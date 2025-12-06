import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/subsidies/[id] - Get single subsidy
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const subsidy = await prisma.subsidy.findUnique({
      where: { id },
      include: {
        appliesTo: true
      }
    });

    if (!subsidy) {
      return NextResponse.json(
        { error: 'Subsidy not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(subsidy);
  } catch (error) {
    console.error('Error fetching subsidy:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subsidy' },
      { status: 500 }
    );
  }
}

// PUT /api/subsidies/[id] - Update subsidy
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Delete existing type mappings
    await prisma.subsidyType.deleteMany({
      where: { subsidyId: id }
    });

    // Update subsidy with new type mappings
    const subsidy = await prisma.subsidy.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        amount: parseFloat(body.amount),
        isActive: body.isActive !== undefined ? body.isActive : true,
        appliesTo: {
          create: body.appliesTo.map((type: string) => ({
            productType: type
          }))
        }
      },
      include: {
        appliesTo: true
      }
    });

    // Log to audit
    await prisma.auditLog.create({
      data: {
        entityType: 'subsidy',
        entityId: subsidy.id,
        action: 'UPDATE',
        changes: JSON.stringify(body)
      }
    });

    return NextResponse.json(subsidy);
  } catch (error) {
    console.error('Error updating subsidy:', error);
    return NextResponse.json(
      { error: 'Failed to update subsidy' },
      { status: 500 }
    );
  }
}

// DELETE /api/subsidies/[id] - Soft delete subsidy
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const subsidy = await prisma.subsidy.update({
      where: { id },
      data: { isActive: false }
    });

    // Log to audit
    await prisma.auditLog.create({
      data: {
        entityType: 'subsidy',
        entityId: subsidy.id,
        action: 'DELETE',
        changes: null
      }
    });

    return NextResponse.json({ message: 'Subsidy deleted successfully' });
  } catch (error) {
    console.error('Error deleting subsidy:', error);
    return NextResponse.json(
      { error: 'Failed to delete subsidy' },
      { status: 500 }
    );
  }
}
