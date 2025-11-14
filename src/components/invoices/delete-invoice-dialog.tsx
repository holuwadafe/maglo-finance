"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Invoice } from "@/types";

interface DeleteInvoiceDialogProps {
  invoice: Invoice;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function DeleteInvoiceDialog({
  invoice,
  open,
  onOpenChange,
  onConfirm,
}: DeleteInvoiceDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Invoice</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the invoice for {invoice.clientName}? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

