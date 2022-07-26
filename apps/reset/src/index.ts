import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

try {
  await prisma.task.deleteMany({
    where: {
      userId: "testuserid",
    },
  });
  await prisma.class.deleteMany({
    where: {
      userId: "testuserid",
    },
  });

  const dogTraining = await prisma.class.create({
    data: {
      color: "blue",
      name: "Dog Training",
      user: {
        connect: {
          id: "testuserid",
        },
      },
    },
  });

  const oneWeekFromNow = new Date();
  oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
  oneWeekFromNow.setHours(0, 0, 0, 0);

  const tomorrow = new Date();
  tomorrow.setHours(0, 0, 0, 0);

  const learnToFetch = await prisma.task.create({
    data: {
      dueDate: oneWeekFromNow,
      workDate: tomorrow,
      title: "Learn to fetch",
      workTime: 20,
      class: {
        connect: {
          id: dogTraining.id,
        },
      },
      user: {
        connect: {
          id: "testuserid",
        },
      },
    },
  });
} catch (error) {
  console.error(error);
  process.exit(1);
}
