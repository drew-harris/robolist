import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

try {
  await prisma.task.deleteMany({});
  await prisma.class.deleteMany({});
  await prisma.user.deleteMany({});

  const salt = await bcrypt.genSalt(6);
  const password = "testuser";
  const hashed = await bcrypt.hash(password, salt);

  const testUser = await prisma.user.create({
    data: {
      email: "testuser@robolist.net",
      password: hashed,
    },
  });

  const dogTraining = await prisma.class.create({
    data: {
      color: "blue",
      name: "Dog Training",
      user: {
        connect: {
          id: testUser.id,
        },
      },
    },
  });
} catch (error) {
  console.error(error);
}
