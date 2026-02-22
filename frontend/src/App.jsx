import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LayoutProvider } from './contexts/LayoutContext';
import Layout from './components/Layout';
import Transactions from './pages/Transactions';
import Analytics from './pages/Analytics';
import MetricsDashboard from './pages/MetricsDashboard';

/**
 * Main App component
 * AI-generated application entry point with routing and React Query setup
 * Modernized with LayoutProvider for sidebar state management
 */

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000
    }
  }
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <LayoutProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/transactions" replace />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/metrics" element={<MetricsDashboard />} />
            </Routes>
          </Layout>
        </LayoutProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
