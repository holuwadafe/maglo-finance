# Maglo - Finance Dashboard

A modern, intuitive finance dashboard for managing invoices and tracking business payments. Built with Next.js and Appwrite.

##  Features

- **User Authentication** - Secure login and signup with Appwrite
- **Invoice Management** - Create, view, and manage invoices effortlessly
- **Dashboard Overview** - Quick view of payment statistics and trends
- **Dark Mode** - Comfortable viewing in any lighting condition
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Real-time Updates** - Invoices sync instantly across the dashboard

##  Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd maglo
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.local.example .env.local
```

4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages (login, signup)
│   ├── dashboard/         # Dashboard pages
│   └── globals.css        # Global styles
├── components/            # Reusable React components
│   ├── ui/               # UI primitives (buttons, cards, etc.)
│   ├── invoices/         # Invoice-specific components
│   ├── dashboard/        # Dashboard components
│   └── providers/        # App providers (auth, theme)
├── lib/                  # Utility functions
│   ├── appwrite.ts      # Appwrite client setup
│   └── services/        # API service functions
├── store/               # Zustand state management
├── types/               # TypeScript type definitions
└── data/                # Mock data
```

## 🛠️ Available Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server


##  Design System

- **Colors**: White background (light mode default) with green accents (#B8E986)
- **Framework**: Tailwind CSS for styling
- **Icons**: Lucide React
- **Components**: Custom ShadCN-style UI components

##  Authentication

The app supports two authentication flows:
- **Appwrite** - Primary authentication backend
- **Demo Mode** - Fallback for testing without Appwrite credentials

##  Core Features

### Dashboard
- View payment statistics
- See recent invoices
- Quick action buttons

### Invoices
- Create new invoices with form validation
- View all invoices in a table
- Edit existing invoices
- Delete invoices with confirmation
- See success confirmations

##  Deployment

The app is production-ready and can be deployed to:
- **Vercel** - Recommended (zero-config deployment)

##  Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Forms**: react-hook-form + zod validation
- **Charts**: Recharts

##  License

This project is open source. See LICENSE file for details.

---

**Questions?** Check the documentation or create an issue on GitHub.
