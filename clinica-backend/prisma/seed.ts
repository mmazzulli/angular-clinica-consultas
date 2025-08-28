import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10); // senha inicial

  const superadmin = await prisma.user.upsert({
    where: { email: 'superadmin@clinica.com' },
    update: {}, // não altera se já existir
    create: {
      name: 'Super',
      surname: 'Admin',
      email: 'superadmin@clinica.com',
      password: passwordHash,
      role: 'superadmin',
    },
  });

  console.log('Superadmin criado:', superadmin);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
  });
