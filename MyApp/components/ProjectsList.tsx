import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Button } from "react-native";

import { Project } from "@/models/Project";
import { getProjects, addProject } from "@/storage/storage";

export default function ProjectsList({ onSelectProject }: { onSelectProject: (project: Project) => void }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState("");

  useEffect(() => {
    (async () => setProjects(await getProjects()))();
  }, []);

  const handleAddProject = async () => {
    if (!newProjectName.trim()) return;
    const project = await addProject(newProjectName);
    setProjects(await getProjects());
    setNewProjectName("");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Projects</Text>

      <View style={{ flexDirection: "row", marginBottom: 20 }}>
        <TextInput
          placeholder="New project name"
          value={newProjectName}
          onChangeText={setNewProjectName}
          style={{ flex: 1, borderWidth: 1, borderColor: "#ccc", padding: 5, marginRight: 10 }}
        />
        <Button title="Add" onPress={handleAddProject} />
      </View>

      {projects.map(project => (
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
  projectCard: { padding: 15, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, marginBottom: 10 },
  projectName: { fontSize: 18, fontWeight: "bold" },
  postCount: { color: "gray" }
});
