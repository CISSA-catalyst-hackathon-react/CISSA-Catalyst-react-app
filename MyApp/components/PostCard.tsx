import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Post } from "@/models/Post";

export default function PostCard({ post }: { post: Post }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.type}>{post.type}</Text>
      {post.imageUri && <Text style={styles.imageText}>[Image attached]</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10
  },
  title: { fontSize: 16, fontWeight: "bold" },
  type: { color: "gray" },
  imageText: { color: "#4f46e5", marginTop: 5 }
});
