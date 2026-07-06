import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { Box, Card, CardContent, Chip, Typography } from "@mui/material";
import { getVariationLabel } from "../../utils/formatters";

type SummaryCardProps = {
  title: string;
  value: string;
  icon: React.ReactNode;
  variation?: number;
  helperText?: string;
  color?: "primary" | "success" | "error" | "warning" | "info";
};

export function SummaryCard({
  title,
  value,
  icon,
  variation,
  helperText,
  color = "primary",
}: SummaryCardProps) {
  const isPositive = (variation ?? 0) >= 0;

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              bgcolor: `${color}.main`,
              color: "common.white",
              display: "grid",
              placeItems: "center",
            }}
          >
            {icon}
          </Box>
          {variation !== undefined ? (
            <Chip
              size="small"
              color={isPositive ? "success" : "error"}
              icon={isPositive ? <TrendingUpIcon /> : <TrendingDownIcon />}
              label={getVariationLabel(variation)}
              sx={{ fontWeight: 700 }}
            />
          ) : null}
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {title}
        </Typography>
        <Typography variant="h5" sx={{ mt: 0.75 }}>
          {value}
        </Typography>
        {helperText ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
            {helperText}
          </Typography>
        ) : null}
      </CardContent>
    </Card>
  );
}
