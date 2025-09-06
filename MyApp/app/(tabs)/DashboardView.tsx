import React, { useState, useEffect } from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Alert,
  Button,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Project } from "@/models/Project";
import { Post } from "@/models/Post";
import PostCard from "@/components/PostCard";
import projectsJson from "@/data/projects.json";

type Tool =
  | "select"
  | "pan"
  | "addPost"
  | "addLink"
  | "undo"
  | "redo"
  | "zoomIn"
  | "zoomOut"
  | "settings";

export default function DashboardWithProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [activeTool, setActiveTool] = useState<Tool>("select");
  const [zoom, setZoom] = useState(1);

  // Modal state for Add Post
  const [addPostModalVisible, setAddPostModalVisible] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostType, setNewPostType] = useState("");

  const [newProjectName, setNewProjectName] = useState("");

  // Load projects from AsyncStorage or JSON
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

  const addPost = (title: string, type: string) => {
    if (!currentProject || !title.trim() || !type.trim()) return;

    const newPost: Post = {
      id: Date.now().toString(),
      title,
      type,
      imageUri: null,
      connections: [],
      projectId: currentProject.id,
    };

    const updatedProject = {
      ...currentProject,
      posts: [...currentProject.posts, newPost],
    };

    setCurrentProject(updatedProject);

    const updatedProjects = projects.map(p =>
      p.id === currentProject.id ? updatedProject : p
    );
    setProjects(updatedProjects);
    AsyncStorage.setItem("projects", JSON.stringify(updatedProjects));
  };

  const updatePost = (updatedPost: Post) => {
    if (!currentProject) return;
    const updatedPosts = currentProject.posts.map(p =>
      p.id === updatedPost.id ? updatedPost : p
    );
    const updatedProject = { ...currentProject, posts: updatedPosts };
    setCurrentProject(updatedProject);
    saveProjects(projects.map(p => (p.id === currentProject.id ? updatedProject : p)));
  };

  const goBack = () => setCurrentProject(null);

  const handleTool = (tool: Tool) => {
    setActiveTool(tool);
    switch (tool) {
      case "zoomIn":
        setZoom(z => Math.min(2, +(z + 0.1).toFixed(2)));
        break;
      case "zoomOut":
        setZoom(z => Math.max(0.5, +(z - 0.1).toFixed(2)));
        break;
      case "addPost":
        if (!currentProject) {
          Alert.alert("Select a project first");
          return;
        }
        if (Platform.OS === "ios") {
          Alert.prompt(
            "New Post",
            "Enter post title",
            title => {
              if (!title) return;
              addPost(title, "default"); // default type
            }
          );
        } else {
          setAddPostModalVisible(true);
        }
        break;
    }
  };

  // --- RENDER ---

  if (currentProject) {
    return (
      <SafeAreaView style={styles.root}>
        {/* TOP TOOLBAR */}
        <View style={styles.topBar}>
          <View style={styles.topLeft}>
            <Text style={styles.title}>{currentProject.name}</Text>
            <Text style={styles.subtitle}>
              zoom {Math.round(zoom * 100)}% • posts {currentProject.posts.length}
            </Text>
          </View>
          <View style={styles.topActions}>
            <Button title="Back" onPress={goBack} />
          </View>
        </View>

        {/* CANVAS AREA */}
        <View style={styles.canvas}>
          <ScrollView style={{ width: "100%" }}>
            {currentProject.posts.map(post => (
              <PostCard key={post.id} post={post} onUpdatePost={updatePost} />
            ))}
          </ScrollView>
        </View>

        {/* RIGHT SIDEBAR */}
        <View style={styles.rightBar}>
          <ToolButton
            icon={<Ionicons name="hand-left-outline" size={20} color="#111827" />}
            label="Select"
            active={activeTool === "select"}
            onPress={() => handleTool("select")}
          />
          <ToolButton
            icon={<MaterialCommunityIcons name="hand-back-right-outline" size={20} color="#111827" />}
            label="Pan"
            active={activeTool === "pan"}
            onPress={() => handleTool("pan")}
          />
          <ToolButton
            icon={<Ionicons name="add" size={20} color="#111827" />}
            label="Add Post"
            active={activeTool === "addPost"}
            onPress={() => handleTool("addPost")}
          />
          {/* ...other tools */}
        </View>

        {/* MODAL FOR ANDROID/GENERAL */}
        <Modal visible={addPostModalVisible} transparent animationType="slide">
          <View style={modalStyles.modalBackground}>
            <View style={modalStyles.modalContainer}>
              <Text style={{ fontWeight: "bold", marginBottom: 10 }}>New Post</Text>
              <TextInput
                placeholder="Post title"
                value={newPostTitle}
                onChangeText={setNewPostTitle}
                style={modalStyles.input}
              />
              <TextInput
                placeholder="Post type"
                value={newPostType}
                onChangeText={setNewPostType}
                style={modalStyles.input}
              />
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                <Button
                  title="Cancel"
                  onPress={() => {
                    setAddPostModalVisible(false);
                    setNewPostTitle("");
                    setNewPostType("");
                  }}
                />
                <Button
                  title="Add"
                  onPress={() => {
                    addPost(newPostTitle, newPostType);
                    setAddPostModalVisible(false);
                    setNewPostTitle("");
                    setNewPostType("");
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  // --- PROJECT LIST VIEW ---
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

// --- TOOLBUTTON ---
function ToolButton({ icon, label, active, onPress }: { icon: React.ReactNode; label: string; active?: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.toolBtn, active && styles.toolBtnActive]}
    >
      <View style={styles.toolIcon}>{icon}</View>
      <Text style={styles.toolLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f3f4f6" },
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 12, paddingVertical: 10, backgroundColor: "#ffffff", borderBottomWidth: 1, borderBottomColor: "#e5e7eb" },
  topLeft: { gap: 2 },
  title: { fontSize: 20, fontWeight: "700", color: "#111827" },
  subtitle: { fontSize: 12, color: "#6b7280" },
  topActions: { flexDirection: "row", gap: 8 },
  canvas: { flex: 1, margin: 12, borderRadius: 14, backgroundColor: "#ffffff", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#e5e7eb" },
  rightBar: { position: "absolute", right: 10, top: 70, bottom: 20, width: 110, paddingVertical: 8, paddingHorizontal: 6, borderRadius: 12, backgroundColor: "#ffffffee", borderWidth: 1, borderColor: "#e5e7eb", gap: 8 },
  toolBtn: { alignItems: "center", paddingVertical: 8, borderRadius: 10 },
  toolBtnActive: { backgroundColor: "#eef2ff", borderWidth: 1, borderColor: "#c7d2fe" },
  toolIcon: { marginBottom: 4 },
  toolLabel: { fontSize: 11, color: "#111827", textAlign: "center" },
});

// --- MODAL STYLES ---
const modalStyles = StyleSheet.create({
  modalBackground: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#00000066" },
  modalContainer: { width: "80%", backgroundColor: "white", padding: 20, borderRadius: 12 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 6, borderRadius: 6, marginBottom: 10 },
});
