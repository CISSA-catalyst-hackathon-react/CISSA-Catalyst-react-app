import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { Project } from "@/models/Project";
import { Post } from "@/models/Post";
import { getProjects, saveProjects, updatePost } from "@/storage/storage";

type Props = {
  postId: string;
  project: Project;
  onClose: () => void;
  onUpdateProject: (updated: Project) => void;
};

export default function PostPage({ postId, project, onClose, onUpdateProject }: Props) {
  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState("");
  const [titleHeight, setTitleHeight] = useState(0);
  const [notes, setNotes] = useState("");
  const [notesHeight, setNotesHeight] = useState(0);

  useEffect(() => {
    // Load the post from the project
    const foundPost = project.posts.find(p => p.id === postId);
    if (foundPost) {
      setPost(foundPost);
      setTitle(foundPost.title);
      setNotes(foundPost.notes || "");
    }
  }, [postId, project.posts]);

  if (!post) return <Text>Loading post...</Text>;

  const handleSave = async () => {
    if (!post) return;
    console.log("Saving post...");

    // 1. Create an updated post object with the latest edits
    const updatedPost: Post = {
      ...post,
      title,
      notes,
    };

    // 2. Update the post in storage
    await updatePost(updatedPost);

    // 3. Reload the updated project from storage
    const allProjects = await getProjects();
    const updatedProject = allProjects.find(p => p.id === project.id);

    // 4. Notify parent to refresh UI
    if (updatedProject) {
      onUpdateProject(updatedProject);

      const refreshedPost = updatedProject.posts.find(p => p.id === postId);
      if (refreshedPost) {
        setPost(refreshedPost);
        setTitle(refreshedPost.title);
        setNotes(refreshedPost.notes || "");
      }
    }
  };

  
  return (
    <View style={{ flex: 1 }}>
      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={onClose}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.row}>
          {/* Left column */}
          <View style={styles.leftColumn}>
            <Text style={styles.title}>Plan your creations here 😀</Text>

            <TextInput
              style={[styles.input, { height: Math.max(40, titleHeight) }]}
              placeholder="Enter your creative idea..."
              value={title}
              onChangeText={setTitle}
              multiline
              textAlignVertical="top"
              onContentSizeChange={(e) =>
                setTitleHeight(e.nativeEvent.contentSize.height)
              }
            />

            <TextInput
              style={[styles.notesArea, { height: Math.max(100, notesHeight) }]}
              placeholder="Write your notes here..."
              value={notes}
              onChangeText={setNotes}
              multiline
              textAlignVertical="top"
              onContentSizeChange={(e) =>
                setNotesHeight(e.nativeEvent.contentSize.height)
              }
            />

            {post.imageUri && (
              <Image
                source={{ uri: post.imageUri }}
                style={{ width: "100%", height: 200, marginTop: 12, borderRadius: 8 }}
                resizeMode="cover"
              />
            )}

            <TouchableOpacity
              style={{
                marginTop: 12,
                backgroundColor: "#573bc9ff",
                padding: 12,
                borderRadius: 8,
                alignItems: "center",
              }}
              onPress={handleSave}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Save Post</Text>
            </TouchableOpacity>
          </View>

          {/* Right column */}
          <View style={styles.rightColumn}>
            <Text style={styles.sectionHeading}>Relationships</Text>
            {post.connections.length > 0 ? (
              post.connections.map((c, idx) => <Text key={idx}>- {c}</Text>)
            ) : (
              <Text>No connections yet</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f5f5f5",
    padding: 18,
    paddingTop: 60,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  leftColumn: {
    flex: 2,
    marginRight: 30,
  },
  rightColumn: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    shadowOpacity: 0.4,
    shadowRadius: 23,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginVertical: 12,
    textAlign: "center",
  },
  input: {
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fff",
    textAlignVertical: "top",
  },
  notesArea: {
    marginTop: 20,
    fontSize: 16,
    padding: 8,
    backgroundColor: "transparent",
    borderWidth: 0,
    color: "#000",
  },
  sectionHeading: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "#6e99c8ff",
    paddingVertical: 8,
    paddingHorizontal: 32,
    borderRadius: 16,
    zIndex: 1000,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

