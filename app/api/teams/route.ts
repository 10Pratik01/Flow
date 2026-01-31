import { auth } from "@clerk/nextjs/server";
import { db as prisma } from "@/lib/prisma";
import { successResponse, errorResponse, unauthorizedError } from "@/lib/api-response";

/**
 * GET /api/teams
 * Get all teams
 */
export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return unauthorizedError();

    const teams = await prisma.team.findMany({
      include: {
        users: {
          select: {
            userId: true,
            username: true,
            profilePictureUrl: true,
          },
        },
        projectTeams: {
          include: {
            project: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        teamName: "asc",
      },
    });

    return successResponse(teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    return errorResponse("Failed to fetch teams");
  }
}
