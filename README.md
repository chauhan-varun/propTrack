# PropTrack - Rent & Electricity Bill Management System

A full-stack web application for managing rent and electricity bills for up to 90 rooms. Built with Next.js 14 (App Router), TypeScript, Prisma (SQLite), shadcn/ui, and TailwindCSS.

## 🚀 Features

### Core Features

- **Rooms Management**
  - Support for up to 90 rooms
  - Track room number, tenant name, fixed rent, and occupancy status
  - Add, edit, and manage room details
  - View all rooms with their current billing status

- **Monthly Bill Tracking**
  - Automatic bill generation for occupied rooms
  - Electricity meter readings (Previous Units, Current Units, Units Used)
  - Configurable electricity rate per unit
  - Automatic calculation: Total = Rent + (Units Used × Rate Per Unit)
  - Payment status tracking (Paid/Unpaid)
  - Historical data preservation - no overwriting

- **Dashboard**
  - Summary cards showing:
    - Total Rooms
    - Occupied Rooms
    - Vacant Rooms
    - Total Collected (current month)
    - Pending Amount (current month)
  - Due payments section with all unpaid bills
  - Real-time statistics

- **Bill Management**
  - Monthly bill generation with one click
  - Edit current readings and payment status
  - Automatic previous units carryover from last month
  - Real-time calculations

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 19, TypeScript
- **Styling**: TailwindCSS, shadcn/ui components
- **Database**: Prisma ORM + SQLite
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Package Manager**: pnpm

## 📦 Installation

1. **Install dependencies**

```bash
pnpm install
```

2. **Set up the database**

```bash
# Run migrations
pnpm db:migrate

# Seed with sample data (optional)
pnpm db:seed
```

3. **Run the development server**

```bash
pnpm dev
```

4. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
proptrack/
├── app/
│   ├── api/              # API routes
│   │   ├── rooms/        # Room CRUD operations
│   │   ├── bills/        # Bill management & generation
│   │   ├── settings/     # Global settings
│   │   └── dashboard/    # Dashboard statistics
│   ├── rooms/            # Rooms management page
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Dashboard page
│   └── globals.css       # Global styles
├── components/
│   ├── ui/               # shadcn/ui components
│   └── rooms/            # Room & bill dialogs
├── lib/
│   ├── prisma.ts         # Prisma client
│   └── utils.ts          # Utility functions
├── prisma/
│   ├── schema.prisma     # Database schema
│   ├── seed.ts           # Seed script
│   └── migrations/       # Database migrations
└── package.json
```

## 🗄️ Database Schema

### Room Model
- `id`: Auto-increment ID
- `number`: Unique room number
- `tenantName`: Optional tenant name
- `rent`: Fixed monthly rent amount
- `status`: "Occupied" or "Vacant"
- `bills`: Relation to bills

### Bill Model
- `id`: Auto-increment ID
- `month`: Month in YYYY-MM format
- `prevUnits`: Previous electricity meter reading
- `currUnits`: Current electricity meter reading
- `unitsUsed`: Calculated units consumed
- `ratePerUnit`: Electricity rate per unit
- `rentAmount`: Fixed rent for the month
- `electricityAmt`: Calculated electricity charge
- `total`: Total amount (rent + electricity)
- `paid`: Payment status (boolean)
- `roomId`: Foreign key to Room

### Setting Model
- `id`: Auto-increment ID
- `key`: Setting key (e.g., "ratePerUnit")
- `value`: Setting value

## 🎯 Usage Guide

### Adding a Room

1. Go to "Manage Rooms" from the dashboard
2. Click "Add Room" button
3. Fill in room details:
   - Room Number (required, unique)
   - Tenant Name (optional)
   - Monthly Rent (required)
   - Status: Occupied/Vacant
4. Click "Add Room"

### Generating Monthly Bills

1. Go to "Rooms Management" page
2. Click "Generate New Month" button
3. Select the month
4. System will create bills for all occupied rooms
5. Previous month's current readings become new month's previous readings

### Editing Bills

1. Find the room in the Rooms Management page
2. Select the desired month from the month picker
3. Click the edit icon (pencil) next to the bill
4. Update:
   - Current Units
   - Rate Per Unit
   - Payment Status
5. System automatically recalculates totals

### Viewing Dashboard

- Dashboard shows real-time statistics
- View all unpaid bills across all months
- Quick navigation to rooms management
- Monitor occupancy and collection rates

## 🔧 Available Scripts

```bash
# Development
pnpm dev              # Start development server

# Database
pnpm db:migrate       # Run Prisma migrations
pnpm db:seed          # Seed database with sample data
pnpm db:studio        # Open Prisma Studio (database GUI)

# Production
pnpm build           # Build for production
pnpm start           # Start production server

# Utilities
pnpm lint            # Run ESLint
```

## 🌐 API Endpoints

### Rooms
- `GET /api/rooms` - Get all rooms
- `POST /api/rooms` - Create a room
- `GET /api/rooms/[id]` - Get a specific room
- `PUT /api/rooms/[id]` - Update a room
- `DELETE /api/rooms/[id]` - Delete a room

### Bills
- `GET /api/bills` - Get all bills (with optional filters)
- `POST /api/bills` - Create a bill
- `GET /api/bills/[id]` - Get a specific bill
- `PUT /api/bills/[id]` - Update a bill
- `DELETE /api/bills/[id]` - Delete a bill
- `POST /api/bills/generate-month` - Generate bills for a new month

### Settings
- `GET /api/settings` - Get all settings
- `PUT /api/settings` - Update/create a setting

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Vercel will auto-detect Next.js and configure build settings
4. Deploy!

**Note**: For production with SQLite, consider migrating to PostgreSQL:
- Update `prisma/schema.prisma` datasource to `postgresql`
- Set up a PostgreSQL database (e.g., Vercel Postgres, Supabase)
- Update `DATABASE_URL` environment variable
- Run migrations: `pnpm db:migrate`

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./dev.db"
```

For production with PostgreSQL:

```env
DATABASE_URL="postgresql://username:password@host:port/database"
```

## 🎨 Customization

### Changing Currency
Search and replace `₹` with your currency symbol in the codebase.

### Adjusting Room Limit
Update the maximum room validation in:
- `app/rooms/page.tsx` - Display logic
- API validation if needed

### Modifying Rate Per Unit
1. Go to Prisma Studio: `pnpm db:studio`
2. Edit the `Setting` table
3. Update `ratePerUnit` value
4. Or programmatically via Settings API

## 🐛 Troubleshooting

### Prisma Client Issues
```bash
pnpm prisma generate
```

### Database Not Found
```bash
pnpm db:migrate
```

### Missing Dependencies
```bash
pnpm install
```

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

**Happy Property Management! 🏠**
