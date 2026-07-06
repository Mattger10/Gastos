import { Grid } from "@mui/material";
import { FinancialGoal } from "../../types/finance";
import { GoalCard } from "./GoalCard";

type FinancialGoalsProps = {
  goals: FinancialGoal[];
  onEdit?: (goal: FinancialGoal) => void;
  onDelete?: (goal: FinancialGoal) => void;
};

export function FinancialGoals({ goals, onEdit, onDelete }: FinancialGoalsProps) {
  return (
    <Grid container spacing={2}>
      {goals.map((goal) => (
        <Grid item xs={12} sm={6} md={3} key={goal.id}>
          <GoalCard goal={goal} onEdit={onEdit} onDelete={onDelete} />
        </Grid>
      ))}
    </Grid>
  );
}
