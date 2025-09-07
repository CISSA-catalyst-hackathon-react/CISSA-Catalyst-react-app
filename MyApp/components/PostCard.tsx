import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Post } from "@/models/Post";

type Props = {
  post: Post;
  onPress: () => void;
};

export default function PostCard({ post, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {post.imageUri ? (
        <Image source={{ uri: post.imageUri }} style={styles.image} />
      ) : (
        <Text style={styles.title}>{post.title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 280,
    height: 200,
    backgroundColor: "#fff",
    borderRadius: 8,
    margin: 6,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  image: { width: "100%", height: "100%", borderRadius: 8 },
  title: { fontSize: 18, fontWeight: "bold" },
});




