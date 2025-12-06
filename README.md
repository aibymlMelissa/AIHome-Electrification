# EcoHome - Energy Transition Simulator

An interactive educational web application for simulating home energy transitions in the Australian context, featuring real-time energy modeling, dynamic marketplace, and AI-powered recommendations.

## 🎯 Overview

**EcoHome** is a comprehensive full-stack energy simulation game specifically designed for Australian households (Victoria/Melbourne focus). It helps users understand the financial and environmental impact of transitioning to renewable energy and electrification through:

- **Real-time Energy Simulation**: 24-hour cycles modeling solar production, battery storage, and consumption
- **Dynamic Marketplace**: Database-driven product catalog with solar panels, batteries, heat pumps, and efficiency upgrades
- **Government Subsidies**: Automatic application of Australian government rebates and incentives
- **AI Energy Advisor**: Context-aware recommendations powered by Google Gemini 2.5 Flash
- **Admin Dashboard**: Complete backend management system for products and subsidies
- **Financial Modeling**: Track ROI, electricity costs, grid import/export revenue over 1 quarter to 5 years
- **Environmental Impact**: Real-time CO2 savings calculations based on grid displacement

## ✨ Key Features

### Interactive Game Simulation
- **Configurable Duration**: Simulate 1 quarter (90 days) to 5 years (1825 days)
- **Speed Control**: Adjustable simulation speed with pause/resume functionality
- **Real-time Metrics**: Track daily costs, net energy, CO2 saved, and subsidy claims
- **Energy Flow Visualization**: Animated diagram showing solar → battery → home → grid flows
- **24-Hour Analytics**: Charts displaying production vs. consumption patterns

### Marketplace & Upgrades
**Four Product Categories:**
- **SOLAR**: 3kW & 6kW solar panel systems
- **BATTERY**: 5kWh & 10kWh home battery storage
- **HEATING**: Heat pumps, hot water systems, home warming (replaces gas appliances)
- **EFFICIENCY**: LED lighting, insulation, induction cooktops

**Purchase Features:**
- Automatic subsidy calculation and application
- Real-time inventory tracking
- Dynamic pricing from database
- Icon-based product cards with detailed descriptions

### Admin Management System
**Access at `/admin`**
- Full CRUD operations for products and subsidies
- Real-time marketplace updates
- Audit logging with timestamps
- Product parameter management:
  - Production bonus (solar kW)
  - Capacity bonus (battery kWh)
  - Consumption reduction (efficiency multiplier)
  - Gas appliance replacement tracking

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables (see .env.example)
cp .env.example .env

# Generate Prisma client
npx prisma generate

# Run migrations (requires database)
npx prisma migrate dev

# Start development server
npm run dev

# Seed database (in another terminal)
curl -X POST http://localhost:3000/api/seed
```

**Access:**
- Game: http://localhost:3000
- Admin Panel: http://localhost:3000/admin

### Settings Panel
Configure simulation parameters in real-time:
- **Target Duration**: Choose between 1 quarter (90 days), 1 year (365 days), or 5 years (1825 days)
- **Government Subsidies**: Manually adjust total subsidy savings
- **Gas Appliances Count**: Track remaining gas-powered appliances (affects consumption)
- **Resell to Grid**: YES/NO toggle for grid export revenue

### AI Energy Advisor
**Powered by Google Gemini 2.5 Flash**
- Context-aware recommendations based on current game state
- Analyzes available upgrades and ROI potential
- Tailored to Australian (Victoria/Melbourne) energy policies and tariffs
- Floating chat widget in bottom-right corner
- Real-time conversation with game-aware AI

## 📂 Project Structure

```
/aihome-electrification/
├── app/
│   ├── page.tsx              # Main game interface
│   ├── layout.tsx            # Root layout & metadata
│   ├── providers.tsx         # React Context providers
│   ├── globals.css           # Tailwind global styles
│   ├── api/
│   │   ├── products/         # Product CRUD endpoints
│   │   ├── subsidies/        # Subsidy CRUD endpoints
│   │   └── seed/             # Database initialization
│   └── admin/
│       └── page.tsx          # Admin dashboard
├── components/
│   ├── Dashboard.tsx         # Main game view with KPIs
│   ├── Store.tsx             # Marketplace component
│   ├── Reports.tsx           # Energy analytics charts
│   ├── Advisor.tsx           # AI chatbot widget
│   ├── Layout.tsx            # Navigation & settings
│   └── EnergyFlow.tsx        # Animated energy diagram
├── contexts/
│   └── GameContext.tsx       # Central game state & logic
├── services/
│   └── geminiService.ts      # Google Gemini API integration
├── prisma/
│   └── schema.prisma         # Database schema (4 models)
└── lib/
    └── prisma.ts             # Prisma client setup
```

## 📂 API Endpoints

```
GET    /api/products         - List products
POST   /api/products         - Create product
PUT    /api/products/:id     - Update product
DELETE /api/products/:id     - Delete product

GET    /api/subsidies        - List subsidies
POST   /api/subsidies        - Create subsidy
PUT    /api/subsidies/:id    - Update subsidy
DELETE /api/subsidies/:id    - Delete subsidy

POST   /api/seed             - Initialize database
```

## 🗄️ Database Schema

### Models

**Product**
- Core fields: `id`, `name`, `type`, `cost`, `description`, `icon`
- Energy parameters:
  - `productionBonus`: Solar kW added
  - `capacityBonus`: Battery kWh added
  - `consumptionReduction`: Efficiency multiplier
  - `replacesGasAppliance`: Boolean for gas replacement
- Metadata: `isActive`, `createdAt`, `updatedAt`

**Subsidy**
- Fields: `id`, `name`, `description`, `amount`
- Relationship: One-to-many with `SubsidyType`
- Metadata: `isActive`, `createdAt`, `updatedAt`

**SubsidyType** (Junction Table)
- Links subsidies to product types (SOLAR, BATTERY, EFFICIENCY, HEATING)
- Unique constraint: `[subsidyId, productType]`

**AuditLog**
- Tracks all changes to products and subsidies
- Fields: `id`, `entityType`, `entityId`, `action`, `changes` (JSON), `timestamp`

See `prisma/schema.prisma` for complete schema details.

## 🚢 Deployment

Full deployment guide available in [DEPLOYMENT.md](./DEPLOYMENT.md)

**Vercel Deployment:**
1. Push to GitHub
2. Import to Vercel
3. Add Vercel Postgres database
4. Deploy (auto-detected)
5. Run migrations
6. Seed database

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19.2.1
- **Language**: TypeScript 5.8.2 (strict mode)
- **Styling**: Tailwind CSS 3.4.18
- **Charts**: Recharts 3.5.1
- **Animation**: Framer Motion 12.23.25
- **Icons**: Lucide React 0.555.0

### Backend
- **API**: Next.js API Routes (Serverless)
- **Database**: PostgreSQL (Vercel Postgres)
- **ORM**: Prisma 7.1.0
- **Database Client**: @vercel/postgres 0.10.0, pg 8.16.3

### AI Integration
- **Service**: Google Gemini 2.5 Flash
- **Client**: @google/genai 1.31.0

### Deployment
- **Platform**: Vercel (serverless)
- **Database**: Vercel Postgres
- **Build Tool**: Next.js build system

### Development Tools
- **TypeScript Configuration**: ES2022 target
- **CSS Processing**: PostCSS 8.5.6, Autoprefixer 10.4.22
- **Runtime**: tsx 4.21.0 for TypeScript execution

## 📈 Simulation Logic

### Energy Modeling
The game simulates realistic home energy systems:

**Solar Production**
- Time-of-day variance (peak at midday, zero at night)
- Weather patterns and cloud cover simulation
- Scales with installed solar capacity (0-6kW+)

**Battery Management**
- Automatic charge from excess solar
- Discharge during high consumption or night hours
- Capacity tracking (0-10kWh+)
- Prevents over-charging and deep discharge

**Consumption Calculation**
- Base load: 1.5 kW
- Gas appliance factor: +0.2 kW per appliance
- Efficiency upgrades reduce consumption
- Time-of-day variance

**Grid Interaction**
- **Import Tariff**: $0.30/kWh (when consuming from grid)
- **Export Tariff**: $0.15/kWh (when selling back to grid)
- **Resell to Grid Setting**:
  - **YES**: Earn revenue from excess solar exports (default)
  - **NO**: Excess energy is wasted, no revenue

**Financial Calculations**
- Daily cost tracking (grid imports - grid exports)
- Subsidy application at purchase time
- Total money balance (starting: $20,000)
- ROI calculations over simulation period

**Environmental Impact**
- CO2 savings: Grid displacement × 0.82 kg CO2/kWh
- Tracks cumulative carbon reduction
- Real-time environmental metrics

## 🎮 How to Play

1. **Start the Game**: Visit http://localhost:3000
2. **Review Dashboard**: Check your current energy metrics and daily costs
3. **Browse Store**: Click "STORE" to see available upgrades
4. **Purchase Upgrades**: Buy solar panels, batteries, or efficiency improvements
   - Subsidies are automatically applied at checkout
   - Watch your money balance
5. **Monitor Reports**: View 24-hour energy production/consumption charts
6. **Adjust Settings**: Configure simulation duration, subsidies, and grid resell options
7. **Get AI Advice**: Click the advisor widget for personalized recommendations
8. **Watch Metrics**: Track your progress toward financial and environmental goals

**Win Conditions**: Maximize CO2 savings and ROI over your chosen simulation period!

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```bash
# Database (Required)
POSTGRES_PRISMA_URL="postgresql://user:password@host:port/database"
POSTGRES_URL_NON_POOLING="postgresql://user:password@host:port/database"

# Google Gemini AI (Optional - required for AI Advisor)
API_KEY="your_google_gemini_api_key"
```

**Notes:**
- For Vercel deployment, use Vercel Postgres environment variables
- AI Advisor feature requires a valid Google Gemini API key
- Database URLs are automatically provided by Vercel Postgres

## 📄 Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete deployment guide with troubleshooting
- **[DEPLOY_NOW.md](./DEPLOY_NOW.md)** - Quick start guide for Vercel deployment
- **[VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)** - Vercel-specific deployment instructions
- **`.env.example`** - Environment variables template
- **`prisma/schema.prisma`** - Complete database schema with relationships

## 🧪 Development Scripts

```bash
# Development
npm run dev          # Start Next.js dev server (port 3000)
npm run lint         # Run ESLint

# Database
npx prisma generate  # Generate Prisma client
npx prisma migrate dev     # Run migrations (development)
npx prisma migrate deploy  # Run migrations (production)
npx prisma studio    # Open Prisma Studio GUI

# Build & Production
npm run build        # Build for production (runs prisma generate + next build)
npm start            # Start production server

# Database Seeding
curl -X POST http://localhost:3000/api/seed      # Local
curl -X POST https://your-app.vercel.app/api/seed  # Production
```

## 🌐 Australian Energy Context

This application is specifically designed for the **Australian energy market** with focus on **Victoria/Melbourne**:

- **Tariffs**: Realistic import ($0.30/kWh) and export ($0.15/kWh) rates
- **Subsidies**: Models Victorian government solar and battery rebates
- **Product Recommendations**: Based on Australian climate and energy patterns
- **AI Advisor**: Trained on Australian energy policies and regulations
- **Gas Appliances**: Tracks transition from gas to electric (common in Australia)

## 🤝 Contributing

This is an educational project demonstrating:
- Full-stack Next.js development
- Real-time simulation algorithms
- Database-driven dynamic content
- AI integration with Google Gemini
- TypeScript best practices
- Responsive UI design with Tailwind CSS

## 📊 Application Statistics

- **React Components**: 6 main components
- **API Endpoints**: 5 endpoint groups
- **Database Models**: 4 Prisma models
- **Product Types**: 4 categories (Solar, Battery, Heating, Efficiency)
- **Simulation Tick Rate**: Configurable (default: 1000ms = 1 game hour)
- **Supported Duration**: 90-1825 game days
- **Starting Money**: $20,000 AUD

## 🙋 Support & Issues

For questions, bug reports, or feature requests:
1. Check the documentation files (`DEPLOYMENT.md`, etc.)
2. Review the API documentation in the codebase
3. Inspect the Prisma schema for database structure
4. Check browser console for client-side errors
5. Review Vercel logs for server-side issues

## 📜 License

This project is available for educational and research purposes.

---

**Built with Next.js 16** | **Powered by Vercel** | **Database by Prisma** | **AI by Google Gemini**
