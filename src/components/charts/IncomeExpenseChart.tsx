import { Card, CardContent } from "@mui/material";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MonthlyFinance } from "../../types/finance";
import { formatCurrency } from "../../utils/formatters";

type IncomeExpenseChartProps = {
  data: MonthlyFinance[];
};

export function IncomeExpenseChart({ data }: IncomeExpenseChartProps) {
  return (
    <Card>
      <CardContent sx={{ height: 360 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#12a66a" stopOpacity={0.28} />
                <stop offset="95%" stopColor="#12a66a" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d64545" stopOpacity={0.24} />
                <stop offset="95%" stopColor="#d64545" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#e8edf5" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${Number(value) / 1000}k`} />
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            <Legend />
            <Area type="monotone" dataKey="income" name="Ingresos" stroke="#12a66a" fill="url(#income)" strokeWidth={3} />
            <Area type="monotone" dataKey="expense" name="Gastos" stroke="#d64545" fill="url(#expense)" strokeWidth={3} />
            <Area type="monotone" dataKey="saving" name="Ahorro" stroke="#1f5eff" fill="#1f5eff" fillOpacity={0.06} strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
