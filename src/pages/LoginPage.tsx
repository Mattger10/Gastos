import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FormEvent, useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

type LoginPageProps = {
  authError: string | null;
  onAuthError: (message: string | null) => void;
};

export function LoginPage({ authError, onAuthError }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!supabase) {
      onAuthError("Supabase no esta configurado. Revisa VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.");
      return;
    }

    setIsSubmitting(true);
    setMessage(null);
    onAuthError(null);

    const result =
      mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    setIsSubmitting(false);

    if (result.error) {
      onAuthError(result.error.message);
      return;
    }

    setMessage(
      mode === "signup"
        ? "Usuario creado. Si Supabase pide confirmacion, revisa tu email antes de entrar."
        : "Sesion iniciada."
    );
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "minmax(360px, 0.9fr) 1.1fr" },
        bgcolor: "background.default",
      }}
    >
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "space-between",
          p: 5,
          color: "common.white",
          bgcolor: "#172033",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              bgcolor: "primary.main",
            }}
          >
            <AccountBalanceWalletIcon />
          </Box>
          <Box>
            <Typography variant="h6">Finanzas</Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.72)" }}>
              Control personal
            </Typography>
          </Box>
        </Stack>

        <Box sx={{ maxWidth: 520 }}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Tus gastos, ingresos y objetivos en un solo lugar.
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.72)", fontSize: 18 }}>
            Inicia sesion para cargar movimientos, revisar prestamos y mantener tu tablero sincronizado.
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "grid", placeItems: "center", p: { xs: 2, sm: 4 } }}>
        <Paper
          component="form"
          onSubmit={submit}
          sx={{
            width: "min(460px, 100%)",
            p: { xs: 2.5, sm: 4 },
            border: "1px solid",
            borderColor: "divider",
          }}
          elevation={0}
        >
          <Stack spacing={2.25}>
            <Box>
              <Typography variant="h5">{mode === "signin" ? "Iniciar sesion" : "Crear usuario"}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Accede con tu cuenta de Supabase para ver y editar tus datos.
              </Typography>
            </Box>

            {!isSupabaseConfigured ? (
              <Alert severity="warning" variant="outlined">
                Falta configurar Supabase en el archivo .env.
              </Alert>
            ) : null}

            {authError ? (
              <Alert severity="error" variant="outlined" onClose={() => onAuthError(null)}>
                {authError}
              </Alert>
            ) : null}

            {message ? (
              <Alert severity="success" variant="outlined" onClose={() => setMessage(null)}>
                {message}
              </Alert>
            ) : null}

            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              fullWidth
              required
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              fullWidth
              required
            />

            <Button
              type="submit"
              disabled={isSubmitting || !isSupabaseConfigured}
              variant="contained"
              size="large"
              startIcon={mode === "signin" ? <LoginIcon /> : <PersonAddAltIcon />}
            >
              {mode === "signin" ? "Entrar" : "Crear cuenta"}
            </Button>

            <Button
              type="button"
              color="inherit"
              onClick={() => {
                setMode((currentMode) => (currentMode === "signin" ? "signup" : "signin"));
                setMessage(null);
                onAuthError(null);
              }}
            >
              {mode === "signin" ? "Crear usuario nuevo" : "Ya tengo usuario"}
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
}
