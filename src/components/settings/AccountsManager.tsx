import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Account } from "../../types/finance";
import { formatCurrency } from "../../utils/formatters";

type AccountInput = {
  name: string;
  kind: Account["kind"];
  initialBalance: number;
  color: string;
};

type AccountsManagerProps = {
  accounts: Account[];
  onCreate: (input: AccountInput) => Promise<void>;
  onUpdate: (id: string, input: AccountInput) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

const defaultForm: AccountInput = {
  name: "",
  kind: "bank",
  initialBalance: 0,
  color: "#1f5eff",
};

export function AccountsManager({ accounts, onCreate, onUpdate, onDelete }: AccountsManagerProps) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Account | null>(null);
  const [form, setForm] = useState<AccountInput>(defaultForm);

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name,
        kind: editing.kind,
        initialBalance: editing.initialBalance,
        color: editing.color,
      });
    } else {
      setForm(defaultForm);
    }
  }, [editing, open]);

  const submit = async () => {
    if (editing) {
      await onUpdate(editing.id, form);
    } else {
      await onCreate(form);
    }
    setOpen(false);
    setEditing(null);
  };

  return (
    <>
      <Card>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, mb: 2 }}>
            <Box>
              <Typography variant="h6">Cuentas</Typography>
              <Typography variant="body2" color="text.secondary">
                Cuentas bancarias, billeteras, efectivo y tarjetas.
              </Typography>
            </Box>
            <Button startIcon={<AddIcon />} variant="contained" onClick={() => setOpen(true)}>
              Nueva
            </Button>
          </Box>
          <Stack spacing={1.5}>
            {accounts.map((account) => (
              <Box
                key={account.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  p: 1.5,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: account.color }} />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography fontWeight={800} noWrap>
                      {account.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {account.kind} · {formatCurrency(account.initialBalance)}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <IconButton onClick={() => { setEditing(account); setOpen(true); }} aria-label="Editar cuenta">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => onDelete(account.id)} aria-label="Eliminar cuenta">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            ))}
            {!accounts.length ? (
              <Typography color="text.secondary">Todavia no hay cuentas cargadas.</Typography>
            ) : null}
          </Stack>
        </CardContent>
      </Card>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? "Editar cuenta" : "Nueva cuenta"}</DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 2, pt: 1 }}>
          <TextField label="Nombre" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          <TextField select label="Tipo" value={form.kind} onChange={(event) => setForm({ ...form, kind: event.target.value as Account["kind"] })}>
            <MenuItem value="bank">Banco</MenuItem>
            <MenuItem value="virtual_wallet">Billetera virtual</MenuItem>
            <MenuItem value="cash">Efectivo</MenuItem>
            <MenuItem value="credit_card">Tarjeta de credito</MenuItem>
          </TextField>
          <TextField
            label="Balance inicial"
            type="number"
            value={form.initialBalance}
            onChange={(event) => setForm({ ...form, initialBalance: Number(event.target.value) })}
          />
          <TextField label="Color" value={form.color} onChange={(event) => setForm({ ...form, color: event.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={submit} disabled={!form.name.trim()}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
