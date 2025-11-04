import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all rooms
export async function GET() {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: { number: 'asc' },
      include: {
        bills: {
          orderBy: { month: 'desc' },
        },
      },
    });
    return NextResponse.json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rooms' },
      { status: 500 }
    );
  }
}

// POST create a new room
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { number, tenantName, rent, status, currentUnits } = body;

    // Validate input
    if (!number || rent === undefined || !status || currentUnits === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Parse number values from string inputs
    const roomNumber = parseInt(number);
    const roomRent = parseFloat(rent);
    const initialUnits = parseInt(currentUnits);

    // Check if room number already exists
    const existingRoom = await prisma.room.findUnique({
      where: { number: roomNumber },
    });

    if (existingRoom) {
      return NextResponse.json(
        { error: 'Room number already exists' },
        { status: 400 }
      );
    }

    // Get current month
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Get global settings for default rate
    const rateSetting = await prisma.setting.findUnique({
      where: { key: 'defaultRatePerUnit' },
    });
    const defaultRate = rateSetting ? parseFloat(rateSetting.value) : 5.0;

    // Create room and initial bill in a transaction
    const room = await prisma.room.create({
      data: {
        number: roomNumber,
        tenantName: tenantName || null,
        rent: roomRent,
        status,
        bills: {
          create: {
            month: currentMonth,
            prevUnits: initialUnits,
            currUnits: initialUnits,
            unitsUsed: 0,
            ratePerUnit: defaultRate,
            rentAmount: roomRent,
            electricityAmt: 0,
            total: roomRent,
            paid: false,
          },
        },
      },
      include: {
        bills: true,
      },
    });

    return NextResponse.json(room, { status: 201 });
  } catch (error) {
    console.error('Error creating room:', error);
    return NextResponse.json(
      { error: 'Failed to create room' },
      { status: 500 }
    );
  }
}
