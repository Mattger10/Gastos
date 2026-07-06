import AddIcon from "@mui/icons-material/Add";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import FlagIcon from "@mui/icons-material/Flag";
import HandshakeIcon from "@mui/icons-material/Handshake";
import PaidIcon from "@mui/icons-material/Paid";
import PieChartIcon from "@mui/icons-material/PieChart";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import SavingsIcon from "@mui/icons-material/Savings";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  LinearProgress,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";
import { FinancialAlerts } from "../components/alerts/FinancialAlerts";
import { BudgetProgressList } from "../components/budget/BudgetProgressList";
import { BalanceCard } from "../components/cards/BalanceCard";
import { SummaryCard } from "../components/cards/SummaryCard";
import { ExpenseCategoryChart } from "../components/charts/ExpenseCategoryChart";
import { IncomeExpenseChart } from "../components/charts/IncomeExpenseChart";
import { MonthlyComparisonChart } from "../components/charts/MonthlyComparisonChart";
import { EmptyState } from "../components/common/EmptyState";
import { SectionHeader } from "../components/common/SectionHeader";
import { FinancialGoals } from "../components/goals/FinancialGoals";
import { GoalFormDialog, GoalFormInput } from "../components/goals/GoalFormDialog";
import { LoanFormDialog, LoanFormInput } from "../components/loans/LoanFormDialog";
import { LoansTable } from "../components/loans/LoansTable";
import { AccountsManager } from "../components/settings/AccountsManager";
import { AuthPanel } from "../components/settings/AuthPanel";
import { TransactionFormDialog, TransactionFormInput } from "../components/transactions/TransactionFormDialog";
import { TransactionsTable } from "../components/transactions/TransactionsTable";
import { useDashboardData } from "../hooks/useDashboardData";
import {
  Account,
  DashboardMetric,
  DashboardMetricGroup,
  FinancialGoal,
  Loan,
  SummaryMetric,
  Transaction,
} from "../types/finance";
import { DashboardView } from "../types/navigation";
import {
  AccountInput,
  createAccount,
  createLoan,
  createSavingsGoal,
  createTransaction,
  deleteAccount,
  deleteLoan,
  deleteSavingsGoal,
  deleteTransaction,
  LoanInput,
  setManualBalance,
  updateAccount,
  updateLoan,
  updateSavingsGoal,
  updateTransaction,
} from "../services/dashboardService";
import { formatCurrency, formatPercent } from "../utils/formatters";

const iconByMetric: Record<SummaryMetric["type"], React.ReactNode> = {
  balance: <AccountBalanceWalletIcon />,
  income: <PaidIcon />,
  expense: <ShoppingCartIcon />,
  saving: <SavingsIcon />,
};

const colorByMetric: Record<SummaryMetric["type"], "primary" | "success" | "error" | "warning" | "info"> = {
  balance: "primary",
  income: "success",
  expense: "error",
  saving: "info",
};

const metricGroupByView: Record<DashboardView, DashboardMetricGroup> = {
  dashboard: "dashboard",
  transactions: "transactions",
  budgets: "budgets",
  goals: "goals",
  loans: "loans",
  reports: "reports",
  settings: "settings",
};

const metricIconByGroup: Record<DashboardMetricGroup, React.ReactNode> = {
  dashboard: <AccountBalanceWalletIcon />,
  transactions: <ReceiptLongIcon />,
  budgets: <PieChartIcon />,
  goals: <FlagIcon />,
  loans: <HandshakeIcon />,
  reports: <AssessmentIcon />,
  settings: <CreditCardIcon />,
};

type DashboardPageProps = {
  selectedView: DashboardView;
};

const viewTitle: Record<DashboardView, { title: string; subtitle: string }> = {
  dashboard: {
    title: "Resumen financiero",
    subtitle: "Vista general de ingresos, gastos, presupuestos y objetivos.",
  },
  transactions: {
    title: "Movimientos",
    subtitle: "Transacciones sincronizadas desde Supabase.",
  },
  budgets: {
    title: "Presupuestos",
    subtitle: "Seguimiento de presupuestos por categoria.",
  },
  goals: {
    title: "Objetivos",
    subtitle: "Metas de ahorro cargadas en Supabase.",
  },
  loans: {
    title: "Prestamos",
    subtitle: "Dinero prestado, devoluciones y vencimientos.",
  },
  reports: {
    title: "Reportes",
    subtitle: "Analisis mensual de ingresos, gastos y categorias.",
  },
  settings: {
    title: "Configuracion",
    subtitle: "Preferencias y estado de conexion.",
  },
};

export function DashboardPage({ selectedView }: DashboardPageProps) {
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format("YYYY-MM"));
  const { data, isLoading, error, reload } = useDashboardData(selectedMonth);
  const currentView = viewTitle[selectedView];
  const [actionError, setActionError] = useState<string | null>(null);
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<FinancialGoal | null>(null);
  const [loanDialogOpen, setLoanDialogOpen] = useState(false);
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);
  const [balanceDialogOpen, setBalanceDialogOpen] = useState(false);
  const [manualBalance, setManualBalanceValue] = useState("");
  const monthFilter = (
    <Stack direction="row" spacing={1} alignItems="center">
      <Tooltip title="Mes anterior">
        <IconButton
          aria-label="Mes anterior"
          onClick={() => setSelectedMonth((month) => dayjs(month).subtract(1, "month").format("YYYY-MM"))}
        >
          <ChevronLeftIcon />
        </IconButton>
      </Tooltip>
      <TextField
        label="Mes"
        type="month"
        size="small"
        value={selectedMonth}
        onChange={(event) => setSelectedMonth(event.target.value)}
        InputLabelProps={{ shrink: true }}
        sx={{ minWidth: 180 }}
      />
      <Tooltip title="Mes siguiente">
        <IconButton
          aria-label="Mes siguiente"
          onClick={() => setSelectedMonth((month) => dayjs(month).add(1, "month").format("YYYY-MM"))}
        >
          <ChevronRightIcon />
        </IconButton>
      </Tooltip>
    </Stack>
  );

  if (isLoading || !data) {
    return (
      <>
        <SectionHeader
          title={currentView.title}
          subtitle="Cargando informacion financiera."
          action={monthFilter}
        />
        <LinearProgress sx={{ borderRadius: 999 }} />
      </>
    );
  }

  const {
    accounts,
    metrics,
    summaryMetrics,
    monthlyFinance,
    expenseCategories,
    transactions,
    budgets,
    financialGoals,
    loans,
    financialAlerts,
    source,
    message,
  } = data;
  const balance = summaryMetrics.find((metric) => metric.type === "balance")!;
  const income = summaryMetrics.find((metric) => metric.type === "income")!;
  const expense = summaryMetrics.find((metric) => metric.type === "expense")!;
  const saving = summaryMetrics.find((metric) => metric.type === "saving")!;
  const hasMonthlyData = monthlyFinance.some((item) => item.income || item.expense || item.saving);
  const currentMetricGroup = metricGroupByView[selectedView];

  const formatMetricValue = (metric: DashboardMetric) => {
    if (metric.format === "currency") return formatCurrency(metric.value);
    if (metric.format === "percent") return formatPercent(metric.value);
    return new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 }).format(metric.value);
  };

  const runAction = async (action: () => Promise<void>) => {
    try {
      setActionError(null);
      await action();
      await reload();
    } catch (actionError: unknown) {
      setActionError(actionError instanceof Error ? actionError.message : "No se pudo completar la accion.");
    }
  };

  const handleTransactionSubmit = async (input: TransactionFormInput) => {
    await runAction(async () => {
      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, input);
      } else {
        await createTransaction(input);
      }
      setTransactionDialogOpen(false);
      setEditingTransaction(null);
    });
  };

  const handleGoalSubmit = async (input: GoalFormInput) => {
    await runAction(async () => {
      if (editingGoal) {
        await updateSavingsGoal(editingGoal.id, input);
      } else {
        await createSavingsGoal(input);
      }
      setGoalDialogOpen(false);
      setEditingGoal(null);
    });
  };

  const handleLoanSubmit = async (input: LoanFormInput) => {
    await runAction(async () => {
      const payload: LoanInput = input;
      if (editingLoan) {
        await updateLoan(editingLoan.id, payload);
      } else {
        await createLoan(payload);
      }
      setLoanDialogOpen(false);
      setEditingLoan(null);
    });
  };

  const handleAccountCreate = (input: AccountInput) => runAction(() => createAccount(input));
  const handleAccountUpdate = (id: string, input: AccountInput) => runAction(() => updateAccount(id, input));
  const handleAccountDelete = (id: string) =>
    runAction(async () => {
      if (window.confirm("Eliminar esta cuenta? Las transacciones vinculadas podrian impedir el borrado.")) {
        await deleteAccount(id);
      }
    });

  const openNewTransaction = () => {
    setEditingTransaction(null);
    setTransactionDialogOpen(true);
  };

  const openNewGoal = () => {
    setEditingGoal(null);
    setGoalDialogOpen(true);
  };

  const openNewLoan = () => {
    setEditingLoan(null);
    setLoanDialogOpen(true);
  };

  const openBalanceDialog = () => {
    setManualBalanceValue(String(balance.value));
    setBalanceDialogOpen(true);
  };

  const handleManualBalanceSubmit = async () => {
    await runAction(async () => {
      await setManualBalance(Number(manualBalance));
      setBalanceDialogOpen(false);
    });
  };

  const renderSummaryCards = () => (
    <>
      <Grid item xs={12} lg={4}>
        <BalanceCard
          balance={balance.value}
          income={income.value}
          expense={expense.value}
          saving={saving.value}
          variation={balance.variation}
          onEdit={openBalanceDialog}
        />
      </Grid>
      <Grid item xs={12} lg={8}>
        <Grid container spacing={2.5} sx={{ height: "100%" }}>
          {summaryMetrics
            .filter((metric) => metric.type !== "balance")
            .map((metric) => (
              <Grid item xs={12} sm={4} key={metric.id}>
                <SummaryCard
                  title={metric.title}
                  value={formatCurrency(metric.value)}
                  icon={iconByMetric[metric.type]}
                  variation={metric.variation}
                  helperText={metric.helperText}
                  color={colorByMetric[metric.type]}
                />
              </Grid>
            ))}
        </Grid>
      </Grid>
    </>
  );

  const renderMetricCards = () => {
    const currentMetrics = metrics[currentMetricGroup];

    if (!currentMetrics.length) return null;

    return currentMetrics.map((metric) => (
      <Grid item xs={12} sm={6} lg={3} key={metric.id}>
        <SummaryCard
          title={metric.title}
          value={formatMetricValue(metric)}
          icon={metricIconByGroup[currentMetricGroup]}
          helperText={metric.helperText}
          color={metric.color ?? "primary"}
        />
      </Grid>
    ));
  };

  const renderTransactions = () =>
    transactions.length ? (
      <TransactionsTable
        transactions={selectedView === "dashboard" ? transactions.slice(0, 8) : transactions}
        onEdit={(transaction) => {
          setEditingTransaction(transaction);
          setTransactionDialogOpen(true);
        }}
        onDelete={(transaction) =>
          runAction(async () => {
            if (window.confirm("Eliminar este movimiento?")) {
              await deleteTransaction(transaction.id);
            }
          })
        }
      />
    ) : (
      <EmptyState title="No hay movimientos" description="Cuando cargues transacciones en Supabase van a aparecer aca." />
    );

  const renderBudgets = () =>
    budgets.length ? (
      <BudgetProgressList budgets={budgets} />
    ) : (
      <EmptyState
        title="No hay presupuestos"
        description="Tu esquema actual no incluye una tabla de presupuestos. No se muestran presupuestos inventados."
      />
    );

  const renderGoals = () =>
    financialGoals.length ? (
      <FinancialGoals
        goals={financialGoals}
        onEdit={(goal) => {
          setEditingGoal(goal);
          setGoalDialogOpen(true);
        }}
        onDelete={(goal) =>
          runAction(async () => {
            if (window.confirm("Eliminar este objetivo?")) {
              await deleteSavingsGoal(goal.id);
            }
          })
        }
      />
    ) : (
      <EmptyState title="No hay objetivos" description="Crea registros en savings_goals para ver tus metas aca." />
    );

  const renderLoans = () =>
    loans.length ? (
      <LoansTable
        loans={loans}
        onEdit={(loan) => {
          setEditingLoan(loan);
          setLoanDialogOpen(true);
        }}
        onDelete={(loan) =>
          runAction(async () => {
            if (window.confirm("Eliminar este prestamo?")) {
              await deleteLoan(loan.id);
            }
          })
        }
      />
    ) : (
      <EmptyState title="No hay prestamos" description="Carga prestamos para seguir saldos pendientes, devoluciones y vencimientos." />
    );

  const renderAlerts = () =>
    financialAlerts.length ? (
      <FinancialAlerts alerts={financialAlerts} />
    ) : (
      <EmptyState title="Sin alertas" description="No hay vencimientos, prestamos vencidos ni objetivos cerca de completarse." />
    );

  return (
    <>
      <SectionHeader
        title={currentView.title}
        subtitle={
          source === "supabase"
            ? `${currentView.subtitle} Filtro: ${dayjs(selectedMonth).format("MMMM YYYY")}.`
            : "Conecta una sesion de Supabase para ver tus datos."
        }
        action={monthFilter}
      />
      {error || message ? (
        <Alert severity={error ? "error" : "info"} variant="outlined" sx={{ mb: 2 }}>
          {error ?? message}
        </Alert>
      ) : null}
      {actionError ? (
        <Alert severity="error" variant="outlined" sx={{ mb: 2 }} onClose={() => setActionError(null)}>
          {actionError}
        </Alert>
      ) : null}

      <Grid container spacing={2.5}>
        {renderMetricCards()}

        {selectedView === "dashboard" ? renderSummaryCards() : null}

        {selectedView === "dashboard" || selectedView === "reports" ? (
          <>
            <Grid item xs={12} lg={8}>
              <SectionHeader title="Evolucion de ingresos y gastos" />
              {hasMonthlyData ? (
                <IncomeExpenseChart data={monthlyFinance} />
              ) : (
                <EmptyState title="Sin datos mensuales" description="Cargá ingresos o gastos para ver la evolucion." />
              )}
            </Grid>
            <Grid item xs={12} lg={4}>
              <SectionHeader title="Gastos por categoria" />
              {expenseCategories.length ? (
                <ExpenseCategoryChart data={expenseCategories} />
              ) : (
                <EmptyState title="Sin categorias" description="No hay gastos categorizados este mes." />
              )}
            </Grid>
          </>
        ) : null}

        {selectedView === "dashboard" || selectedView === "transactions" ? (
          <Grid item xs={12} lg={selectedView === "dashboard" ? 8 : 12}>
            <SectionHeader
              title="Ultimos movimientos"
              action={
                <Button startIcon={<AddIcon />} variant="contained" onClick={openNewTransaction}>
                  Nuevo
                </Button>
              }
            />
            {renderTransactions()}
          </Grid>
        ) : null}
        {selectedView === "dashboard" || selectedView === "budgets" ? (
          <Grid item xs={12} lg={selectedView === "dashboard" ? 4 : 12}>
            <SectionHeader title="Presupuesto mensual" />
            {renderBudgets()}
          </Grid>
        ) : null}

        {selectedView === "dashboard" || selectedView === "goals" ? (
          <Grid item xs={12}>
            <SectionHeader
              title="Objetivos financieros"
              subtitle="Seguimiento del progreso hacia tus metas."
              action={
                <Button startIcon={<AddIcon />} variant="contained" onClick={openNewGoal}>
                  Nuevo
                </Button>
              }
            />
            {renderGoals()}
          </Grid>
        ) : null}

        {selectedView === "loans" ? (
          <Grid item xs={12}>
            <SectionHeader
              title="Prestamos"
              subtitle="Seguimiento de personas, saldos devueltos y pendientes."
              action={
                <Button startIcon={<AddIcon />} variant="contained" onClick={openNewLoan}>
                  Nuevo
                </Button>
              }
            />
            {renderLoans()}
          </Grid>
        ) : null}

        {selectedView === "dashboard" ? (
          <Grid item xs={12} lg={5}>
            <SectionHeader title="Alertas y recomendaciones" />
            {renderAlerts()}
          </Grid>
        ) : null}
        {selectedView === "dashboard" || selectedView === "reports" ? (
          <Grid item xs={12} lg={selectedView === "dashboard" ? 7 : 12}>
            <SectionHeader title="Comparativa mensual" />
            {hasMonthlyData ? (
              <MonthlyComparisonChart data={monthlyFinance} />
            ) : (
              <EmptyState title="Sin comparativa" description="No hay movimientos suficientes para comparar meses." />
            )}
          </Grid>
        ) : null}
        {selectedView === "settings" ? (
          <Grid item xs={12}>
            <Stack spacing={2.5}>
              <AuthPanel onAuthChange={reload} />
              <AccountsManager
                accounts={accounts}
                onCreate={handleAccountCreate}
                onUpdate={handleAccountUpdate}
                onDelete={handleAccountDelete}
              />
            </Stack>
          </Grid>
        ) : null}
      </Grid>
      <TransactionFormDialog
        open={transactionDialogOpen}
        accounts={accounts}
        transaction={editingTransaction}
        onClose={() => {
          setTransactionDialogOpen(false);
          setEditingTransaction(null);
        }}
        onSubmit={handleTransactionSubmit}
      />
      <GoalFormDialog
        open={goalDialogOpen}
        goal={editingGoal}
        onClose={() => {
          setGoalDialogOpen(false);
          setEditingGoal(null);
        }}
        onSubmit={handleGoalSubmit}
      />
      <LoanFormDialog
        open={loanDialogOpen}
        loan={editingLoan}
        onClose={() => {
          setLoanDialogOpen(false);
          setEditingLoan(null);
        }}
        onSubmit={handleLoanSubmit}
      />
      <Dialog open={balanceDialogOpen} onClose={() => setBalanceDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Editar balance actual</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <TextField
            autoFocus
            fullWidth
            label="Balance actual"
            type="number"
            value={manualBalance}
            onChange={(event) => setManualBalanceValue(event.target.value)}
            helperText="Se guardara como una cuenta de ajuste manual tipo billetera virtual."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBalanceDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleManualBalanceSubmit} disabled={manualBalance === ""}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
