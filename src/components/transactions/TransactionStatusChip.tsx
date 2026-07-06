import { Chip } from "@mui/material";
import { TransactionStatus } from "../../types/finance";

type TransactionStatusChipProps = {
  status: TransactionStatus;
};

const statusConfig: Record<TransactionStatus, { label: string; color: "success" | "warning" | "error" }> = {
  completed: { label: "Completado", color: "success" },
  pending: { label: "Pendiente", color: "warning" },
  rejected: { label: "Rechazado", color: "error" },
};

export function TransactionStatusChip({ status }: TransactionStatusChipProps) {
  const config = statusConfig[status];

  return <Chip size="small" label={config.label} color={config.color} sx={{ fontWeight: 700 }} />;
}
