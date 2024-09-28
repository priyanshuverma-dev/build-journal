"use client";
import { Project } from "@prisma/client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  createProject,
  deleteProject,
  fetchProject,
  fetchProjects,
} from "../data";
import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import { useParams } from "next/navigation";

type ProjectPayload = {
  name: string;
  description: string;
};

type ProjectsContextType = {
  projects: Project[];
  addProject: (payload: ProjectPayload) => Promise<void>;
  isloading: boolean;
  removeProject: (id: string) => Promise<void>;
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
};

const ProjectsContext = createContext<ProjectsContextType | undefined>(
  undefined
);

export const ProjectsProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isloading, setIsloading] = useState(false);

  useEffect(() => {
    const loadProjects = async () => {
      setIsloading(true);
      const fetchedProjects = await fetchProjects();
      setProjects(fetchedProjects);
      setIsloading(false);
    };

    loadProjects();
  }, []);

  const addProject = async (project: ProjectPayload) => {
    try {
      const newProject = await createProject(project);
      if (!newProject) throw new Error("Failed to add project in db");
      setProjects((prevProjects) => [...prevProjects, newProject]);
    } catch (error) {
      console.error("Failed to add project:", error);
    }
  };

  const removeProject = async (id: string) => {
    try {
      const newProject = await deleteProject(id);
      if (!newProject) throw new Error("Failed to add project in db");

      setProjects((prevProjects) => prevProjects.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Failed to add project:", error);
    }
  };

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        addProject,
        isloading,
        removeProject,
        currentProject,
        setCurrentProject,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectsProvider");
  }
  return context;
};
