"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { invoiceService } from "@/lib/services/invoice-service";
import { useInvoiceStore } from "@/store/invoice-store";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { dummyInvoices } from "@/data/invoices";
import { Search, Filter, MoreVertical, Calendar, Eye, Download } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

// Helper function to generate avatar color
const getAvatarColor = (id: string) => {
  const hue = Math.abs(id.charCodeAt(0) * 17) % 360;
  return `hsl(${hue}, 70%, 50%)`;
};

function Avatar({ id, children, size = 40 }: { id: string; children: React.ReactNode; size?: number }) {
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.style.backgroundColor = getAvatarColor(id);
    }
  }, [id]);

  const classes = `rounded-full flex items-center justify-center text-white font-bold`;

  return (
    <div ref={ref} className={`${classes} ${size === 48 ? "w-12 h-12" : "w-10 h-10"}`}>
      {children}
    </div>
  );
}

export default function InvoicesPage() {
  const { user } = useAuthStore();
  const { invoices, setInvoices } = useInvoiceStore();
  const [searchTerm, setSearchTerm] = useState("");
  type DisplayInvoice = typeof dummyInvoices[number];
  const [displayInvoices, setDisplayInvoices] = useState<DisplayInvoice[]>(dummyInvoices);
  const [selectedInvoice, setSelectedInvoice] = useState<DisplayInvoice | null>(
    (dummyInvoices[0] as DisplayInvoice) || null
  );
  const { toast } = useToast();

  useEffect(() => {
    // Load dummy invoices
    setDisplayInvoices(dummyInvoices);
  }, []);

  // Fetch persisted invoices for the current user and populate the store
  useEffect(() => {
    if (!user?.$id) return;

    let mounted = true;
    (async () => {
      try {
        const remote = await invoiceService.getInvoices(user.$id);
        if (!mounted) return;
        setInvoices(remote);
      } catch (err: any) {
        toast({ title: "Error", description: "Failed to load invoices" });
      }
    })();

    return () => {
      mounted = false;
    };
  }, [user?.$id]);

  // Merge invoices from the store into the displayed list so newly created invoices appear
  useEffect(() => {
    if (!invoices || invoices.length === 0) return;

    const mapped: DisplayInvoice[] = invoices.map((inv) => ({
      id: inv.$id || `${inv.userId}-${Math.random().toString(36).slice(2, 8)}`,
      clientName: inv.clientName,
      clientEmail: inv.clientEmail,
      date: inv.createdAt ? new Date(inv.createdAt).toLocaleString() : new Date(inv.dueDate).toLocaleString(),
      amount: inv.total ?? inv.amount,
      status: (inv.status === "paid" ? "paid" : "pending") as DisplayInvoice["status"],
      orderType: Math.max(1, Math.round((inv.total ?? inv.amount) / 100)),
      invoiceNumber: inv.$id ? String(inv.$id).slice(0, 8).toUpperCase() : `MGL${Math.floor(Math.random() * 900000 + 100000)}`,
      avatar: inv.clientName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    }));

    setDisplayInvoices((prev) => {
      const existingIds = new Set(prev.map((d) => d.id));
      const toAdd = mapped.filter((m) => !existingIds.has(m.id));
      if (toAdd.length === 0) return prev;
      return [...toAdd, ...prev];
    });

    setSelectedInvoice((cur) => cur || mapped[0] || displayInvoices[0] || null);
  }, [invoices]);

  // Filter invoices based on search
  const filteredInvoices = displayInvoices.filter(
    (invoice) =>
      invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content will span two columns on large screens */}
        <div className="lg:col-span-2">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Invoices</h1>

        {/* Controls: search + create + filter — share same border as table */}
        <div className="flex items-center gap-3 w-full lg:w-auto p-4">
          <div className="flex items-center gap-2 flex-1 lg:flex-none border-gray-200 rounded-lg px-3 py-2 bg-white dark:bg-[#201629] dark:border-transparent">
            <div className="flex items-center gap-2 flex-1">
              <Search className="w-5 h-5 text-gray-400 dark:text-gray-300" />
              <input
                type="text"
                placeholder="Search invoices"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent outline-none text-sm flex-1 placeholder:text-gray-400 dark:placeholder:text-gray-400/70 text-gray-900 dark:text-gray-200"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/dashboard/invoices/new" className="flex-1 lg:flex-none">
              <Button className="w-full lg:w-auto bg-primary dark:bg-green-400 hover:bg-primary/90 text-black font-medium">
                📋 Create Invoice
              </Button>
            </Link>

            <button className="py-2 px-3 border border-gray-200 rounded-lg bg-white dark:bg-[#201629] dark:border-transparent" title="Filter invoices">
              <Filter className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl shadow-sm  overflow-hidden dark:bg-[#201629] p-6">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-[#241b33]">
              <TableHead className="px-6 py-4 text-sm text-gray-600 dark:text-white">NAME/CLIENT</TableHead>
              <TableHead className="px-6 py-4 text-sm text-gray-600 dark:text-white">DATE</TableHead>
              <TableHead className="px-6 py-4 text-sm text-gray-600 dark:text-white">ORDERS/TYPE</TableHead>
              <TableHead className="px-6 py-4 text-sm text-gray-600 dark:text-white">AMOUNT</TableHead>
              <TableHead className="px-6 py-4 text-sm text-gray-600 dark:text-white">STATUS</TableHead>
              <TableHead className="px-6 py-4 text-sm text-gray-600 dark:text-white">ACTION</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((invoice) => (
                <TableRow
                  key={invoice.id}
                  onClick={() => setSelectedInvoice(invoice) as any}
                  className={`transition cursor-pointer ${
                    selectedInvoice?.id === invoice.id ? "bg-gray-50 dark:bg-slate-800" : ""
                  }`}
                >
                  <TableCell className="flex items-center gap-3 px-6 py-5">
                    <Avatar id={invoice.id}>{invoice.avatar}</Avatar>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate dark:text-white">{invoice.clientName}</p>
                      <p className="text-xs truncate text-gray-600 dark:text-gray-300">Inv: {invoice.invoiceNumber}</p>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-5">
                    <p className="text-sm dark:text-white">{invoice.date}</p>
                  </TableCell>
                  <TableCell className="px-6 py-5">
                    <p className="text-sm dark:text-white">{invoice.orderType}</p>
                  </TableCell>
                  <TableCell className="px-6 py-5">
                    <p className="text-sm font-medium dark:text-white">${invoice.amount.toFixed(2)}</p>
                  </TableCell>
                  <TableCell className="px-6 py-5">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                        invoice.status === "paid"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                      }`}
                    >
                      {invoice.status === "paid" ? "Paid" : "Pending"}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-5 text-right">
                    <button
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
                      title="More options"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="w-5 h-5 text-gray-400 dark:text-gray-300" />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="px-6 py-12 text-center" colSpan={6}>
                  <p className="text-gray-600 dark:text-gray-300">No invoices found</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

        {/* Pagination Info */}
        {filteredInvoices.length > 0 && (
          <div className="text-sm text-gray-600 text-center mt-4">
            Showing {filteredInvoices.length} of {displayInvoices.length} invoices
          </div>
        )}
        </div>

        {/* Right side details panel */}
        <aside className="hidden lg:block">
          {selectedInvoice ? (
            <div className="space-y-6">
              {/* Client Details Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 dark:bg-[#201629] dark:border-transparent dark:shadow-none">
                <div className="flex items-center gap-3">
                  <Avatar id={selectedInvoice.id} size={48}>{selectedInvoice.avatar}</Avatar>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{selectedInvoice.clientName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{selectedInvoice.clientEmail}</p>
                  </div>
                </div>

                <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                  <div className="font-medium text-gray-900 dark:text-gray-100">{selectedInvoice.clientName}</div>
                  <div className="text-xs mt-1">{selectedInvoice.invoiceNumber}</div>
                  <button className="mt-4 w-full bg-green-700 text-white py-2 rounded-lg dark:bg-green-800">Add Customer</button>
                </div>
              </div>

              {/* Basic Info Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 dark:bg-[#201629] dark:border-transparent dark:shadow-none">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Basic Info</h3>
                <div className="mt-3 space-y-3 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Invoice Date</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{selectedInvoice.date}</p>
                    </div>
                    <Calendar className="w-5 h-5 text-gray-400 dark:text-gray-400" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Due Date</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">14 May 2022</p>
                    </div>
                    <Calendar className="w-5 h-5 text-gray-400 dark:text-gray-400" />
                  </div>

                  <div className="pt-2">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2 dark:bg-lime-400 dark:text-black">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Send Invoice
                    </Button>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 text-sm text-green-100 bg-[#0f3b2e]">
                      <Eye className="w-4 h-4 text-green-200" /> Preview
                    </button>
                    <button className="flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 text-sm text-green-100 bg-[#0f3b2e]">
                      <Download className="w-4 h-4 text-green-200" /> Download
                    </button>
                  </div>
                </div>
              </div>

              {/* Totals Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-900">${selectedInvoice.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span>Tax</span>
                    <span className="text-green-600">Add</span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span>Total</span>
                    <span className="font-bold text-gray-900">${selectedInvoice.amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-sm text-gray-600">Select an invoice to see details</div>
          )}
        </aside>
      </div>
    </div>
  );
}

