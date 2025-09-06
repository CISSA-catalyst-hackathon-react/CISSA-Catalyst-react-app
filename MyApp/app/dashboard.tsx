import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, TextInput, Button, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Project } from "@/models/Project";
import { Post } from "@/models/Post";
import PostCard from "@/components/PostCard";
import projectsJson from "@/data/projects.json";

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [newProjectName, setNewProjectName] = useState("");
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostType, setNewPostType] = useState("");

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem("projects");
      setProjects(stored ? JSON.parse(stored) : projectsJson);
    })();
  }, []);

  const saveProjects = async (projectsToSave: Project[]) => {
    setProjects(projectsToSave);
    await AsyncStorage.setItem("projects", JSON.stringify(projectsToSave));
  };

  const addProject = () => {
    if (!newProjectName.trim()) return;
    const newProject: Project = { id: Date.now().toString(), name: newProjectName, posts: [] };
    saveProjects([...projects, newProject]);
    setNewProjectName("");
  };

  const addPost = () => {
    if (!currentProject || !newPostTitle.trim() || !newPostType.trim()) return;

    const newPost: Post = {
      id: Date.now().toString(),
      title: newPostTitle,
      type: newPostType, // just a string
      imageUri: null,    // user can add later
      connections: [],
      projectId: currentProject.id,
    };

    const updatedProject = { ...currentProject, posts: [...currentProject.posts, newPost] };
    setCurrentProject(updatedProject);
    saveProjects(projects.map(p => (p.id === currentProject.id ? updatedProject : p)));

    setNewPostTitle("");
    setNewPostType("");
  };



  const updatePost = (updatedPost: Post) => {
    if (!currentProject) return;
    const updatedPosts = currentProject.posts.map(p => (p.id === updatedPost.id ? updatedPost : p));
    const updatedProject = { ...currentProject, posts: updatedPosts };
    setCurrentProject(updatedProject);
    saveProjects(projects.map(p => (p.id === currentProject.id ? updatedProject : p)));
  };

  const goBack = () => setCurrentProject(null);

  if (currentProject) {
    return (
      <ScrollView style={{ padding: 20 }}>
        <Button title="Back to Projects" onPress={goBack} />
        <Text style={{ fontSize: 24, fontWeight: "bold", marginVertical: 10 }}>{currentProject.name}</Text>

        <View style={{ flexDirection: "row", marginBottom: 20 }}>
          <TextInput
            placeholder="Post title"
            value={newPostTitle}
            onChangeText={setNewPostTitle}
            style={{ flex: 1, borderWidth: 1, borderColor: "#ccc", marginRight: 5, padding: 5 }}
          />
          <TextInput
            placeholder="Post type"
            value={newPostType}
            onChangeText={setNewPostType}
            style={{ flex: 1, borderWidth: 1, borderColor: "#ccc", marginRight: 5, padding: 5 }}
          />
          <Button title="Add Post" onPress={addPost} />
        </View>

        {currentProject.posts.map(post => (
          <PostCard key={post.id} post={post} onUpdatePost={updatePost} />
        ))}
      </ScrollView>
    );
  }

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Projects</Text>

      <View style={{ flexDirection: "row", marginBottom: 20 }}>
        <TextInput
          placeholder="New project name"
          value={newProjectName}
          onChangeText={setNewProjectName}
          style={{ flex: 1, borderWidth: 1, borderColor: "#ccc", marginRight: 10, padding: 5 }}
        />
        <Button title="Add" onPress={addProject} />
      </View>

      {projects.map(project => (
        <TouchableOpacity
          key={project.id}
          style={{ padding: 15, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, marginBottom: 10 }}
          onPress={() => setCurrentProject(project)}
        >
          <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>{project.name}</Text>
          <Text style={{ color: "gray" }}>{project.posts.length} posts</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}


