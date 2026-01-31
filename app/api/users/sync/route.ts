import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db as prisma } from "@/lib/prisma";

/**
 * GET /api/users/sync
 * Sync the current Clerk user to the database
 */
export async function GET() {
  console.log("🔵 [API] GET /api/users/sync - Request received");
  
  try {
    const { userId: clerkId } = await auth();
    
    if (!clerkId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    console.log("🔵 [API] Clerk ID:", clerkId);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (existingUser) {
      console.log("🟢 [API] User already exists:", existingUser);
      return NextResponse.json({ 
        message: "User already synced",
        user: existingUser 
      });
    }

    // Get full user data from Clerk
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return NextResponse.json({ error: "Could not fetch user from Clerk" }, { status: 500 });
    }

    console.log("🔵 [API] Creating user in database...");
    console.log("🔵 [API] Clerk user data:", {
      id: clerkUser.id,
      username: clerkUser.username,
      email: clerkUser.emailAddresses[0]?.emailAddress,
    });

    // Create user in database
    const newUser = await prisma.user.create({
      data: {
        clerkId: clerkUser.id,
        username: clerkUser.username || clerkUser.emailAddresses[0]?.emailAddress.split('@')[0] || 'user',
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        profilePictureUrl: clerkUser.imageUrl,
      },
    });

    console.log("🟢 [API] User created successfully:", newUser);

    return NextResponse.json({
      message: "User synced successfully",
      user: newUser,
    });

  } catch (error) {
    console.error("🔴 [API] Error syncing user:", error);
    return NextResponse.json(
      { error: "Failed to sync user", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
