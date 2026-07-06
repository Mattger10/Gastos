import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ExpenseCategory } from "../../types/finance";
import { formatCurrency } from "../../utils/formatters";

type ExpenseCategoryChartProps = {
  data: ExpenseCategory[];
};

export function ExpenseCategoryChart({ data }: ExpenseCategoryChartProps) {
  return (
    <Card>
      <CardContent sx={{ height: 360 }}>
        <ResponsiveContainer width="100%" height="68%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={62} outerRadius={104} paddingAngle={3}>
              {data.map((item) => (
                <Cell key={item.id} fill={item.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
          </PieChart>
        </ResponsiveContainer>
        <Stack spacing={1} sx={{ mt: 1 }}>
          {data.slice(0, 5).map((item) => (
            <Box key={item.id} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: item.color }} />
                <Typography variant="body2" noWrap>
                  {item.name}
                </Typography>
              </Box>
              <Typography variant="body2" fontWeight={700}>
                {formatCurrency(item.value)}
              </Typography>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
