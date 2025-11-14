# Maglo - Finance Management Dashboard

A comprehensive Finance Management Dashboard for small businesses built with Next.js, React, TypeScript, and Appwrite.

## Features

- 🔐 **Authentication** - Secure login and signup with Appwrite Auth
- 📊 **Dashboard Overview** - Key metrics with live totals and charts
  - Total invoices count
  - Total paid amount
  - Pending payments
  - Total VAT collected
- 🧾 **Invoice Management** - Full CRUD operations for invoices
  - Create new invoices with client details
  - Edit existing invoices
  - Delete invoices with confirmation
  - Mark invoices as paid/unpaid
  - Filter invoices by status (All/Paid/Unpaid)
- 💰 **VAT Calculations** - Automatic VAT calculations
  - Real-time VAT amount calculation
  - Configurable VAT percentage
  - Automatic total calculation (Amount + VAT)
- 📈 **Financial Summaries** - Comprehensive financial tracking
  - Monthly VAT summary
  - Payments summary
  - Overdue invoices tracking
  - Upcoming due dates (7-day countdown)
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 📊 **Data Visualization** - Interactive charts using Recharts
  - Bar chart for financial overview
  - Pie chart for invoice status distribution
- 🔔 **Toast Notifications** - User-friendly notifications for all actions
- 🎨 **Modern UI** - Built with ShadCN/UI components and TailwindCSS

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: ShadCN/UI
- **Backend**: Appwrite (Auth & Database)
- **State Management**: Zustand
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- An Appwrite account and project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd maglo
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Update `.env.local` with your Appwrite credentials:
```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
NEXT_PUBLIC_APPWRITE_INVOICES_COLLECTION_ID=your_invoices_collection_id
NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID=your_users_collection_id
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Appwrite Setup

### Step 1: Create Appwrite Project
1. Go to [Appwrite Cloud](https://cloud.appwrite.io) or set up a self-hosted instance
2. Create a new project
3. Note your Project ID and Endpoint URL

### Step 2: Enable Authentication
1. Go to **Auth** in your Appwrite project
2. Enable **Email/Password** authentication
3. Configure email settings (for production, set up SMTP)

### Step 3: Create Database and Collections
1. Go to **Databases** and create a new database
2. Note your Database ID

3. Create the **invoices** collection with the following attributes:
   - `clientName` (string, required)
   - `clientEmail` (string, required, email format)
   - `amount` (double, required)
   - `vatPercentage` (double, required)
   - `vatAmount` (double, required)
   - `total` (double, required)
   - `dueDate` (datetime, required)
   - `status` (string, required) - enum: "paid", "unpaid"
   - `userId` (string, required)
   
4. Set up permissions for the invoices collection:
   - **Create**: Users (authenticated users can create)
   - **Read**: Users (users can read their own documents)
   - **Update**: Users (users can update their own documents)
   - **Delete**: Users (users can delete their own documents)
   
   To restrict users to their own documents, add this rule in Appwrite:
   - Read: `userId = {{userId}}`
   - Update: `userId = {{userId}}`
   - Delete: `userId = {{userId}}`

### Step 4: Environment Variables
Update your `.env.local` file with:
```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id_here
NEXT_PUBLIC_APPWRITE_INVOICES_COLLECTION_ID=your_invoices_collection_id_here
```

## Project Structure

```
maglo/
├── src/
│   ├── app/                      # Next.js app router pages
│   │   ├── (auth)/               # Authentication pages
│   │   │   ├── login/            # Login page
│   │   │   └── signup/           # Signup page
│   │   ├── dashboard/            # Dashboard pages
│   │   │   ├── invoices/         # Invoice management pages
│   │   │   │   ├── new/          # Create invoice page
│   │   │   │   └── page.tsx      # Invoices list page
│   │   │   ├── layout.tsx        # Dashboard layout
│   │   │   └── page.tsx          # Dashboard home
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Home page (redirects)
│   ├── components/               # React components
│   │   ├── dashboard/            # Dashboard components
│   │   │   └── payments-summary.tsx
│   │   ├── invoices/             # Invoice components
│   │   │   ├── invoice-dialog.tsx
│   │   │   ├── invoice-table.tsx
│   │   │   └── delete-invoice-dialog.tsx
│   │   ├── providers/            # Context providers
│   │   │   └── auth-provider.tsx
│   │   └── ui/                   # ShadCN/UI components
│   ├── lib/                      # Utilities and configurations
│   │   ├── appwrite.ts           # Appwrite client setup
│   │   ├── services/             # Service functions
│   │   │   ├── auth-service.ts
│   │   │   └── invoice-service.ts
│   │   └── utils.ts              # Utility functions
│   ├── store/                    # Zustand stores
│   │   ├── auth-store.ts         # Authentication state
│   │   └── invoice-store.ts      # Invoice state
│   └── types/                    # TypeScript types
│       └── index.ts
├── public/                       # Static assets
├── .env.local.example            # Environment variables example
├── package.json                  # Dependencies
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # This file
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

This project can be deployed on Vercel or Netlify:

1. Push your code to GitHub
2. Connect your repository to Vercel/Netlify
3. Add environment variables in the deployment platform
4. Deploy!

## Key Components

### Authentication
- **Login/Signup**: User authentication using Appwrite Auth
- **Protected Routes**: Dashboard routes are protected and require authentication
- **Session Management**: Automatic session checking and logout functionality

### Dashboard
- **Metrics Cards**: Display key financial metrics at a glance
- **Charts**: Visual representation of financial data using Recharts
- **Recent Invoices**: Quick view of the latest invoices
- **Payments Summary**: Detailed breakdown of payments and VAT

### Invoice Management
- **Create Invoice**: Form with validation for creating new invoices
- **Edit Invoice**: Modal dialog for editing existing invoices
- **Delete Invoice**: Confirmation dialog before deletion
- **Status Management**: Toggle invoice status between paid/unpaid
- **Filtering**: Filter invoices by status (All/Paid/Unpaid)
- **Responsive Table**: Mobile-friendly table with hidden columns on smaller screens

### VAT Calculations
- **Automatic Calculation**: VAT amount is calculated automatically based on percentage
- **Real-time Updates**: Calculations update in real-time as you type
- **Configurable VAT**: Set custom VAT percentage per invoice

## State Management

The app uses Zustand for state management:
- **Auth Store**: Manages user authentication state
- **Invoice Store**: Manages invoice data and dashboard statistics

## API Integration

All API calls are handled through service functions:
- **auth-service.ts**: Handles authentication operations
- **invoice-service.ts**: Handles CRUD operations for invoices

## Styling

- **TailwindCSS**: Utility-first CSS framework
- **ShadCN/UI**: High-quality React components
- **Responsive Design**: Mobile-first approach with breakpoints

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Common Issues

1. **Appwrite Connection Errors**
   - Verify your endpoint URL and project ID in `.env.local`
   - Check if your Appwrite instance is running
   - Verify CORS settings in Appwrite

2. **Authentication Issues**
   - Ensure email/password authentication is enabled in Appwrite
   - Check if your email domain is allowed (for development, localhost should work)

3. **Database Permission Errors**
   - Verify collection permissions in Appwrite
   - Ensure users have read/write access to their own documents
   - Check if the collection ID is correct in `.env.local`

4. **Build Errors**
   - Delete `node_modules` and `.next` folder
   - Run `npm install` again
   - Clear Next.js cache: `rm -rf .next`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

MIT

## Project Status

✅ **Production Ready** - 18/20 tasks complete (90%)

See `PROJECT_COMPLETION.md` for detailed status.

### Completed
- All core features (authentication, CRUD, calculations, charts)
- Responsive design with dark mode
- Loading states and error handling
- Comprehensive documentation

### Ready for Deployment
- See `DEPLOYMENT.md` for deployment guide
- See `TESTING.md` for testing checklist
- See `DEMO_VIDEO_SCRIPT.md` for creating demo

## Support

For support, create an issue in the repository.

