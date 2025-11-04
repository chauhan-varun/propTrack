# PropTrack - Rent & Electricity Bill Management System

A full-stack web application for managing rent and electricity bills for property rooms. Built with Next.js 16 (App Router), TypeScript, Prisma (PostgreSQL), NextAuth v5, shadcn/ui, and TailwindCSS.

## 🚀 Features

### Core Features

- **🔐 Authentication System**
  - Secure login with NextAuth v5
  - Credentials-based authentication
  - Password hashing with bcryptjs
  - Session management with JWT
  - Protected routes with middleware

- **🏠 Rooms Management**
  - Support for up to 90 rooms
  - Track room number, tenant name, fixed rent, and occupancy status
  - Add new tenants with initial meter readings
  - Edit room details and billing information
  - Delete bills for specific months
  - View all rooms with current billing status

- **📊 Monthly Bill Tracking**
  - Automatic bill generation for occupied rooms
  - Electricity meter readings (Previous Units, Current Units, Units Used)
  - Configurable electricity rate per unit
  - Automatic calculation: Total = Rent + (Units Used × Rate Per Unit)
  - Payment status tracking (Paid/Unpaid)
  - Historical data preservation - no overwriting
  - Month-by-month filtering

- **📈 Dashboard**
  - Summary cards showing:
    - Total Rooms
    - Occupied Rooms
    - Vacant Rooms
    - Total Collected (current month)
    - Pending Amount (current month)
  - Due payments section with all unpaid bills
  - Real-time statistics

- **🎨 UI/UX Features**
  - 🌓 Dark/Light mode toggle
  - 🔄 Loading spinners with react-spinners
  - Responsive design for all devices
  - Clean and intuitive interface
  - Real-time form validation

- **⚡ Bill Management**
  - Monthly bill generation with one click
  - Edit current readings and payment status
  - Delete bills for specific months
  - Automatic previous units carryover from last month
  - Real-time calculations

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Authentication**: NextAuth v5 (Auth.js)
- **Styling**: TailwindCSS 4, shadcn/ui components
- **Database**: Prisma ORM + PostgreSQL (Neon)
- **Forms**: React Hook Form + Zod validation
- **Theme**: next-themes for dark/light mode
- **Icons**: Lucide React
- **Loading**: react-spinners
- **Package Manager**: pnpm

## 📦 Installation

### Prerequisites

- Node.js 20+
- PostgreSQL database (Neon, Supabase, or local)
- pnpm package manager

### Setup Steps

1. **Clone the repository**

```bash
git clone https://github.com/chauhan-varun/propTrack.git
cd propTrack
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:

```env
# PostgreSQL Database URL (Neon, Supabase, or local)
DATABASE_URL="postgresql://username:password@host:port/database"

# NextAuth Configuration
AUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"
AUTH_URL="http://localhost:3000"
```

To generate a secure AUTH_SECRET:
```bash
openssl rand -base64 32
```

4. **Set up the database**

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations to create tables
pnpm db:migrate

# Seed with sample data (optional)
pnpm db:seed

# Create admin user
pnpm create-admin
```

5. **Run the development server**

```bash
pnpm dev
```

6. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

**Default Login Credentials:**
- Email: `admin@proptrack.com`
- Password: `admin123`

## 📁 Project Structure

```
proptrack/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # NextAuth authentication
│   │   ├── rooms/        # Room CRUD operations
│   │   ├── bills/        # Bill management & generation
│   │   ├── settings/     # Global settings
│   │   └── dashboard/    # Dashboard statistics
│   ├── rooms/            # Rooms management page
│   ├── login/            # Login page
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Dashboard page
│   └── globals.css       # Global styles with dark mode
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── rooms/            # Room & bill dialogs
│   ├── header.tsx        # Header with theme toggle
│   ├── theme-provider.tsx # Theme provider
│   ├── theme-toggle.tsx  # Dark/light mode toggle
│   └── providers.tsx     # App providers
├── lib/
│   ├── prisma.ts         # Prisma client singleton
│   └── utils.ts          # Utility functions
├── prisma/
│   ├── schema.prisma     # Database schema
│   ├── seed.ts           # Seed script
│   └── migrations/       # Database migrations
├── scripts/
│   └── create-admin.ts   # Admin user creation script
├── auth.ts               # NextAuth configuration
├── middleware.ts         # Route protection middleware
└── package.json
```

## 🗄️ Database Schema

### User Model
- `id`: Auto-increment ID
- `email`: Unique email address
- `password`: Hashed password (bcrypt)
- `name`: Optional user name
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### Room Model
- `id`: Auto-increment ID
- `number`: Unique room number (1-90)
- `tenantName`: Optional tenant name
- `rent`: Fixed monthly rent amount
- `status`: "Occupied" or "Vacant"
- `bills`: Relation to bills
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

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
- `createdAt`: Timestamp
- `updatedAt`: Timestamp
- **Unique constraint**: `roomId + month` (one bill per room per month)

### Setting Model
- `id`: Auto-increment ID
- `key`: Setting key (e.g., "defaultRatePerUnit")
- `value`: Setting value (stored as string)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

## 🎯 Usage Guide

### Initial Setup

1. **Login**
   - Navigate to the app
   - You'll be redirected to the login page
   - Use default credentials: `admin@proptrack.com` / `admin123`
   - Or create your own admin user with `pnpm create-admin`

### Adding a New Tenant

1. Go to "Manage Rooms" from the dashboard
2. Click "Add New Tenant" button
3. Fill in tenant details:
   - Room Number (required, unique, 1-90)
   - Tenant Name (optional)
   - Monthly Rent (required)
   - Status: Occupied/Vacant
   - Current Meter Reading (required) - This becomes the initial reading
4. Click "Add Tenant"
5. System automatically creates first bill with initial meter reading

### Editing Room Details

1. In Rooms Management, find the room
2. Click the "Room" button (pencil icon)
3. Update room details
4. Click "Update Room"

### Managing Bills

#### Editing a Bill
1. Select the desired month from the month picker
2. Click the "Bill" button (file-edit icon)
3. Update:
   - Current Units (new meter reading)
   - Rate Per Unit
   - Payment Status (Paid/Unpaid)
4. System automatically recalculates electricity charges and total

#### Deleting a Bill
1. Select the month containing the bill
2. Click the "Delete" button (trash icon)
3. Confirm deletion
4. Only the selected month's bill is deleted

### Generating Monthly Bills

1. Go to "Rooms Management" page
2. Click "Generate New Month" button
3. Select the month (e.g., 2025-11)
4. System will:
   - Create bills for all occupied rooms
   - Use previous month's current readings as new month's previous readings
   - Set initial current units equal to previous units (0 usage)
   - Copy rent amount and rate per unit from settings
5. Edit each bill to add new current meter readings

### Using Dark/Light Mode

- Click the sun/moon icon in the header
- Theme toggles between light and dark mode
- Preference is saved to localStorage
- System default respects your OS preference

### Viewing Dashboard

- Dashboard shows real-time statistics for current month
- View all unpaid bills across all months
- Quick navigation to rooms management
- Monitor occupancy and collection rates

## 🔧 Available Scripts

```bash
# Development
pnpm dev              # Start development server (Turbopack)
pnpm build           # Build for production
pnpm start           # Start production server

# Database
pnpm db:migrate       # Run Prisma migrations
pnpm db:seed          # Seed database with 10 sample rooms
pnpm db:studio        # Open Prisma Studio (database GUI)

# Authentication
pnpm create-admin     # Create admin user interactively

# Utilities
pnpm lint            # Run ESLint
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out
- `GET /api/auth/session` - Get session

### Rooms
- `GET /api/rooms` - Get all rooms with bills
- `POST /api/rooms` - Create a room and initial bill
- `GET /api/rooms/[id]` - Get a specific room
- `PUT /api/rooms/[id]` - Update a room
- `DELETE /api/rooms/[id]` - Delete a room

### Bills
- `GET /api/bills` - Get all bills (with optional filters)
- `POST /api/bills` - Create a bill
- `GET /api/bills/[id]` - Get a specific bill
- `PUT /api/bills/[id]` - Update a bill (recalculates totals)
- `DELETE /api/bills/[id]` - Delete a bill
- `POST /api/bills/generate-month` - Generate bills for a new month

### Settings
- `GET /api/settings` - Get all settings
- `PUT /api/settings` - Update/create a setting

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics (current month)

## 🚀 Deployment

### Vercel (Recommended)

1. **Set up PostgreSQL Database**
   
   Recommended providers:
   - [Neon](https://neon.tech/) - Serverless Postgres ⭐ Recommended
   - [Supabase](https://supabase.com/) - Postgres + additional features
   - [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) - Built-in

2. **Push your code to GitHub**

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

3. **Import project in Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js configuration

4. **Add environment variables in Vercel**
   
   Go to Project Settings → Environment Variables and add:
   
   ```env
   DATABASE_URL=postgresql://username:password@host/database
   AUTH_SECRET=your-generated-secret-key
   AUTH_URL=https://your-domain.vercel.app
   ```

5. **Deploy**
   - Click "Deploy"
   - Vercel will automatically:
     - Install dependencies
     - Generate Prisma client
     - Build the application
     - Deploy to production

6. **Run migrations**
   
   After first deployment, run migrations:
   - Go to Vercel project → Settings → Environment Variables
   - Copy your `DATABASE_URL`
   - Run locally:
     ```bash
     DATABASE_URL="your-vercel-postgres-url" npx prisma migrate deploy
     ```
   - Or use Vercel's terminal

7. **Create admin user**
   
   Connect to your database and run:
   ```bash
   DATABASE_URL="your-vercel-postgres-url" pnpm create-admin
   ```

### Manual Deployment

For other platforms, ensure you:
1. Set up a PostgreSQL database
2. Set the `DATABASE_URL` environment variable
3. Run `pnpm db:migrate` to create tables
4. Run `pnpm build` to build the application
5. Run `pnpm start` to start the production server

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
# PostgreSQL Database URL (Neon, Supabase, or local)
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

# NextAuth Configuration
# Generate with: openssl rand -base64 32
AUTH_SECRET="your-secret-key-here"

# Auth URL (change for production)
AUTH_URL="http://localhost:3000"
# Production: AUTH_URL="https://your-domain.vercel.app"
```

### Database Connection String Format

```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public&sslmode=require
```

Examples:
- **Local**: `postgresql://postgres:password@localhost:5432/proptrack`
- **Neon**: `postgresql://user:password@ep-xxx.region.aws.neon.tech/proptrack?sslmode=require`
- **Supabase**: `postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres`
- **Vercel Postgres**: Provided in Vercel dashboard

## 🎨 Customization

### Changing Currency
Search and replace `₹` with your currency symbol in:
- `app/page.tsx`
- `app/rooms/page.tsx`
- `components/rooms/edit-bill-dialog.tsx`

### Adjusting Room Limit
Update the maximum room validation in:
- `app/rooms/page.tsx` - Display logic (line ~105)
- Prisma schema if needed

### Modifying Default Rate Per Unit
1. Go to Prisma Studio: `pnpm db:studio`
2. Navigate to `Setting` table
3. Update or create key `defaultRatePerUnit` with your value
4. Or use the Settings API programmatically

### Customizing Theme Colors
Edit `app/globals.css`:
- Light mode colors in `:root`
- Dark mode colors in `.dark`
- Uses OKLCH color space for better color consistency

## 🔒 Security Features

- ✅ Password hashing with bcryptjs (10 rounds)
- ✅ JWT session tokens with NextAuth v5
- ✅ HTTP-only cookies for session storage
- ✅ CSRF protection built-in
- ✅ Middleware-based route protection
- ✅ Environment variable validation
- ✅ SQL injection prevention via Prisma ORM

## ⚡ Performance Optimizations

- ✅ Next.js 16 with Turbopack (faster builds)
- ✅ React Server Components by default
- ✅ Optimized bundle size with tree-shaking
- ✅ Lightweight middleware (<1MB for Edge)
- ✅ Database connection pooling
- ✅ Efficient Prisma queries with includes
- ✅ Static generation where possible

## 🐛 Troubleshooting

### "Module not found: '@prisma/client'"
```bash
npx prisma generate
```

### Database Connection Errors
```bash
# Check your DATABASE_URL in .env
# Ensure PostgreSQL is running
# Test connection with Prisma Studio
pnpm db:studio
```

### Migration Errors
```bash
# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Or create a new migration
pnpm db:migrate
```

### Authentication Not Working
```bash
# Ensure AUTH_SECRET is set
echo $AUTH_SECRET

# Regenerate if needed
openssl rand -base64 32

# Check AUTH_URL matches your domain
```

### Build Errors on Vercel
```bash
# Ensure all environment variables are set in Vercel
# Check that Prisma generate runs in build
# Verify DATABASE_URL is accessible from Vercel
```

### Middleware Size Error (>1MB)
The middleware has been optimized to be <1MB. If you still get this error:
- Don't import heavy libraries in middleware.ts
- Keep authentication logic minimal
- Use edge-compatible packages only

## 📊 Sample Data

Running `pnpm db:seed` creates:
- 10 sample rooms (Room 101-110)
- 7 occupied rooms with tenants
- Bills for November 2025
- Default settings (rate per unit: 5.0)

## 🔄 Update Guide

### Updating Dependencies
```bash
pnpm update
```

### Database Schema Changes
1. Edit `prisma/schema.prisma`
2. Create migration: `npx prisma migrate dev --name your_change`
3. Generate client: `npx prisma generate`

## 📱 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)


## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👨‍💻 Author

**Varun Chauhan**
- GitHub: [@chauhan-varun](https://github.com/chauhan-varun)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [NextAuth.js](https://next-auth.js.org/) - Authentication for Next.js
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Neon](https://neon.tech/) - Serverless Postgres

---

**Happy Property Management! 🏠**
