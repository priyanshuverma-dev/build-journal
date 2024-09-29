import { auth } from "@/auth";
import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  request: Request,
  { params: { id } }: { params: { id: string } }
) => {
  try {
    const session = await auth();

    if (!session) throw new Error("unauthenticated");
    console.log(id);
    const project = await db.project.findUnique({
      where: {
        id,
      },
      include: {
        pages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    return NextResponse.json(project);
  } catch (error: any) {
    // console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const DELETE = async (
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) => {
  try {
    const session = await auth();

    if (!session) throw new Error("unauthenticated");

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
