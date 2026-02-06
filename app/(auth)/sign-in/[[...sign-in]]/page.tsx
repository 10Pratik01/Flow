"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-zinc-950 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
            <p className="text-gray-500 mt-2 dark:text-gray-300">Sign in to continue to Milestone</p>
          </div>
          <SignIn 
            appearance={{
              elements: {
                rootBox: "mx-auto w-full",
                card: "shadow-none p-0 w-full bg-white dark:bg-zinc-900",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
