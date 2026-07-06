import {
  Card,
  CardContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Transaction, TransactionType } from "../../types/finance";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { TransactionStatusChip } from "./TransactionStatusChip";

type TransactionsTableProps = {
  transactions: Transaction[];
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
};

const typeLabel: Record<TransactionType, string> = {
  income: "Ingreso",
  expense: "Gasto",
  saving: "Ahorro",
};

const typeColor: Record<TransactionType, "success.main" | "error.main" | "info.main"> = {
  income: "success.main",
  expense: "error.main",
  saving: "info.main",
};

const typeSign: Record<TransactionType, "+" | "-"> = {
  income: "+",
  expense: "-",
  saving: "+",
};

export function TransactionsTable({ transactions, onEdit, onDelete }: TransactionsTableProps) {
  return (
    <Card>
      <CardContent sx={{ p: 0 }}>
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 760 }}>
            <TableHead>
              <TableRow>
                <TableCell>Fecha</TableCell>
                <TableCell>Descripcion</TableCell>
                <TableCell>Categoria</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Monto</TableCell>
                {(onEdit || onDelete) ? <TableCell align="right">Acciones</TableCell> : null}
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id} hover>
                  <TableCell>{formatDate(transaction.date)}</TableCell>
                  <TableCell>
                    <Typography fontWeight={700}>{transaction.description}</Typography>
                  </TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>{typeLabel[transaction.type]}</TableCell>
                  <TableCell>
                    <TransactionStatusChip status={transaction.status} />
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      fontWeight={800}
                      color={typeColor[transaction.type]}
                    >
                      {typeSign[transaction.type]}
                      {formatCurrency(transaction.amount)}
                    </Typography>
                  </TableCell>
                  {(onEdit || onDelete) ? (
                    <TableCell align="right">
                      {onEdit ? (
                        <IconButton onClick={() => onEdit(transaction)} aria-label="Editar movimiento">
                          <EditIcon />
                        </IconButton>
                      ) : null}
                      {onDelete ? (
                        <IconButton onClick={() => onDelete(transaction)} aria-label="Eliminar movimiento">
                          <DeleteIcon />
                        </IconButton>
                      ) : null}
                    </TableCell>
                  ) : null}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
