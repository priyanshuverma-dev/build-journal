import { auth } from "@/auth";
import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { Project } from "@prisma/client";
import { Mistral } from "@mistralai/mistralai";

const model = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

export const GET = async (req: NextRequest) => {
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
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(projects);
  } catch (error: any) {
    console.log(error);
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
  - Project Description: "${description}"

  The development log should include the following sections:
  1. **Project Overview**: A brief introduction to the project and its goals.
  2. **Phases**: List of phases from setuping locally to deployment give name and prompt to generate them.
  3. **Initial Setup**: Describe the initial steps taken to start the project, including tech stack choices.
  4. **Code Snippets**: From scratch start by setuping project add code and terminal command snippets.
  5. **Feature Development**: Discuss major features developed, including design decisions and any iterations.
  6. **Development Milestones**: Document key milestones achieved during the project, such as feature completions, challenges faced, and solutions implemented.
  Please make the markdown clear and structured, providing details that capture the development journey of the project.
  - Don't use "\`" in starting of markdown or end use only in code snippets
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
        // markdown,
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
    const searchParams = req.nextUrl.searchParams;
    const md = searchParams.get("md") ?? "0";
    const payload: Partial<Project> = await req.json();

    if (!payload) {
      throw new Error("payload is required.");
    }

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
        userId: user.id,
      },
    });

    return NextResponse.json(project);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

const copilotGenerateMarkdown = async (prompt: string): Promise<string> => {
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
