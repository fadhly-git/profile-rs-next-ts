import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs'

const prisma = new PrismaClient();

export async function seedUsers() {
    const password = process.env.ADMIN_PASSWORD || 'PASSWORD_USER';
  const users = [
    {
      id: 1,
      name: 'Admin Hospital',
      email: 'admin@hospital.com',
      password: await hash(password, 10),
      role: 'ADMIN' as const,
      created_at: new Date('2025-07-28T21:18:46.000Z'),
      updated_at: new Date('2025-07-28T21:18:46.000Z')
    },
    {
      id: 2,
      name: 'Admin RS',
      email: 'admin.rs@hospital.com',
      password: await hash(password, 10),
      role: 'ADMIN' as const,
      created_at: new Date('2025-07-28T21:18:47.000Z'),
      updated_at: new Date('2025-07-28T21:18:47.000Z')
    }
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: user
    });
  }
}