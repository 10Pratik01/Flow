import { HoverEffect } from "@/components/ui/card-hover-effect";


export function Features() {
  return (
    <div className="max-w-270 mx-auto px-8  ">
      <HoverEffect
       items={projects} />
    </div>
  );
}
export const projects = [
  {
    title: "Project & Workspace Management",
    description:
      "Create and manage multiple projects and workspaces to organize tasks and real-world workflows efficiently.",
    link: "#",
  },
  {
    title: "Task Lifecycle Management",
    description:
      "Move tasks through clear stages like Todo, In Progress, Blocked, and Completed with visual status indicators.",
    link: "#",
  },
  {
    title: "Priority-Based Views",
    description:
      "Filter tasks by High, Medium, and Low priority so you can focus on what matters most.",
    link: "#",
  },
  {
    title: "Multiple Task Views",
    description:
      "Switch between list view, table view, and board-style layouts depending on your workflow.",
    link: "#",
  },
  {
    title: "Interactive Gantt Charts",
    description:
      "Visualize project timelines and task durations with interactive Gantt charts for better planning.",
    link: "#",
  },
  {
    title: "Analytics & Progress Tracking",
    description:
      "Track task completion, workload distribution, and overall project progress through visual analytics.",
    link: "#",
  },
  {
    title: "User Assignment & Ownership",
    description:
      "Assign tasks to team members and clearly track authorship and responsibility.",
    link: "#",
  },
  {
    title: "Tags & Categorization",
    description:
      "Use tags to group related tasks and improve filtering and discoverability.",
    link: "#",
  },
  {
    title: "File Attachments",
    description:
      "Attach files directly to tasks so important references stay in one place.",
    link: "#",
  },
  {
    title: "Modern UI with Dark Mode",
    description:
      "Enjoy a clean, responsive interface with full dark mode support and smooth interactions.",
    link: "#",
  },
  {
    title: "Efficient State Management",
    description:
      "Powered by Redux Toolkit and RTK Query for predictable state updates and optimized API calls.",
    link: "#",
  },
  {
    title: "Secure & Scalable Backend",
    description:
      "Built with Node.js, Express, Prisma, and PostgreSQL for secure, type-safe, and scalable data handling.",
    link: "#",
  },
];
