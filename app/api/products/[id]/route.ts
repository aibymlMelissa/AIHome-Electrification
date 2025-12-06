import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/products/[id] - Get single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        type: body.type,
        cost: parseFloat(body.cost),
        description: body.description,
        productionBonus: body.productionBonus ? parseFloat(body.productionBonus) : null,
        capacityBonus: body.capacityBonus ? parseFloat(body.capacityBonus) : null,
        consumptionReduction: body.consumptionReduction ? parseFloat(body.consumptionReduction) : null,
        replacesGasAppliance: body.replacesGasAppliance || false,
        icon: body.icon,
        isActive: body.isActive !== undefined ? body.isActive : true
      }
    });

    // Log to audit
    await prisma.auditLog.create({
      data: {
        entityType: 'product',
        entityId: product.id,
        action: 'UPDATE',
        changes: JSON.stringify(body)
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Soft delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await prisma.product.update({
      where: { id },
      data: { isActive: false }
    });

    // Log to audit
    await prisma.auditLog.create({
      data: {
        entityType: 'product',
        entityId: product.id,
        action: 'DELETE',
        changes: null
      }
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
