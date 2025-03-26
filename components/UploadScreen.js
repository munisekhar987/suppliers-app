import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Alert, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import RNPickerSelect from "react-native-picker-select";

const UploadScreen = () => {
  const [image, setImage] = useState(null);
  const [cost, setCost] = useState("");
  const [size, setSize] = useState("");
  const [category, setCategory] = useState("");

  const backendURL = "http://localhost:5000"; // ✅ Backend & frontend on the same server

  // Function to pick an image
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  // Function to upload image
  const uploadImage = async () => {
    if (!image || !cost || !size || !category) {
      Alert.alert("Error", "Please fill all fields and select an image");
      return;
    }

    const formData = new FormData();
    formData.append("image", {
      uri: image,
      name: "upload.jpg",
      type: "image/jpeg",
    });
    formData.append("cost", cost);
    formData.append("size", size);
    formData.append("category", category);

    try {
      const response = await axios.post(`${backendURL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Alert.alert("Success", "Image uploaded successfully");
      setImage(null);
      setCost("");
      setSize("");
      setCategory("");
    } catch (error) {
      console.error("Upload Error:", error);
      Alert.alert("Error", "Upload failed");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Product</Text>

      {image && <Image source={{ uri: image }} style={styles.image} />}

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Pick an Image</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Enter Cost"
        keyboardType="numeric"
        value={cost}
        onChangeText={setCost}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Size"
        value={size}
        onChangeText={setSize}
      />

      <RNPickerSelect
        onValueChange={(value) => setCategory(value)}
        items={[
          { label: "Socks", value: "Socks" },
          { label: "Children’s clothes", value: "Children's Clothes" },
          { label: "Women’s dresses", value: "Women's Dresses" },
          { label: "Women’s shorts", value: "Women's Shorts" },
        ]}
        placeholder={{ label: "Select Category", value: null }}
        style={pickerSelectStyles}
      />

      <TouchableOpacity style={styles.uploadButton} onPress={uploadImage}>
        <Text style={styles.buttonText}>Upload</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UploadScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
    borderRadius: 10,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  uploadButton: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 5,
    marginTop: 15,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#fff",
    textAlign: "center",
  },
  inputAndroid: {
    fontSize: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#fff",
    textAlign: "center",
  },
};
