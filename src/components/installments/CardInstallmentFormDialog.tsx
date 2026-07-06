import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  TextField,
} from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Account, CardInstallment } from "../../types/finance";

export type CardInstallmentFormInput = {
  accountId: string | null;
  cardName: string;
  merchant: string;
  totalAmount: number;
  installments: number;
  paidInstallments: number;
  nextDue: string | null;
  notes: string;
  automaticDebit: boolean;
};

type CardInstallmentFormDialogProps = {
  open: boolean;
  accounts: Account[];
  installment: CardInstallment | null;
  onClose: () => void;
  onSubmit: (input: CardInstallmentFormInput) => Promise<void>;
};

const defaultForm: CardInstallmentFormInput = {
  accountId: null,
  cardName: "",
  merchant: "",
  totalAmount: 0,
  installments: 1,
  paidInstallments: 0,
  nextDue: dayjs().format("YYYY-MM-DD"),
  notes: "",
  automaticDebit: false,
};

export function CardInstallmentFormDialog({
  open,
  accounts,
  installment,
  onClose,
  onSubmit,
}: CardInstallmentFormDialogProps) {
  const [form, setForm] = useState<CardInstallmentFormInput>(defaultForm);
  const creditCardAccounts = accounts.filter((account) => account.kind === "credit_card");

  useEffect(() => {
    if (installment) {
      setForm({
        accountId: installment.accountId,
        cardName: installment.cardName,
        merchant: installment.merchant,
        totalAmount: installment.totalAmount,
        installments: installment.installments,
        paidInstallments: installment.paidInstallments,
        nextDue: installment.nextDue,
        notes: installment.notes,
        automaticDebit: installment.automaticDebit,
      });
    } else {
      setForm({
        ...defaultForm,
        accountId: creditCardAccounts[0]?.id ?? null,
        cardName: creditCardAccounts[0]?.name ?? "",
      });
    }
  }, [installment, open, accounts]);

  const updateAccount = (accountId: string) => {
    const account = accounts.find((item) => item.id === accountId);
    setForm({ ...form, accountId: accountId || null, cardName: account?.name || form.cardName });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{installment ? "Editar compra en cuotas" : "Nueva compra en cuotas"}</DialogTitle>
      <DialogContent sx={{ display: "grid", gap: 2, pt: 1 }}>
        <TextField
          select
          label="Cuenta de tarjeta"
          value={form.accountId ?? ""}
          onChange={(event) => updateAccount(event.target.value)}
        >
          <MenuItem value="">Sin cuenta vinculada</MenuItem>
          {creditCardAccounts.map((account) => (
            <MenuItem key={account.id} value={account.id}>
              {account.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField label="Tarjeta" value={form.cardName} onChange={(event) => setForm({ ...form, cardName: event.target.value })} />
        <TextField label="Comercio" value={form.merchant} onChange={(event) => setForm({ ...form, merchant: event.target.value })} />
        <TextField
          label="Monto total"
          type="number"
          value={form.totalAmount}
          onChange={(event) => setForm({ ...form, totalAmount: Number(event.target.value) })}
        />
        <TextField
          label="Cantidad de cuotas"
          type="number"
          value={form.installments}
          onChange={(event) => setForm({ ...form, installments: Number(event.target.value) })}
        />
        <TextField
          label="Cuotas pagadas"
          type="number"
          value={form.paidInstallments}
          onChange={(event) => setForm({ ...form, paidInstallments: Number(event.target.value) })}
        />
        <TextField
          label="Proximo vencimiento"
          type="date"
          value={form.nextDue ?? ""}
          onChange={(event) => setForm({ ...form, nextDue: event.target.value || null })}
          InputLabelProps={{ shrink: true }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={form.automaticDebit}
              onChange={(event) => setForm({ ...form, automaticDebit: event.target.checked })}
            />
          }
          label="Debito automatico"
        />
        <TextField label="Notas" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} multiline minRows={3} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          onClick={() => onSubmit(form)}
          disabled={
            !form.cardName.trim() ||
            !form.merchant.trim() ||
            form.totalAmount < 0 ||
            form.installments < 0 ||
            form.paidInstallments < 0 ||
            form.paidInstallments > form.installments
          }
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
