import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1f5eff",
      dark: "#1748c7",
    },
    secondary: {
      main: "#12a66a",
    },
    success: {
      main: "#149b62",
    },
    error: {
      main: "#d64545",
    },
    warning: {
      main: "#d99016",
    },
    info: {
      main: "#2077b8",
    },
    background: {
      default: "#f5f7fb",
      paper: "#ffffff",
    },
    text: {
      primary: "#172033",
      secondary: "#667085",
    },
  },
  typography: {
    fontFamily: "'Inter', 'Segoe UI', Roboto, Arial, sans-serif",
    h4: {
      fontWeight: 800,
    },
    h5: {
      fontWeight: 750,
    },
    h6: {
      fontWeight: 700,
    },
    button: {
      fontWeight: 700,
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border: "1px solid #e8edf5",
          boxShadow: "0 8px 24px rgba(20, 28, 45, 0.06)",
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
});
