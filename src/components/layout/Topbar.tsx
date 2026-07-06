import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { AppBar, Avatar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import { formatCurrentDate } from "../../utils/formatters";

type TopbarProps = {
  onMenuClick: () => void;
};

export function Topbar({ onMenuClick }: TopbarProps) {
  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{ borderBottom: "1px solid", borderColor: "divider", bgcolor: "background.paper" }}
    >
      <Toolbar sx={{ minHeight: 72, gap: 2 }}>
        <IconButton sx={{ display: { md: "none" } }} onClick={onMenuClick} aria-label="Abrir menu">
          <MenuIcon />
        </IconButton>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h6" noWrap>
            Dashboard Financiero
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textTransform: "capitalize" }}>
            {formatCurrentDate()}
          </Typography>
        </Box>
        <IconButton aria-label="Notificaciones">
          <NotificationsNoneIcon />
        </IconButton>
        <Avatar sx={{ bgcolor: "secondary.main", fontWeight: 800 }}>M</Avatar>
      </Toolbar>
    </AppBar>
  );
}
