import { auth } from "@clerk/nextjs/server";
import { db as prisma } from "@/lib/prisma";
import { successResponse, errorResponse, unauthorizedError } from "@/lib/api-response";

/**
 * GET /api/search?query=searchTerm
 * Search across tasks, projects, and users
 */
export async function GET(request: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return unauthorizedError();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query || query.trim().length === 0) {
      return errorResponse("Search query is required", 400);
    }

    const searchTerm = query.trim();

    // Search in parallel
    const [tasks, projects, users] = await Promise.all([
      // Search tasks
      prisma.task.findMany({
        where: {
          OR: [
            { title: { contains: searchTerm, mode: "insensitive" } },
            { description: { contains: searchTerm, mode: "insensitive" } },
            { tags: { contains: searchTerm, mode: "insensitive" } },
          ],
        },
        include: {
          project: {
            select: {
              id: true,
              name: true,
            },
          },
          author: {
            select: {
              userId: true,
              username: true,
              profilePictureUrl: true,
            },
          },
          assignee: {
            select: {
              userId: true,
              username: true,
              profilePictureUrl: true,
            },
          },
        },
        take: 20,
        orderBy: {
          updatedAt: "desc",
        },
      }),

      // Search projects
      prisma.project.findMany({
        where: {
          OR: [
            { name: { contains: searchTerm, mode: "insensitive" } },
            { description: { contains: searchTerm, mode: "insensitive" } },
          ],
        },
        include: {
          tasks: {
            select: {
              id: true,
              status: true,
            },
          },
        },
        take: 10,
        orderBy: {
          updatedAt: "desc",
        },
      }),

      // Search users
      prisma.user.findMany({
        where: {
          OR: [
            { username: { contains: searchTerm, mode: "insensitive" } },
            { email: { contains: searchTerm, mode: "insensitive" } },
          ],
        },
        select: {
          userId: true,
          username: true,
          email: true,
          profilePictureUrl: true,
          teamId: true,
        },
        take: 10,
        orderBy: {
          username: "asc",
        },
      }),
    ]);

    return successResponse({
      tasks,
      projects,
      users,
    });
  } catch (error) {
    console.error("Error searching:", error);
    return errorResponse("Failed to perform search");
  }
}
