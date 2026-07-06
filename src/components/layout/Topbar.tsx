import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { AppBar, Avatar, Box, Button, IconButton, Toolbar, Tooltip, Typography } from "@mui/material";
import { formatCurrentDate } from "../../utils/formatters";

type TopbarProps = {
  userEmail: string;
  onMenuClick: () => void;
  onSignOut: () => void;
};

export function Topbar({ userEmail, onMenuClick, onSignOut }: TopbarProps) {
  const avatarLetter = userEmail.trim().charAt(0).toUpperCase() || "U";

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
        <Tooltip title={userEmail}>
          <Avatar sx={{ bgcolor: "secondary.main", fontWeight: 800 }}>{avatarLetter}</Avatar>
        </Tooltip>
        <Button
          color="inherit"
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={onSignOut}
          sx={{ display: { xs: "none", sm: "inline-flex" } }}
        >
          Cerrar sesion
        </Button>
        <Tooltip title="Cerrar sesion">
          <IconButton
            aria-label="Cerrar sesion"
            onClick={onSignOut}
            sx={{ display: { xs: "inline-flex", sm: "none" } }}
          >
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
