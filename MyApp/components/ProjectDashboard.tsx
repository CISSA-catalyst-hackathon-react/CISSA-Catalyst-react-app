import React, { useState, useMemo } from "react";
import {
  Text,
  View,
  PanResponder,
  Animated,
  Dimensions,
  Button,
  TouchableOpacity,
  Pressable,
  TextInput,
  Modal,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Project } from "@/models/Project";
import { Post } from "@/models/Post";
import PostPage from "@/app/(tabs)/postPage";
import { FontAwesome } from "@expo/vector-icons";
import { saveProjects, getProjects, addConnection } from "@/storage/storage";
import { Connection } from "@/models/Connection";

type ConnectionLabel = {
  from: string;
  to: string;
  label: string;
};

type Props = {
  project: Project;
  onBack: () => void;
  onUpdateProject: (updated: Project) => void;
};

const { width: W, height: H } = Dimensions.get("window");

export default function ProjectDashboard({ project, onBack, onUpdateProject }: Props) {
  const [currentProject, setCurrentProject] = useState<Project>(project);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [dragMode, setDragMode] = useState(false);
  const [connectMode, setConnectMode] = useState(false);
  const [sourceNodeId, setSourceNodeId] = useState<string | null>(null);

  // Connection label modal state
  const [labelModalVisible, setLabelModalVisible] = useState(false);
  const [labelModalFrom, setLabelModalFrom] = useState<string | null>(null);
  const [labelModalTo, setLabelModalTo] = useState<string | null>(null);
  const [labelInput, setLabelInput] = useState("");

  // Store positions for each post as Animated.ValueXY
  const [positions, setPositions] = useState<{ [id: string]: Animated.ValueXY }>({});

  // --- starfield (visual only)
  const stars = useMemo(
    () =>
      Array.from({ length: 70 }).map(() => ({
        topPct: Math.random() * 100,
        leftPct: Math.random() * 100,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.6 + 0.25,
      })),
    []
  );

  // Initialize positions for each post
  React.useEffect(() => {
    setPositions((prev) => {
      const updated: { [id: string]: Animated.ValueXY } = { ...prev };
      currentProject.posts.forEach((post, idx) => {
        if (!updated[post.id]) {
          const x = 100 + (idx % 3) * 120;
          const y = 200 + Math.floor(idx / 3) * 120;
          updated[post.id] = new Animated.ValueXY({ x, y });
        }
      });
      return updated;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProject.posts.length]);

  const addPost = async () => {
    const newPost: Post = {
      id: Date.now().toString(),
      title: "New Post",
      type: "Custom",
      imageUri: null,
      projectId: currentProject.id,
      notes: "",
    };
    const allProjects = await getProjects();
    const idx = allProjects.findIndex((p) => p.id === currentProject.id);
    if (idx !== -1) {
      const updatedProject = {
        ...allProjects[idx],
        posts: [...allProjects[idx].posts, newPost],
      };
      allProjects[idx] = updatedProject;
      await saveProjects(allProjects);
      setCurrentProject(updatedProject);
      onUpdateProject(updatedProject);
    }
  };

  const openPost = (postId: string) => {
    setSelectedPostId(postId);
  };

  const handleNodePress = async (postId: string) => {
    if (connectMode) {
      if (!sourceNodeId) {
        setSourceNodeId(postId);
      } else if (sourceNodeId !== postId) {
        const newConnection: Connection = {
          id: Date.now().toString(),
          name: "",
          postA: sourceNodeId,
          postB: postId,
        };
        await addConnection(currentProject.id, newConnection);
        await reloadProject();
        setSourceNodeId(sourceNodeId);
      }
    } else if (!dragMode) {
      openPost(postId);
    }
  };

  const handleBackgroundPress = () => {
    if (connectMode) {
      setConnectMode(false);
      setSourceNodeId(null);
    }
  };

  const saveLabel = () => {
    setLabelModalVisible(false);
    setLabelModalFrom(null);
    setLabelModalTo(null);
    setLabelInput("");
  };

  const reloadProject = async () => {
    const allProjects = await getProjects();
    const freshProject = allProjects.find((p) => p.id === currentProject.id);
    if (freshProject) setCurrentProject(freshProject);
  };

  const handleUpdateProject = async (updated: Project) => {
    const allProjects = await getProjects();
    const freshProject = allProjects.find((p) => p.id === updated.id);
    if (freshProject) {
      setCurrentProject(freshProject);
      onUpdateProject(freshProject);
    }
  };

  const renderConnections = () => {
    if (!currentProject.connections) return null;
    return currentProject.connections.map((conn) => {
      const from = positions[conn.postA];
      const to = positions[conn.postB];
      if (!from || !to) return null;
      // @ts-ignore
      const fromX = from.x._value + 40,
        // @ts-ignore
        fromY = from.y._value + 40;
      // @ts-ignore
      const toX = to.x._value + 40,
        // @ts-ignore
        toY = to.y._value + 40;

      return (
        <View
          key={conn.id}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: W,
            height: H,
            pointerEvents: "box-none",
          }}
        >
          <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
            <line x1={fromX} y1={fromY} x2={toX} y2={toY} stroke="#7c83ff" strokeWidth="3" opacity="0.95" />
          </svg>
        </View>
      );
    });
  };

  if (selectedPostId) {
    return (
      <PostPage
        postId={selectedPostId}
        onClose={async () => {
          await reloadProject();
          setSelectedPostId(null);
        }}
        project={currentProject}
        onUpdateProject={handleUpdateProject}
      />
    );
  }

  return (
    <Pressable style={{ flex: 1, backgroundColor: "transparent" }} onPress={handleBackgroundPress}>
      {/* Night-sky gradient background */}
      <LinearGradient
        colors={["#070915", "#0a0f2e", "#16173d"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {/* Subtle stars */}
      {stars.map((s, i) => (
        <View
          key={i}
          style={{
            position: "absolute",
            top: `${s.topPct}%`,
            left: `${s.leftPct}%`,
            width: s.size,
            height: s.size,
            borderRadius: s.size / 2,
            backgroundColor: "#ffffff",
            opacity: s.opacity,
          }}
        />
      ))}

      {/* Header */}
      <View style={styles.header}>
        <Button title="Back to Dashboard" onPress={onBack} color="#3b82f6" />
        <Text style={styles.titleText}>{currentProject.name}</Text>
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <Button title="Add Post" onPress={addPost} color="#3b82f6" />
        </View>
      </View>

      {/* Canvas */}
      <View style={styles.canvas}>
        {renderConnections()}
        {currentProject.posts.map((post) => {
          if (!positions[post.id]) return null;
          const pan = positions[post.id];

          const panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => dragMode,
            onPanResponderGrant: () => {
              pan.setOffset({
                // @ts-ignore
                x: pan.x._value,
                // @ts-ignore
                y: pan.y._value,
              });
              pan.setValue({ x: 0, y: 0 });
            },
            onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
            onPanResponderRelease: () => {
              pan.flattenOffset();
            },
          });

          return (
            <Animated.View
              key={post.id}
              {...(dragMode ? panResponder.panHandlers : {})}
              style={[
                {
                  position: "absolute",
                  left: 0,
                  top: 0,
                  transform: pan.getTranslateTransform(),
                  alignItems: "center",
                  justifyContent: "center",
                  userSelect: "none",
                  cursor: "pointer",
                },
              ]}
            >
              {/* Label */}
              <Text
                style={[
                  styles.nodeLabel,
                  connectMode && sourceNodeId === post.id && { color: "#fbbf24" },
                ]}
                onPress={() => handleNodePress(post.id)}
              >
                {post.title}
              </Text>

              {/* Circle */}
              <View style={styles.nodeCircle} />
            </Animated.View>
          );
        })}
      </View>

      {/* Toolbar */}
      <View style={styles.toolbar}>
        <TouchableOpacity
          style={[
            styles.toolBtn,
            {
              backgroundColor: dragMode ? "#6366f1" : "rgba(198, 205, 255, 0.25)",
              borderColor: dragMode ? "rgba(255,255,255,0.45)" : "rgba(129,140,248,0.45)",
            },
          ]}
          onPress={() => {
            setDragMode((prev) => !prev);
            setConnectMode(false);
            setSourceNodeId(null);
          }}
        >
          <FontAwesome name="hand-paper-o" size={28} color={dragMode ? "#fff" : "#6366f1"} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toolBtn,
            {
              backgroundColor: connectMode ? "#f59e0b" : "rgba(198, 205, 255, 0.25)",
              borderColor: connectMode ? "rgba(255,255,255,0.45)" : "rgba(129,140,248,0.45)",
            },
          ]}
          onPress={() => {
            setConnectMode((prev) => !prev);
            setDragMode(false);
            setSourceNodeId(null);
          }}
        >
          <FontAwesome name="share-alt" size={28} color={connectMode ? "#fff" : "#6366f1"} />
        </TouchableOpacity>

        <Text style={styles.modeText}>
          {dragMode
            ? "Drag Mode: ON"
            : connectMode
            ? sourceNodeId
              ? "Select nodes to connect"
              : "Connection Mode: Select source"
            : "Drag or Connect"}
        </Text>
      </View>

      {/* Modal (unchanged logic) */}
      <Modal
        visible={labelModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLabelModalVisible(false)}
      >
        <View style={styles.modalMask}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Name Relationship</Text>
            <TextInput
              style={styles.modalInput}
              value={labelInput}
              onChangeText={setLabelInput}
              placeholder="Relationship name"
              placeholderTextColor="#9aa1ff"
            />
            <View style={{ flexDirection: "row" }}>
              <Button title="Save" onPress={saveLabel} />
              <View style={{ width: 12 }} />
              <Button title="Cancel" onPress={() => setLabelModalVisible(false)} color="#888" />
            </View>
          </View>
        </View>
      </Modal>
    </Pressable>
  );
}

/* ========== styles (visual only) ========== */
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "rgba(10,12,28,0.55)",
    borderBottomWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  titleText: {
    fontSize: 24,
    fontWeight: "800",
    marginLeft: 16,
    color: "#e5e7eb",
    textShadowColor: "rgba(255,255,255,0.25)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  canvas: {
    flex: 1,
    backgroundColor: "rgba(6,9,22,0.12)",
  },
  nodeLabel: {
    color: "#c7d2fe",
    fontWeight: "800",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 6,
    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    userSelect: "none",
  },
  nodeCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#5865f2",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.35)",
    shadowColor: "#4f46e5",
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  toolbar: {
    width: "100%",
    height: 68,
    backgroundColor: "rgba(13,16,34,0.72)",
    borderTopWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
    paddingHorizontal: 10,
  },
  toolBtn: {
    borderRadius: 32,
    padding: 10,
    marginHorizontal: 10,
    borderWidth: 1,
  },
  modeText: {
    fontWeight: "700",
    color: "#c7d2fe",
    fontSize: 16,
    marginLeft: 10,
  },
  modalMask: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    backgroundColor: "rgba(12,14,30,0.95)",
    padding: 20,
    borderRadius: 12,
    minWidth: 260,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(129,140,248,0.35)",
  },
  modalTitle: {
    fontWeight: "800",
    fontSize: 16,
    marginBottom: 10,
    color: "#e5e7eb",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#7c83ff",
    borderRadius: 8,
    padding: 8,
    width: 200,
    marginBottom: 12,
    color: "#e5e7eb",
    backgroundColor: "rgba(18,22,50,0.6)",
  },
});
