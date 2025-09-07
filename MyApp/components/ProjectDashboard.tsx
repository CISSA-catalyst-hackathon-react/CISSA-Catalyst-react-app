import React, { useState } from "react";
import { Text, View, PanResponder, Animated, Dimensions, Button, TouchableOpacity, Pressable, TextInput, Modal } from "react-native";
import { Project } from "@/models/Project";
import { Post } from "@/models/Post";
import PostPage from "@/app/(tabs)/postPage";
import { FontAwesome } from "@expo/vector-icons";

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
  // Store connection labels
  const [connectionLabels, setConnectionLabels] = useState<ConnectionLabel[]>([]);

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

  const addPost = () => {
    const newPost: Post = {
      id: Date.now().toString(),
      title: "New Post",
      type: "Custom",
      imageUri: null,
      connections: [],
      projectId: project.id,
      notes: "",
    };
    const updated = { ...currentProject, posts: [...currentProject.posts, newPost] };
    setCurrentProject(updated);
    onUpdateProject(updated);
  };

  const openPost = (postId: string) => {
    setSelectedPostId(postId);
  };

  // Handle connection logic
  const handleNodePress = (postId: string) => {
    if (connectMode) {
      if (!sourceNodeId) {
        setSourceNodeId(postId); // Start connection from this node
      } else if (sourceNodeId !== postId) {
        // Connect sourceNodeId to postId
        const updatedPosts = currentProject.posts.map((post) => {
          if (post.id === sourceNodeId && !post.connections.includes(postId)) {
            return { ...post, connections: [...post.connections, postId] };
          }
          return post;
        });
        setCurrentProject({ ...currentProject, posts: updatedPosts });
        onUpdateProject({ ...currentProject, posts: updatedPosts });
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

  // Handle line click to name relationship
  const handleLinePress = (from: string, to: string) => {
    setLabelModalFrom(from);
    setLabelModalTo(to);
    const existing = connectionLabels.find(l => l.from === from && l.to === to);
    setLabelInput(existing ? existing.label : "");
    setLabelModalVisible(true);
  };

  const saveLabel = () => {
    if (labelModalFrom && labelModalTo) {
      setConnectionLabels(prev => {
        const filtered = prev.filter(l => !(l.from === labelModalFrom && l.to === labelModalTo));
        return [...filtered, { from: labelModalFrom, to: labelModalTo, label: labelInput }];
      });
    }
    setLabelModalVisible(false);
    setLabelModalFrom(null);
    setLabelModalTo(null);
    setLabelInput("");
  };

  if (selectedPostId) {
    return (
      <PostPage
        postId={selectedPostId}
        onClose={() => setSelectedPostId(null)}
        project={currentProject}
        onUpdateProject={onUpdateProject}
      />
    );
  }

  // Draw lines for connections
  const renderConnections = () => {
    return currentProject.posts.flatMap((post) =>
      post.connections.map((targetId) => {
        const from = positions[post.id];
        const to = positions[targetId];
        if (!from || !to) return null;
        // @ts-ignore
        const fromX = from.x._value + 40, fromY = from.y._value + 40;
        // @ts-ignore
        const toX = to.x._value + 40, toY = to.y._value + 40;
        const labelObj = connectionLabels.find(l => l.from === post.id && l.to === targetId);

        return (
          <View
            key={`${post.id}-${targetId}`}
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
                onClick={() => connectMode && handleLinePress(post.id, targetId)}
                style={{ cursor: connectMode ? "pointer" : "default" }}
              />
            </svg>
            {/* Label at the midpoint */}
            {labelObj && labelObj.label && (
              <View
                style={{
                  position: "absolute",
                  left: (fromX + toX) / 2 - 40,
                  top: (fromY + toY) / 2 - 12,
                  backgroundColor: "#fff",
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#6366f1",
                  minWidth: 40,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#6366f1", fontWeight: "bold", fontSize: 13 }}>
                  {labelObj.label}
                </Text>
              </View>
            )}
          </View>
        );
      })
    );
  };

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
      {/* Modal for naming relationship */}
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

