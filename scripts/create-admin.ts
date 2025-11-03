import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdminUser() {
  const email = 'admin@proptrack.com';
  const password = 'admin123';
  
  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    console.log('Admin user already exists');
    return;
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the admin user
  const admin = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: 'Admin',
    },
  });

  console.log('Admin user created successfully!');
  console.log('Email:', email);
  console.log('Password:', password);
  console.log('User ID:', admin.id);
}

createAdminUser()
  .catch((e) => {
    console.error('Error creating admin user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
