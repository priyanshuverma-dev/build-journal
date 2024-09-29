import { auth } from "@/auth";
import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { Project } from "@prisma/client";
import { copilotGenerateMarkdown } from "@/lib/data";
import { initMarkdownPrompt } from "@/lib/utils";

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

    const { name, description, markdown } = await req.json();

    if (!name || !markdown) {
      throw new Error("name is required.");
    }

    // const markdown = await copilotGenerateMarkdown(
    //   initMarkdownPrompt(name, description)
    // ); // Generate the markdown here

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
        userId: user.id,
        pages: {
          create: {
            markdown,
            title: `${name} - Overview`,
            description,
          },
        },
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
