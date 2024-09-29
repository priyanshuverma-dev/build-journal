import { auth } from "@/auth";
import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const session = await auth();

    if (!session) throw new Error("unauthenticated");
    const { description, projectId, title, markdown } = await req.json();

    if (!description || !projectId || !markdown) {
      throw new Error("description, markdown and projectId are required.");
    }

    const user = await db.user.findUnique({
      where: {
        email: session.user!.email!,
      },
    });

    if (!user) throw new Error("Invalid session");

    const project = await db.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        pages: true,
      },
    });

    if (!project) throw new Error("project not found");

    const pageNo = project.pages.length + 1;
    const newPage = await db.page.create({
      data: {
        projectId,
        description,
        markdown,
        pageNo,
        title: title ?? `${project.name} - log ${pageNo}`,
      },
    });

    return NextResponse.json(newPage);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
export const PATCH = async (req: NextRequest) => {
  try {
    const session = await auth();

    if (!session) throw new Error("unauthenticated");
    const { markdown, projectId, id } = await req.json();

    if (!markdown || !projectId || !id) {
      throw new Error("markdown, id and projectId are required.");
    }

    const user = await db.user.findUnique({
      where: {
        email: session.user!.email!,
      },
    });

    if (!user) throw new Error("Invalid session");

    const newPage = await db.page.update({
      where: {
        id: id,
        projectId: projectId,
      },
      data: {
        markdown,
      },
    });

    return NextResponse.json(newPage);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
