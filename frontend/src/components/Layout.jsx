/**
 * Main Layout Component
 * Modernized with collapsible sidebar and mobile navigation
 * AI-generated: 100%
 */

import { LayoutDashboard, TrendingUp, BarChart3 } from 'lucide-react';
import { useLayout } from '../contexts/LayoutContext';
import { Sidebar, TopBar, MobileNav } from './layout';
import { cn } from '../styles/utils';

// Navigation items configuration
const navItems = [
  {
    path: '/transactions',
    label: 'Transactions',
    icon: LayoutDashboard,
  },
  {
    path: '/analytics',
    label: 'Analytics',
    icon: TrendingUp,
  },
  {
    path: '/metrics',
    label: 'Metrics',
    icon: BarChart3,
  },
];

const Layout = ({ children }) => {
  const { isMobile, sidebarCollapsed } = useLayout();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      {!isMobile && <Sidebar navItems={navItems} />}

      {/* Mobile Navigation Drawer */}
      {isMobile && <MobileNav navItems={navItems} />}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar />

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className={cn(
            'p-4 sm:p-6 lg:p-8',
            'max-w-[1920px] mx-auto w-full'
          )}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
