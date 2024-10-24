import { useViewport } from "../Context/ResponsiveContext";
import { useLocation } from "react-router-dom";

export const useDashboardLayout = () => {
  const { isMobile } = useViewport();
  const location = useLocation();

  const showRightSidebar =
    !isMobile && location.pathname !== "/dashboard/settings";

  return {
    isMobile,
    showRightSidebar,
  };
};
