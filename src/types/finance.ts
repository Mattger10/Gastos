export type TransactionType = "income" | "expense" | "saving";
export type TransactionStatus = "completed" | "pending" | "rejected";
export type AlertSeverity = "success" | "info" | "warning" | "error";

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  accountId?: string | null;
  notes?: string;
}

export interface SummaryMetric {
  id: string;
  title: string;
  value: number;
  variation: number;
  helperText: string;
  type: "balance" | "income" | "expense" | "saving";
}

export interface ExpenseCategory {
  id: string;
  name: string;
  value: number;
  color: string;
}

export interface BudgetItem {
  id: string;
  category: string;
  used: number;
  limit: number;
}

export interface FinancialGoal {
  id: string;
  name: string;
  currentAmount: number;
  targetAmount: number;
  estimatedDate: string;
}

export interface MonthlyFinance {
  month: string;
  income: number;
  expense: number;
  saving: number;
}

export interface FinancialAlert {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
}

export interface Account {
  id: string;
  name: string;
  kind: "bank" | "virtual_wallet" | "cash" | "credit_card";
  initialBalance: number;
  color: string;
}

export type LoanStatus = "pending" | "partially_paid" | "paid" | "overdue";

export interface Loan {
  id: string;
  borrowerName: string;
  amount: number;
  amountRepaid: number;
  loanDate: string;
  dueDate: string | null;
  status: LoanStatus;
  notes: string;
}

export interface DashboardMetric {
  id: string;
  title: string;
  value: number;
  format: "currency" | "number" | "percent";
  helperText: string;
  color?: "primary" | "success" | "error" | "warning" | "info";
}

export type DashboardMetricGroup = "dashboard" | "transactions" | "budgets" | "goals" | "loans" | "reports" | "settings";

export interface DashboardData {
  accounts: Account[];
  metrics: Record<DashboardMetricGroup, DashboardMetric[]>;
  summaryMetrics: SummaryMetric[];
  monthlyFinance: MonthlyFinance[];
  expenseCategories: ExpenseCategory[];
  transactions: Transaction[];
  budgets: BudgetItem[];
  financialGoals: FinancialGoal[];
  loans: Loan[];
  financialAlerts: FinancialAlert[];
  source: "supabase" | "empty";
  message?: string;
}
