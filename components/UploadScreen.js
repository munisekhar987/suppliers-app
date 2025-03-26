import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Alert, StyleSheet, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import RNPickerSelect from "react-native-picker-select";

const UploadScreen = () => {
  const [images, setImages] = useState([]);
  const [cost, setCost] = useState("");
  const [size, setSize] = useState("");
  const [category, setCategory] = useState("");

  const backendURL = "http://localhost:5000"; // ✅ Backend & frontend on the same server

  // Function to pick multiple images
  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true, // Allow multiple images
      quality: 1,
    });

    if (!result.canceled) {
      setImages(result.assets.map((asset) => asset.uri));
    }
  };

  // Function to upload images
  const uploadImages = async () => {
    if (images.length === 0 || !cost || !size || !category) {
      Alert.alert("Error", "Please fill all fields and select at least one image");
      return;
    }

    const formData = new FormData();
    images.forEach((imageUri, index) => {
      formData.append("images", {
        uri: imageUri,
        name: `upload-${index}.jpg`,
        type: "image/jpeg",
      });
    });

    formData.append("cost", cost);
    formData.append("size", size);
    formData.append("category", category);

    try {
      const response = await axios.post(`${backendURL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Alert.alert("Success", "Images uploaded successfully");
      setImages([]);
      setCost("");
      setSize("");
      setCategory("");
    } catch (error) {
      console.error("Upload Error:", error);
      Alert.alert("Error", "Upload failed");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Upload Product</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {images.map((uri, index) => (
          <Image key={index} source={{ uri }} style={styles.image} />
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.button} onPress={pickImages}>
        <Text style={styles.buttonText}>Pick Images</Text>
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

      <TouchableOpacity style={styles.uploadButton} onPress={uploadImages}>
        <Text style={styles.buttonText}>Upload</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default UploadScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
    width: 100,
    height: 100,
    marginRight: 10,
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
