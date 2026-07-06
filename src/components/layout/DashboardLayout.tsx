import { Box, Drawer } from "@mui/material";
import { useState } from "react";
import { DashboardView } from "../../types/navigation";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

const drawerWidth = 280;

type DashboardLayoutProps = {
  children: React.ReactNode;
  selectedView: DashboardView;
  userEmail: string;
  onSignOut: () => void;
  onViewChange: (view: DashboardView) => void;
};

export function DashboardLayout({ children, selectedView, userEmail, onSignOut, onViewChange }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleViewChange = (view: DashboardView) => {
    onViewChange(view);
    setMobileOpen(false);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <Box
        component="nav"
        sx={{
          width: { md: drawerWidth },
          flexShrink: { md: 0 },
        }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}
        >
          <Sidebar selectedView={selectedView} onViewChange={handleViewChange} />
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              borderRight: "1px solid",
              borderColor: "divider",
            },
          }}
        >
          <Sidebar selectedView={selectedView} onViewChange={handleViewChange} />
        </Drawer>
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Topbar userEmail={userEmail} onMenuClick={() => setMobileOpen(true)} onSignOut={onSignOut} />
        <Box component="main" sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1480, mx: "auto" }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
