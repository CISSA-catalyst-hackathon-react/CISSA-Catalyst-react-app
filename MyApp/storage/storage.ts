import AsyncStorage from "@react-native-async-storage/async-storage";
import { Project } from "@/models/Project";
import { Post } from "@/models/Post";
import projectsJson from "@/data/projects.json";
import { Connection } from "@/models/Connection";
// dashboard = project for naming sake
// Load all projects
export async function getProjects(): Promise<Project[]> {
  const stored = await AsyncStorage.getItem("projects");
  return stored ? JSON.parse(stored) : projectsJson;
}

// Save all projects
export async function saveProjects(projects: Project[]): Promise<void> {
  await AsyncStorage.setItem("projects", JSON.stringify(projects));
}

// Add a project
export async function addProject(name: string, imageUri: string | null = null): Promise<Project> {
  const projects = await getProjects();
  const newProject: Project = {
    id: Date.now().toString(),
    name,
    imageUri, // Save imageUri
    posts: [],
    connections: []
  };
  projects.push(newProject);
  await saveProjects(projects);
  return newProject;
}

// Add a post to a project
export async function addPost(projectId: string, title: string, type: string): Promise<Post | null> {
  const projects = await getProjects();
  const project = projects.find(p => p.id === projectId);
  if (!project) return null;

  const newPost: Post = {
    id: Date.now().toString(),
    title,
    type,
    imageUri: null,
    projectId
  };
  project.posts.push(newPost);
  await saveProjects(projects);
  return newPost;
}

// Update a post
export async function updatePost(updatedPost: Post): Promise<void> {
  const projects = await getProjects();
  const project = projects.find(p => p.id === updatedPost.projectId);
  if (!project) return;
  project.posts = project.posts.map(p => (p.id === updatedPost.id ? updatedPost : p));
  await saveProjects(projects);
}
// ...existing code...

export async function addConnection(projectId: string, connection: Connection): Promise<void> {
  const projects = await getProjects();
  const project = projects.find(p => p.id === projectId);
  if (!project) return;
  project.connections = [...(project.connections || []), connection];
  await saveProjects(projects);
}

export async function updateConnection(projectId: string, updatedConnection: Connection): Promise<void> {
  const projects = await getProjects();
  const project = projects.find(p => p.id === projectId);
  if (!project) return;
  project.connections = project.connections.map(conn =>
    conn.id === updatedConnection.id ? updatedConnection : conn
  );
  await saveProjects(projects);
}



