import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST generate new month records
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { month } = body; // Expected format: "YYYY-MM"

    if (!month) {
      return NextResponse.json(
        { error: 'Month is required (format: YYYY-MM)' },
        { status: 400 }
      );
    }

    // Get all occupied rooms
    const rooms = await prisma.room.findMany({
      where: { status: 'Occupied' },
      include: {
        bills: {
          orderBy: { month: 'desc' },
          take: 1,
        },
      },
    });

    // Get default rate per unit from settings
    const rateSetting = await prisma.setting.findUnique({
      where: { key: 'defaultRatePerUnit' },
    });

    const defaultRate = rateSetting ? parseFloat(rateSetting.value) : 5;

    // Create bills for each occupied room
    const newBills = [];
    const skippedRooms = [];
    
    for (const room of rooms) {
      // Check if bill already exists for this month
      const existingBill = await prisma.bill.findUnique({
        where: {
          roomId_month: {
            roomId: room.id,
            month,
          },
        },
      });

      if (existingBill) {
        skippedRooms.push(room.number);
        continue; // Skip if bill already exists
      }

      // Get the most recent bill to get the current units
      const previousBill = room.bills.length > 0 ? room.bills[0] : null;
      
      // Use previous month's currUnits as this month's prevUnits
      const prevUnits = previousBill ? previousBill.currUnits : 0;

      const bill = await prisma.bill.create({
        data: {
          month,
          prevUnits,
          currUnits: prevUnits, // Start with same as prev (to be updated later)
          unitsUsed: 0,
          ratePerUnit: previousBill ? previousBill.ratePerUnit : defaultRate,
          rentAmount: room.rent,
          electricityAmt: 0,
          total: room.rent,
          paid: false,
          roomId: room.id,
        },
        include: {
          room: true,
        },
      });

      newBills.push(bill);
    }

    const message = skippedRooms.length > 0 
      ? `Created ${newBills.length} new bills for ${month}. Skipped ${skippedRooms.length} rooms that already have bills (${skippedRooms.join(', ')}).`
      : `Created ${newBills.length} new bills for ${month}.`;

    return NextResponse.json({
      message,
      bills: newBills,
      skipped: skippedRooms.length,
    });
  } catch (error) {
    console.error('Error generating month records:', error);
    return NextResponse.json(
      { error: 'Failed to generate month records' },
      { status: 500 }
    );
  }
}
