import { PrismaClient, Role, TaskStatus, TaskPriority } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing data
  await prisma.task.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin@123', 12);
  const admin = await prisma.user.create({
    data: {
      name: 'Alice Admin',
      email: 'admin@example.com',
      passwordHash: adminPassword,
      role: Role.ADMIN,
    },
  });

  // Create member users
  const memberPassword = await bcrypt.hash('Member@123', 12);
  const member1 = await prisma.user.create({
    data: {
      name: 'Bob Builder',
      email: 'bob@example.com',
      passwordHash: memberPassword,
      role: Role.MEMBER,
    },
  });

  const member2 = await prisma.user.create({
    data: {
      name: 'Carol Designer',
      email: 'carol@example.com',
      passwordHash: memberPassword,
      role: Role.MEMBER,
    },
  });

  // Create projects
  const project1 = await prisma.project.create({
    data: {
      name: 'Website Redesign',
      description: 'Complete overhaul of the company website with modern design and improved UX.',
      createdById: admin.id,
      members: {
        create: [
          { userId: admin.id },
          { userId: member1.id },
          { userId: member2.id },
        ],
      },
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: 'Mobile App Development',
      description: 'Build a cross-platform mobile app for iOS and Android.',
      createdById: admin.id,
      members: {
        create: [
          { userId: admin.id },
          { userId: member1.id },
        ],
      },
    },
  });

  // Create tasks
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  await prisma.task.createMany({
    data: [
      {
        title: 'Design new homepage mockup',
        description: 'Create Figma mockups for the new homepage including mobile responsive designs.',
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.HIGH,
        dueDate: yesterday,
        projectId: project1.id,
        assigneeId: member2.id,
      },
      {
        title: 'Implement hero section',
        description: 'Code the hero section with animations and responsive layout.',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
        dueDate: nextWeek,
        projectId: project1.id,
        assigneeId: member1.id,
      },
      {
        title: 'SEO optimization',
        description: 'Optimize all pages for search engines including meta tags and sitemap.',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        dueDate: nextMonth,
        projectId: project1.id,
        assigneeId: member1.id,
      },
      {
        title: 'Set up project structure',
        description: 'Initialize React Native project with navigation and state management.',
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.HIGH,
        dueDate: yesterday,
        projectId: project2.id,
        assigneeId: member1.id,
      },
      {
        title: 'Build authentication flow',
        description: 'Implement login, signup, and forgot password screens.',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
        dueDate: nextWeek,
        projectId: project2.id,
        assigneeId: member1.id,
      },
      {
        title: 'Integrate push notifications',
        description: 'Set up Firebase Cloud Messaging for push notifications.',
        status: TaskStatus.TODO,
        priority: TaskPriority.LOW,
        dueDate: nextMonth,
        projectId: project2.id,
        assigneeId: null,
      },
    ],
  });

  console.log('✅ Database seeded successfully!');
  console.log('\n📝 Test Credentials:');
  console.log('  Admin: admin@example.com / Admin@123');
  console.log('  Member: bob@example.com / Member@123');
  console.log('  Member: carol@example.com / Member@123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
