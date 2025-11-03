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
          take: 1,
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
    const { number, tenantName, rent, status } = body;

    // Validate input
    if (!number || rent === undefined || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Parse number values from string inputs
    const roomNumber = parseInt(number);
    const roomRent = parseFloat(rent);

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

    const room = await prisma.room.create({
      data: {
        number: roomNumber,
        tenantName: tenantName || null,
        rent: roomRent,
        status,
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
