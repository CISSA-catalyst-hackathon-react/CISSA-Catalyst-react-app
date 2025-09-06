import AsyncStorage from "@react-native-async-storage/async-storage";
import { Project } from "../models/Project";

const STORAGE_KEY = "projects";

export const loadProjects = async (): Promise<Project[] | null> => {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
};

export const saveProjects = async (projects: Project[]): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
};


