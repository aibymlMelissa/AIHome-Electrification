import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/products - Get all products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const product = await prisma.product.create({
      data: {
        id: body.id,
        name: body.name,
        type: body.type,
        cost: parseFloat(body.cost),
        description: body.description,
        productionBonus: body.productionBonus ? parseFloat(body.productionBonus) : null,
        capacityBonus: body.capacityBonus ? parseFloat(body.capacityBonus) : null,
        consumptionReduction: body.consumptionReduction ? parseFloat(body.consumptionReduction) : null,
        replacesGasAppliance: body.replacesGasAppliance || false,
        icon: body.icon
      }
    });

    // Log to audit
    await prisma.auditLog.create({
      data: {
        entityType: 'product',
        entityId: product.id,
        action: 'CREATE',
        changes: JSON.stringify(body)
      }
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
