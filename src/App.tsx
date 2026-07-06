import { Alert, Box, LinearProgress } from "@mui/material";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { supabase } from "./lib/supabase";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { DashboardView } from "./types/navigation";

export default function App() {
  const [selectedView, setSelectedView] = useState<DashboardView>("dashboard");
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      setIsAuthLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        setAuthError(error.message);
      }
      setSession(data.session);
      setIsAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthError(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    if (!supabase) return;

    const { error } = await supabase.auth.signOut({ scope: "local" });

    setSession(null);
    setSelectedView("dashboard");

    if (error) {
      setAuthError(error.message);
    }
  };

  if (isAuthLoading) {
    return (
      <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", bgcolor: "background.default", px: 3 }}>
        <LinearProgress sx={{ width: "min(420px, 100%)", borderRadius: 999 }} />
      </Box>
    );
  }

  if (!session) {
    return <LoginPage authError={authError} onAuthError={setAuthError} />;
  }

  return (
    <DashboardLayout
      selectedView={selectedView}
      userEmail={session.user.email ?? "Usuario"}
      onSignOut={handleSignOut}
      onViewChange={setSelectedView}
    >
      {authError ? (
        <Alert severity="warning" variant="outlined" sx={{ mb: 2 }} onClose={() => setAuthError(null)}>
          {authError}
        </Alert>
      ) : null}
      <DashboardPage selectedView={selectedView} />
    </DashboardLayout>
  );
}
