export interface Invoice {
  $id?: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  vatPercentage: number;
  vatAmount: number;
  total: number;
  dueDate: string;
  status: "paid" | "unpaid";
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  $id: string;
  name: string;
  email: string;
}

export interface DashboardStats {
  totalInvoices: number;
  totalPaid: number;
  pendingPayments: number;
  totalVAT: number;
}

