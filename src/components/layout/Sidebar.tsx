import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AssessmentIcon from "@mui/icons-material/Assessment";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FlagIcon from "@mui/icons-material/Flag";
import HandshakeIcon from "@mui/icons-material/Handshake";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import SavingsIcon from "@mui/icons-material/Savings";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { DashboardView } from "../../types/navigation";

const navItems = [
  { label: "Dashboard", value: "dashboard", icon: <DashboardIcon /> },
  { label: "Movimientos", value: "transactions", icon: <ReceiptLongIcon /> },
  { label: "Presupuestos", value: "budgets", icon: <SavingsIcon /> },
  { label: "Objetivos", value: "goals", icon: <FlagIcon /> },
  { label: "Prestamos", value: "loans", icon: <HandshakeIcon /> },
  { label: "Reportes", value: "reports", icon: <AssessmentIcon /> },
  { label: "Configuracion", value: "settings", icon: <SettingsIcon /> },
] satisfies Array<{ label: string; value: DashboardView; icon: React.ReactNode }>;

type SidebarProps = {
  selectedView: DashboardView;
  onViewChange: (view: DashboardView) => void;
};

export function Sidebar({ selectedView, onViewChange }: SidebarProps) {
  return (
    <Box sx={{ height: "100%", px: 2, py: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 1, mb: 3 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            bgcolor: "primary.main",
            color: "common.white",
            display: "grid",
            placeItems: "center",
          }}
        >
          <AccountBalanceWalletIcon />
        </Box>
        <Box>
          <Typography fontWeight={800}>Finanzas</Typography>
          <Typography variant="caption" color="text.secondary">
            Control personal
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <List sx={{ display: "grid", gap: 0.75 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.label}
            selected={selectedView === item.value}
            onClick={() => onViewChange(item.value)}
            sx={{
              borderRadius: 2,
              minHeight: 48,
              "&.Mui-selected": {
                bgcolor: "primary.main",
                color: "common.white",
                "& .MuiListItemIcon-root": { color: "common.white" },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: "text.secondary" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 700 }} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
