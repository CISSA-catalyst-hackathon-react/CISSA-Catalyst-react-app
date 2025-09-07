import React from "react";
import { ScrollView, View, Text, TextInput, Button, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Project } from "@/models/Project";
import { Post } from "@/models/Post";
import PostCard from "@/components/PostCard";

interface ProjectDashboardProps {
  project: Project;
  onBack: () => void;
  onUpdateProject: (project: Project) => void;
}

export default function ProjectDashboard({ project, onBack, onUpdateProject }: ProjectDashboardProps) {
  const [newPostTitle, setNewPostTitle] = React.useState("");
  const [newPostType, setNewPostType] = React.useState("");

  const addPost = () => {
    if (!newPostTitle.trim() || !newPostType.trim()) return;

    const newPost: Post = {
      id: Date.now().toString(),
      title: newPostTitle,
      type: newPostType,
      imageUri: null,
      connections: [],
      projectId: project.id,
    };

    const updated = { ...project, posts: [...project.posts, newPost] };
    onUpdateProject(updated);

    setNewPostTitle("");
    setNewPostType("");
  };

  const updatePost = (updatedPost: Post) => {
    const updatedPosts = project.posts.map(p => (p.id === updatedPost.id ? updatedPost : p));
    onUpdateProject({ ...project, posts: updatedPosts });
  };

  const pickImage = async (post: Post) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const updatedPost = { ...post, imageUri: result.assets[0].uri };
      updatePost(updatedPost);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Button title="Back to Projects" onPress={onBack} />

      <Text style={styles.title}>{project.name}</Text>

      <View style={styles.addPostRow}>
        <TextInput
          placeholder="Post title"
          value={newPostTitle}
          onChangeText={setNewPostTitle}
          style={styles.input}
        />
        <TextInput
          placeholder="Post type"
          value={newPostType}
          onChangeText={setNewPostType}
          style={styles.input}
        />
        <Button title="Add Post" onPress={addPost} />
      </View>

      {project.posts.map(post => (
        <PostCard
          key={post.id}
          post={post}
          onUpdatePost={updatePost}
          onPickImage={pickImage}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginVertical: 10, color: "white" },
  addPostRow: { flexDirection: "row", marginBottom: 20, alignItems: "center" },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 5,
    marginRight: 5,
    color: "white",
  },
});
