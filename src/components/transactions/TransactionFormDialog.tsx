import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Account, Transaction, TransactionType } from "../../types/finance";

export type TransactionFormInput = {
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  accountId: string | null;
  transactionDate: string;
  notes: string;
};

type TransactionFormDialogProps = {
  open: boolean;
  accounts: Account[];
  transaction: Transaction | null;
  onClose: () => void;
  onSubmit: (input: TransactionFormInput) => Promise<void>;
};

const defaultForm: TransactionFormInput = {
  title: "",
  amount: 0,
  type: "expense",
  category: "General",
  accountId: null,
  transactionDate: dayjs().format("YYYY-MM-DD"),
  notes: "",
};

export function TransactionFormDialog({ open, accounts, transaction, onClose, onSubmit }: TransactionFormDialogProps) {
  const [form, setForm] = useState<TransactionFormInput>(defaultForm);

  useEffect(() => {
    if (transaction) {
      setForm({
        title: transaction.description,
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category,
        accountId: transaction.accountId ?? null,
        transactionDate: transaction.date,
        notes: transaction.notes ?? "",
      });
    } else {
      setForm(defaultForm);
    }
  }, [transaction, open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{transaction ? "Editar movimiento" : "Nuevo movimiento"}</DialogTitle>
      <DialogContent sx={{ display: "grid", gap: 2, pt: 1 }}>
        <TextField label="Descripcion" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
        <TextField
          label="Monto"
          type="number"
          value={form.amount}
          onChange={(event) => setForm({ ...form, amount: Number(event.target.value) })}
        />
        <TextField select label="Tipo" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value as TransactionType })}>
          <MenuItem value="expense">Gasto</MenuItem>
          <MenuItem value="income">Ingreso</MenuItem>
          <MenuItem value="saving">Ahorro</MenuItem>
        </TextField>
        <TextField label="Categoria" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} />
        <TextField
          select
          label="Cuenta"
          value={form.accountId ?? ""}
          onChange={(event) => setForm({ ...form, accountId: event.target.value || null })}
        >
          <MenuItem value="">Sin cuenta</MenuItem>
          {accounts.map((account) => (
            <MenuItem key={account.id} value={account.id}>
              {account.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Fecha"
          type="date"
          value={form.transactionDate}
          onChange={(event) => setForm({ ...form, transactionDate: event.target.value })}
          InputLabelProps={{ shrink: true }}
        />
        <TextField label="Notas" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} multiline minRows={3} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          onClick={() => onSubmit(form)}
          disabled={!form.title.trim() || !form.category.trim() || form.amount < 0 || !form.transactionDate}
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
