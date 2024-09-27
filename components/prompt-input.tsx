"use client";

import { useProjects } from "@/lib/projects/use-projects";
import { useCopilotChat } from "@copilotkit/react-core";
import { Role, TextMessage } from "@copilotkit/runtime-client-gql";
import { Progress, Textarea } from "@nextui-org/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
export function PromptInput() {
  const { projects } = useProjects();
  const { appendMessage, isLoading, stopGeneration, visibleMessages } =
    useCopilotChat();
  const [value, setValue] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Get values from form fields
    const value = formData.get("inputfield");
    if (!value) return;

    const promise = () =>
      new Promise(async (resolve, reject) => {
        const initialProjectCount = projects.length;

        // Attempt to append the message
        await appendMessage(
          new TextMessage({
            content: value.toString(),
            role: Role.User,
          })
        );

        // Check the new count of projects
        const newProjectCount = projects.length;
        // If the count hasn't changed, reject the promise
        if (newProjectCount === initialProjectCount) {
          reject(
            new Error(
              "Could you provide me with a brief description of project?."
            )
          );
        } else {
          resolve(newProjectCount); // Resolve with the new project count or any other value you need
        }
      });
    toast.promise(promise, {
      loading: "generating project...",
      success: () => {
        return "project has been added";
      },
      error: (err) => err.message ?? "stopped or failed to generate",
    });
  };
  return (
    <form
      onSubmit={onSubmit}
      className="w-full relative max-w-xl mx-auto bg-white dark:bg-zinc-800 h-full rounded-2xl overflow-hidden shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),_0px_1px_0px_0px_rgba(25,28,33,0.02),_0px_0px_0px_1px_rgba(25,28,33,0.08)] transition duration-200"
    >
      <Textarea
        variant="flat"
        placeholder="Write your project idea like 'A web app named banana to with feature to calculate pythagoras theorem.'"
        className="col-span-12 md:col-span-6 mb-6 md:mb-0 resize-y"
        isDisabled={isLoading}
        name="inputfield"
        rows={3}
        onChange={(e) => setValue(e.currentTarget.value)}
      />
      {isLoading && (
        <Progress size="sm" isIndeterminate aria-label="Loading..." />
      )}
      {!isLoading && (
        <button
          type="submit"
          disabled={isLoading}
          className="absolute right-2 top-1/2 z-50 -translate-y-1/2 h-8 w-8 rounded-full disabled:bg-gray-100 bg-black dark:bg-zinc-900 dark:disabled:bg-zinc-800 transition duration-200 flex items-center justify-center"
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-300 h-4 w-4"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <motion.path
              d="M5 12l14 0"
              initial={{
                strokeDasharray: "50%",
                strokeDashoffset: "50%",
              }}
              animate={{
                strokeDashoffset: value ? 0 : "50%",
              }}
              transition={{
                duration: 0.3,
                ease: "linear",
              }}
            />
            <path d="M13 18l6 -6" />
            <path d="M13 6l6 6" />
          </motion.svg>
        </button>
      )}
    </form>
  );
}
