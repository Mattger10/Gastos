import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { CardInstallment } from "../../types/finance";
import { formatCurrency, formatDate } from "../../utils/formatters";

type CardInstallmentsTableProps = {
  installments: CardInstallment[];
  onMarkPaid: (installment: CardInstallment) => void;
  onEdit: (installment: CardInstallment) => void;
  onDelete: (installment: CardInstallment) => void;
};

export function CardInstallmentsTable({ installments, onMarkPaid, onEdit, onDelete }: CardInstallmentsTableProps) {
  return (
    <Card>
      <CardContent sx={{ p: 0 }}>
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 1080 }}>
            <TableHead>
              <TableRow>
                <TableCell>Comercio</TableCell>
                <TableCell>Tarjeta</TableCell>
                <TableCell>Progreso</TableCell>
                <TableCell>Proximo vencimiento</TableCell>
                <TableCell>Debito</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell align="right">Cuota</TableCell>
                <TableCell align="right">Pendiente</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {installments.map((installment) => {
                const installmentValue = installment.installments
                  ? installment.totalAmount / installment.installments
                  : 0;
                const pendingInstallments = Math.max(installment.installments - installment.paidInstallments, 0);
                const pendingAmount = pendingInstallments * installmentValue;
                const progress = installment.installments
                  ? Math.min((installment.paidInstallments / installment.installments) * 100, 100)
                  : 0;

                return (
                  <TableRow key={installment.id} hover>
                    <TableCell>
                      <Typography fontWeight={800}>{installment.merchant}</Typography>
                      {installment.notes ? (
                        <Typography variant="body2" color="text.secondary">
                          {installment.notes}
                        </Typography>
                      ) : null}
                    </TableCell>
                    <TableCell>{installment.cardName}</TableCell>
                    <TableCell sx={{ minWidth: 170 }}>
                      <Typography variant="body2" fontWeight={700}>
                        {installment.paidInstallments}/{installment.installments}
                      </Typography>
                      <LinearProgress variant="determinate" value={progress} sx={{ mt: 0.75, borderRadius: 999 }} />
                    </TableCell>
                    <TableCell>{installment.nextDue ? formatDate(installment.nextDue) : "-"}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={installment.automaticDebit ? "Automatico" : "Manual"}
                        color={installment.automaticDebit ? "success" : "default"}
                        sx={{ fontWeight: 700 }}
                      />
                    </TableCell>
                    <TableCell align="right">{formatCurrency(installment.totalAmount)}</TableCell>
                    <TableCell align="right">{formatCurrency(installmentValue)}</TableCell>
                    <TableCell align="right">
                      <Typography fontWeight={800} color={pendingAmount > 0 ? "warning.main" : "success.main"}>
                        {formatCurrency(pendingAmount)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<CheckCircleIcon />}
                        disabled={pendingInstallments <= 0}
                        onClick={() => onMarkPaid(installment)}
                        sx={{ mr: 1, whiteSpace: "nowrap" }}
                      >
                        Pagado este mes
                      </Button>
                      <IconButton onClick={() => onEdit(installment)} aria-label="Editar cuota">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => onDelete(installment)} aria-label="Eliminar cuota">
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
