 
import React, { createContext, useContext, useState, useEffect } from 'react';

interface ViewportContextType {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

const ViewportContext = createContext<ViewportContextType | undefined>(undefined);

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

export const ResponsiveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewport, setViewport] = useState<ViewportContextType>({
    width: window.innerWidth,
    height: window.innerHeight,
    isMobile: window.innerWidth < MOBILE_BREAKPOINT,
    isTablet: window.innerWidth >= MOBILE_BREAKPOINT && window.innerWidth < TABLET_BREAKPOINT,
    isDesktop: window.innerWidth >= TABLET_BREAKPOINT,
  });

  useEffect(() => {
    const handleWindowResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setViewport({
        width,
        height,
        isMobile: width < MOBILE_BREAKPOINT,
        isTablet: width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT,
        isDesktop: width >= TABLET_BREAKPOINT,
      });
    };

    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  return (
    <ViewportContext.Provider value={viewport}>
      {children}
    </ViewportContext.Provider>
  );
}

export const useViewport = () => {
  const context = useContext(ViewportContext);
  if (context === undefined) {
    throw new Error('useViewport must be used within a ResponsiveProvider');
  }
  return context;
}