import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET dashboard statistics
export async function GET() {
  try {
    // Get current month in YYYY-MM format
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Count rooms
    const totalRooms = await prisma.room.count();
    const occupiedRooms = await prisma.room.count({
      where: { status: 'Occupied' },
    });
    const vacantRooms = totalRooms - occupiedRooms;

    // Get bills for current month
    const currentMonthBills = await prisma.bill.findMany({
      where: { month: currentMonth },
    });

    // Calculate totals
    const totalCollected = currentMonthBills
      .filter((bill: any) => bill.paid)
      .reduce((sum: number, bill: any) => sum + bill.total, 0);

    const pendingAmount = currentMonthBills
      .filter((bill: any) => !bill.paid)
      .reduce((sum: number, bill: any) => sum + bill.total, 0);

    // Get unpaid bills with room details
    const unpaidBills = await prisma.bill.findMany({
      where: {
        paid: false,
      },
      include: {
        room: true,
      },
      orderBy: [
        { month: 'desc' },
        { room: { number: 'asc' } },
      ],
    });

    return NextResponse.json({
      stats: {
        totalRooms,
        occupiedRooms,
        vacantRooms,
        totalCollected,
        pendingAmount,
        currentMonth,
      },
      unpaidBills,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
