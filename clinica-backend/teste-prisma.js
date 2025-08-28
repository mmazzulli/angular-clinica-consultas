require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log('Users:', users);
}

main()
  .then(() => console.log('Prisma funcionando!'))
  .catch(err => console.error(err))
  .finally(() => prisma.$disconnect());
