import React, { useState } from "react";
import { Text, View, PanResponder, Animated, Dimensions, Button, TouchableOpacity, Pressable, TextInput, Modal } from "react-native";
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
  // Update in storage
  const allProjects = await getProjects();
  const idx = allProjects.findIndex(p => p.id === currentProject.id);
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

  // Open a post and reload the latest project from storage after update
  const openPost = (postId: string) => {
    setSelectedPostId(postId);
  };

  // Handle connection logic (project-level)
  const handleNodePress = async (postId: string) => {
    if (connectMode) {
      if (!sourceNodeId) {
        setSourceNodeId(postId); // Start connection from this node
      } else if (sourceNodeId !== postId) {
        // Add a new connection at the project level
        const newConnection: Connection = {
          id: Date.now().toString(),
          name: "", // You can set a default or open a modal for naming
          postA: sourceNodeId,
          postB: postId,
        };
        await addConnection(currentProject.id, newConnection);
        await reloadProject();
        setSourceNodeId(sourceNodeId); // Keep source for multi-connection
      }
    } else if (!dragMode) {
      openPost(postId);
    }
  };

  // Stop connection mode if clicking on empty space
  const handleBackgroundPress = () => {
    if (connectMode) {
      setConnectMode(false);
      setSourceNodeId(null);
    }
  };

  // Modal for naming relationship (optional, not wired to project-level connections in this sample)
  const saveLabel = () => {
    setLabelModalVisible(false);
    setLabelModalFrom(null);
    setLabelModalTo(null);
    setLabelInput("");
  };

  // Reload the latest project from storage
  const reloadProject = async () => {
    const allProjects = await getProjects();
    const freshProject = allProjects.find(p => p.id === currentProject.id);
    if (freshProject) setCurrentProject(freshProject);
  };

  // Called after saving a post in PostPage
  const handleUpdateProject = async (updated: Project) => {
    // Reload the latest project from storage to ensure UI is up-to-date
    const allProjects = await getProjects();
    const freshProject = allProjects.find(p => p.id === updated.id);
    if (freshProject) {
      setCurrentProject(freshProject);
      onUpdateProject(freshProject);
    }
  };

  // Draw lines for connections (project-level)
  const renderConnections = () => {
    if (!currentProject.connections) return null;
    return currentProject.connections.map((conn) => {
      const from = positions[conn.postA];
      const to = positions[conn.postB];
      if (!from || !to) return null;
      // @ts-ignore
      const fromX = from.x._value + 40, fromY = from.y._value + 40;
      // @ts-ignore
      const toX = to.x._value + 40, toY = to.y._value + 40;
      // Label logic can be added here if you wish
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
          {/* Clickable line using SVG */}
          <svg
            width={W}
            height={H}
            style={{ position: "absolute", left: 0, top: 0 }}
          >
            <line
              x1={fromX}
              y1={fromY}
              x2={toX}
              y2={toY}
              stroke="#6366f1"
              strokeWidth="3"
            />
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
    <Pressable style={{ flex: 1, backgroundColor: "#f3f4f6" }} onPress={handleBackgroundPress}>
      <View style={{ flexDirection: "row", alignItems: "center", padding: 12 }}>
        <Button title="Back to Dashboard" onPress={onBack} />
        <Text style={{ fontSize: 24, fontWeight: "bold", marginLeft: 16 }}>
          {currentProject.name}
        </Text>
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <Button title="Add Post" onPress={addPost} />
        </View>
      </View>
      <View style={{ flex: 1 }}>
        {renderConnections()}
        {currentProject.posts.map((post) => {
          if (!positions[post.id]) return null;
          const pan = positions[post.id];

          // Only enable drag if dragMode is true
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
            onPanResponderMove: Animated.event(
              [null, { dx: pan.x, dy: pan.y }],
              { useNativeDriver: false }
            ),
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
              {/* Move the text above the node */}
              <Text
                style={{
                  color: connectMode && sourceNodeId === post.id ? "#f59e42" : "#6366f1",
                  fontWeight: "bold",
                  fontSize: 16,
                  textAlign: "center",
                  marginBottom: 6,
                  userSelect: "none",
                  cursor: "pointer",
                }}
                onPress={() => handleNodePress(post.id)}
              >
                {post.title}
              </Text>
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: "#6366f1",
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 3,
                  borderColor: "#e0e7ff",
                  userSelect: "none",
                }}
              />
            </Animated.View>
          );
        })}
      </View>
      {/* Toolbar at the bottom */}
      <View
        style={{
          width: "100%",
          height: 60,
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderColor: "#e0e7ff",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          bottom: 0,
          left: 0,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: dragMode ? "#6366f1" : "#e0e7ff",
            borderRadius: 30,
            padding: 10,
            marginHorizontal: 10,
          }}
          onPress={() => {
            setDragMode((prev) => !prev);
            setConnectMode(false);
            setSourceNodeId(null);
          }}
        >
          <FontAwesome name="hand-paper-o" size={28} color={dragMode ? "#fff" : "#6366f1"} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: connectMode ? "#f59e42" : "#e0e7ff",
            borderRadius: 30,
            padding: 10,
            marginHorizontal: 10,
          }}
          onPress={() => {
            setConnectMode((prev) => !prev);
            setDragMode(false);
            setSourceNodeId(null);
          }}
        >
          <FontAwesome name="share-alt" size={28} color={connectMode ? "#fff" : "#6366f1"} />
        </TouchableOpacity>
        <Text style={{ fontWeight: "bold", color: "#6366f1", fontSize: 16, marginLeft: 10 }}>
          {dragMode
            ? "Drag Mode: ON"
            : connectMode
            ? sourceNodeId
              ? "Select nodes to connect"
              : "Connection Mode: Select source"
            : "Drag or Connect"}
        </Text>
      </View>
      {/* Modal for naming relationship (optional, not wired to project-level connections in this sample) */}
      <Modal
        visible={labelModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLabelModalVisible(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.3)",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <View style={{
            backgroundColor: "#fff",
            padding: 20,
            borderRadius: 12,
            minWidth: 240,
            alignItems: "center"
          }}>
            <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 10 }}>Name Relationship</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#6366f1",
                borderRadius: 8,
                padding: 8,
                width: 180,
                marginBottom: 12,
              }}
              value={labelInput}
              onChangeText={setLabelInput}
              placeholder="Relationship name"
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