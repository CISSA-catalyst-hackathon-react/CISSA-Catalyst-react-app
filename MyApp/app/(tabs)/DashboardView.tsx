import React, { useState, useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { Project } from "@/models/Project";
import ProjectsList from "@/components/ProjectsList";
import ProjectDashboard from "@/components/ProjectDashboard";
import { getProjects, saveProjects } from "@/storage/storage";

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const loaded = await getProjects();
      setProjects(loaded);
      setLoading(false);
    })();
  }, []);

  const updateProjects = async (projectsToSave: Project[]) => {
    setProjects(projectsToSave);
    await saveProjects(projectsToSave);
  };

  const updateProject = async (updated: Project) => {
    const updatedProjects = projects.map(p => (p.id === updated.id ? updated : p));
    await updateProjects(updatedProjects);
    setCurrentProject(updated);
  };

  if (loading) return <ActivityIndicator size="large" />;

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
    <ProjectsList
      projects={projects}
      onSelectProject={setCurrentProject}
      onUpdateProjects={updateProjects}
    />
  );
}



