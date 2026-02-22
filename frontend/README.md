# Merchant Transaction Portal - Frontend

React frontend application for the Merchant Transaction Portal. Built with Vite, React 18, TailwindCSS, React Query, and Recharts.

## Features

- **Transactions List**: View, filter, and paginate through transactions from multiple payment sources
- **Transaction Details**: Click any transaction to view full details including JSONB payload
- **Analytics Dashboard**: Visualize transaction data with interactive charts
- **Responsive Design**: Mobile-friendly interface with TailwindCSS
- **Real-time Updates**: React Query for efficient data fetching and caching
- **Loading States**: Skeleton loaders and spinners for better UX
- **Error Handling**: User-friendly error messages with retry options

## Tech Stack

- **React 18**: Modern React with hooks
- **Vite**: Fast build tool and dev server
- **TailwindCSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **React Query (@tanstack/react-query)**: Data fetching and state management
- **Recharts**: Composable charting library
- **Axios**: HTTP client for API calls

## Getting Started

### Prerequisites

- Node.js (v20.19.0 or >=22.12.0)
- npm (v10.x or later)

### Installation

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` to set your API base URL:
```
VITE_API_BASE_URL=http://localhost:3000/api
```

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/            # Page components
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API service layer
│   ├── utils/            # Utility functions
│   └── App.jsx           # Main app component
├── .env                  # Environment variables
└── package.json          # Dependencies
```

## API Integration

The application currently uses mock data. To enable real API calls, uncomment the React Query hooks in the page components and comment out the mock data assignments.

## License

MIT
