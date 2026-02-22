/**
 * TopBar Component
 * Top navigation with breadcrumbs and user actions
 * AI-generated: 100%
 */

import { Menu, Bell, ChevronDown } from 'lucide-react';
import { useLayout } from '../../contexts/LayoutContext';
import { cn } from '../../styles/utils';
import Breadcrumbs from './Breadcrumbs';

const TopBar = () => {
  const { isMobile, toggleMobileNav } = useLayout();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Left Side - Mobile Menu + Breadcrumbs */}
          <div className="flex items-center gap-4 flex-1">
            {/* Mobile Menu Button */}
            {isMobile && (
              <button
                onClick={toggleMobileNav}
                className={cn(
                  'p-2 rounded-lg text-gray-600 hover:bg-gray-100',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500'
                )}
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            {/* Breadcrumbs */}
            <Breadcrumbs />
          </div>

          {/* Right Side - Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Notifications */}
            <button
              className={cn(
                'relative p-2 rounded-lg text-gray-600 hover:bg-gray-100',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500'
              )}
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {/* Badge for unread notifications */}
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error-500 rounded-full" />
            </button>

            {/* Merchant Selector */}
            <select
              className={cn(
                'px-3 py-2 pr-8 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                'appearance-none cursor-pointer',
                'hidden sm:block'
              )}
              defaultValue="merchant-a"
            >
              <option value="merchant-a">Merchant A</option>
              <option value="merchant-b">Merchant B</option>
              <option value="merchant-c">Merchant C</option>
            </select>

            {/* User Menu (Future: Dropdown) */}
            <button
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                'hidden sm:flex'
              )}
            >
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary-700">U</span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
