import { auth } from "@clerk/nextjs/server";
import { db as prisma } from "@/lib/prisma";
import { successResponse, errorResponse, unauthorizedError } from "@/lib/api-response";
import { createTaskSchema } from "@/lib/validators";
import { logActivity } from "@/lib/activity";

/**
 * GET /api/tasks?projectId=123
 * Get tasks for a project
 */
export async function GET(request: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return unauthorizedError();

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return errorResponse("Project ID is required", 400);
    }

    const tasks = await prisma.task.findMany({
      where: {
        projectId: Number(projectId),
      },
      include: {
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
        comments: {
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
            createdAt: "desc",
          },
        },
        attachments: true,
        timeEntries: {
          include: {
            user: {
              select: {
                userId: true,
                username: true,
              },
            },
          },
        },
        dependencies: {
          include: {
            dependsOn: {
              select: {
                id: true,
                title: true,
                status: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return successResponse(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return errorResponse("Failed to fetch tasks");
  }
}

/**
 * POST /api/tasks
 * Create a new task
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
    const validation = createTaskSchema.safeParse(body);
    if (!validation.success) {
      return errorResponse(
        validation.error.issues[0].message,
        400,
        "VALIDATION_ERROR"
      );
    }

    const {
      title,
      description,
      status,
      priority,
      tags,
      startDate,
      dueDate,
      points,
      estimatedHours,
      projectId,
      assignedUserId,
    } = validation.data;

    // Create task
    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        tags,
        startDate: startDate ? new Date(startDate) : null,
        dueDate: dueDate ? new Date(dueDate) : null,
        points,
        estimatedHours,
        projectId,
        authorUserId: user.userId,
        assignedUserId,
      },
      include: {
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
    });

    // Log activity
    await logActivity({
      userId: user.userId,
      action: "created_task",
      entityType: "task",
      entityId: task.id,
      projectId: task.projectId,
      metadata: { taskTitle: task.title },
    });

    // If task is assigned, log that too
    if (assignedUserId && assignedUserId !== user.userId) {
      await logActivity({
        userId: user.userId,
        action: "assigned_task",
        entityType: "task",
        entityId: task.id,
        projectId: task.projectId,
        metadata: {
          taskTitle: task.title,
          assignedToUserId: assignedUserId,
        },
      });

      // TODO: Send email notification to assigned user
      // await sendTaskAssignmentEmail(assignedUser.email, task.title, project.name);
    }

    return successResponse(task, 201);
  } catch (error) {
    console.error("Error creating task:", error);
    return errorResponse("Failed to create task");
  }
}
