"use client";

import { PromptInput } from "@/components/prompt-input";
import { useProjects } from "@/lib/projects/use-projects";
import { timeSince } from "@/lib/utils";
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
  const { projects, isloading } = useProjects();

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

        {(isloading || projects.length == 0) && <LoadingSk />}
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
