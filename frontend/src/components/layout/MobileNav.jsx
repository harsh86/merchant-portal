/**
 * MobileNav Component
 * Mobile navigation drawer
 * AI-generated: 100%
 */

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useLayout } from '../../contexts/LayoutContext';
import { cn } from '../../styles/utils';
import { drawerLeft, modalOverlay } from '../../utils/animations';
import SidebarItem from './SidebarItem';

const MobileNav = ({ navItems }) => {
  const { mobileNavOpen, closeMobileNav } = useLayout();

  return (
    <AnimatePresence>
      {mobileNavOpen && (
        <>
          {/* Overlay */}
          <motion.div
            {...modalOverlay}
            onClick={closeMobileNav}
            className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.aside
            {...drawerLeft}
            className={cn(
              'fixed top-0 left-0 bottom-0 w-64 bg-white',
              'shadow-2xl z-50 flex flex-col'
            )}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-900">Merchant Portal</h1>
              <button
                onClick={closeMobileNav}
                className={cn(
                  'p-2 rounded-lg text-gray-600 hover:bg-gray-100',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500'
                )}
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 p-4 overflow-y-auto">
              <ul className="space-y-1">
                {navItems.map((item) => (
                  <div key={item.path} onClick={closeMobileNav}>
                    <SidebarItem {...item} collapsed={false} />
                  </div>
                ))}
              </ul>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary-700">U</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">User</p>
                  <p className="text-xs text-gray-500 truncate">user@example.com</p>
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileNav;
