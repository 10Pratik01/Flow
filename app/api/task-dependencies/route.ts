import { auth } from "@clerk/nextjs/server";
import { db as prisma } from "@/lib/prisma";
import { successResponse, errorResponse, unauthorizedError } from "@/lib/api-response";
import { createTaskDependencySchema } from "@/lib/validators";

/**
 * GET /api/task-dependencies?taskId=123
 * Get dependencies for a task
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

    const dependencies = await prisma.taskDependency.findMany({
      where: {
        taskId: Number(taskId),
      },
      include: {
        dependsOn: {
          select: {
            id: true,
            title: true,
            status: true,
            dueDate: true,
          },
        },
      },
    });

    return successResponse(dependencies);
  } catch (error) {
    console.error("Error fetching task dependencies:", error);
    return errorResponse("Failed to fetch task dependencies");
  }
}

/**
 * POST /api/task-dependencies
 * Create a task dependency
 */
export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return unauthorizedError();

    const body = await request.json();

    // Validate input
    const validation = createTaskDependencySchema.safeParse(body);
    if (!validation.success) {
      return errorResponse(
        validation.error.issues[0].message,
        400,
        "VALIDATION_ERROR"
      );
    }

    const { taskId, dependsOnId, dependencyType } = validation.data;

    // Check for circular dependencies
    const existingDependency = await prisma.taskDependency.findFirst({
      where: {
        taskId: dependsOnId,
        dependsOnId: taskId,
      },
    });

    if (existingDependency) {
      return errorResponse(
        "Cannot create circular dependency",
        400,
        "CIRCULAR_DEPENDENCY"
      );
    }

    // Create dependency
    const dependency = await prisma.taskDependency.create({
      data: {
        taskId,
        dependsOnId,
        dependencyType,
      },
      include: {
        task: {
          select: {
            id: true,
            title: true,
          },
        },
        dependsOn: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },
    });

    return successResponse(dependency, 201);
  } catch (error) {
    console.error("Error creating task dependency:", error);
    return errorResponse("Failed to create task dependency");
  }
}

/**
 * DELETE /api/task-dependencies/[id]
 * Remove a task dependency
 */
export async function DELETE(request: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return unauthorizedError();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return errorResponse("Dependency ID is required", 400);
    }

    await prisma.taskDependency.delete({
      where: { id: Number(id) },
    });

    return successResponse({ message: "Dependency removed successfully" });
  } catch (error) {
    console.error("Error deleting task dependency:", error);
    return errorResponse("Failed to delete task dependency");
  }
}
