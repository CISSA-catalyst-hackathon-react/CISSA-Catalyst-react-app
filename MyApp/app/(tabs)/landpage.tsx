import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Button, ScrollView, TextInput, TouchableOpacity, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getProjects, addProject, saveProjects } from "../../storage/storage";
import { Project } from "@/models/Project";
import ProjectDashboard from "@/components/ProjectDashboard";

export default function LandPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectImage, setNewProjectImage] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    getProjects().then(setProjects);
  }, []);

  const handleAddProject = async () => {
    if (!newProjectName.trim()) return;
    const project = await addProject(newProjectName.trim(), newProjectImage);
    setProjects([...projects, project]);
    setNewProjectName("");
    setNewProjectImage(null);
    setShowAddForm(false);
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setNewProjectImage(result.assets[0].uri);
    }
  };

  const updateProjects = async (projectsToSave: Project[]) => {
    setProjects(projectsToSave);
    await saveProjects(projectsToSave);
  };
  const updateProject = async (updated: Project) => {
    const updatedProjects = projects.map(p => (p.id === updated.id ? updated : p));
    await updateProjects(updatedProjects);
    setCurrentProject(updated);
  };

  // Group projects into rows of 3
  const rows: Project[][] = [];
  for (let i = 0; i < projects.length; i += 3) {
    rows.push(projects.slice(i, i + 3));
  }

  const handleShowAddForm = () => {
    setShowAddForm(true);
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 300);
  };

  if (currentProject) {
    return (
      <ProjectDashboard
        project={currentProject}
        onBack={() => setCurrentProject(null)}
        onUpdateProject={updateProject}
      />
    );
  }

  return (
    <View style={styles.splitContainer}>
      <View style={styles.leftPane}>
        <Text style={styles.leftTitle}>Sidebar</Text>
        <Button color={"#573bc9ff"} title="+" onPress={handleShowAddForm} />
      </View>
      <ScrollView
        ref={scrollViewRef}
        style={styles.rightPane}
        contentContainerStyle={styles.rightPaneContent}
      >
        <Text style={styles.title}>Your Dashboards</Text>
        {/* Display projects in rows of 3 */}
        {rows.map((row, rowIdx) => (
          <View key={rowIdx} style={styles.rectangleRow}>
            {row.map((project) => (
              <View key={project.id} style={styles.rectangleContainer}>
                <TouchableOpacity
                  style={styles.rectangle}
                  onPress={() => setCurrentProject(project)}
                >
                  {project.imageUri ? (
                    <Image
                      source={{ uri: project.imageUri }}
                      style={styles.dashboardImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <Text style={styles.rectangleText}>{project.name}</Text>
                  )}
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ))}
        {/* Add Project Form */}
        {showAddForm && (
          <View style={[styles.rectangle, styles.addForm]}>
            <TextInput
              style={styles.input}
              value={newProjectName}
              onChangeText={setNewProjectName}
              placeholder="Enter dashboard name"
            />
            <Button color={"#2a1c63ff"} title={newProjectImage ? "Change Image" : "Add Image"} onPress={handlePickImage} />
            {newProjectImage && (
              <Image source={{ uri: newProjectImage }} style={styles.dashboardImageInput} resizeMode="cover" />
            )}
            <Button color={"#2a1c63ff"} title="Add Dashboard" onPress={handleAddProject} />
            <Button color={"#2a1c63ff"} title="Cancel" onPress={() => setShowAddForm(false)} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  splitContainer: {
    flex: 1,
    flexDirection: "row",
  },
  leftPane: {
    width: 80,
    backgroundColor: "#382585ff",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingVertical: 16,
  },
  leftTitle: {
    fontWeight: "bold",
    marginBottom: 16,
  },
  rightPane: {
    flex: 1,
    backgroundColor: "#1a113fff",
  },
  rightPaneContent: {
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  rectangleRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  rectangleContainer: {
    alignItems: "center",
    marginHorizontal: 8,
  },
  rectangle: {
    width: 300,
    height: 500,
    backgroundColor: "#573bc9ff",
    borderRadius: 8,
    marginBottom: 6,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  dashboardImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  dashboardImageInput: {
    width: "70%",
    height: "70%",
    borderRadius: 8,
  },
  rectangleText: {
    color: "#333",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    width: 160,
    height: 32,
    borderColor: "#573bc9ff",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    backgroundColor: "#423576ff",
    marginTop: 4,
    marginBottom: 4,
  },
  addForm: {
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    width: 300,
    height: 500,
    backgroundColor: "#573bc9ff",
    borderRadius: 8,
    marginBottom: 100,
    overflow: "hidden",
  },
  addButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 6,
    marginVertical: 6,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 120,
  },
});