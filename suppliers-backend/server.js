require("dotenv").config();
const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Ensure `uploads/` folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage (Saving Locally)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Upload API
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const { cost, size, category } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    
    const imagePath = "/uploads/" + req.file.filename; // Path to serve locally

    // Insert into PostgreSQL
    const result = await pool.query(
      "INSERT INTO products (image_path, cost, size, category, uploaded_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *",
      [imagePath, cost, size, category]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Upload failed" });
  }
});

// Serve static images from "uploads" folder
app.use("/uploads", express.static(uploadDir));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
