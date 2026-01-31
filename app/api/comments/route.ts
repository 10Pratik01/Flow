import { auth } from "@clerk/nextjs/server";
import { db as prisma } from "@/lib/prisma";
import { successResponse, errorResponse, unauthorizedError } from "@/lib/api-response";
import { createCommentSchema } from "@/lib/validators";
import { logActivity } from "@/lib/activity";

/**
 * GET /api/comments?taskId=123
 * Get comments for a task
 */
export async function GET(request: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return unauthorizedError();

    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get("taskId");

    if (!taskId) {
      return errorResponse("Task ID is required", 400);
    }

    const comments = await prisma.comment.findMany({
      where: {
        taskId: Number(taskId),
      },
      include: {
        user: {
          select: {
            userId: true,
            username: true,
            profilePictureUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return successResponse(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return errorResponse("Failed to fetch comments");
  }
}

/**
 * POST /api/comments
 * Create a new comment
 */
export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return unauthorizedError();

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return errorResponse("User not found", 404);
    }

    const body = await request.json();

    // Validate input
    const validation = createCommentSchema.safeParse(body);
    if (!validation.success) {
      return errorResponse(
        validation.error.issues[0].message,
        400,
        "VALIDATION_ERROR"
      );
    }

    const { text, taskId, mentions } = validation.data;

    // Get task info for activity log
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: { id: true, title: true, projectId: true },
    });

    if (!task) {
      return errorResponse("Task not found", 404);
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        text,
        taskId,
        userId: user.userId,
        mentions: mentions ? JSON.stringify(mentions) : null,
      },
      include: {
        user: {
          select: {
            userId: true,
            username: true,
            profilePictureUrl: true,
          },
        },
      },
    });

    // Log activity
    await logActivity({
      userId: user.userId,
      action: "commented",
      entityType: "comment",
      entityId: comment.id,
      projectId: task.projectId,
      metadata: {
        taskId: task.id,
        taskTitle: task.title,
        commentPreview: text.substring(0, 100),
      },
    });

    // If there are mentions, log those too
    if (mentions && mentions.length > 0) {
      for (const mentionedUserId of mentions) {
        await logActivity({
          userId: user.userId,
          action: "mentioned_user",
          entityType: "comment",
          entityId: comment.id,
          projectId: task.projectId,
          metadata: {
            mentionedUserId,
            taskId: task.id,
            taskTitle: task.title,
          },
        });

        // TODO: Send notification to mentioned user
        // await sendMentionNotification(mentionedUserId, task, comment);
      }
    }

    return successResponse(comment, 201);
  } catch (error) {
    console.error("Error creating comment:", error);
    return errorResponse("Failed to create comment");
  }
}
