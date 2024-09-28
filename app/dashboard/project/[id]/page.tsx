"use client";

import React from "react";
import { notFound, useParams } from "next/navigation";
import md from "markdown-it";
import { Link } from "@nextui-org/react";
import { ArrowRight } from "lucide-react";
import { fetchProject, updateProject } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";
import { useProjects } from "@/lib/projects/use-projects";

import { Skeleton } from "@nextui-org/react";
import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";

export default function ProjectPage() {
  const { id } = useParams();
  const {
    data: project,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["project", id],
    queryFn: () => fetchProject(id as string),
    enabled: !!id,
  });

  useCopilotReadable({
    description: "The current opened project",
    value: JSON.stringify(project),
  });

  useCopilotAction({
    name: "updateProject",
    description: "updates feature in project markdown/development log",
    render: "updating...",
    parameters: [
      {
        name: "prompt",
        type: "string",
        description: "The prompt to update markdown.",
        required: true,
      },
    ],
    handler: async ({ prompt }) => {
      if (!prompt) {
        throw new Error("prompt is required");
      }
      try {
        // Call addProject function from context to add the project
        await updateProject(
          {
            id: id as string,
            description: prompt,
          },
          "1"
        );
        await refetch();
      } catch (error: any) {
        console.log(error);
      }
    },
  });
  if (isLoading) return <ProjectPageSkeleton />;
  if (error) return <div>Failed to load project</div>;
  if (!project) return notFound();

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

const ProjectPageSkeleton = () => {
  return (
    <article className="rounded-lg p-1 m-2 container max-w-[60ch] mx-auto px-4 bg-default-50">
      <div className="prose mx-auto mt-8 dark:prose-invert pb-2">
        {/* Skeleton for the project title */}
        <Skeleton className="h-10 w-3/4 mb-1" />

        {/* Skeleton for the project link and name */}
        <div className="mb-4 flex items-center">
          <Skeleton className="h-5 w-1/6" />
          <span className="inline-block mx-2">{"  "}</span>
          <Skeleton className="h-8 w-1/4" />
        </div>

        {/* Skeleton for the project markdown content */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6" />
          <Skeleton className="h-6 w-3/7" />
          <Skeleton className="h-6 w-3/8" />
          <Skeleton className="h-6 w-3/6" />
        </div>
      </div>
    </article>
  );
};
