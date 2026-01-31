import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/* =========================
   Interfaces
========================= */

export interface Project {
  id: number;
  name: string;
  description: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}

export enum Priority {
  Urgent = "Urgent",
  High = "High",
  Medium = "Medium",
  Low = "Low",
  Backlog = "Backlog",
}

export enum Status {
  ToDo = "To Do",
  WorkInProgress = "Work In Progress",
  UnderReview = "Under Review",
  Completed = "Completed",
}

export interface User {
  userId: number;
  username: string;
  email: string;
  profilePictureUrl?: string;
  clerkId: string;
  teamId?: number;
}

export interface Attachment {
  id: number;
  fileURL: string;
  fileName: string;
  taskId: number;
  uploadedById: number;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  tags?: string;
  startDate?: string;
  dueDate?: string;
  points?: number;
  projectId: number;
  authorUserId: number;
  assignedUserId?: number;
}

export interface Comment {
  id: number;
  text: string;
  taskId?: number;
  postId?: number;
  userId: number;
  createdAt: string;
}

export interface SearchResult {
  tasks?: Task[];
  projects?: Project[];
  users?: User[];
}

export interface Team {
  id: number;
  teamName: string;
  productOwnerUserId?: number;
  projectManagerUserId?: number;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
  tags?: string;
  createdAt: string;
}

/* =========================
   Tag constants (IMPORTANT)
========================= */

const PROJECTS = "Projects" as const;
const TASKS = "Tasks" as const;
const USERS = "Users" as const;
const TEAMS = "Teams" as const;
const POSTS = "CommunityPosts" as const;

/* =========================
   API
========================= */

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: [PROJECTS, TASKS, USERS, TEAMS, POSTS],

  endpoints: (build) => ({

    /* ---------- Projects ---------- */

    getProjects: build.query<Project[], void>({
      query: () => "projects",
      transformResponse: (res: { success: boolean; data: Project[] }) => res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: PROJECTS, id })),
              { type: PROJECTS, id: "LIST" },
            ]
          : [{ type: PROJECTS, id: "LIST" }],
    }),

    createProject: build.mutation<Project, Partial<Project>>({
      query: (project) => ({
        url: "projects",
        method: "POST",
        body: project,
      }),
      invalidatesTags: [{ type: PROJECTS, id: "LIST" }],
    }),

    /* ---------- Tasks ---------- */

    getTasks: build.query<Task[], { projectId: number }>({
      query: ({ projectId }) => `tasks?projectId=${projectId}`,
      transformResponse: (res: { success: boolean; data: Task[] }) => res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: TASKS, id })),
              { type: TASKS, id: "LIST" },
            ]
          : [{ type: TASKS, id: "LIST" }],
    }),

    getTasksByUser: build.query<Task[], number>({
      query: (userId) => `tasks/user/${userId}`,
      transformResponse: (res: { success: boolean; data: Task[] }) => res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: TASKS, id })),
              { type: TASKS, id: "USER_LIST" },
            ]
          : [{ type: TASKS, id: "USER_LIST" }],
    }),

    createTask: build.mutation<Task, Partial<Task>>({
      query: (task) => ({
        url: "tasks",
        method: "POST",
        body: task,
      }),
      invalidatesTags: [{ type: TASKS, id: "LIST" }],
    }),

    updateTaskStatus: build.mutation<Task, { taskId: number; status: string }>({
      query: ({ taskId, status }) => ({
        url: `tasks/${taskId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (_r, _e, { taskId }) => [
        { type: TASKS, id: taskId },
      ],
    }),

    /* ---------- Users ---------- */

    getUsers: build.query<User[], void>({
      query: () => "users",
      transformResponse: (res: { success: boolean; data: User[] }) => res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ userId }) => ({ type: USERS, id: userId })),
              { type: USERS, id: "LIST" },
            ]
          : [{ type: USERS, id: "LIST" }],
    }),

    /* ---------- Teams ---------- */

    getTeams: build.query<Team[], void>({
      query: () => "teams",
      transformResponse: (res: { success: boolean; data: Team[] }) => res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: TEAMS, id })),
              { type: TEAMS, id: "LIST" },
            ]
          : [{ type: TEAMS, id: "LIST" }],
    }),

    /* ---------- Search ---------- */

    searchQuery: build.query<SearchResult, string>({
      query: (q) => `search?query=${q}`,
    }),

    /* ---------- Community ---------- */

    getPosts: build.query<Post[], void>({
      query: () => "community/posts",
      transformResponse: (res: { success: boolean; data: Post[] }) => res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: POSTS, id })),
              { type: POSTS, id: "LIST" },
            ]
          : [{ type: POSTS, id: "LIST" }],
    }),

    createPost: build.mutation<Post, Partial<Post>>({
      query: (post) => ({
        url: "community/posts",
        method: "POST",
        body: post,
      }),
      invalidatesTags: [{ type: POSTS, id: "LIST" }],
    }),
  }),
});

/* =========================
   Hooks
========================= */

export const {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useGetTasksQuery,
  useGetTasksByUserQuery,
  useCreateTaskMutation,
  useUpdateTaskStatusMutation,
  useGetUsersQuery,
  useGetTeamsQuery,
  useSearchQueryQuery,
  useGetPostsQuery,
  useCreatePostMutation,
} = api;
