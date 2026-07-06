import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { FinancialGoal } from "../../types/finance";

export type GoalFormInput = {
  name: string;
  target: number;
  current: number;
  deadline: string | null;
};

type GoalFormDialogProps = {
  open: boolean;
  goal: FinancialGoal | null;
  onClose: () => void;
  onSubmit: (input: GoalFormInput) => Promise<void>;
};

const defaultForm: GoalFormInput = {
  name: "",
  target: 0,
  current: 0,
  deadline: null,
};

export function GoalFormDialog({ open, goal, onClose, onSubmit }: GoalFormDialogProps) {
  const [form, setForm] = useState<GoalFormInput>(defaultForm);

  useEffect(() => {
    if (goal) {
      setForm({
        name: goal.name,
        target: goal.targetAmount,
        current: goal.currentAmount,
        deadline: goal.estimatedDate,
      });
    } else {
      setForm(defaultForm);
    }
  }, [goal, open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{goal ? "Editar objetivo" : "Nuevo objetivo"}</DialogTitle>
      <DialogContent sx={{ display: "grid", gap: 2, pt: 1 }}>
        <TextField label="Nombre" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        <TextField label="Monto objetivo" type="number" value={form.target} onChange={(event) => setForm({ ...form, target: Number(event.target.value) })} />
        <TextField label="Monto actual" type="number" value={form.current} onChange={(event) => setForm({ ...form, current: Number(event.target.value) })} />
        <TextField
          label="Fecha estimada"
          type="date"
          value={form.deadline ?? ""}
          onChange={(event) => setForm({ ...form, deadline: event.target.value || null })}
          InputLabelProps={{ shrink: true }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={() => onSubmit(form)} disabled={!form.name.trim() || form.target < 0 || form.current < 0}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
