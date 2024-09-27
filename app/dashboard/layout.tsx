import { CopilotKit } from "@copilotkit/react-core";
import {
  CopilotKitCSSProperties,
  CopilotSidebar,
  WindowProps,
} from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import DashboardNav from "./_components/navbar";
import { Divider } from "@nextui-org/react";
import { ProjectsProvider } from "@/lib/projects/use-projects";
import { BotIcon } from "lucide-react";
import React, { ComponentType } from "react";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-grid min-h-screen">
      <CopilotKit runtimeUrl="/api/copilotkit">
        <ProjectsProvider>
          <DashboardNav />
          <Divider />
          {children}
        </ProjectsProvider>
        <div
          style={
            {
              "--copilot-kit-primary-color": "#222222",
            } as CopilotKitCSSProperties
          }
        >
          <CopilotSidebar
            labels={{
              title: "Your Assistant",
              initial: "Hi! 👋 How can I assist you today?",
            }}
            icons={{
              openIcon: <BotIcon />,
            }}
            className="text-primary"
          ></CopilotSidebar>
        </div>
      </CopilotKit>
      <footer className="py-6 mt-20 bottom-0">
        <div className="container mx-auto px-6 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Build Journal. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
