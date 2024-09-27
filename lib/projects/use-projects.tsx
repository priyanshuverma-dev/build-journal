"use client";
import { Project } from "@prisma/client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { createProject, deleteProject, fetchProjects } from "../data";
import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";

type ProjectPayload = {
  name: string;
  description: string;
};

type ProjectsContextType = {
  projects: Project[];
  addProject: (payload: ProjectPayload) => void;
  isloading: boolean;
  removeProject: (id: string) => void;
};

const ProjectsContext = createContext<ProjectsContextType | undefined>(
  undefined
);

export const ProjectsProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);
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

  useCopilotReadable({
    description: "The state of the projects list",
    value: JSON.stringify(projects),
  });

  useCopilotAction({
    name: "addProject",
    description: "Adds a project to the projects list",
    parameters: [
      {
        name: "name",
        type: "string",
        description: "The name of the project",
        required: true,
      },
      {
        name: "description",
        type: "string",
        description: "The description of the project",
        required: true,
      },
    ],
    handler: async ({ description, name }) => {
      if (!name || !description) {
        throw new Error("Both name and description are required");
      }

      // Construct project payload
      const newProject = {
        name,
        description,
      };

      try {
        // Call addProject function from context to add the project
        await addProject(newProject);
        return {
          success: true,
          message: `Project '${name}' added successfully`,
        };
      } catch (error: any) {
        return {
          success: false,
          message: `Failed to add project: ${error.message}`,
        };
      }
    },
  });
  useCopilotAction({
    name: "removeProject",
    description: "removes a project to the projects list",
    parameters: [
      {
        name: "id",
        type: "string",
        description: "The id of the project",
        required: true,
      },
    ],
    handler: async ({ id }) => {
      if (!id) {
        throw new Error("id is required");
      }

      try {
        // Call addProject function from context to add the project
        await removeProject(id);
        return {
          success: true,
          message: `Project '${name}' removed successfully`,
        };
      } catch (error: any) {
        return {
          success: false,
          message: `Failed to remove project: ${error.message}`,
        };
      }
    },
  });

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
      value={{ projects, addProject, isloading, removeProject }}
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
