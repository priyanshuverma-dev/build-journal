import { Project } from "@prisma/client";

export const features = [
  {
    title: "Project Documentation",
    description:
      " Keep track of all your project details, ideas, and features in one place.",
  },
  {
    title: "Code Snippet Manager",
    description:
      " Save and manage your code snippets alongside their respective project features.",
  },
  {
    title: "Auto-generate README",
    description:
      "Automatically generate a README file based on your project data and features.",
  },
];

type ProjectPayload = {
  name: string;
  description: string;
};

export async function fetchProjects() {
  try {
    const res = await fetch("/api/projects?md=0");

    const data = await res.json();
    if (res.status != 200) throw new Error(data.error);

    return data as Project[];
  } catch (error) {
    console.log("[PROJECTS_FETCHING]", error);
    return [];
  }
}

export async function fetchProject(id: string) {
  try {
    const res = await fetch(`/api/projects/${id}`);

    const data = await res.json();
    if (res.status != 200) throw new Error(data.error);

    return data as Project;
  } catch (error) {
    console.log("[PROJECT_FETCHING]", error);
    return null;
  }
}

export async function createProject(payload: ProjectPayload) {
  try {
    const res = await fetch("/api/projects", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (res.status != 200) throw new Error(data.error);

    return data as Project;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function updateProject(payload: Partial<Project>, md?: string) {
  try {
    const res = await fetch(`/api/projects?md=${md}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (res.status != 200) throw new Error(data.error);

    return data as Project;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function deleteProject(id: string) {
  try {
    const res = await fetch("/api/projects", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });

    const data = await res.json();
    if (res.status != 200) throw new Error(data.error);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
