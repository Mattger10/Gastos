import { Card, CardContent, Stack } from "@mui/material";
import { BudgetItem } from "../../types/finance";
import { BudgetProgressItem } from "./BudgetProgressItem";

type BudgetProgressListProps = {
  budgets: BudgetItem[];
};

export function BudgetProgressList({ budgets }: BudgetProgressListProps) {
  return (
    <Card>
      <CardContent>
        <Stack spacing={2.5}>
          {budgets.map((item) => (
            <BudgetProgressItem key={item.id} item={item} />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
