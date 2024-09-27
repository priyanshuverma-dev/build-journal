import { auth } from "@/auth";
import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

import Groq from "groq-sdk";
import { Project } from "@prisma/client";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const GET = async () => {
  try {
    const session = await auth();

    if (!session) throw new Error("unauthenticated");

    const user = await db.user.findUnique({
      where: {
        email: session.user!.email!,
      },
    });

    const projects = await db.project.findMany({
      where: {
        userId: user!.id,
      },
    });

    return NextResponse.json(projects);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const session = await auth();

    if (!session) throw new Error("unauthenticated");

    const { name, description } = await req.json();

    if (!name) {
      throw new Error("name is required.");
    }
    const markdownPrompt = `
  You are a markdown generation assistant. Based on the project name and description provided, create a comprehensive development log for the project.

  - Project Name: "${name}"
  - Project Description: "${
    description || "This project is aimed at solving a specific problem."
  }"

  The development log should include the following sections:
  1. **Project Overview**: A brief introduction to the project and its goals.
  2. **Initial Setup**: Describe the initial steps taken to start the project, including tech stack choices.
  3. **Code Snippets**: From scratch start by setuping project add code and terminal command snippets.
  4. **Feature Development**: Discuss major features developed, including design decisions and any iterations.
  5. **Development Milestones**: Document key milestones achieved during the project, such as feature completions, challenges faced, and solutions implemented.
  Please make the markdown clear and structured, providing details that capture the development journey of the project.
`;

    const markdown = await copilotGenerateMarkdown(markdownPrompt); // Generate the markdown here

    const user = await db.user.findUnique({
      where: {
        email: session.user!.email!,
      },
    });

    if (!user) throw new Error("Invalid session");

    const project = await db.project.create({
      data: {
        name,
        description,
        markdown,
        userId: user.id,
      },
    });

    return NextResponse.json(project);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
export const PATCH = async (req: NextRequest) => {
  try {
    const session = await auth();

    if (!session) throw new Error("unauthenticated");

    const payload: Partial<Project> = await req.json();

    if (!payload) {
      throw new Error("payload is required.");
    }
    const markdownPrompt = `
  You are a markdown generation assistant. Based on the project name and description provided, create a comprehensive development log for the project.

  - Project Name: "${payload.name}"
  - Project Description: "${
    payload.description ||
    "This project is aimed at solving a specific problem."
  }"

  The development log should include the following sections:
  1. **Project Overview**: A brief introduction to the project and its goals.
  2. **Initial Setup**: Describe the initial steps taken to start the project, including tech stack choices.
  3. **Code Snippets**: From scratch start by setuping project add code and terminal command snippets.
  4. **Feature Development**: Discuss major features developed, including design decisions and any iterations.
  5. **Development Milestones**: Document key milestones achieved during the project, such as feature completions, challenges faced, and solutions implemented.
  Please make the markdown clear and structured, providing details that capture the development journey of the project.
`;

    const markdown = await copilotGenerateMarkdown(markdownPrompt); // Generate the markdown here

    const user = await db.user.findUnique({
      where: {
        email: session.user!.email!,
      },
    });

    if (!user) throw new Error("Invalid session");

    const project = await db.project.update({
      where: {
        id: payload.id,
      },
      data: {
        name: payload.name,
        description: payload.description,
        markdown,
        userId: user.id,
      },
    });

    return NextResponse.json(project);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
export const DELETE = async (req: NextRequest) => {
  try {
    const session = await auth();

    if (!session) throw new Error("unauthenticated");

    const { id } = await req.json();

    if (!id) {
      throw new Error("id is required.");
    }

    const user = await db.user.findUnique({
      where: {
        email: session.user!.email!,
      },
    });

    if (!user) throw new Error("Invalid session");

    const project = await db.project.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(project);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

const copilotGenerateMarkdown = async (prompt: string): Promise<string> => {
  try {
    const chatCompletion = await groq.chat.completions.create({
      model: "gemma-7b-it",
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
      stream: false,
      max_tokens: 2048,
      temperature: 0.7,
    });

    if (chatCompletion.choices && chatCompletion.choices.length > 0) {
      return chatCompletion.choices[0].message.content?.trim() || ""; // Extract and return the generated markdown
    } else {
      throw new Error("No markdown generated from OpenAI.");
    }
  } catch (error: any) {
    console.error("Error generating markdown:", error);
    throw new Error("Failed to generate markdown.");
  }
};
