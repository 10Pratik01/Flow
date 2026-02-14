"use client";
import { HeroParallax } from "@/components/ui/hero-parallax";
import React from "react";


export function HeroSection() {
  return <HeroParallax products={products} />;
}
export const products = [
  {
    title: "home",
    link:"",
    thumbnail:
      "/photos/home.png",
  },
  {
    title: "community",
    link: "",
    thumbnail:
      "/photos/community.png",
  },
  {
    title: "invitation",
    link: "",
    thumbnail:
      "/photos/invitation.png",
  },

  {
    title: "Projects",
    link: "",
    thumbnail:
      "/photos/projects.png",
  },
  {
    title: "Editrix AI",
    link: "",
    thumbnail:
      "/photos/project.png",
  },
  {
    title: "List Project",
    link: "",
    thumbnail:
      "/photos/list_project.png",
  },
  {
    title: "Algochurn",
    link: "https://algochurn.com",
    thumbnail:
      "/photos/p_project.png",
  },
  {
    title: "Aceternity UI",
    link: "https://ui.aceternity.com",
    thumbnail:
      "/photos/search.png",
  },
  {
    title: "Tailwind Master Kit",
    link: "https://tailwindmasterkit.com",
    thumbnail:
      "/photos/table_project.png",
  },
  {
    title: "SmartBridge",
    link: "https://smartbridgetech.com",
    thumbnail:
      "/photos/task.png",
  },
];
