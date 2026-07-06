import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Card, CardContent, IconButton, LinearProgress, Typography } from "@mui/material";
import { FinancialGoal } from "../../types/finance";
import { calculateProgress, formatCurrency, formatDate } from "../../utils/formatters";

type GoalCardProps = {
  goal: FinancialGoal;
  onEdit?: (goal: FinancialGoal) => void;
  onDelete?: (goal: FinancialGoal) => void;
};

export function GoalCard({ goal, onEdit, onDelete }: GoalCardProps) {
  const progress = calculateProgress(goal.currentAmount, goal.targetAmount);

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
          <Typography fontWeight={800}>{goal.name}</Typography>
          <Box>
            {onEdit ? (
              <IconButton size="small" onClick={() => onEdit(goal)} aria-label="Editar objetivo">
                <EditIcon fontSize="small" />
              </IconButton>
            ) : null}
            {onDelete ? (
              <IconButton size="small" onClick={() => onDelete(goal)} aria-label="Eliminar objetivo">
                <DeleteIcon fontSize="small" />
              </IconButton>
            ) : null}
          </Box>
        </Box>
        <Typography variant="h6" sx={{ mt: 1 }}>
          {formatCurrency(goal.currentAmount)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Meta: {formatCurrency(goal.targetAmount)}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 2, mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Progreso
          </Typography>
          <Typography fontWeight={800}>{progress}%</Typography>
        </Box>
        <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 999 }} />
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mt: 2, color: "text.secondary" }}>
          <CalendarMonthIcon fontSize="small" />
          <Typography variant="body2">{formatDate(goal.estimatedDate)}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
