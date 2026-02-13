"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { db as prisma } from "@/lib/prisma";

export async function getUsers() {
    const { userId: clerkId } = await auth();
    
    if (!clerkId) {
        throw new Error("Unauthorized");
    }

    const users = await prisma.user.findMany({
        select: {
            userId: true, 
            username: true,
            email: true, 
            profilePictureUrl: true,
            teamId: true
        }
    });

    return users;
}

export async function syncUser() {
  const { userId: clerkId } = await auth();
  const user = await currentUser();

  if (!clerkId || !user) {
    return null;
  }

  const existingUser = await prisma.user.findUnique({
    where: { clerkId },
  });

  if (existingUser) {
    return existingUser;
  }

  // Generate base username
  let username = user.username || 
    `${user.firstName || ""}${user.lastName || ""}`.toLowerCase() || 
    user.emailAddresses[0].emailAddress.split("@")[0];

  // Check if username exists and append suffix if needed
  const existingUsername = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUsername) {
    username = `${username}${Math.floor(1000 + Math.random() * 9000)}`;
  }

  // Create new user if not exists (fallback for webhook failure)
  try {
    const newUser = await prisma.user.create({
      data: {
        clerkId,
        username,
        email: user.emailAddresses[0].emailAddress,
        profilePictureUrl: user.imageUrl,
      },
    });
    return newUser;
  } catch (error) {
    // If we still hit a conflict (unlikely race condition), try one more time with a new suffix
    console.error("Error creating user, retrying with new suffix:", error);
    username = `${username}${Math.floor(1000 + Math.random() * 9000)}`;
    const retryUser = await prisma.user.create({
      data: {
        clerkId,
        username,
        email: user.emailAddresses[0].emailAddress,
        profilePictureUrl: user.imageUrl,
      },
    });
    return retryUser;
  }
}

export async function searchUsers(query: string) {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    throw new Error("Unauthorized");
  }

  if (!query || query.length < 2) {
      return [];
  }

  const userIdQuery = parseInt(query);
  const isUserId = !isNaN(userIdQuery);

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { username: { contains: query, mode: "insensitive" } },
        isUserId ? { userId: userIdQuery } : {},
      ],
    },
    take: 10,
    select: {
      userId: true,
      username: true,
      email: true,
      profilePictureUrl: true,
    },
  });

  return users;
}
