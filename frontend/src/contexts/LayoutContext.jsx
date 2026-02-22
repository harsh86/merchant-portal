/**
 * Layout Context
 * Global state for layout (sidebar collapse, mobile detection)
 * AI-generated: 100%
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useIsMobile } from '../hooks/useMediaQuery';

const LayoutContext = createContext(undefined);

export function LayoutProvider({ children }) {
  // Persist sidebar state in localStorage
  const [sidebarCollapsed, setSidebarCollapsed] = useLocalStorage('sidebarCollapsed', false);

  // Detect mobile viewport
  const isMobile = useIsMobile();

  // Mobile nav state (drawer open/closed)
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Toggle sidebar collapse
  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  // Toggle mobile nav
  const toggleMobileNav = () => {
    setMobileNavOpen(prev => !prev);
  };

  // Close mobile nav when switching to desktop
  useEffect(() => {
    if (!isMobile && mobileNavOpen) {
      setMobileNavOpen(false);
    }
  }, [isMobile, mobileNavOpen]);

  // Close mobile nav on route change (we'll enhance this later with router integration)
  const closeMobileNav = () => {
    setMobileNavOpen(false);
  };

  const value = {
    // Sidebar state
    sidebarCollapsed,
    setSidebarCollapsed,
    toggleSidebar,

    // Mobile state
    isMobile,
    mobileNavOpen,
    setMobileNavOpen,
    toggleMobileNav,
    closeMobileNav,
  };

  return (
    <LayoutContext.Provider value={value}>
      {children}
    </LayoutContext.Provider>
  );
}

// Hook to use layout context
export function useLayout() {
  const context = useContext(LayoutContext);

  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }

  return context;
}

export default LayoutContext;
