import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/subsidies - Get all subsidies with their applicable types
export async function GET() {
  try {
    const subsidies = await prisma.subsidy.findMany({
      where: { isActive: true },
      include: {
        appliesTo: true
      },
      orderBy: { createdAt: 'asc' }
    });

    // Transform to match frontend format
    const transformedSubsidies = subsidies.map(subsidy => ({
      id: subsidy.id,
      name: subsidy.name,
      description: subsidy.description,
      amount: subsidy.amount,
      appliesTo: subsidy.appliesTo.map(st => st.productType),
      isActive: subsidy.isActive,
      createdAt: subsidy.createdAt,
      updatedAt: subsidy.updatedAt
    }));

    return NextResponse.json(transformedSubsidies);
  } catch (error) {
    console.error('Error fetching subsidies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subsidies' },
      { status: 500 }
    );
  }
}

// POST /api/subsidies - Create a new subsidy
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const subsidy = await prisma.subsidy.create({
      data: {
        id: body.id,
        name: body.name,
        description: body.description,
        amount: parseFloat(body.amount),
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
        action: 'CREATE',
        changes: JSON.stringify(body)
      }
    });

    return NextResponse.json(subsidy, { status: 201 });
  } catch (error) {
    console.error('Error creating subsidy:', error);
    return NextResponse.json(
      { error: 'Failed to create subsidy' },
      { status: 500 }
    );
  }
}
