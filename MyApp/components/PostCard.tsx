import React from "react";
import { View, Text, Image, Button, StyleSheet } from "react-native";
import { Post } from "@/models/Post";

interface PostCardProps {
  post: Post;
  onUpdatePost: (updated: Post) => void;
  onPickImage?: (post: Post) => void;
}

export default function PostCard({ post, onUpdatePost, onPickImage }: PostCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.type}>{post.type}</Text>

      {post.imageUri ? (
        <Image source={{ uri: post.imageUri }} style={styles.image} />
      ) : (
        <Text style={styles.noImage}>No image</Text>
      )}

      {onPickImage && (
        <Button title="Add / Change Image" onPress={() => onPickImage(post)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#1e1e1e",
  },
  title: { fontSize: 18, fontWeight: "bold", color: "white" },
  type: { fontSize: 14, color: "gray", marginBottom: 8 },
  noImage: { fontSize: 12, color: "gray", marginBottom: 8 },
  image: { width: "100%", height: 200, borderRadius: 8, marginBottom: 8 },
});

