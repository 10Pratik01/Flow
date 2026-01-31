"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-zinc-950">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 dark:bg-zinc-900">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Account</h1>
            <p className="text-gray-500 mt-2 dark:text-gray-300">Join Flow to manage your projects</p>
          </div>
          <SignUp 
            appearance={{
              elements: {
                rootBox: "mx-auto w-full",
                card: "shadow-none p-0 w-full",
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
