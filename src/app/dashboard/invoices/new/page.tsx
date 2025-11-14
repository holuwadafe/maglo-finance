"use client";

import { useRouter } from "next/navigation";
import { InvoiceDialog } from "@/components/invoices/invoice-dialog";
import { useState } from "react";

export default function NewInvoicePage() {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  return (
    <InvoiceDialog
      invoice={null}
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          router.push("/dashboard/invoices");
        }
      }}
      onSuccess={() => {
        router.push("/dashboard/invoices");
      }}
    />
  );
}

