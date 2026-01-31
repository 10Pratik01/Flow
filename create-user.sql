-- Create user manually for testing
-- Replace with your actual email and username

INSERT INTO "User" ("clerkId", "username", "email", "profilePictureUrl", "createdAt", "updatedAt")
VALUES (
  'user_392Si9aw6ipIFxcNSUMyymuxN3l',
  'testuser',  -- Change this to your username
  'your-email@example.com',  -- Change this to your email
  NULL,
  NOW(),
  NOW()
);
