import { Card, CardContent } from "@mui/material";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { MonthlyFinance } from "../../types/finance";
import { formatCurrency } from "../../utils/formatters";

type MonthlyComparisonChartProps = {
  data: MonthlyFinance[];
};

export function MonthlyComparisonChart({ data }: MonthlyComparisonChartProps) {
  return (
    <Card>
      <CardContent sx={{ height: 330 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#e8edf5" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${Number(value) / 1000}k`} />
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            <Legend />
            <Bar dataKey="income" name="Ingresos" fill="#12a66a" radius={[6, 6, 0, 0]} />
            <Bar dataKey="expense" name="Gastos" fill="#d64545" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
