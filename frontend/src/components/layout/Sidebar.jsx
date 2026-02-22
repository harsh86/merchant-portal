/**
 * Sidebar Component
 * Collapsible desktop navigation
 * AI-generated: 100%
 */

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLayout } from '../../contexts/LayoutContext';
import { cn } from '../../styles/utils';
import SidebarItem from './SidebarItem';

const Sidebar = ({ navItems }) => {
  const { sidebarCollapsed, toggleSidebar } = useLayout();

  return (
    <motion.aside
      initial={false}
      animate={{
        width: sidebarCollapsed ? '4.5rem' : '16rem'
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={cn(
        'relative bg-white border-r border-gray-200 flex flex-col',
        'h-screen overflow-hidden'
      )}
    >
      {/* Logo Area */}
      <div className={cn(
        'p-6 border-b border-gray-200 flex items-center',
        sidebarCollapsed ? 'justify-center' : 'justify-between'
      )}>
        <AnimatePresence mode="wait">
          {sidebarCollapsed ? (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-2xl font-bold text-primary-600"
            >
              MP
            </motion.div>
          ) : (
            <motion.h1
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-xl font-bold text-gray-900"
            >
              Merchant Portal
            </motion.h1>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <SidebarItem
              key={item.path}
              {...item}
              collapsed={sidebarCollapsed}
            />
          ))}
        </ul>
      </nav>

      {/* Collapse Toggle Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={toggleSidebar}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2 rounded-lg',
            'text-gray-600 hover:bg-gray-100 transition-colors',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
            sidebarCollapsed && 'justify-center'
          )}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Collapse</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
