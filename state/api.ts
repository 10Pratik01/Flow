import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Interfaces
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

  author?: User;
  assignee?: User;
  comments?: Comment[];
  attachments?: Attachment[];
}

export interface Comment {
  id: number;
  text: string;
  taskId?: number;
  postId?: number;
  userId: number;
  createdAt: string;
  user?: User;
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

// Community Interfaces
export interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
  tags?: string;
  createdAt: string;
  author: User;
  _count: {
    comments: number;
    votes: number;
  };
  userVote?: "UP" | "DOWN" | null;
  voteCount?: number;
}

export const api = createApi({
  baseQuery: fetchBaseQuery({ 
    baseUrl: "/api",
    prepareHeaders: async (headers) => {
      // Clerk middleware handles auth via cookies automatically for same-domain requests
      // But if we need tokens explicitly:
      // const token = await window.Clerk?.session?.getToken();
      // if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  reducerPath: "api",
  tagTypes: ["Projects", "Tasks", "Users", "Teams", "CommunityPosts"],
  endpoints: (build) => ({
    getProjects: build.query<Project[], void>({
      query: () => "projects",
      providesTags: ["Projects"],
      transformResponse: (response: { success: boolean; data: Project[] }) => response.data,
    }),
    createProject: build.mutation<Project, Partial<Project>>({
      query: (project) => ({
        url: "projects",
        method: "POST",
        body: project,
      }),
      invalidatesTags: ["Projects"],
    }),
    
    getTasks: build.query<Task[], { projectId: number }>({
      query: ({ projectId }) => `tasks?projectId=${projectId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Tasks" as const, id })),
              { type: "Tasks" as const, id: "LIST" },
            ]
          : [{ type: "Tasks" as const, id: "LIST" }],
    }),

    getTasksByUser: build.query<Task[], number>({
      query: (userId) => `tasks/user/${userId}`,
      providesTags: (result, error, userId) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Tasks" as const, id })),
              { type: "Tasks" as const, id: "USER_LIST" },
            ]
          : [{ type: "Tasks" as const, id: "USER_LIST" }],
    }),

    createTask: build.mutation<Task, Partial<Task>>({
      query: (task) => ({
        url: "tasks",
        method: "POST",
        body: task,
      }),
      invalidatesTags: ["Tasks"],
    }),

    updateTaskStatus: build.mutation<Task, { taskId: number; status: string }>({
      query: ({ taskId, status }) => ({
        url: `tasks/${taskId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: "Tasks", id: taskId },
      ],
    }),

    searchQuery: build.query<SearchResult, string>({
      query: (search) => `search?query=${search}`,
    }),

    getUsers: build.query<User[], void>({
      query: () => "users",
      providesTags: ["Users"],
    }),

    getTeams: build.query<Team[], void>({
      query: () => "teams",
      providesTags: ["Teams"],
    }),

    // Community Endpoints
    getPosts: build.query<Post[], { userId?: number; tag?: string } | void>({
      query: (params) => {
        if (!params) return "community/posts";
        const { userId, tag } = params;
        let queryString = "";
        if (userId) queryString += `userId=${userId}&`;
        if (tag) queryString += `tag=${tag}&`;
        return `community/posts?${queryString}`;
      },
      providesTags: ["CommunityPosts"],
    }),
    
    createPost: build.mutation<Post, Partial<Post>>({
      query: (post) => ({
        url: "community/posts",
        method: "POST",
        body: post,
      }),
      invalidatesTags: ["CommunityPosts"],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskStatusMutation,
  useSearchQueryQuery,
  useGetUsersQuery,
  useGetTeamsQuery,
  useGetTasksByUserQuery,
  useGetPostsQuery,
  useCreatePostMutation,
} = api;