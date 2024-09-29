import { Mistral } from "@mistralai/mistralai";
import { Page } from "@prisma/client";

export type Project = {
  id: string;
  name: string;
  description: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  pages: Page[];
};

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

const model = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });
export const copilotGenerateMarkdown = async (
  prompt: string
): Promise<string> => {
  try {
    const chatCompletion = await model.chat.complete({
      model: "mistral-large-latest",
      messages: [
        {
          role: "assistant",
          content:
            "You are a markdown generation assistant. Based on the project name and description provided, create a comprehensive development log for the project.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    if (chatCompletion.choices && chatCompletion.choices.length > 0) {
      return chatCompletion.choices[0].message.content?.trim() || ""; // Extract and return the generated markdown
    } else {
      throw new Error("No markdown generated from MistralAI.");
    }
  } catch (error: any) {
    console.error("Error generating markdown:", error);
    throw new Error("Failed to generate markdown.");
  }
};

// PROJECTS
export async function fetchProjects() {
  try {
    const res = await fetch("/api/projects");

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
export async function deleteProject(id: string) {
  try {
    const res = await fetch(`/api/projects/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    if (res.status != 200) throw new Error(data.error);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

// PAGES
export async function createPage(payload: {
  description: string;
  projectId: string;
}) {
  try {
    const res = await fetch(`/api/markdown`, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (res.status != 200) throw new Error(data.error);

    return data as Page;
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function updatePage(payload: {
  id: string;
  markdown: string;
  projectId: string;
}) {
  try {
    const res = await fetch(`/api/markdown`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (res.status != 200) throw new Error(data.error);

    return data as Page;
  } catch (error) {
    console.log(error);
    return null;
  }
}
