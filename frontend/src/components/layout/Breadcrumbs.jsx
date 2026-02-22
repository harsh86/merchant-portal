/**
 * Breadcrumbs Component
 * Navigation breadcrumbs auto-generated from route
 * AI-generated: 100%
 */

import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../styles/utils';

const routeNameMap = {
  '/': 'Home',
  '/transactions': 'Transactions',
  '/analytics': 'Analytics',
  '/metrics': 'Metrics',
};

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  // Don't show breadcrumbs on home page
  if (pathnames.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="hidden sm:flex">
      <ol className="flex items-center gap-2 text-sm">
        {/* Home Link */}
        <li>
          <Link
            to="/"
            className={cn(
              'text-gray-600 hover:text-gray-900 transition-colors',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded'
            )}
          >
            <Home className="w-4 h-4" />
          </Link>
        </li>

        {/* Path Segments */}
        {pathnames.map((segment, index) => {
          const path = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const label = routeNameMap[path] || segment.charAt(0).toUpperCase() + segment.slice(1);

          return (
            <li key={path} className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              {isLast ? (
                <span className="text-gray-900 font-medium">{label}</span>
              ) : (
                <Link
                  to={path}
                  className={cn(
                    'text-gray-600 hover:text-gray-900 transition-colors',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded'
                  )}
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
