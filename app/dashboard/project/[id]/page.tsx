"use client";

import React, { useState } from "react";
import { notFound, useParams } from "next/navigation";
import md from "markdown-it";
import { Button, Link } from "@nextui-org/react";
import { ArrowRight, Edit3 } from "lucide-react";
import { createPage, fetchProject, updatePage } from "@/lib/data";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Pagination } from "@nextui-org/react";
import { Skeleton } from "@nextui-org/react";
import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import MDEditor from "@uiw/react-md-editor";

export default function ProjectPage() {
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [editedMarkdown, setEditedMarkdown] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
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
    name: "addPage",
    description: "add page/feature/log in project markdown/development log",
    render: "adding new page...",
    parameters: [
      {
        name: "prompt",
        type: "string",
        description: "The prompt to generate/add new page.",
        required: true,
      },
    ],
    handler: async ({ prompt }) => {
      if (!prompt) {
        throw new Error("prompt is required");
      }
      try {
        // Call addProject function from context to add the project
        await createPage({
          projectId: id as string,
          description: prompt,
        });
        await refetch();
      } catch (error: any) {
        console.log(error);
      }
    },
  });

  const mutation = useMutation({
    mutationFn: ({
      pageId,
      updatedMarkdown,
    }: {
      updatedMarkdown: string;
      pageId: string;
    }) =>
      updatePage({
        projectId: id as string,
        id: pageId,
        markdown: updatedMarkdown,
      }),
    onSuccess: () => {
      refetch();
      setIsUpdating(true);
      setIsEditing(false);
    },
  });

  if (isLoading) return <ProjectPageSkeleton />;
  if (error) return <div>Failed to load project</div>;
  if (!project) return notFound();

  const handleSave = () => {
    const currentProjectPage = project.pages[currentPage - 1];
    if (editedMarkdown == currentProjectPage.markdown) return;
    setIsUpdating(true);
    mutation.mutate({
      updatedMarkdown: editedMarkdown,
      pageId: currentProjectPage.id,
    }); // Save edited markdown
  };
  const handleEditToggle = () => {
    setEditedMarkdown(project.pages[currentPage - 1].markdown); // Load existing markdown
    setIsEditing(!isEditing);
  };
  const totalPages = project.pages.length;
  const currentMarkdown = project.pages[currentPage - 1].markdown;
  return (
    <article
      className={`rounded-lg p-1 m-2 container ${
        isEditing ? "w-full" : "max-w-[60ch]"
      } mx-auto px-4 bg-default-50`}
    >
      <div className="prose mx-auto mt-8 dark:prose-invert">
        <div className="flex flex-row justify-between">
          <h1 className="dark:text-white">{project.name}</h1>
          {isEditing ? (
            <div className="p-1 space-x-2 flex justify-end">
              <Button
                onClick={handleSave}
                color="success"
                className="mt-4"
                isLoading={isUpdating}
              >
                Save Changes
              </Button>
              <Button
                onClick={handleEditToggle}
                className="mt-4 ml-2"
                disabled={isUpdating}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button onClick={handleEditToggle} size="sm" radius="full">
              <Edit3 className="w-4 h-4" />
            </Button>
          )}
        </div>
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
            {project.name} - Page {currentPage}
          </h3>
        </div>
        {isEditing ? (
          <div>
            <MDEditor
              value={editedMarkdown}
              onChange={(value) => setEditedMarkdown(value || "")}
              height="100vh"
              className="h-screen p-2"
            />
          </div>
        ) : (
          <div>
            <div
              dangerouslySetInnerHTML={{
                __html: md({
                  linkify: true,
                  typographer: true,
                }).render(currentMarkdown),
              }}
              className="dark:text-white"
            />
          </div>
        )}
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 -mb-2">
          <Pagination
            isCompact
            color="default"
            showControls
            total={totalPages}
            initialPage={1}
            page={currentPage}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
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
