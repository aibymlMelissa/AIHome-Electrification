import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    // Check if data already exists
    const productCount = await prisma.product.count();
    if (productCount > 0) {
      return NextResponse.json(
        { message: 'Database already seeded' },
        { status: 200 }
      );
    }

    // Seed products
    const products = [
      {
        id: 'solar-3kw',
        name: '3kW Solar System',
        type: 'SOLAR',
        cost: 3500,
        description: 'Entry-level solar panel system',
        productionBonus: 3,
        icon: 'Sun'
      },
      {
        id: 'solar-6kw',
        name: '6kW Solar System',
        type: 'SOLAR',
        cost: 6000,
        description: 'Mid-tier solar panel system',
        productionBonus: 6,
        icon: 'Sun'
      },
      {
        id: 'batt-5kwh',
        name: '5kWh Home Battery',
        type: 'BATTERY',
        cost: 4500,
        description: 'Compact battery storage solution',
        capacityBonus: 5,
        icon: 'Battery'
      },
      {
        id: 'batt-10kwh',
        name: '10kWh Premium Battery',
        type: 'BATTERY',
        cost: 8500,
        description: 'High-capacity battery for energy independence',
        capacityBonus: 10,
        icon: 'BatteryFull'
      },
      {
        id: 'led-lights',
        name: 'LED Lighting Upgrade',
        type: 'EFFICIENCY',
        cost: 200,
        description: 'Replace all lights with energy-efficient LEDs',
        consumptionReduction: 0.05,
        icon: 'Lightbulb'
      },
      {
        id: 'heat-pump',
        name: 'Heat Pump Hot Water',
        type: 'HEATING',
        cost: 3000,
        description: 'Efficient hot water heating system',
        consumptionReduction: 0.15,
        replacesGasAppliance: true,
        icon: 'Droplets'
      },
      {
        id: 'elec-hot-water-sys',
        name: 'Electric Hot Water System',
        type: 'HEATING',
        cost: 1200,
        description: 'Standard electric hot water system',
        consumptionReduction: 0.05,
        replacesGasAppliance: true,
        icon: 'Flame'
      },
      {
        id: 'home-warming-sys',
        name: 'Home Warming System',
        type: 'HEATING',
        cost: 4500,
        description: 'Efficient home heating solution',
        consumptionReduction: 0.12,
        replacesGasAppliance: true,
        icon: 'Home'
      },
      {
        id: 'induction-cooktop',
        name: 'Induction Cooktop',
        type: 'EFFICIENCY',
        cost: 1500,
        description: 'Modern cooking with precise temperature control',
        consumptionReduction: 0.02,
        replacesGasAppliance: true,
        icon: 'Utensils'
      },
      {
        id: 'insulation',
        name: 'Roof Insulation',
        type: 'EFFICIENCY',
        cost: 1500,
        description: 'Reduce heat loss and gain through your roof',
        consumptionReduction: 0.20,
        icon: 'House'
      }
    ];

    await prisma.product.createMany({ data: products });

    // Seed subsidies
    const subsidies = [
      {
        id: 'sub-solar',
        name: 'Solar Homes Rebate',
        description: 'Government rebate for solar installations',
        amount: 1400
      },
      {
        id: 'sub-battery',
        name: 'Battery Storage Loan',
        description: 'Interest-free loan for battery storage',
        amount: 1000
      },
      {
        id: 'sub-eff',
        name: 'Energy Efficiency Grant',
        description: 'Grant for energy efficiency upgrades',
        amount: 250
      }
    ];

    await prisma.subsidy.createMany({ data: subsidies });

    // Seed subsidy type mappings
    await prisma.subsidyType.createMany({
      data: [
        { subsidyId: 'sub-solar', productType: 'SOLAR' },
        { subsidyId: 'sub-battery', productType: 'BATTERY' },
        { subsidyId: 'sub-eff', productType: 'HEATING' },
        { subsidyId: 'sub-eff', productType: 'EFFICIENCY' }
      ]
    });

    return NextResponse.json(
      { message: 'Database seeded successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}
