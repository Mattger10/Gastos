import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Card,
  CardContent,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Loan, LoanStatus } from "../../types/finance";
import { formatCurrency, formatDate } from "../../utils/formatters";

type LoansTableProps = {
  loans: Loan[];
  onEdit: (loan: Loan) => void;
  onDelete: (loan: Loan) => void;
};

const statusConfig: Record<LoanStatus, { label: string; color: "default" | "success" | "warning" | "error" | "info" }> = {
  pending: { label: "Pendiente", color: "warning" },
  partially_paid: { label: "Parcial", color: "info" },
  paid: { label: "Pagado", color: "success" },
  overdue: { label: "Vencido", color: "error" },
};

export function LoansTable({ loans, onEdit, onDelete }: LoansTableProps) {
  return (
    <Card>
      <CardContent sx={{ p: 0 }}>
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 860 }}>
            <TableHead>
              <TableRow>
                <TableCell>Persona</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Vencimiento</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Monto</TableCell>
                <TableCell align="right">Devuelto</TableCell>
                <TableCell align="right">Pendiente</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loans.map((loan) => {
                const pending = Math.max(loan.amount - loan.amountRepaid, 0);
                const config = statusConfig[loan.status];

                return (
                  <TableRow key={loan.id} hover>
                    <TableCell>
                      <Typography fontWeight={800}>{loan.borrowerName}</Typography>
                      {loan.notes ? (
                        <Typography variant="body2" color="text.secondary">
                          {loan.notes}
                        </Typography>
                      ) : null}
                    </TableCell>
                    <TableCell>{formatDate(loan.loanDate)}</TableCell>
                    <TableCell>{loan.dueDate ? formatDate(loan.dueDate) : "-"}</TableCell>
                    <TableCell>
                      <Chip size="small" label={config.label} color={config.color} sx={{ fontWeight: 700 }} />
                    </TableCell>
                    <TableCell align="right">{formatCurrency(loan.amount)}</TableCell>
                    <TableCell align="right">{formatCurrency(loan.amountRepaid)}</TableCell>
                    <TableCell align="right">
                      <Typography fontWeight={800} color={pending > 0 ? "warning.main" : "success.main"}>
                        {formatCurrency(pending)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => onEdit(loan)} aria-label="Editar prestamo">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => onDelete(loan)} aria-label="Eliminar prestamo">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
