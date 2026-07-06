import { useState } from "react";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { DashboardView } from "./types/navigation";

export default function App() {
  const [selectedView, setSelectedView] = useState<DashboardView>("dashboard");

  return (
    <DashboardLayout selectedView={selectedView} onViewChange={setSelectedView}>
      <DashboardPage selectedView={selectedView} />
    </DashboardLayout>
  );
}
