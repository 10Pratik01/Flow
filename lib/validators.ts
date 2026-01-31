import { z } from "zod";

// ============================================
// TASK VALIDATORS
// ============================================

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().optional(),
  status: z
    .enum(["To Do", "Work In Progress", "Under Review", "Completed"])
    .optional()
    .default("To Do"),
  priority: z
    .enum(["Urgent", "High", "Medium", "Low", "Backlog"])
    .optional()
    .default("Medium"),
  tags: z.string().optional(),
  startDate: z.string().datetime().optional(),
  dueDate: z.string().datetime().optional(),
  points: z.number().int().min(0).max(100).optional(),
  estimatedHours: z.number().min(0).max(1000).optional(),
  projectId: z.number().int().positive("Project ID is required"),
  assignedUserId: z.number().int().positive().optional(),
});

export const updateTaskSchema = createTaskSchema.partial().extend({
  id: z.number().int().positive(),
});

export const updateTaskStatusSchema = z.object({
  status: z.enum(["To Do", "Work In Progress", "Under Review", "Completed"]),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>;

// ============================================
// PROJECT VALIDATORS
// ============================================

export const createProjectSchema = z.object({
  name: z.string().min(1, "Name is required").max(200, "Name too long"),
  description: z.string().min(1, "Description is required"),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  status: z.enum(["active", "completed", "archived"]).optional().default("active"),
});

export const updateProjectSchema = createProjectSchema.partial().extend({
  id: z.number().int().positive(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

// ============================================
// COMMENT VALIDATORS
// ============================================

export const createCommentSchema = z.object({
  text: z.string().min(1, "Comment cannot be empty").max(5000, "Comment too long"),
  taskId: z.number().int().positive().optional(),
  postId: z.number().int().positive().optional(),
  mentions: z.array(z.number().int().positive()).optional(),
}).refine((data) => data.taskId || data.postId, {
  message: "Either taskId or postId must be provided",
  path: ["taskId"],
});

export const updateCommentSchema = z.object({
  id: z.number().int().positive(),
  text: z.string().min(1, "Comment cannot be empty").max(5000, "Comment too long"),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;

// ============================================
// TIME ENTRY VALIDATORS
// ============================================

export const createTimeEntrySchema = z.object({
  taskId: z.number().int().positive("Task ID is required"),
  hours: z.number().min(0.1, "Hours must be at least 0.1").max(24, "Hours cannot exceed 24"),
  description: z.string().max(500, "Description too long").optional(),
  date: z.string().datetime().optional(),
});

export const updateTimeEntrySchema = createTimeEntrySchema.partial().extend({
  id: z.number().int().positive(),
});

export type CreateTimeEntryInput = z.infer<typeof createTimeEntrySchema>;
export type UpdateTimeEntryInput = z.infer<typeof updateTimeEntrySchema>;

// ============================================
// TEAM VALIDATORS
// ============================================

export const createTeamSchema = z.object({
  teamName: z.string().min(1, "Team name is required").max(100, "Team name too long"),
  productOwnerUserId: z.number().int().positive().optional(),
  projectManagerUserId: z.number().int().positive().optional(),
});

export const updateTeamSchema = createTeamSchema.partial().extend({
  id: z.number().int().positive(),
});

export type CreateTeamInput = z.infer<typeof createTeamSchema>;
export type UpdateTeamInput = z.infer<typeof updateTeamSchema>;

// ============================================
// SEARCH VALIDATORS
// ============================================

export const searchQuerySchema = z.object({
  query: z.string().min(1, "Search query is required").max(200, "Query too long"),
  type: z.enum(["all", "tasks", "projects", "users", "posts"]).optional().default("all"),
});

export type SearchQueryInput = z.infer<typeof searchQuerySchema>;

// ============================================
// TASK DEPENDENCY VALIDATORS
// ============================================

export const createTaskDependencySchema = z.object({
  taskId: z.number().int().positive("Task ID is required"),
  dependsOnId: z.number().int().positive("Depends on task ID is required"),
  dependencyType: z
    .enum(["finish-to-start", "start-to-start", "finish-to-finish", "start-to-finish"])
    .optional()
    .default("finish-to-start"),
});

export type CreateTaskDependencyInput = z.infer<typeof createTaskDependencySchema>;

// ============================================
// COMMUNITY VALIDATORS
// ============================================

export const createPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  content: z.string().min(1, "Content is required"),
  tags: z.string().optional(),
});

export const voteSchema = z.object({
  type: z.enum(["UP", "DOWN"]),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type VoteInput = z.infer<typeof voteSchema>;
