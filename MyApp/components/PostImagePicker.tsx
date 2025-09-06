import React from "react";
import { Button } from "react-native";
import * as ImagePicker from "expo-image-picker";

interface Props {
  onImagePicked: (uri: string) => void;
}

export default function PostImagePicker({ onImagePicked }: Props) {
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Camera roll permission is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      onImagePicked(result.assets[0].uri);
    }
  };

  return <Button title="Pick Image" onPress={pickImage} />;
}





