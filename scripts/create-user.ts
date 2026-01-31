import { db as prisma } from '../lib/prisma';

async function createUser() {
  try {
    const user = await prisma.user.create({
      data: {
        clerkId: 'user_392Si9aw6ipIFxcNSUMyymuxN3l',
        username: 'testuser',
        email: 'test@example.com',
      },
    });
    
    console.log('✅ User created successfully:', user);
  } catch (error) {
    console.error('❌ Error creating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createUser();
