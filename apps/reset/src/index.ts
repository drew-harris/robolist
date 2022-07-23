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

  const oneWeekFromNow = new Date();
  oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const learnToFetch = await prisma.task.create({
    data: {
      dueDate: oneWeekFromNow,
      workDate: tomorrow,
      title: "Learn to fetch",
      class: {
        connect: {
          id: dogTraining.id,
        },
      },
      user: {
        connect: {
          id: testUser.id,
        },
      },
    },
  });
} catch (error) {
  console.error(error);
  process.exit(1);
}
