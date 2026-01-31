import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";
import { db as prisma } from "@/lib/prisma";

const f = createUploadthing();

export const ourFileRouter = {
  taskAttachment: f({
    image: { maxFileSize: "4MB", maxFileCount: 5 },
    pdf: { maxFileSize: "16MB", maxFileCount: 3 },
    video: { maxFileSize: "64MB", maxFileCount: 2 },
  })
    .middleware(async () => {
      const { userId: clerkId } = await auth();
      if (!clerkId) throw new Error("Unauthorized");

      const user = await prisma.user.findUnique({
        where: { clerkId },
      });

      if (!user) throw new Error("User not found");

      return { userId: user.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);

      // Note: You'll need to pass taskId from the frontend
      // For now, we just return the file info
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
