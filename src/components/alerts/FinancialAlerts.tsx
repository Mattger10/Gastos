import { Alert, Stack } from "@mui/material";
import { FinancialAlert } from "../../types/finance";

type FinancialAlertsProps = {
  alerts: FinancialAlert[];
};

export function FinancialAlerts({ alerts }: FinancialAlertsProps) {
  return (
    <Stack spacing={1.5}>
      {alerts.map((alert) => (
        <Alert key={alert.id} severity={alert.severity} variant="outlined">
          <strong>{alert.title}:</strong> {alert.message}
        </Alert>
      ))}
    </Stack>
  );
}
