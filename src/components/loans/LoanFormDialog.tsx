import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Loan, LoanStatus } from "../../types/finance";

export type LoanFormInput = {
  borrowerName: string;
  amount: number;
  amountRepaid: number;
  loanDate: string;
  dueDate: string | null;
  status: LoanStatus;
  notes: string;
};

type LoanFormDialogProps = {
  open: boolean;
  loan: Loan | null;
  onClose: () => void;
  onSubmit: (input: LoanFormInput) => Promise<void>;
};

const defaultForm: LoanFormInput = {
  borrowerName: "",
  amount: 0,
  amountRepaid: 0,
  loanDate: dayjs().format("YYYY-MM-DD"),
  dueDate: null,
  status: "pending",
  notes: "",
};

export function LoanFormDialog({ open, loan, onClose, onSubmit }: LoanFormDialogProps) {
  const [form, setForm] = useState<LoanFormInput>(defaultForm);

  useEffect(() => {
    if (loan) {
      setForm({
        borrowerName: loan.borrowerName,
        amount: loan.amount,
        amountRepaid: loan.amountRepaid,
        loanDate: loan.loanDate,
        dueDate: loan.dueDate,
        status: loan.status,
        notes: loan.notes,
      });
    } else {
      setForm(defaultForm);
    }
  }, [loan, open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{loan ? "Editar prestamo" : "Nuevo prestamo"}</DialogTitle>
      <DialogContent sx={{ display: "grid", gap: 2, pt: 1 }}>
        <TextField label="Persona" value={form.borrowerName} onChange={(event) => setForm({ ...form, borrowerName: event.target.value })} />
        <TextField label="Monto" type="number" value={form.amount} onChange={(event) => setForm({ ...form, amount: Number(event.target.value) })} />
        <TextField label="Devuelto" type="number" value={form.amountRepaid} onChange={(event) => setForm({ ...form, amountRepaid: Number(event.target.value) })} />
        <TextField
          label="Fecha del prestamo"
          type="date"
          value={form.loanDate}
          onChange={(event) => setForm({ ...form, loanDate: event.target.value })}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Vencimiento"
          type="date"
          value={form.dueDate ?? ""}
          onChange={(event) => setForm({ ...form, dueDate: event.target.value || null })}
          InputLabelProps={{ shrink: true }}
        />
        <TextField select label="Estado" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as LoanStatus })}>
          <MenuItem value="pending">Pendiente</MenuItem>
          <MenuItem value="partially_paid">Parcialmente pagado</MenuItem>
          <MenuItem value="paid">Pagado</MenuItem>
          <MenuItem value="overdue">Vencido</MenuItem>
        </TextField>
        <TextField label="Notas" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} multiline minRows={3} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={() => onSubmit(form)} disabled={!form.borrowerName.trim() || form.amount < 0 || form.amountRepaid < 0 || !form.loanDate}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
