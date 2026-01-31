import { auth } from "@clerk/nextjs/server";
import { db as prisma } from "@/lib/prisma";
import { successResponse, errorResponse, unauthorizedError } from "@/lib/api-response";

/**
 * GET /api/users
 * Get all users
 */
export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return unauthorizedError();

    const users = await prisma.user.findMany({
      select: {
        userId: true,
        clerkId: true,
        username: true,
        email: true,
        profilePictureUrl: true,
        teamId: true,
        createdAt: true,
      },
      orderBy: {
        username: "asc",
      },
    });

    return successResponse(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return errorResponse("Failed to fetch users");
  }
}
