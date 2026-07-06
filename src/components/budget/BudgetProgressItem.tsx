import { Box, LinearProgress, Typography } from "@mui/material";
import { BudgetItem } from "../../types/finance";
import { calculateProgress, formatCurrency } from "../../utils/formatters";

type BudgetProgressItemProps = {
  item: BudgetItem;
};

const getColor = (progress: number) => {
  if (progress > 90) return "error";
  if (progress >= 70) return "warning";
  return "success";
};

export function BudgetProgressItem({ item }: BudgetProgressItemProps) {
  const progress = calculateProgress(item.used, item.limit);
  const color = getColor(progress);

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, mb: 1 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography fontWeight={800} noWrap>
            {item.category}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formatCurrency(item.used)} de {formatCurrency(item.limit)}
          </Typography>
        </Box>
        <Typography fontWeight={800} color={`${color}.main`}>
          {progress}%
        </Typography>
      </Box>
      <LinearProgress variant="determinate" value={progress} color={color} sx={{ height: 8, borderRadius: 999 }} />
    </Box>
  );
}
