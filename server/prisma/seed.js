const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function seed() {
  const password = await bcrypt.hash('123', 8);

  const createdUser = await prisma.user.create({
    data: {
      email: 'notmyrealemail@email.com',
      password: password
    },
  });
  const createdAdmin = await prisma.user.create({
    data: {
      email: 'deandangerous@email.com',
      password: password,
      role: 'ADMIN',
    },
  });
  console.log('created user', createdAdmin);
}

seed().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});
