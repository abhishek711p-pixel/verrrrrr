import prisma from "./src/lib/prisma";

async function checkBatches() {
  try {
    const batches = await prisma.batch.findMany({
      include: {
        _count: {
          select: { students: true }
        }
      }
    });

    console.log("Current Batches in Database:");
    batches.forEach(b => {
      console.log(`- Batch: ${b.name} | Students: ${b._count.students}`);
    });

  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

checkBatches();
