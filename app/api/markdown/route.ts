import { auth } from "@/auth";
import { copilotGenerateMarkdown } from "@/lib/data";
import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const session = await auth();

    if (!session) throw new Error("unauthenticated");
    const { description, projectId, title } = await req.json();

    if (!description || !projectId) {
      throw new Error("description and projectId is required.");
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

    const markdownPrompt = `
    You are a markdown generation assistant for documenting a project's development. Your task is to generate a detailed project development log in markdown format. This log should build upon previous logs while reflecting the current instructions.

    - **Project Name:** "${project.name}"

    ### Context:
    The following are the existing logs from earlier stages of the project. Use them as context to ensure the log maintains continuity, avoids redundancy, and effectively reflects progress.
    \`\`\`
    ${project.pages.map((p, i) => `Page ${i + 1}: ${p.markdown}`).join("\n")}
    \`\`\`

    ### New Instructions:
    Based on the following new instructions, generate a new markdown page:
    \`\`\`
    ${description}
    \`\`\`

    ### Requirements for the New Log:
    - Do not start the output with a newline or any special characters like \`\`\`.
    - Ensure the new log reflects any changes or new phases, while avoiding repetition from earlier logs.
    - Structure the log with the following sections:

    1. **Updated Project Overview:** Summarize the updated status of the project, including any shifts in goals or focus based on the new instructions.
    2. **New Phases:** Document any new development phases or stages added to the project, building on the earlier ones.
    3. **Continued Setup:** Describe new steps or refinements in the project setup (new tools, libraries, or configurations).
    4. **New Code Snippets:** Provide new code snippets that align with the latest changes or instructions, avoiding duplication of previously logged snippets.
    5. **Feature Enhancements:** Describe any new features added based on the new instructions, including relevant design decisions or challenges.
    6. **Updated Milestones:** Document new milestones, if any, achieved since the last log.
    7. **Next Steps:** Outline upcoming tasks or objectives based on the current progress.

    Please ensure the markdown is clear, structured, and properly formatted, and does not start with unnecessary line breaks or markdown characters.
    `;

    const markdown = await copilotGenerateMarkdown(markdownPrompt);
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
