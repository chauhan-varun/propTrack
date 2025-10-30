import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET a single bill
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bill = await prisma.bill.findUnique({
      where: { id: parseInt(id) },
      include: {
        room: true,
      },
    });

    if (!bill) {
      return NextResponse.json(
        { error: 'Bill not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(bill);
  } catch (error) {
    console.error('Error fetching bill:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bill' },
      { status: 500 }
    );
  }
}

// PUT update a bill
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { currUnits, paid, ratePerUnit } = body;

    const bill = await prisma.bill.findUnique({
      where: { id: parseInt(id) },
      include: { room: true },
    });

    if (!bill) {
      return NextResponse.json(
        { error: 'Bill not found' },
        { status: 404 }
      );
    }

    // Recalculate if currUnits or ratePerUnit changed
    let updateData: any = {};
    
    if (currUnits !== undefined && currUnits !== bill.currUnits) {
      const unitsUsed = currUnits - bill.prevUnits;
      const rate = ratePerUnit !== undefined ? ratePerUnit : bill.ratePerUnit;
      const electricityAmt = unitsUsed * rate;
      const total = bill.rentAmount + electricityAmt;

      updateData = {
        currUnits,
        unitsUsed,
        electricityAmt,
        total,
      };

      if (ratePerUnit !== undefined) {
        updateData.ratePerUnit = ratePerUnit;
      }
    } else if (ratePerUnit !== undefined && ratePerUnit !== bill.ratePerUnit) {
      const electricityAmt = bill.unitsUsed * ratePerUnit;
      const total = bill.rentAmount + electricityAmt;

      updateData = {
        ratePerUnit,
        electricityAmt,
        total,
      };
    }

    if (paid !== undefined) {
      updateData.paid = paid;
    }

    const updatedBill = await prisma.bill.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        room: true,
      },
    });

    return NextResponse.json(updatedBill);
  } catch (error) {
    console.error('Error updating bill:', error);
    return NextResponse.json(
      { error: 'Failed to update bill' },
      { status: 500 }
    );
  }
}

// DELETE a bill
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.bill.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: 'Bill deleted successfully' });
  } catch (error) {
    console.error('Error deleting bill:', error);
    return NextResponse.json(
      { error: 'Failed to delete bill' },
      { status: 500 }
    );
  }
}
