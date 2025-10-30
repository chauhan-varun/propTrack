import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create default settings
  await prisma.setting.upsert({
    where: { key: 'ratePerUnit' },
    update: { value: '5' },
    create: { key: 'ratePerUnit', value: '5' },
  });

  console.log('Created default rate per unit setting: ₹5');

  // Create sample rooms
  const sampleRooms = [
    { number: 101, tenantName: 'John Doe', rent: 5000, status: 'Occupied' },
    { number: 102, tenantName: 'Jane Smith', rent: 5500, status: 'Occupied' },
    { number: 103, tenantName: 'Bob Wilson', rent: 6000, status: 'Occupied' },
    { number: 104, tenantName: null, rent: 5000, status: 'Vacant' },
    { number: 105, tenantName: 'Alice Brown', rent: 5800, status: 'Occupied' },
    { number: 106, tenantName: null, rent: 5200, status: 'Vacant' },
    { number: 107, tenantName: 'Charlie Davis', rent: 6500, status: 'Occupied' },
    { number: 108, tenantName: 'Diana Evans', rent: 5500, status: 'Occupied' },
    { number: 109, tenantName: null, rent: 5000, status: 'Vacant' },
    { number: 110, tenantName: 'Frank Green', rent: 6200, status: 'Occupied' },
  ];

  for (const roomData of sampleRooms) {
    const room = await prisma.room.upsert({
      where: { number: roomData.number },
      update: roomData,
      create: roomData,
    });
    console.log(`Created/Updated room ${room.number}`);

    // Create a bill for current month if room is occupied
    if (roomData.status === 'Occupied') {
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      const prevUnits = Math.floor(Math.random() * 100) + 50; // Random prev units 50-150
      const currUnits = prevUnits + Math.floor(Math.random() * 50) + 20; // Add 20-70 units
      const unitsUsed = currUnits - prevUnits;
      const ratePerUnit = 5;
      const electricityAmt = unitsUsed * ratePerUnit;
      const total = roomData.rent + electricityAmt;

      await prisma.bill.upsert({
        where: {
          roomId_month: {
            roomId: room.id,
            month: currentMonth,
          },
        },
        update: {},
        create: {
          month: currentMonth,
          prevUnits,
          currUnits,
          unitsUsed,
          ratePerUnit,
          rentAmount: roomData.rent,
          electricityAmt,
          total,
          paid: Math.random() > 0.5, // Randomly set some as paid
          roomId: room.id,
        },
      });
      console.log(`  Created bill for room ${room.number} - ${currentMonth}`);
    }
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
