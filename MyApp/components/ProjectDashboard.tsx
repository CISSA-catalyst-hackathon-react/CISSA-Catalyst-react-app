import React, { useState } from "react";
import { View, Text, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, Button, TextInput, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Project } from "@/models/Project";
import PostCard from "./PostCard";
import { addPost } from "@/storage/storage";

export default function ProjectDashboard({ project, onGoBack }: { project: Project; onGoBack: () => void }) {
  const [currentProject, setCurrentProject] = useState(project);
  const [addPostModalVisible, setAddPostModalVisible] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostType, setNewPostType] = useState("");

  const handleAddPost = async () => {
    if (!newPostTitle.trim() || !newPostType.trim()) return;
    const post = await addPost(currentProject.id, newPostTitle, newPostType);
    if (post) {
      setCurrentProject({ ...currentProject, posts: [...currentProject.posts, post] });
      setNewPostTitle("");
      setNewPostType("");
      setAddPostModalVisible(false);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.topBar}>
        <Text style={styles.title}>{currentProject.name}</Text>
        <Button title="Back" onPress={onGoBack} />
      </View>

      <ScrollView style={styles.canvas}>
        {currentProject.posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </ScrollView>

      <View style={styles.toolbar}>
        <TouchableOpacity style={styles.toolBtn} onPress={() => setAddPostModalVisible(true)}>
          <Ionicons name="add" size={20} color="#111827" />
          <Text style={styles.toolLabel}>Add Post</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={addPostModalVisible} transparent animationType="slide">
        <View style={modalStyles.modalBackground}>
          <View style={modalStyles.modalContainer}>
            <Text style={modalStyles.modalTitle}>New Post</Text>
            <TextInput placeholder="Title" value={newPostTitle} onChangeText={setNewPostTitle} style={modalStyles.input} />
            <TextInput placeholder="Type" value={newPostType} onChangeText={setNewPostType} style={modalStyles.input} />
            <View style={modalStyles.modalButtons}>
              <Button title="Cancel" onPress={() => setAddPostModalVisible(false)} />
              <Button title="Add" onPress={handleAddPost} />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f3f4f6" },
  topBar: { flexDirection: "row", justifyContent: "space-between", padding: 12, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold" },
  canvas: { flex: 1, margin: 12, backgroundColor: "#fff", borderRadius: 10, borderWidth: 1, borderColor: "#ccc" },
  toolbar: { position: "absolute", right: 10, top: 70 },
  toolBtn: { alignItems: "center", paddingVertical: 8, borderRadius: 10, backgroundColor: "#eef2ff" },
  toolLabel: { fontSize: 11, textAlign: "center" }
});

const modalStyles = StyleSheet.create({
  modalBackground: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#00000066" },
  modalContainer: { width: "80%", backgroundColor: "white", padding: 20, borderRadius: 12 },
  modalTitle: { fontWeight: "bold", marginBottom: 10, fontSize: 16 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 6, borderRadius: 6, marginBottom: 10 },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 }
});
