import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Project } from "./data";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function timeSince(date: Date | number) {
  const seconds = Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / 1000
  );

  const intervals: [number, string][] = [
    [31536000, "year"],
    [2592000, "month"],
    [86400, "day"],
    [3600, "hour"],
    [60, "minute"],
    [1, "second"],
  ];

  for (const [intervalSeconds, label] of intervals) {
    const interval = seconds / intervalSeconds;
    if (interval >= 1) {
      const count = Math.floor(interval);
      return `${count} ${label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "just now"; // If less than a second has passed
}

export const initMarkdownPrompt = (name: string, description: string) => `
You are a markdown generation assistant. Based on the project name and description provided, create a comprehensive development log for the project.

- Project Name: "${name}"
- Project Description: "${description}"

The development log should include the following sections:
1. **Project Overview**: A brief introduction to the project and its goals.
2. **Phases**: List of phases from setuping locally to deployment give name and prompt to generate them.
3. **Initial Setup**: Describe the initial steps taken to start the project, including tech stack choices.
4. **Code Snippets**: From scratch start by setuping project add code and terminal command snippets.
5. **Feature Development**: Discuss major features developed, including design decisions and any iterations.
6. **Development Milestones**: Document key milestones achieved during the project, such as feature completions, challenges faced, and solutions implemented.
Please make the markdown clear and structured, providing details that capture the development journey of the project.
- Don't use "\`" in starting of markdown or end use only in code snippets
`;

export const newMarkdownPrompt = (project: Project, description: string) => `
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
