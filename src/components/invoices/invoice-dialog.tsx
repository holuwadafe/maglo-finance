"use client";

import { useState, useEffect } from "react";
import { Invoice } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { invoiceService } from "@/lib/services/invoice-service";
import { useAuthStore } from "@/store/auth-store";
import { useInvoiceStore } from "@/store/invoice-store";
import { useToast } from "@/components/ui/use-toast";

const invoiceSchema = z.object({
  clientName: z.string().min(1, "Client name is required"),
  clientEmail: z.string().email("Invalid email address"),
  amount: z.number().min(0, "Amount must be positive"),
  vatPercentage: z.number().min(0).max(100),
  dueDate: z.string().min(1, "Due date is required"),
  status: z.enum(["paid", "unpaid"]),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

interface InvoiceDialogProps {
  invoice?: Invoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function InvoiceDialog({
  invoice,
  open,
  onOpenChange,
  onSuccess,
}: InvoiceDialogProps) {
  const { user } = useAuthStore();
  const { addInvoice, updateInvoice } = useInvoiceStore();
  const { toast } = useToast();
  const [showSuccess, setShowSuccess] = useState(false);
  const [vatAmount, setVatAmount] = useState(0);
  const [total, setTotal] = useState(0);

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: invoice
      ? {
          clientName: invoice.clientName,
          clientEmail: invoice.clientEmail,
          amount: invoice.amount,
          vatPercentage: invoice.vatPercentage,
          dueDate: invoice.dueDate.split("T")[0],
          status: invoice.status,
        }
      : {
          clientName: "",
          clientEmail: "",
          amount: 0,
          vatPercentage: 7.5,
          dueDate: "",
          status: "unpaid",
        },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
  } = form;

  const amount = watch("amount");
  const vatPercentage = watch("vatPercentage");

  useEffect(() => {
    if (invoice) {
      reset({
        clientName: invoice.clientName,
        clientEmail: invoice.clientEmail,
        amount: invoice.amount,
        vatPercentage: invoice.vatPercentage,
        dueDate: invoice.dueDate.split("T")[0],
        status: invoice.status,
      });
      setVatAmount(invoice.vatAmount);
      setTotal(invoice.total);
    } else {
      reset({
        clientName: "",
        clientEmail: "",
        amount: 0,
        vatPercentage: 7.5,
        dueDate: "",
        status: "unpaid",
      });
      setVatAmount(0);
      setTotal(0);
    }
  }, [invoice, reset, open]);

  useEffect(() => {
    const calculatedVat = (amount * vatPercentage) / 100;
    const calculatedTotal = amount + calculatedVat;
    setVatAmount(calculatedVat);
    setTotal(calculatedTotal);
  }, [amount, vatPercentage]);

  const onSubmit = async (data: InvoiceFormData) => {
    if (!user?.$id) return;

    try {
      const invoiceData = {
        ...data,
        vatAmount,
        total,
        userId: user.$id,
        dueDate: new Date(data.dueDate).toISOString(),
      };

      if (invoice?.$id) {
        const updated = await invoiceService.updateInvoice(invoice.$id, invoiceData);
        updateInvoice(invoice.$id, updated);
        // show success modal for update
        setShowSuccess(true);
      } else {
        const created = await invoiceService.createInvoice(invoiceData);
        addInvoice(created);
        // show success modal for create
        setShowSuccess(true);
      }
      // do not immediately close or navigate — wait for user to dismiss success modal
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save invoice",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{invoice ? "Edit Invoice" : "Create Invoice"}</DialogTitle>
          <DialogDescription>
            {invoice ? "Update invoice details" : "Create a new invoice"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                {...register("clientName")}
                placeholder="John Doe"
              />
              {errors.clientName && (
                <p className="text-sm text-destructive">{errors.clientName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientEmail">Client Email</Label>
              <Input
                id="clientEmail"
                type="email"
                {...register("clientEmail")}
                placeholder="john@example.com"
              />
              {errors.clientEmail && (
                <p className="text-sm text-destructive">{errors.clientEmail.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₦)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                {...register("amount", { valueAsNumber: true })}
                placeholder="0.00"
              />
              {errors.amount && (
                <p className="text-sm text-destructive">{errors.amount.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="vatPercentage">VAT (%)</Label>
              <Input
                id="vatPercentage"
                type="number"
                step="0.1"
                {...register("vatPercentage", { valueAsNumber: true })}
                placeholder="7.5"
              />
              {errors.vatPercentage && (
                <p className="text-sm text-destructive">
                  {errors.vatPercentage.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                {...register("dueDate")}
              />
              {errors.dueDate && (
                <p className="text-sm text-destructive">{errors.dueDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={watch("status")}
                onValueChange={(value) => setValue("status", value as "paid" | "unpaid", { shouldValidate: true })}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-destructive">{errors.status.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
            <div>
              <Label className="text-sm text-muted-foreground">VAT Amount</Label>
              <p className="text-lg font-semibold">₦{vatAmount.toFixed(2)}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Total</Label>
              <p className="text-lg font-semibold">₦{total.toFixed(2)}</p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : invoice ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>

        {/* Success modal shown after create/update */}
        <Dialog open={showSuccess} onOpenChange={(v) => setShowSuccess(v)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Success</DialogTitle>
              <DialogDescription>
                {invoice ? "Invoice updated successfully" : "Invoice created successfully"}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                onClick={() => {
                  setShowSuccess(false);
                  onOpenChange(false);
                  onSuccess();
                }}
              >
                OK
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </Dialog>
  );
}

