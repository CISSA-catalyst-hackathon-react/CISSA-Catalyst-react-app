import React, { useState, useEffect } from "react";
import { View, TextInput, Text, Button, StyleSheet, ScrollView } from "react-native";
import { Post } from "@/models/Post";
import { Project } from "@/models/Project";
import { saveProjects } from "@/storage/storage";

type Props = {
  postId: string;
  project: Project;
  onClose: () => void;
  onUpdateProject: (updated: Project) => void;
};

export default function PostPage({ postId, project, onClose, onUpdateProject }: Props) {
  const post = project.posts.find((p) => p.id === postId);
  const [notes, setNotes] = useState(post?.notes || "");
  const [title, setTitle] = useState(post?.title || "");

  useEffect(() => {
    if (post) setNotes(post.notes || "");
  }, [postId]);

  if (!post) return null;

  const savePost = () => {
    const updatedPosts = project.posts.map((p) =>
      p.id === postId ? { ...p, notes, title } : p
    );
    const updatedProject = { ...project, posts: updatedPosts };
    onUpdateProject(updatedProject);
    saveProjects([updatedProject]);

    onClose();
  };

  return (
    <ScrollView style={{ flex: 1, padding: 12 }}>
      <Button title="Back" onPress={onClose} />
      <Text style={{ fontSize: 24, fontWeight: "bold", marginVertical: 8 }}>Edit Post</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Post title"
        style={styles.input}
      />
      <TextInput
        value={notes}
        onChangeText={setNotes}
        placeholder="Notes"
        multiline
        style={[styles.input, { height: 200 }]}
      />
      <Button title="Save Post" onPress={savePost} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginVertical: 8,
    borderRadius: 6,
    backgroundColor: "#fff",
  },
});