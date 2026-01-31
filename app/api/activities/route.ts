import { auth } from "@clerk/nextjs/server";
import { db as prisma } from "@/lib/prisma";
import { successResponse, errorResponse, unauthorizedError } from "@/lib/api-response";

/**
 * GET /api/activities?projectId=123&limit=50
 * Get activity feed for a project or user
 */
export async function GET(request: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return unauthorizedError();

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    const userId = searchParams.get("userId");
    const limit = parseInt(searchParams.get("limit") || "50");

    const where: any = {};
    if (projectId) where.projectId = Number(projectId);
    if (userId) where.userId = Number(userId);

    const activities = await prisma.activity.findMany({
      where,
      include: {
        user: {
          select: {
            userId: true,
            username: true,
            profilePictureUrl: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: Math.min(limit, 100), // Max 100 activities
    });

    return successResponse(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    return errorResponse("Failed to fetch activities");
  }
}
