import { create } from "zustand";
import { Invoice, DashboardStats } from "@/types";

interface InvoiceStore {
  invoices: Invoice[];
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
  setInvoices: (invoices: Invoice[]) => void;
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  setStats: (stats: DashboardStats) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  calculateStats: () => void;
}

export const useInvoiceStore = create<InvoiceStore>((set, get) => ({
  invoices: [],
  stats: null,
  isLoading: false,
  error: null,
  setInvoices: (invoices) => {
    set({ invoices });
    get().calculateStats();
  },
  addInvoice: (invoice) => {
    set((state) => ({ invoices: [...state.invoices, invoice] }));
    get().calculateStats();
  },
  updateInvoice: (id, updatedInvoice) => {
    set((state) => ({
      invoices: state.invoices.map((inv) =>
        inv.$id === id ? { ...inv, ...updatedInvoice } : inv
      ),
    }));
    get().calculateStats();
  },
  deleteInvoice: (id) => {
    set((state) => ({
      invoices: state.invoices.filter((inv) => inv.$id !== id),
    }));
    get().calculateStats();
  },
  setStats: (stats) => set({ stats }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  calculateStats: () => {
    const { invoices } = get();
    const totalInvoices = invoices.length;
    const totalPaid = invoices
      .filter((inv) => inv.status === "paid")
      .reduce((sum, inv) => sum + inv.total, 0);
    const pendingPayments = invoices
      .filter((inv) => inv.status === "unpaid")
      .reduce((sum, inv) => sum + inv.total, 0);
    const totalVAT = invoices
      .filter((inv) => inv.status === "paid")
      .reduce((sum, inv) => sum + inv.vatAmount, 0);

    set({
      stats: {
        totalInvoices,
        totalPaid,
        pendingPayments,
        totalVAT,
      },
    });
  },
}));

