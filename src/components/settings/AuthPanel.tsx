import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type AuthPanelProps = {
  onAuthChange: () => void;
};

export function AuthPanel({ onAuthChange }: AuthPanelProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    supabase?.auth.getUser().then(({ data }) => setUserEmail(data.user?.email ?? null));
  }, []);

  const submit = async (mode: "signin" | "signup") => {
    if (!supabase) {
      setMessage("Supabase no esta configurado.");
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    const result =
      mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    setIsSubmitting(false);

    if (result.error) {
      setMessage(result.error.message);
      return;
    }

    setUserEmail(result.data.user?.email ?? email);
    setMessage(mode === "signup" ? "Usuario creado. Revisá tu email si Supabase pide confirmacion." : "Sesion iniciada.");
    onAuthChange();
  };

  const signOut = async () => {
    await supabase?.auth.signOut();
    setUserEmail(null);
    setMessage("Sesion cerrada.");
    onAuthChange();
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Sesion de Supabase</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Necesitas una sesion activa para crear, editar o eliminar datos.
        </Typography>
        {message ? (
          <Alert severity={userEmail ? "success" : "info"} variant="outlined" sx={{ mt: 2 }}>
            {message}
          </Alert>
        ) : null}
        {userEmail ? (
          <Box sx={{ mt: 2 }}>
            <Typography fontWeight={800}>{userEmail}</Typography>
            <Button variant="outlined" color="inherit" sx={{ mt: 2 }} onClick={signOut}>
              Cerrar sesion
            </Button>
          </Box>
        ) : (
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField label="Email" value={email} onChange={(event) => setEmail(event.target.value)} fullWidth />
            <TextField
              label="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              fullWidth
            />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <Button disabled={isSubmitting} variant="contained" onClick={() => submit("signin")}>
                Iniciar sesion
              </Button>
              <Button disabled={isSubmitting} variant="outlined" onClick={() => submit("signup")}>
                Crear usuario
              </Button>
            </Stack>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
