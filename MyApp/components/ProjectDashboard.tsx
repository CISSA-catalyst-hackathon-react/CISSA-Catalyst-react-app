import React, { useState, useEffect } from "react";
import { ScrollView, Text, Button, View } from "react-native";
import { Project } from "@/models/Project";
import { Post } from "@/models/Post";
import PostCard from "./PostCard";
import PostPage from "@/app/(tabs)/postPage";
import { getProjects, saveProjects } from "@/storage/storage";

type Props = {
  project: Project;
  onBack: () => void;
  onUpdateProject: (updated: Project) => void;
};

export default function ProjectDashboard({ project, onBack, onUpdateProject }: Props) {
  const [currentProject, setCurrentProject] = useState<Project>(project);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

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
    <ScrollView style={{ flex: 1, padding: 12 }}>
      <Button title="Back to Dashboards" onPress={onBack} />
      <Text style={{ fontSize: 24, fontWeight: "bold", marginVertical: 10 }}>
        {currentProject.name}
      </Text>
      <Button title="Add Post" onPress={addPost} />
      {currentProject.posts.map((post) => (
        <PostCard key={post.id} post={post} onPress={() => openPost(post.id)} />
      ))}
    </ScrollView>
  );
}

