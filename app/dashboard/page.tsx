"use client";

import { PromptInput } from "@/components/prompt-input";
import { useProjects } from "@/lib/projects/use-projects";
import { timeSince } from "@/lib/utils";
import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Link,
  Skeleton,
} from "@nextui-org/react";

export default function Dashboard() {
  const { projects, isloading, addProject, removeProject } = useProjects();
  useCopilotReadable({
    description: "The state of the projects list",
    value: JSON.stringify(projects),
  });

  useCopilotAction({
    name: "addProject",
    description:
      "Adds/creates/makes a project to the projects list with unique names",
    render: "getting ready...",
    parameters: [
      {
        name: "name",
        type: "string",
        description:
          "The unique name of the project (name should not include in existing projects)",
        required: true,
      },
      {
        name: "description",
        type: "string",
        description: "The description of the project",
        required: true,
      },
    ],
    handler: async ({ description, name }) => {
      if (!name || !description) {
        throw new Error("Both name and description are required");
      }

      // Construct project payload
      const newProject = {
        name,
        description,
      };

      try {
        // Call addProject function from context to add the project
        await addProject(newProject);
        return {
          success: true,
          message: `Project '${name}' added successfully`,
        };
      } catch (error: any) {
        return {
          success: false,
          message: `Failed to add project: ${error.message}`,
        };
      }
    },
  });

  useCopilotAction({
    name: "removeProject",
    description: "removes/deletes a project from the projects list",
    parameters: [
      {
        name: "id",
        type: "string",
        description: "The id of the project fetch from project list with name",
        required: true,
      },
    ],
    handler: async ({ id }) => {
      if (!id) {
        throw new Error("id is required");
      }

      try {
        // Call addProject function from context to add the project
        await removeProject(id);
        return {
          success: true,
          message: `Project '${name}' removed successfully`,
        };
      } catch (error: any) {
        return {
          success: false,
          message: `Failed to remove project: ${error.message}`,
        };
      }
    },
  });
  return (
    <div className="container max-w-[60ch] mx-auto px-4 flex items-center flex-col justify-center w-full h-full">
      <div>
        <h2 className="my-10 sm:my-20 text-xl text-center sm:text-5xl ">
          Ask Copliot AI Anything
        </h2>
        <PromptInput />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 h-full w-full">
        {projects.map((p) => (
          <Card key={p.id} className="max-w-[400px]">
            <CardHeader className="flex gap-3">
              <div className="flex flex-col">
                <p className="text-md">{p.name}</p>
                <p className="text-small text-default-500">
                  last {timeSince(p.updatedAt)}
                </p>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              <p>{p.description}</p>
            </CardBody>
            <Divider />
            <CardFooter>
              <Link showAnchorIcon href={`/dashboard/project/${p.id}`}>
                View and Edit
              </Link>
            </CardFooter>
          </Card>
        ))}

        {isloading && <LoadingSk />}
      </div>
    </div>
  );
}

function LoadingSk() {
  return Array.from({ length: 4 }).map((_, idx) => (
    <Card key={idx} className="w-[300px] space-y-5 p-4">
      <Skeleton className="rounded-lg">
        <div className="h-3 rounded-lg bg-default-200"></div>
        <div className="h-6 rounded-lg bg-default-200"></div>
      </Skeleton>

      <Divider />
      <div className="space-y-3">
        <Skeleton className="w-3/5 rounded-lg">
          <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
        </Skeleton>
        <Skeleton className="w-4/5 rounded-lg">
          <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
        </Skeleton>
        <Skeleton className="w-2/5 rounded-lg">
          <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
        </Skeleton>
      </div>
    </Card>
  ));
}
