import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all bills or filter by month/room
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const roomId = searchParams.get('roomId');

    const where: { month?: string; roomId?: number } = {};
    if (month) where.month = month;
    if (roomId) where.roomId = parseInt(roomId);

    const bills = await prisma.bill.findMany({
      where,
      include: {
        room: true,
      },
      orderBy: [
        { month: 'desc' },
        { room: { number: 'asc' } },
      ],
    });

    return NextResponse.json(bills);
  } catch (error) {
    console.error('Error fetching bills:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bills' },
      { status: 500 }
    );
  }
}

// POST create a new bill
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      month,
      prevUnits,
      currUnits,
      ratePerUnit,
      rentAmount,
      roomId,
    } = body;

    // Validate input
    if (!month || prevUnits === undefined || currUnits === undefined || 
        !ratePerUnit || !rentAmount || !roomId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate values
    const unitsUsed = currUnits - prevUnits;
    const electricityAmt = unitsUsed * ratePerUnit;
    const total = rentAmount + electricityAmt;

    const bill = await prisma.bill.create({
      data: {
        month,
        prevUnits,
        currUnits,
        unitsUsed,
        ratePerUnit,
        rentAmount,
        electricityAmt,
        total,
        roomId,
      },
      include: {
        room: true,
      },
    });

    return NextResponse.json(bill, { status: 201 });
  } catch (error) {
    console.error('Error creating bill:', error);
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Bill for this room and month already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create bill' },
      { status: 500 }
    );
  }
}
