import React from "react";
import { notFound } from "next/navigation";
import md from "markdown-it";
import { Link } from "@nextui-org/react";
import { ArrowRight } from "lucide-react";
import db from "@/lib/db";
import { Project } from "@prisma/client";

const fetchProject = async (id: string): Promise<Project | null> => {
  try {
    const data = await db.project.findUnique({
      where: {
        id,
      },
    });
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default async function ProjectPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const project = await fetchProject(id);

  if (project == undefined) {
    notFound();
  }

  return (
    <article className="rounded-lg p-1 m-2 container max-w-[60ch] mx-auto px-4 bg-default-50">
      <div className="prose mx-auto mt-8 dark:prose-invert">
        <h1 className="dark:text-white">{project.name}</h1>
        <div className="mb-4 flex items-center">
          <Link
            href="/dashboard"
            className="text-teail-600 hover:underline dark:text-white"
          >
            Projects
          </Link>
          <span className="inline-block mx-2">
            <ArrowRight />
          </span>
          <h3 className="inline-block text-[18px] decoration-[#525252] dark:text-white mt-[3px] mb-[4px] text-3xl font-bold">
            {project.name}
          </h3>
        </div>
        <div
          dangerouslySetInnerHTML={{
            __html: md({
              linkify: true,
              typographer: true,
            }).render(project.markdown),
          }}
          className="dark:text-white"
        />
      </div>
    </article>
  );
}
