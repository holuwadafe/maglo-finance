"use client";

import { useState } from "react";
import { Invoice } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import { InvoiceDialog } from "./invoice-dialog";
import { DeleteInvoiceDialog } from "./delete-invoice-dialog";
import { invoiceService } from "@/lib/services/invoice-service";
import { useInvoiceStore } from "@/store/invoice-store";
import { useToast } from "@/components/ui/use-toast";

interface InvoiceTableProps {
  invoices: Invoice[];
  onRefresh: () => void;
}

export function InvoiceTable({ invoices, onRefresh }: InvoiceTableProps) {
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [deletingInvoice, setDeletingInvoice] = useState<Invoice | null>(null);
  const { updateInvoice, deleteInvoice } = useInvoiceStore();
  const { toast } = useToast();

  const handleStatusChange = async (invoice: Invoice) => {
    const newStatus = invoice.status === "paid" ? "unpaid" : "paid";
    try {
      const updated = await invoiceService.updateInvoice(invoice.$id!, {
        status: newStatus,
      });
      updateInvoice(invoice.$id!, updated);
      toast({
        title: "Success",
        description: `Invoice marked as ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update invoice status",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (invoiceId: string) => {
    try {
      await invoiceService.deleteInvoice(invoiceId);
      deleteInvoice(invoiceId);
      toast({
        title: "Success",
        description: "Invoice deleted successfully",
      });
      setDeletingInvoice(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete invoice",
        variant: "destructive",
      });
    }
  };

  if (invoices.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No invoices found.
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[120px]">Client Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="hidden lg:table-cell">VAT</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="hidden md:table-cell">Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.$id}>
                <TableCell className="font-medium">
                  <div>
                    <div>{invoice.clientName}</div>
                    <div className="text-sm text-muted-foreground md:hidden">
                      {invoice.clientEmail}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {invoice.clientEmail}
                </TableCell>
                <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                <TableCell className="hidden lg:table-cell">
                  {formatCurrency(invoice.vatAmount)}
                </TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(invoice.total)}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {formatDate(invoice.dueDate)}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      invoice.status === "paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {invoice.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleStatusChange(invoice)}
                      title={
                        invoice.status === "paid"
                          ? "Mark as Unpaid"
                          : "Mark as Paid"
                      }
                      className="h-8 w-8"
                    >
                      {invoice.status === "paid" ? (
                        <XCircle className="h-4 w-4" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingInvoice(invoice)}
                      className="h-8 w-8"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeletingInvoice(invoice)}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editingInvoice && (
        <InvoiceDialog
          invoice={editingInvoice}
          open={!!editingInvoice}
          onOpenChange={(open) => !open && setEditingInvoice(null)}
          onSuccess={() => {
            setEditingInvoice(null);
            onRefresh();
          }}
        />
      )}

      {deletingInvoice && (
        <DeleteInvoiceDialog
          invoice={deletingInvoice}
          open={!!deletingInvoice}
          onOpenChange={(open) => !open && setDeletingInvoice(null)}
          onConfirm={() => {
            if (deletingInvoice.$id) {
              handleDelete(deletingInvoice.$id);
            }
          }}
        />
      )}
    </>
  );
}

