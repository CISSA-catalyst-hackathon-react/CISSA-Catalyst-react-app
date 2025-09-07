import React, { useState } from "react";
import { Text, View, PanResponder, Animated, Dimensions, Button, TouchableOpacity } from "react-native";
import { Project } from "@/models/Project";
import { Post } from "@/models/Post";
import PostPage from "@/app/(tabs)/postPage";
import { FontAwesome } from "@expo/vector-icons"; // For hand icon
import { getProjects, saveProjects } from "@/storage/storage";

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


  const openPost = async (postId: string) => {
    // Fetch the latest project from storage
    const allProjects = await getProjects();
    const freshProject = allProjects.find(p => p.id === currentProject.id);
    if (freshProject) {
      setCurrentProject(freshProject);
      setSelectedPostId(postId);
    }
  };

  const handleUpdateProject = (updated: Project) => {
    setCurrentProject(updated);
    onUpdateProject(updated);
  }

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

  return (
    <View style={{ flex: 1, backgroundColor: "#f3f4f6" }}>
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
                  color: "#6366f1",
                  fontWeight: "bold",
                  fontSize: 16,
                  textAlign: "center",
                  marginBottom: 6,
                  userSelect: "none",
                  cursor: "pointer",
                }}
                onPress={() => !dragMode && openPost(post.id)}
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
          onPress={() => setDragMode((prev) => !prev)}
        >
          <FontAwesome name="hand-paper-o" size={28} color={dragMode ? "#fff" : "#6366f1"} />
        </TouchableOpacity>
        <Text style={{ fontWeight: "bold", color: "#6366f1", fontSize: 16 }}>
          {dragMode ? "Drag Mode: ON" : "Drag Mode: OFF"}
        </Text>
      </View>
    </View>
  );
}

