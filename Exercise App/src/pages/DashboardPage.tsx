import { useViewport } from '../Context/ResponsiveContext';

const DashboardPage: React.FC = () => {
  const { isMobile, isTablet, isDesktop } = useViewport();

  if (isMobile) {
    return <MobileDashboard />;
  } else if (isTablet) {
    return <TabletDashboard />;
  } else {
    return <DesktopDashboard />;
  }
};