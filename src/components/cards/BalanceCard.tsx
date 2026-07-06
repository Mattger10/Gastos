import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Card, CardContent, Divider, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { formatCurrency, getVariationLabel } from "../../utils/formatters";

type BalanceCardProps = {
  balance: number;
  income: number;
  expense: number;
  saving: number;
  variation: number;
  onEdit?: () => void;
};

export function BalanceCard({ balance, income, expense, saving, variation, onEdit }: BalanceCardProps) {
  return (
    <Card
      sx={{
        height: "100%",
        color: "common.white",
        bgcolor: "primary.main",
        border: 0,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
          <Box>
            <Typography sx={{ opacity: 0.82 }}>Balance actual</Typography>
            <Typography variant="h4" sx={{ mt: 1 }}>
              {formatCurrency(balance)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {onEdit ? (
              <Tooltip title="Editar balance actual">
                <IconButton
                  onClick={onEdit}
                  aria-label="Editar balance actual"
                  sx={{ color: "common.white", bgcolor: "rgba(255,255,255,0.14)" }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
            ) : null}
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: 2,
                bgcolor: "rgba(255,255,255,0.18)",
                display: "grid",
                placeItems: "center",
              }}
            >
              <AccountBalanceIcon />
            </Box>
          </Box>
        </Box>
        <Typography sx={{ mt: 1.5, opacity: 0.88 }}>
          {getVariationLabel(variation)} respecto del mes anterior
        </Typography>
        <Divider sx={{ my: 2.5, borderColor: "rgba(255,255,255,0.24)" }} />
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          {[
            ["Ingresos", income],
            ["Gastos", expense],
            ["Ahorro", saving],
          ].map(([label, value]) => (
            <Box key={label} sx={{ flex: 1 }}>
              <Typography variant="caption" sx={{ opacity: 0.75 }}>
                {label}
              </Typography>
              <Typography fontWeight={800}>{formatCurrency(Number(value))}</Typography>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
