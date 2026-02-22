/**
 * SidebarItem Component
 * Navigation link with icon, text, and active state
 * AI-generated: 100%
 */

import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as Tooltip from '@radix-ui/react-tooltip';
import { cn } from '../../styles/utils';

const SidebarItem = ({ path, label, icon: Icon, badge, collapsed }) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  const linkContent = (
    <Link
      to={path}
      className={cn(
        'relative flex items-center gap-3 px-3 py-2.5 rounded-lg',
        'transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
        collapsed ? 'justify-center' : 'justify-start',
        isActive
          ? 'bg-primary-50 text-primary-700 font-medium'
          : 'text-gray-700 hover:bg-gray-100'
      )}
    >
      {/* Active Indicator */}
      {isActive && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-600 rounded-r-full"
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}

      {/* Icon */}
      <Icon className={cn('w-5 h-5 flex-shrink-0', collapsed && 'mx-auto')} />

      {/* Label (hidden when collapsed) */}
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="text-sm whitespace-nowrap overflow-hidden"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Badge (hidden when collapsed) */}
      {!collapsed && badge && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="ml-auto px-2 py-0.5 text-xs font-medium bg-error-100 text-error-700 rounded-full"
        >
          {badge}
        </motion.span>
      )}
    </Link>
  );

  // Show tooltip when collapsed
  if (collapsed) {
    return (
      <Tooltip.Provider delayDuration={300}>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <li>{linkContent}</li>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              side="right"
              sideOffset={10}
              className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm shadow-xl z-50"
            >
              {label}
              {badge && (
                <span className="ml-2 px-1.5 py-0.5 text-xs bg-error-600 rounded">
                  {badge}
                </span>
              )}
              <Tooltip.Arrow className="fill-gray-900" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    );
  }

  return <li>{linkContent}</li>;
};

export default SidebarItem;
