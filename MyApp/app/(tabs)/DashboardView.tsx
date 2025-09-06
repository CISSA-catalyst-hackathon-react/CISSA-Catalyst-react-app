import React, { useState } from "react";
import ProjectsList from "@/components/ProjectsList";
import ProjectDashboard from "@/components/ProjectDashboard";
import { Project } from "@/models/Project";

export default function DashboardView() {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  return currentProject ? (
    <ProjectDashboard project={currentProject} onGoBack={() => setCurrentProject(null)} />
  ) : (
    <ProjectsList onSelectProject={setCurrentProject} />
  );
}



