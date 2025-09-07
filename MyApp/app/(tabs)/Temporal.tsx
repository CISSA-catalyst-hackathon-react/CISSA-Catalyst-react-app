import { Project } from "@/models/Project";
import { addPost } from "@/storage/storage";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
    Button,
    Dimensions,
    Modal,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Svg, { Circle, G, Line, Text as SvgText } from "react-native-svg";

const { width: W, height: H } = Dimensions.get("window");

export default function DashboardView() {
  // ---- Hardcoded test project
  // const [currentProject, setCurrentProject] = useState<Project>({
  //   id: "1",
  //   name: "My Dashboard Project",
  //   posts: [
  //     {
  //         id: "p1", title: "Post 1", type: "note",
  //         imageUri: null,
  //         connections: [],
  //         projectId: ""
  //     },
  //     {
  //         id: "p2", title: "Post 2", type: "image",
  //         imageUri: null,
  //         connections: [],
  //         projectId: ""
  //     },
  //     {
  //         id: "p3", title: "Post 3", type: "link",
  //         imageUri: null,
  //         connections: [],
  //         projectId: ""
  //     },
  //   ],
  // });

  const [addPostModalVisible, setAddPostModalVisible] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostType, setNewPostType] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  // Layout center
  const centerX = W / 2;
  const centerY = H * 0.45; // leave space for top bar
  const radius = Math.min(W, H) * 0.30;

  // Position posts in a radial layout
  const nodes = useMemo(() => {
    const N = currentProject.posts.length || 1;
    return currentProject.posts.map((p, i) => {
      const angle = (2 * Math.PI * i) / N - Math.PI / 2; // start at top
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      return { id: p.id, title: p.title, type: p.type, x, y };
    });
  }, [currentProject.posts, centerX, centerY, radius]);

  // Example edges (connect each post to the next one)
  const edges = useMemo(() => {
    if (nodes.length < 2) return [];
    return nodes.map((n, i) => {
      const m = nodes[(i + 1) % nodes.length];
      return { from: n.id, to: m.id };
    });
  }, [nodes]);

  const handleAddPost = async () => {
    if (!newPostTitle.trim() || !newPostType.trim()) return;
    const post = await addPost(currentProject.id, newPostTitle, newPostType);
    if (post) {
      setCurrentProject({
        ...currentProject,
        posts: [...currentProject.posts, post],
      });
      setNewPostTitle("");
      setNewPostType("");
      setAddPostModalVisible(false);
    }
  };

  const getNode = (id: string) => nodes.find((n) => n.id === id)!;

  return (
    <SafeAreaView style={styles.root}>
      {/* Top Toolbar */}
      <View style={styles.topBar}>
        <Button title="Back" onPress={() => console.log("Back pressed")} />
        <Text style={styles.title}>{currentProject.name}</Text>
        <View style={styles.topRightButtons}>
          <TouchableOpacity
            style={styles.zoomBtn}
            onPress={() => setZoom((z) => Math.min(2, +(z + 0.1).toFixed(2)))}
          >
            <Ionicons name="add" size={18} color="#111827" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.zoomBtn}
            onPress={() => setZoom((z) => Math.max(0.5, +(z - 0.1).toFixed(2)))}
          >
            <Ionicons name="remove" size={18} color="#111827" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.container}>
        {/* Left Toolbar */}
        <View style={styles.leftToolbar}>
          <TouchableOpacity
            style={styles.leftToolBtn}
            onPress={() => setAddPostModalVisible(true)}
          >
            <Ionicons name="add" size={20} color="#111827" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.leftToolBtn}>
            <Ionicons name="settings" size={20} color="#111827" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.leftToolBtn}>
            <Ionicons name="link" size={20} color="#111827" />
          </TouchableOpacity>
        </View>

        {/* Diagram Canvas */}
        <View style={styles.canvas}>
          <Svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}>
            <G scale={zoom} originX={centerX} originY={centerY}>
              {/* Draw edges */}
              {edges.map((e, idx) => {
                const a = getNode(e.from);
                const b = getNode(e.to);
                return (
                  <Line
                    key={`edge-${idx}`}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke="#c7d2fe"
                    strokeWidth={2}
                  />
                );
              })}

              {/* Draw nodes */}
              {nodes.map((n) => {
                const isSelected = n.id === selectedId;
                return (
                  <G key={n.id}>
                    <Circle
                      cx={n.x}
                      cy={n.y}
                      r={isSelected ? 22 : 18}
                      fill={isSelected ? "#4f46e5" : "#6366f1"}
                      stroke={isSelected ? "#ffffff" : "#e0e7ff"}
                      strokeWidth={isSelected ? 3 : 2}
                      onPress={() =>
                        setSelectedId(n.id === selectedId ? null : n.id)
                      }
                    />
                    <SvgText
                      x={n.x}
                      y={n.y + (isSelected ? 40 : 34)}
                      fontSize="12"
                      fill="#111827"
                      textAnchor="middle"
                    >
                      {n.title}
                    </SvgText>
                  </G>
                );
              })}
            </G>
          </Svg>
        </View>
      </View>

      {/* Add Post Modal */}
      <Modal visible={addPostModalVisible} transparent animationType="slide">
        <View style={modalStyles.modalBackground}>
          <View style={modalStyles.modalContainer}>
            <Text style={modalStyles.modalTitle}>New Post</Text>
            <TextInput
              placeholder="Title"
              value={newPostTitle}
              onChangeText={setNewPostTitle}
              style={modalStyles.input}
            />
            <TextInput
              placeholder="Type"
              value={newPostType}
              onChangeText={setNewPostType}
              style={modalStyles.input}
            />
            <View style={modalStyles.modalButtons}>
              <Button
                title="Cancel"
                onPress={() => setAddPostModalVisible(false)}
              />
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

  container: {
    flex: 1,
    flexDirection: "row",
  },

  // --- Top Toolbar
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  title: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  topRightButtons: { flexDirection: "row", gap: 8 },
  zoomBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    marginLeft: 6,
  },

  // --- Left Toolbar
  leftToolbar: {
    width: 60,
    backgroundColor: "#ffffff",
    borderRightWidth: 1,
    borderRightColor: "#e5e7eb",
    alignItems: "center",
    paddingVertical: 10,
    gap: 12,
  },
  leftToolBtn: {
    backgroundColor: "#eef2ff",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  // --- Diagram Canvas
  canvas: {
    flex: 1,
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    overflow: "hidden",
  },
});

const modalStyles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000066",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: { fontWeight: "bold", marginBottom: 10, fontSize: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 6,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});




