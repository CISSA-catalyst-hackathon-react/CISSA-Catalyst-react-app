import React from "react";
import { View, Text, Image } from "react-native";
import PostImagePicker from "./PostImagePicker";
import { Post } from "../models/Post";

interface Props {
  post: Post;
  onUpdatePost: (post: Post) => void;
}

export default function PostCard({ post, onUpdatePost }: Props) {
  const handleImagePicked = (uri: string) => {
    onUpdatePost({ ...post, imageUri: uri });
  };

  return (
    <View
      style={{
        marginVertical: 5,
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
        {post.imageUri ? (
  <Image
    source={{ uri: post.imageUri }}
    style={{ width: 50, height: 50, marginRight: 10 }}
  />
) : (
  <View
    style={{
      width: 50,
      height: 50,
      marginRight: 10,
      backgroundColor: "#eee",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Text style={{ color: "#999" }}>No image</Text>
  </View>
)}


      <View style={{ flex: 1 }}>
        <Text style={{ color: "white", fontSize: 16 }}>{post.title}</Text>
        <Text style={{ color: "gray" }}>Type: {post.type}</Text>
        <PostImagePicker onImagePicked={handleImagePicked} />
      </View>
    </View>
  );
}






