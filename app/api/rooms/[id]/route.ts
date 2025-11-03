import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET a single room
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const room = await prisma.room.findUnique({
      where: { id: parseInt(id) },
      include: {
        bills: {
          orderBy: { month: 'desc' },
        },
      },
    });

    if (!room) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(room);
  } catch (error) {
    console.error('Error fetching room:', error);
    return NextResponse.json(
      { error: 'Failed to fetch room' },
      { status: 500 }
    );
  }
}

// PUT update a room
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { number, tenantName, rent, status } = body;

    // Check if room exists
    const existingRoom = await prisma.room.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingRoom) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    // Convert and validate number
    const roomNumber = number !== undefined ? parseInt(number) : existingRoom.number;

    // Check if new room number conflicts with another room
    if (roomNumber !== existingRoom.number) {
      const conflictingRoom = await prisma.room.findUnique({
        where: { number: roomNumber },
      });

      if (conflictingRoom) {
        return NextResponse.json(
          { error: 'Room number already exists' },
          { status: 400 }
        );
      }
    }

    const room = await prisma.room.update({
      where: { id: parseInt(id) },
      data: {
        number: roomNumber,
        tenantName: tenantName !== undefined ? (tenantName || null) : existingRoom.tenantName,
        rent: rent !== undefined ? parseFloat(rent) : existingRoom.rent,
        status: status !== undefined ? status : existingRoom.status,
      },
    });

    return NextResponse.json(room);
  } catch (error) {
    console.error('Error updating room:', error);
    return NextResponse.json(
      { error: 'Failed to update room' },
      { status: 500 }
    );
  }
}

// DELETE a room
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.room.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Error deleting room:', error);
    return NextResponse.json(
      { error: 'Failed to delete room' },
      { status: 500 }
    );
  }
}
