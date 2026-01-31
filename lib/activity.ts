import { db } from "./prisma";

/**
 * Activity types for the activity feed
 */
export type ActivityAction =
  | "created_project"
  | "updated_project"
  | "deleted_project"
  | "created_task"
  | "updated_task"
  | "deleted_task"
  | "assigned_task"
  | "completed_task"
  | "commented"
  | "uploaded_attachment"
  | "logged_time"
  | "mentioned_user";

/**
 * Create an activity log entry
 */
export async function logActivity({
  userId,
  action,
  entityType,
  entityId,
  projectId,
  metadata,
}: {
  userId: number;
  action: ActivityAction;
  entityType: string;
  entityId: number;
  projectId?: number;
  metadata?: Record<string, any>;
}) {
  try {
    await db.activity.create({
      data: {
        userId,
        action,
        entityType,
        entityId,
        projectId,
        metadata: metadata || {},
      },
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
    // Don't throw - activity logging should not break the main operation
  }
}

/**
 * Get recent activities for a project
 */
export async function getProjectActivities(projectId: number, limit = 50) {
  return db.activity.findMany({
    where: { projectId },
    include: {
      user: {
        select: {
          userId: true,
          username: true,
          profilePictureUrl: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

/**
 * Get recent activities for a user
 */
export async function getUserActivities(userId: number, limit = 50) {
  return db.activity.findMany({
    where: { userId },
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
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
