import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Button } from "react-native";

import { Project } from "@/models/Project";

type Props = {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onUpdateProjects: (projects: Project[]) => void;
};

export default function ProjectsList({ projects, onSelectProject, onUpdateProjects }: Props) {
  const [newProjectName, setNewProjectName] = useState("");

  const handleAddProject = () => {
    if (!newProjectName.trim()) return;

    const newProject: Project = {
      id: Date.now().toString(),
      name: newProjectName.trim(),
      posts: [],
      imageUri: null, // New projects start without an image
      connections: [] // New projects start without connections
    };

    // update parent state
    onUpdateProjects([...projects, newProject]);

    setNewProjectName("");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Projects</Text>

      <View style={styles.addRow}>
        <TextInput
          placeholder="New project name"
          value={newProjectName}
          onChangeText={setNewProjectName}
          style={styles.input}
        />
        <Button title="Add" onPress={handleAddProject} />
      </View>

      {projects.map((project) => (
        <TouchableOpacity
          key={project.id}
          style={styles.projectCard}
          onPress={() => onSelectProject(project)}
        >
          <Text style={styles.projectName}>{project.name}</Text>
          <Text style={styles.postCount}>{project.posts.length} posts</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  addRow: { flexDirection: "row", marginBottom: 20 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 5,
    marginRight: 10,
    borderRadius: 5,
  },
  projectCard: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
  },
  projectName: { fontSize: 18, fontWeight: "bold" },
  postCount: { color: "gray" },
});

