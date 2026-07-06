import dayjs from "dayjs";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import {
  Account,
  CardInstallment,
  DashboardData,
  DashboardMetric,
  DashboardMetricGroup,
  ExpenseCategory,
  FinancialAlert,
  FinancialGoal,
  Loan,
  MonthlyFinance,
  SummaryMetric,
  Transaction,
} from "../types/finance";
import { AccountRow, CardInstallmentRow, LoanRow, SavingsGoalRow, TransactionRow } from "../types/supabase";

const categoryColors = ["#1f5eff", "#12a66a", "#2077b8", "#d99016", "#8a63d2", "#d64545", "#667085"];
const manualBalanceAccountName = "Ajuste manual de balance";

const toNumber = (value: number | string | null | undefined) => Number(value ?? 0);

const getMonthRange = (selectedMonth: string) => {
  const start = dayjs(selectedMonth).startOf("month");
  return {
    start,
    end: start.endOf("month").add(1, "day"),
  };
};

const isInRange = (dateValue: string, start: dayjs.Dayjs, end: dayjs.Dayjs) => {
  const date = dayjs(dateValue);
  return (date.isSame(start) || date.isAfter(start)) && date.isBefore(end);
};

const emptyMetrics: Record<DashboardMetricGroup, DashboardMetric[]> = {
  dashboard: [
    { id: "available-balance", title: "Saldo disponible", value: 0, format: "currency", helperText: "sin cuentas", color: "primary" },
    { id: "accounts-count", title: "Cuentas activas", value: 0, format: "number", helperText: "registradas", color: "success" },
    { id: "transactions-count", title: "Movimientos", value: 0, format: "number", helperText: "total cargado", color: "warning" },
    { id: "goal-progress", title: "Progreso de metas", value: 0, format: "percent", helperText: "sin objetivos", color: "info" },
  ],
  transactions: [
    { id: "transaction-count", title: "Movimientos", value: 0, format: "number", helperText: "total cargado", color: "primary" },
    { id: "income-total", title: "Ingresos acumulados", value: 0, format: "currency", helperText: "historico", color: "success" },
    { id: "expense-total", title: "Gastos acumulados", value: 0, format: "currency", helperText: "historico", color: "error" },
    { id: "avg-expense", title: "Gasto promedio", value: 0, format: "currency", helperText: "por movimiento", color: "warning" },
  ],
  budgets: [
    { id: "expense-categories", title: "Categorias con gasto", value: 0, format: "number", helperText: "del mes actual", color: "primary" },
    { id: "top-category", title: "Categoria principal", value: 0, format: "currency", helperText: "sin gastos", color: "warning" },
    { id: "month-expense-budget", title: "Gasto mensual", value: 0, format: "currency", helperText: "base para presupuestos", color: "error" },
    { id: "configured-budgets", title: "Presupuestos", value: 0, format: "number", helperText: "no existe tabla budgets", color: "info" },
  ],
  goals: [
    { id: "goals-count", title: "Objetivos", value: 0, format: "number", helperText: "metas cargadas", color: "primary" },
    { id: "goals-current", title: "Ahorrado", value: 0, format: "currency", helperText: "en objetivos", color: "success" },
    { id: "goals-target", title: "Meta total", value: 0, format: "currency", helperText: "objetivo combinado", color: "info" },
    { id: "goals-progress", title: "Avance promedio", value: 0, format: "percent", helperText: "sobre meta total", color: "warning" },
  ],
  installments: [
    { id: "installments-count", title: "Compras en cuotas", value: 0, format: "number", helperText: "activas", color: "primary" },
    { id: "installments-pending", title: "Saldo pendiente", value: 0, format: "currency", helperText: "por pagar", color: "warning" },
    { id: "next-installments", title: "Proximas cuotas", value: 0, format: "number", helperText: "vencen en 7 dias", color: "info" },
    { id: "automatic-debits", title: "Debitos automaticos", value: 0, format: "number", helperText: "activos", color: "success" },
  ],
  loans: [
    { id: "loans-count", title: "Prestamos", value: 0, format: "number", helperText: "activos", color: "primary" },
    { id: "loans-pending", title: "Saldo pendiente", value: 0, format: "currency", helperText: "por cobrar", color: "warning" },
    { id: "loans-repaid", title: "Devuelto", value: 0, format: "currency", helperText: "recuperado", color: "success" },
    { id: "loans-overdue", title: "Vencidos", value: 0, format: "number", helperText: "requieren seguimiento", color: "error" },
  ],
  reports: [
    { id: "active-months", title: "Meses con actividad", value: 0, format: "number", helperText: "ultimos 6 meses", color: "primary" },
    { id: "six-month-income", title: "Ingresos 6 meses", value: 0, format: "currency", helperText: "periodo graficado", color: "success" },
    { id: "six-month-expense", title: "Gastos 6 meses", value: 0, format: "currency", helperText: "periodo graficado", color: "error" },
    { id: "best-saving", title: "Mejor ahorro", value: 0, format: "currency", helperText: "sin actividad", color: "info" },
  ],
  settings: [
    { id: "accounts-count", title: "Cuentas", value: 0, format: "number", helperText: "registradas", color: "primary" },
    { id: "wallet-balance", title: "Billeteras", value: 0, format: "currency", helperText: "saldo en virtual wallets", color: "success" },
    { id: "credit-card-base", title: "Tarjetas", value: 0, format: "currency", helperText: "saldo inicial informado", color: "warning" },
    { id: "liabilities", title: "Compromisos", value: 0, format: "currency", helperText: "0 cuotas, 0 prestamos", color: "error" },
  ],
};

const emptySummaryMetrics: SummaryMetric[] = [
  {
    id: "balance",
    title: "Balance total",
    value: 0,
    variation: 0,
    helperText: "sin cuentas cargadas",
    type: "balance",
  },
  {
    id: "income",
    title: "Ingresos mensuales",
    value: 0,
    variation: 0,
    helperText: "sin ingresos este mes",
    type: "income",
  },
  {
    id: "expense",
    title: "Gastos mensuales",
    value: 0,
    variation: 0,
    helperText: "sin gastos este mes",
    type: "expense",
  },
  {
    id: "saving",
    title: "Ahorro mensual",
    value: 0,
    variation: 0,
    helperText: "sin ahorro calculado",
    type: "saving",
  },
];

const getEmptyDashboardData = (selectedMonth: string, message?: string): DashboardData => ({
  accounts: [],
  metrics: emptyMetrics,
  summaryMetrics: emptySummaryMetrics,
  monthlyFinance: buildMonthlyFinance([], selectedMonth),
  expenseCategories: [],
  transactions: [],
  budgets: [],
  financialGoals: [],
  cardInstallments: [],
  loans: [],
  financialAlerts: [],
  source: "empty",
  message,
});

const requireSupabase = () => {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase no esta configurado.");
  }

  return supabase;
};

const getCurrentUserId = async () => {
  const client = requireSupabase();
  const { data, error } = await client.auth.getUser();

  if (error || !data.user) {
    throw new Error("Necesitas iniciar sesion para modificar datos.");
  }

  return data.user.id;
};

const buildAccounts = (accounts: AccountRow[]): Account[] =>
  accounts.map((account) => ({
    id: account.id,
    name: account.name,
    kind: account.kind,
    initialBalance: toNumber(account.initial_balance),
    color: account.color,
  }));

const sumByType = (transactions: TransactionRow[], type: TransactionRow["type"], start: dayjs.Dayjs, end: dayjs.Dayjs) =>
  transactions
    .filter((transaction) => {
      return transaction.type === type && isInRange(transaction.transaction_date, start, end);
    })
    .reduce((total, transaction) => total + toNumber(transaction.amount), 0);

const buildMonthlyFinance = (transactions: TransactionRow[], selectedMonth: string): MonthlyFinance[] =>
  Array.from({ length: 6 }, (_, index) => {
    const month = dayjs(selectedMonth).subtract(5 - index, "month");
    const start = month.startOf("month");
    const end = month.endOf("month").add(1, "day");
    const income = sumByType(transactions, "income", start, end);
    const expense = sumByType(transactions, "expense", start, end);
    const explicitSaving = sumByType(transactions, "saving", start, end);

    return {
      month: month.format("MMM"),
      income,
      expense,
      saving: explicitSaving || Math.max(income - expense, 0),
    };
  });

const buildExpenseCategories = (transactions: TransactionRow[], currentMonthStart: dayjs.Dayjs): ExpenseCategory[] => {
  const end = currentMonthStart.endOf("month").add(1, "day");
  const totals = transactions
    .filter((transaction) => transaction.type === "expense" && isInRange(transaction.transaction_date, currentMonthStart, end))
    .reduce<Record<string, number>>((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] ?? 0) + toNumber(transaction.amount);
      return acc;
    }, {});

  return Object.entries(totals)
    .sort(([, a], [, b]) => b - a)
    .map(([name, value], index) => ({
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name,
      value,
      color: categoryColors[index % categoryColors.length],
    }));
};

const buildGoals = (goals: SavingsGoalRow[]): FinancialGoal[] =>
  goals.map((goal) => ({
    id: goal.id,
    name: goal.name,
    currentAmount: toNumber(goal.current),
    targetAmount: toNumber(goal.target),
    estimatedDate: goal.deadline ?? dayjs().add(6, "month").format("YYYY-MM-DD"),
  }));

const buildLoans = (loans: LoanRow[]): Loan[] =>
  loans
    .slice()
    .sort((a, b) => dayjs(b.loan_date).valueOf() - dayjs(a.loan_date).valueOf())
    .map((loan) => ({
      id: loan.id,
      borrowerName: loan.borrower_name,
      amount: toNumber(loan.amount),
      amountRepaid: toNumber(loan.amount_repaid),
      loanDate: loan.loan_date,
      dueDate: loan.due_date,
      status: loan.status,
      notes: loan.notes,
    }));

const buildCardInstallments = (installments: CardInstallmentRow[]): CardInstallment[] =>
  installments
    .slice()
    .sort((a, b) => {
      if (!a.next_due && !b.next_due) return 0;
      if (!a.next_due) return 1;
      if (!b.next_due) return -1;
      return dayjs(a.next_due).valueOf() - dayjs(b.next_due).valueOf();
    })
    .map((installment) => ({
      id: installment.id,
      accountId: installment.account_id,
      cardName: installment.card_name,
      merchant: installment.merchant,
      totalAmount: toNumber(installment.total_amount),
      installments: installment.installments,
      paidInstallments: installment.paid_installments,
      nextDue: installment.next_due,
      notes: installment.notes ?? "",
      automaticDebit: installment.automatic_debit,
    }));

const buildTransactions = (transactions: TransactionRow[]): Transaction[] =>
  transactions
    .slice()
    .sort((a, b) => dayjs(b.transaction_date).valueOf() - dayjs(a.transaction_date).valueOf())
    .map((transaction) => ({
      id: transaction.id,
      date: transaction.transaction_date,
      description: transaction.title,
      category: transaction.category,
      type: transaction.type,
      amount: toNumber(transaction.amount),
      status: "completed",
      accountId: transaction.account_id,
      notes: transaction.notes,
    }));

const buildSummaryMetrics = (
  accounts: AccountRow[],
  monthlyFinance: MonthlyFinance[],
  balanceTransactions: TransactionRow[],
): SummaryMetric[] => {
  const current = monthlyFinance[monthlyFinance.length - 1] ?? { income: 0, expense: 0, saving: 0 };
  const previous = monthlyFinance[monthlyFinance.length - 2] ?? { income: 0, expense: 0, saving: 0 };
  const balanceAccountIds = new Set(
    accounts
      .filter((account) => account.kind === "bank" || account.kind === "virtual_wallet" || account.kind === "cash")
      .map((account) => account.id),
  );
  const initialBalance = accounts
    .filter((account) => balanceAccountIds.has(account.id))
    .reduce((total, account) => total + toNumber(account.initial_balance), 0);
  const balanceMovements = balanceTransactions
    .filter((transaction) => !transaction.account_id || balanceAccountIds.has(transaction.account_id))
    .reduce((total, transaction) => {
      if (transaction.type === "expense") return total - toNumber(transaction.amount);
      return total + toNumber(transaction.amount);
    }, 0);
  const balance = initialBalance + balanceMovements;
  const variation = (value: number, reference: number) => (reference === 0 ? 0 : ((value - reference) / reference) * 100);

  return [
    {
      id: "balance",
      title: "Balance total",
      value: balance,
      variation: variation(balance, initialBalance || balance),
      helperText: "incluye bancos, efectivo y billeteras",
      type: "balance",
    },
    {
      id: "income",
      title: "Ingresos mensuales",
      value: current.income,
      variation: variation(current.income, previous.income),
      helperText: "segun transacciones del mes",
      type: "income",
    },
    {
      id: "expense",
      title: "Gastos mensuales",
      value: current.expense,
      variation: variation(current.expense, previous.expense),
      helperText: "gastos registrados este mes",
      type: "expense",
    },
    {
      id: "saving",
      title: "Ahorro mensual",
      value: current.saving,
      variation: variation(current.saving, previous.saving),
      helperText: "ingresos menos gastos",
      type: "saving",
    },
  ];
};

const calculateAvailableBalance = (
  accounts: AccountRow[],
  transactions: TransactionRow[],
  ignoredAccountId?: string,
  includeUnassignedTransactions = true,
) => {
  const balanceAccountIds = new Set(
    accounts
      .filter((account) => account.id !== ignoredAccountId)
      .filter((account) => account.kind === "bank" || account.kind === "virtual_wallet" || account.kind === "cash")
      .map((account) => account.id),
  );
  const initialBalance = accounts
    .filter((account) => account.id !== ignoredAccountId)
    .filter((account) => balanceAccountIds.has(account.id))
    .reduce((total, account) => total + toNumber(account.initial_balance), 0);
  const balanceMovements = transactions
    .filter((transaction) => {
      if (!transaction.account_id) return includeUnassignedTransactions;
      return balanceAccountIds.has(transaction.account_id);
    })
    .reduce((total, transaction) => {
      if (transaction.type === "expense") return total - toNumber(transaction.amount);
      return total + toNumber(transaction.amount);
    }, 0);

  return initialBalance + balanceMovements;
};

const buildAlerts = (
  goals: FinancialGoal[],
  installments: CardInstallmentRow[],
  loans: LoanRow[],
): FinancialAlert[] => {
  const dueInstallments = installments.filter((item) => item.next_due && dayjs(item.next_due).diff(dayjs(), "day") <= 7);
  const overdueLoans = loans.filter((loan) => loan.status === "overdue");
  const goalAlerts = goals
    .filter((goal) => goal.targetAmount > 0 && goal.currentAmount / goal.targetAmount >= 0.75)
    .map<FinancialAlert>((goal) => ({
      id: `goal-${goal.id}`,
      title: goal.name,
      message: "Estas cerca de cumplir este objetivo financiero.",
      severity: "success",
    }));

  return [
    ...dueInstallments.map<FinancialAlert>((item) => ({
      id: `installment-${item.id}`,
      title: item.card_name,
      message: `Proxima cuota de ${item.merchant} vence pronto.`,
      severity: "info",
    })),
    ...overdueLoans.map<FinancialAlert>((loan) => ({
      id: `loan-${loan.id}`,
      title: loan.borrower_name,
      message: "Este prestamo figura vencido.",
      severity: "error",
    })),
    ...goalAlerts,
  ].slice(0, 5);
};

const buildDashboardMetrics = (
  accounts: AccountRow[],
  transactions: TransactionRow[],
  goals: SavingsGoalRow[],
  installments: CardInstallmentRow[],
  loans: LoanRow[],
  monthlyFinance: MonthlyFinance[],
  expenseCategories: ExpenseCategory[],
  selectedMonth: string,
): Record<DashboardMetricGroup, DashboardMetric[]> => {
  const { start: currentMonthStart, end: currentMonthEnd } = getMonthRange(selectedMonth);
  const currentMonthTransactions = transactions.filter((transaction) =>
    isInRange(transaction.transaction_date, currentMonthStart, currentMonthEnd),
  );
  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + toNumber(transaction.amount), 0);
  const totalExpense = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + toNumber(transaction.amount), 0);
  const monthExpense = currentMonthTransactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + toNumber(transaction.amount), 0);
  const monthIncome = currentMonthTransactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + toNumber(transaction.amount), 0);
  const monthExpenseCount = currentMonthTransactions.filter((transaction) => transaction.type === "expense").length;
  const averageExpense = monthExpenseCount ? monthExpense / monthExpenseCount : 0;
  const balanceTransactions = transactions.filter((transaction) => dayjs(transaction.transaction_date).isBefore(currentMonthEnd));
  const availableBalance = calculateAvailableBalance(accounts, balanceTransactions);
  const walletBalance = calculateAvailableBalance(
    accounts.filter((account) => account.kind === "virtual_wallet"),
    balanceTransactions,
    undefined,
    false,
  );
  const creditCardInitialBalance = accounts
    .filter((account) => account.kind === "credit_card")
    .reduce((total, account) => total + toNumber(account.initial_balance), 0);
  const totalGoalTarget = goals.reduce((total, goal) => total + toNumber(goal.target), 0);
  const totalGoalCurrent = goals.reduce((total, goal) => total + toNumber(goal.current), 0);
  const goalProgress = totalGoalTarget ? (totalGoalCurrent / totalGoalTarget) * 100 : 0;
  const pendingInstallments = installments.filter((installment) => installment.paid_installments < installment.installments);
  const pendingInstallmentAmount = pendingInstallments.reduce((total, installment) => {
    const installmentValue = installment.installments ? toNumber(installment.total_amount) / installment.installments : 0;
    return total + installmentValue * Math.max(installment.installments - installment.paid_installments, 0);
  }, 0);
  const pendingLoans = loans.filter((loan) => loan.status !== "paid");
  const pendingLoanAmount = pendingLoans.reduce(
    (total, loan) => total + Math.max(toNumber(loan.amount) - toNumber(loan.amount_repaid), 0),
    0,
  );
  const repaidLoanAmount = loans.reduce((total, loan) => total + toNumber(loan.amount_repaid), 0);
  const overdueLoansCount = loans.filter((loan) => loan.status === "overdue").length;
  const upcomingInstallmentsCount = pendingInstallments.filter((installment) => {
    return installment.next_due && dayjs(installment.next_due).diff(dayjs(), "day") <= 7;
  }).length;
  const automaticDebitsCount = pendingInstallments.filter((installment) => installment.automatic_debit).length;
  const activeMonths = monthlyFinance.filter((month) => month.income || month.expense || month.saving);
  const bestSavingMonth = monthlyFinance.reduce(
    (best, month) => (month.saving > best.saving ? month : best),
    { month: "", income: 0, expense: 0, saving: 0 },
  );
  const totalSixMonthIncome = monthlyFinance.reduce((total, month) => total + month.income, 0);
  const totalSixMonthExpense = monthlyFinance.reduce((total, month) => total + month.expense, 0);
  const topCategory = expenseCategories[0];

  return {
    dashboard: [
      { id: "available-balance", title: "Saldo disponible", value: availableBalance, format: "currency", helperText: "bancos, efectivo y billeteras", color: "primary" },
      { id: "accounts-count", title: "Cuentas activas", value: accounts.length, format: "number", helperText: "registradas", color: "success" },
      { id: "transactions-count", title: "Movimientos", value: currentMonthTransactions.length, format: "number", helperText: "del mes filtrado", color: "warning" },
      { id: "goal-progress", title: "Progreso de metas", value: goalProgress, format: "percent", helperText: `${goals.length} objetivos activos`, color: "info" },
    ],
    transactions: [
      { id: "transaction-count", title: "Movimientos", value: currentMonthTransactions.length, format: "number", helperText: "del mes filtrado", color: "primary" },
      { id: "income-total", title: "Ingresos", value: monthIncome, format: "currency", helperText: "del mes filtrado", color: "success" },
      { id: "expense-total", title: "Gastos", value: monthExpense, format: "currency", helperText: "del mes filtrado", color: "error" },
      { id: "avg-expense", title: "Gasto promedio", value: averageExpense, format: "currency", helperText: "por gasto del mes", color: "warning" },
    ],
    budgets: [
      { id: "expense-categories", title: "Categorias con gasto", value: expenseCategories.length, format: "number", helperText: "del mes filtrado", color: "primary" },
      { id: "top-category", title: "Categoria principal", value: topCategory?.value ?? 0, format: "currency", helperText: topCategory?.name ?? "sin gastos", color: "warning" },
      { id: "month-expense-budget", title: "Gasto mensual", value: monthExpense, format: "currency", helperText: "base para presupuestos", color: "error" },
      { id: "configured-budgets", title: "Presupuestos", value: 0, format: "number", helperText: "no existe tabla budgets", color: "info" },
    ],
    goals: [
      { id: "goals-count", title: "Objetivos", value: goals.length, format: "number", helperText: "metas cargadas", color: "primary" },
      { id: "goals-current", title: "Ahorrado", value: totalGoalCurrent, format: "currency", helperText: "en objetivos", color: "success" },
      { id: "goals-target", title: "Meta total", value: totalGoalTarget, format: "currency", helperText: "objetivo combinado", color: "info" },
      { id: "goals-progress", title: "Avance promedio", value: goalProgress, format: "percent", helperText: "sobre meta total", color: "warning" },
    ],
    installments: [
      { id: "installments-count", title: "Compras en cuotas", value: pendingInstallments.length, format: "number", helperText: "con saldo pendiente", color: "primary" },
      { id: "installments-pending", title: "Saldo pendiente", value: pendingInstallmentAmount, format: "currency", helperText: "total por pagar", color: "warning" },
      { id: "next-installments", title: "Proximas cuotas", value: upcomingInstallmentsCount, format: "number", helperText: "vencen en 7 dias", color: "info" },
      { id: "automatic-debits", title: "Debitos automaticos", value: automaticDebitsCount, format: "number", helperText: "sobre cuotas activas", color: "success" },
    ],
    loans: [
      { id: "loans-count", title: "Prestamos", value: pendingLoans.length, format: "number", helperText: "activos", color: "primary" },
      { id: "loans-pending", title: "Saldo pendiente", value: pendingLoanAmount, format: "currency", helperText: "por cobrar", color: "warning" },
      { id: "loans-repaid", title: "Devuelto", value: repaidLoanAmount, format: "currency", helperText: "recuperado", color: "success" },
      { id: "loans-overdue", title: "Vencidos", value: overdueLoansCount, format: "number", helperText: "requieren seguimiento", color: "error" },
    ],
    reports: [
      { id: "active-months", title: "Meses con actividad", value: activeMonths.length, format: "number", helperText: "ultimos 6 meses", color: "primary" },
      { id: "six-month-income", title: "Ingresos 6 meses", value: totalSixMonthIncome, format: "currency", helperText: "periodo graficado", color: "success" },
      { id: "six-month-expense", title: "Gastos 6 meses", value: totalSixMonthExpense, format: "currency", helperText: "periodo graficado", color: "error" },
      { id: "best-saving", title: "Mejor ahorro", value: bestSavingMonth.saving, format: "currency", helperText: bestSavingMonth.month || "sin actividad", color: "info" },
    ],
    settings: [
      { id: "accounts-count", title: "Cuentas", value: accounts.length, format: "number", helperText: "registradas", color: "primary" },
      { id: "wallet-balance", title: "Billeteras", value: walletBalance, format: "currency", helperText: "saldo en virtual wallets", color: "success" },
      { id: "credit-card-base", title: "Tarjetas", value: creditCardInitialBalance, format: "currency", helperText: "saldo inicial informado", color: "warning" },
      { id: "liabilities", title: "Compromisos", value: pendingInstallmentAmount + pendingLoanAmount, format: "currency", helperText: `${pendingInstallments.length} cuotas, ${pendingLoans.length} prestamos`, color: "error" },
    ],
  };
};

export const loadDashboardData = async (selectedMonth = dayjs().format("YYYY-MM")): Promise<DashboardData> => {
  if (!isSupabaseConfigured || !supabase) {
    return getEmptyDashboardData(selectedMonth, "Supabase no esta configurado.");
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return getEmptyDashboardData(selectedMonth, "No hay una sesion activa de Supabase.");
  }

  const userId = userData.user.id;
  const [accountsResult, transactionsResult, goalsResult, installmentsResult, loansResult] = await Promise.all([
    supabase.from("accounts").select("*").eq("user_id", userId),
    supabase.from("transactions").select("*").eq("user_id", userId).order("transaction_date", { ascending: false }),
    supabase.from("savings_goals").select("*").eq("user_id", userId),
    supabase.from("card_installments").select("*").eq("user_id", userId),
    supabase.from("loans").select("*").eq("user_id", userId),
  ]);

  const firstError =
    accountsResult.error ?? transactionsResult.error ?? goalsResult.error ?? installmentsResult.error ?? loansResult.error;

  if (firstError) {
    return getEmptyDashboardData(selectedMonth, `No se pudieron leer datos de Supabase: ${firstError.message}`);
  }

  const accounts = accountsResult.data ?? [];
  const transactions = transactionsResult.data ?? [];
  const goals = goalsResult.data ?? [];
  const installments = installmentsResult.data ?? [];
  const loans = loansResult.data ?? [];

  if (!accounts.length && !transactions.length && !goals.length && !installments.length && !loans.length) {
    return getEmptyDashboardData(selectedMonth, "Tu cuenta todavia no tiene datos financieros cargados.");
  }

  const { start: currentMonthStart, end: currentMonthEnd } = getMonthRange(selectedMonth);
  const selectedMonthTransactions = transactions.filter((transaction) =>
    isInRange(transaction.transaction_date, currentMonthStart, currentMonthEnd),
  );
  const balanceTransactions = transactions.filter((transaction) => dayjs(transaction.transaction_date).isBefore(currentMonthEnd));
  const monthlyFinance = buildMonthlyFinance(transactions, selectedMonth);
  const expenseCategories = buildExpenseCategories(transactions, currentMonthStart);
  const financialGoals = buildGoals(goals);
  const financialAlerts = buildAlerts(financialGoals, installments, loans);
  const metrics = buildDashboardMetrics(accounts, transactions, goals, installments, loans, monthlyFinance, expenseCategories, selectedMonth);

  return {
    accounts: buildAccounts(accounts),
    metrics,
    summaryMetrics: buildSummaryMetrics(accounts, monthlyFinance, balanceTransactions),
    monthlyFinance,
    expenseCategories,
    transactions: buildTransactions(selectedMonthTransactions),
    budgets: [],
    financialGoals,
    cardInstallments: buildCardInstallments(installments),
    loans: buildLoans(loans),
    financialAlerts,
    source: "supabase",
  };
};

export type AccountInput = {
  name: string;
  kind: Account["kind"];
  initialBalance: number;
  color: string;
};

export type TransactionInput = {
  title: string;
  amount: number;
  type: TransactionRow["type"];
  category: string;
  accountId: string | null;
  transactionDate: string;
  notes: string;
};

export type SavingsGoalInput = {
  name: string;
  target: number;
  current: number;
  deadline: string | null;
};

export type LoanInput = {
  borrowerName: string;
  amount: number;
  amountRepaid: number;
  loanDate: string;
  dueDate: string | null;
  status: LoanRow["status"];
  notes: string;
};

export type CardInstallmentInput = {
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

export const createAccount = async (input: AccountInput) => {
  const client = requireSupabase();
  const userId = await getCurrentUserId();
  const { error } = await client.from("accounts").insert({
    user_id: userId,
    name: input.name,
    kind: input.kind,
    initial_balance: input.initialBalance,
    color: input.color,
  });

  if (error) throw new Error(error.message);
};

export const updateAccount = async (id: string, input: AccountInput) => {
  const client = requireSupabase();
  await getCurrentUserId();
  const { error } = await client
    .from("accounts")
    .update({
      name: input.name,
      kind: input.kind,
      initial_balance: input.initialBalance,
      color: input.color,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
};

export const deleteAccount = async (id: string) => {
  const client = requireSupabase();
  await getCurrentUserId();
  const { error } = await client.from("accounts").delete().eq("id", id);

  if (error) throw new Error(error.message);
};

export const createTransaction = async (input: TransactionInput) => {
  const client = requireSupabase();
  const userId = await getCurrentUserId();
  const { error } = await client.from("transactions").insert({
    user_id: userId,
    title: input.title,
    amount: input.amount,
    type: input.type,
    category: input.category,
    account_id: input.accountId,
    transaction_date: input.transactionDate,
    notes: input.notes,
  });

  if (error) throw new Error(error.message);
};

export const updateTransaction = async (id: string, input: TransactionInput) => {
  const client = requireSupabase();
  await getCurrentUserId();
  const { error } = await client
    .from("transactions")
    .update({
      title: input.title,
      amount: input.amount,
      type: input.type,
      category: input.category,
      account_id: input.accountId,
      transaction_date: input.transactionDate,
      notes: input.notes,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
};

export const deleteTransaction = async (id: string) => {
  const client = requireSupabase();
  await getCurrentUserId();
  const { error } = await client.from("transactions").delete().eq("id", id);

  if (error) throw new Error(error.message);
};

export const createSavingsGoal = async (input: SavingsGoalInput) => {
  const client = requireSupabase();
  const userId = await getCurrentUserId();
  const { error } = await client.from("savings_goals").insert({
    user_id: userId,
    name: input.name,
    target: input.target,
    current: input.current,
    deadline: input.deadline,
  });

  if (error) throw new Error(error.message);
};

export const updateSavingsGoal = async (id: string, input: SavingsGoalInput) => {
  const client = requireSupabase();
  await getCurrentUserId();
  const { error } = await client
    .from("savings_goals")
    .update({
      name: input.name,
      target: input.target,
      current: input.current,
      deadline: input.deadline,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
};

export const deleteSavingsGoal = async (id: string) => {
  const client = requireSupabase();
  await getCurrentUserId();
  const { error } = await client.from("savings_goals").delete().eq("id", id);

  if (error) throw new Error(error.message);
};

export const createLoan = async (input: LoanInput) => {
  const client = requireSupabase();
  const userId = await getCurrentUserId();
  const { error } = await client.from("loans").insert({
    user_id: userId,
    borrower_name: input.borrowerName,
    amount: input.amount,
    amount_repaid: input.amountRepaid,
    loan_date: input.loanDate,
    due_date: input.dueDate,
    status: input.status,
    notes: input.notes,
  });

  if (error) throw new Error(error.message);
};

export const updateLoan = async (id: string, input: LoanInput) => {
  const client = requireSupabase();
  await getCurrentUserId();
  const { error } = await client
    .from("loans")
    .update({
      borrower_name: input.borrowerName,
      amount: input.amount,
      amount_repaid: input.amountRepaid,
      loan_date: input.loanDate,
      due_date: input.dueDate,
      status: input.status,
      notes: input.notes,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
};

export const deleteLoan = async (id: string) => {
  const client = requireSupabase();
  await getCurrentUserId();
  const { error } = await client.from("loans").delete().eq("id", id);

  if (error) throw new Error(error.message);
};

export const createCardInstallment = async (input: CardInstallmentInput) => {
  const client = requireSupabase();
  const userId = await getCurrentUserId();
  const { error } = await client.from("card_installments").insert({
    user_id: userId,
    account_id: input.accountId,
    card_name: input.cardName,
    merchant: input.merchant,
    total_amount: input.totalAmount,
    installments: input.installments,
    paid_installments: input.paidInstallments,
    next_due: input.nextDue,
    notes: input.notes,
    automatic_debit: input.automaticDebit,
  });

  if (error) throw new Error(error.message);
};

export const updateCardInstallment = async (id: string, input: CardInstallmentInput) => {
  const client = requireSupabase();
  await getCurrentUserId();
  const { error } = await client
    .from("card_installments")
    .update({
      account_id: input.accountId,
      card_name: input.cardName,
      merchant: input.merchant,
      total_amount: input.totalAmount,
      installments: input.installments,
      paid_installments: input.paidInstallments,
      next_due: input.nextDue,
      notes: input.notes,
      automatic_debit: input.automaticDebit,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
};

export const deleteCardInstallment = async (id: string) => {
  const client = requireSupabase();
  await getCurrentUserId();
  const { error } = await client.from("card_installments").delete().eq("id", id);

  if (error) throw new Error(error.message);
};

const getNextInstallmentDue = (nextDue: string | null, paidInstallments: number, installments: number) => {
  if (paidInstallments >= installments) return null;

  return dayjs(nextDue ?? dayjs().format("YYYY-MM-DD"))
    .add(1, "month")
    .format("YYYY-MM-DD");
};

const getInstallmentPaymentDate = (selectedMonth: string) => {
  const month = dayjs(selectedMonth);

  if (month.isSame(dayjs(), "month")) {
    return dayjs().format("YYYY-MM-DD");
  }

  return month.startOf("month").format("YYYY-MM-DD");
};

const createInstallmentPaymentTransaction = async (
  userId: string,
  installment: CardInstallmentRow,
  selectedMonth: string,
) => {
  const installmentValue = installment.installments ? toNumber(installment.total_amount) / installment.installments : 0;
  const client = requireSupabase();
  const { error } = await client.from("transactions").insert({
    user_id: userId,
    title: `Cuota - ${installment.merchant}`,
    amount: installmentValue,
    type: "expense",
    category: "Tarjeta",
    account_id: installment.account_id,
    transaction_date: getInstallmentPaymentDate(selectedMonth),
    notes: `Pago de cuota ${installment.paid_installments + 1}/${installment.installments} de ${installment.card_name}.`,
  });

  if (error) throw new Error(error.message);
};

export const markCardInstallmentPaid = async (id: string, selectedMonth: string) => {
  const client = requireSupabase();
  const userId = await getCurrentUserId();
  const { data, error } = await client.from("card_installments").select("*").eq("id", id).single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("No se encontro la compra en cuotas.");
  if (data.paid_installments >= data.installments) return;

  const paidInstallments = Math.min(data.paid_installments + 1, data.installments);
  await createInstallmentPaymentTransaction(userId, data, selectedMonth);

  const { error: updateError } = await client
    .from("card_installments")
    .update({
      paid_installments: paidInstallments,
      next_due: getNextInstallmentDue(data.next_due, paidInstallments, data.installments),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (updateError) throw new Error(updateError.message);
};

export const markDueCardInstallmentsPaid = async (selectedMonth: string) => {
  const client = requireSupabase();
  const userId = await getCurrentUserId();
  const { end } = getMonthRange(selectedMonth);
  const { data, error } = await client
    .from("card_installments")
    .select("*")
    .eq("user_id", userId)
    .lte("next_due", end.subtract(1, "day").format("YYYY-MM-DD"));

  if (error) throw new Error(error.message);

  const dueInstallments = (data ?? []).filter((installment) => {
    return installment.paid_installments < installment.installments;
  });

  await Promise.all(
    dueInstallments.map(async (installment) => {
      const paidInstallments = Math.min(installment.paid_installments + 1, installment.installments);

      await createInstallmentPaymentTransaction(userId, installment, selectedMonth);

      const { error: updateError } = await client
        .from("card_installments")
        .update({
          paid_installments: paidInstallments,
          next_due: getNextInstallmentDue(installment.next_due, paidInstallments, installment.installments),
          updated_at: new Date().toISOString(),
        })
        .eq("id", installment.id);

      if (updateError) throw new Error(updateError.message);
    }),
  );
};

export const setManualBalance = async (targetBalance: number) => {
  const client = requireSupabase();
  const userId = await getCurrentUserId();
  const [accountsResult, transactionsResult] = await Promise.all([
    client.from("accounts").select("*").eq("user_id", userId),
    client.from("transactions").select("*").eq("user_id", userId),
  ]);

  const firstError = accountsResult.error ?? transactionsResult.error;
  if (firstError) throw new Error(firstError.message);

  const accounts = (accountsResult.data ?? []) as AccountRow[];
  const transactions = (transactionsResult.data ?? []) as TransactionRow[];
  const manualAccount = accounts.find((account) => account.name === manualBalanceAccountName);
  const balanceWithoutManual = calculateAvailableBalance(accounts, transactions, manualAccount?.id);
  const manualInitialBalance = targetBalance - balanceWithoutManual;

  if (manualAccount) {
    const { error } = await client
      .from("accounts")
      .update({
        initial_balance: manualInitialBalance,
        kind: "virtual_wallet",
        color: "#1f5eff",
        updated_at: new Date().toISOString(),
      })
      .eq("id", manualAccount.id);

    if (error) throw new Error(error.message);
    return;
  }

  const { error } = await client.from("accounts").insert({
    user_id: userId,
    name: manualBalanceAccountName,
    kind: "virtual_wallet",
    initial_balance: manualInitialBalance,
    color: "#1f5eff",
  });

  if (error) throw new Error(error.message);
};
