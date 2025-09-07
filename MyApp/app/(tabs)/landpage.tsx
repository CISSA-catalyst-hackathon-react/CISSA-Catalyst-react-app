import ProjectDashboard from "@/components/ProjectDashboard";
import { Project } from "@/models/Project";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Button, Dimensions, Easing, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { addProject, getProjects, saveProjects } from "../../storage/storage";

const { width } = Dimensions.get("window");
const Star = ({ top, left, size, opacity = 0.8 }: { top: number; left: number; size: number; opacity?: number }) => (
  <View
    style={{
      position: "absolute",
      top,
      left,
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: "#fff",
      opacity,
      shadowColor: "#fff",
      shadowOpacity: 0.7,
      shadowRadius: size * 1.5,
    }}
  />
);


export default function LandPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectImage, setNewProjectImage] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.05, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1.00, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
  }, [scaleAnim]);

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
        {/* LEFT: Sidebar */}
        <View style={styles.leftPane}>
          <LinearGradient
            colors={["#1a1455", "#2a1f6a"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <Text style={styles.leftTitle}>Sidebar</Text>

         
          <View style={styles.leftAddWrap}>
            <View style={styles.leftAddGlow} />
            <Button color={"#5465ebff"} title="+" onPress={handleShowAddForm} />
          </View>
        </View>

        {/* RIGHT: Main panel */}
        <View style={styles.rightPane}>
          {/* Night-sky gradient */}
          <LinearGradient
            colors={["#06061a", "#0b0b2d", "#131443"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />

          {/* Star field (static, lightweight) */}
          {Array.from({ length: 42 }).map((_, i) => (
            <Star
              key={i}
              top={Math.random() * (Dimensions.get("window").height * 1)}
              left={Math.random() * (Dimensions.get("window").width * 0.9)}
              size={Math.random() * 2 + 1}
              opacity={0.4 + Math.random() * 0.5}
            />
          ))}

          <ScrollView
            ref={scrollViewRef}
            style={styles.rightScroll}
            contentContainerStyle={styles.rightPaneContent}
          >
            <Text style={styles.title}>Your Dashboards</Text>

            {/* rows of 3 */}
            {rows.map((row, rowIdx) => (
              <View key={rowIdx} style={styles.rectangleRow}>
                {row.map((project) => (
                  <View key={project.id} style={styles.rectangleContainer}>
                    <View style={styles.cardGlow} />
                    <TouchableOpacity
                      style={styles.rectangle}
                      onPress={() => setCurrentProject(project)}
                      activeOpacity={0.85}
                    >
                      {project.imageUri ? (
                        <Image source={{ uri: project.imageUri }} style={styles.dashboardImage} resizeMode="cover" />
                      ) : (
                        <Text style={styles.rectangleText}>{project.name}</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ))}

            {/* Add project form (unchanged logic) */}
            {showAddForm && (
              <Animated.View style={[styles.addFormWrap, { transform: [{ scale: scaleAnim }] }]}>
                <View style={styles.cardGlow} />
                <View style={[styles.rectangle, styles.addForm]}>
                  <TextInput
                    style={styles.input}
                    value={newProjectName}
                    onChangeText={setNewProjectName}
                    placeholder="Enter dashboard name"
                    placeholderTextColor="#b9b5e8"
                  />
                  <Button
                    color={"#5465ebff"}
                    title={newProjectImage ? "Change Image" : "Add Image"}
                    onPress={handlePickImage}
                  />
                  {newProjectImage && (
                    <Image source={{ uri: newProjectImage }} style={styles.dashboardImageInput} resizeMode="cover" />
                  )}
                  <Button color={"#5465ebff"} title="Add Dashboard" onPress={handleAddProject} />
                  <Button color={"#5465ebff"} title="Cancel" onPress={() => setShowAddForm(false)} />
                </View>
              </Animated.View>
            )}
          </ScrollView>
        </View>
      </View>
    );

}

const styles = StyleSheet.create({
  splitContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#06061a",
  },

  /* Left (sidebar) */
  leftPane: {
    width: 88,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 18,
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderRightColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },
  leftTitle: {
    color: "#cdd3ff",
    fontWeight: "700",
    marginBottom: 16,
    textShadowColor: "rgba(255,255,255,0.35)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  leftAddWrap: {
    width: "100%",
    alignItems: "center",
    marginTop: 8,
    position: "relative",
  },
  leftAddGlow: {
    position: "absolute",
    top: -6,
    width: 64,
    height: 64,
    borderRadius: 14,
    backgroundColor: "rgba(99,102,241,0.25)",
    filter: "blur(20px)" as any,
  },

  /* Right (main) */
  rightPane: {
    flex: 1,
  },
  rightScroll: {
    flex: 1,
  },
  rightPaneContent: {
    alignItems: "center",
    paddingVertical: 22,
    paddingHorizontal: 18,
  },

  /* Title */
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#e7e8ff",
    marginBottom: 14,
    letterSpacing: 0.4,
    textShadowColor: "rgba(185, 193, 255, 0.6)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 10,
  },

  /* Grid rows */
  rectangleRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "stretch",
    gap: 18,
    marginBottom: 18,
    flexWrap: "wrap",
  },
  rectangleContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  /* Soft glow behind cards */
  cardGlow: {
    position: "absolute",
    width: 320,
    height: 520,
    borderRadius: 18,
    backgroundColor: "rgba(99,102,241,0.25)",
    opacity: 0.6,
    filter: "blur(22px)" as any,
  },

  /* Cards */
  rectangle: {
    width: 300,
    height: 500,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(168, 180, 255, 0.35)",
    backgroundColor: "rgba(64, 58, 183, 0.38)", // translucent indigo
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    shadowColor: "#6274ff",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 24,
  },
  dashboardImage: {
    width: "100%",
    height: "100%",
  },
  rectangleText: {
    color: "#eef0ff",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    opacity: 0.95,
  },

  /* Add form card wrapper (for extra glow) */
  addFormWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  addForm: {
    padding: 14,
    backgroundColor: "rgba(64, 58, 183, 0.42)",
  },

  /* Inputs */
  input: {
    width: 180,
    height: 38,
    borderColor: "rgba(187, 196, 255, 0.45)",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "rgba(26, 23, 73, 0.8)",
    color: "#eef0ff",
    marginTop: 8,
    marginBottom: 8,
  },
  dashboardImageInput: {
    width: "72%",
    height: "72%",
    borderRadius: 10,
    marginVertical: 8,
  },
});



