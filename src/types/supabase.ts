export type AccountKind = "bank" | "virtual_wallet" | "cash" | "credit_card";
export type DbTransactionType = "expense" | "income" | "saving";
export type LoanStatus = "pending" | "partially_paid" | "paid" | "overdue";

export interface ProfileRow {
  id: string;
  full_name: string | null;
  currency_code: string;
  created_at: string;
  updated_at: string;
}

export interface AccountRow {
  id: string;
  user_id: string;
  name: string;
  kind: AccountKind;
  initial_balance: number | string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface TransactionRow {
  id: string;
  user_id: string;
  title: string;
  amount: number | string;
  type: DbTransactionType;
  category: string;
  account_id: string | null;
  transaction_date: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface SavingsGoalRow {
  id: string;
  user_id: string;
  name: string;
  target: number | string;
  current: number | string;
  deadline: string | null;
  created_at: string;
  updated_at: string;
}

export interface CardInstallmentRow {
  id: string;
  user_id: string;
  account_id: string | null;
  card_name: string;
  merchant: string;
  total_amount: number | string;
  installments: number;
  paid_installments: number;
  next_due: string | null;
  notes: string | null;
  automatic_debit: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoanRow {
  id: string;
  user_id: string;
  borrower_name: string;
  amount: number | string;
  amount_repaid: number | string;
  loan_date: string;
  due_date: string | null;
  status: LoanStatus;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: Partial<ProfileRow> & Pick<ProfileRow, "id">;
        Update: Partial<ProfileRow>;
        Relationships: [];
      };
      accounts: {
        Row: AccountRow;
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          kind: AccountKind;
          initial_balance?: number;
          color?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<AccountRow, "id" | "user_id" | "created_at">>;
        Relationships: [];
      };
      transactions: {
        Row: TransactionRow;
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          amount?: number;
          type: DbTransactionType;
          category?: string;
          account_id?: string | null;
          transaction_date: string;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<TransactionRow, "id" | "user_id" | "created_at">>;
        Relationships: [];
      };
      savings_goals: {
        Row: SavingsGoalRow;
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          target?: number;
          current?: number;
          deadline?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<SavingsGoalRow, "id" | "user_id" | "created_at">>;
        Relationships: [];
      };
      card_installments: {
        Row: CardInstallmentRow;
        Insert: Partial<CardInstallmentRow> & Pick<CardInstallmentRow, "user_id" | "card_name" | "merchant">;
        Update: Partial<Omit<CardInstallmentRow, "id" | "user_id" | "created_at">>;
        Relationships: [];
      };
      loans: {
        Row: LoanRow;
        Insert: Partial<LoanRow> & Pick<LoanRow, "user_id" | "borrower_name" | "loan_date">;
        Update: Partial<Omit<LoanRow, "id" | "user_id" | "created_at">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
