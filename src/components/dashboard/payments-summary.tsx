"use client";

import { Invoice } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { differenceInDays, format } from "date-fns";
import { AlertCircle, Calendar } from "lucide-react";

interface PaymentsSummaryProps {
  invoices: Invoice[];
}

export function PaymentsSummary({ invoices }: PaymentsSummaryProps) {
  const paidInvoices = invoices.filter((inv) => inv.status === "paid");
  const unpaidInvoices = invoices.filter((inv) => inv.status === "unpaid");

  const totalOutputVAT = paidInvoices.reduce((sum, inv) => sum + inv.vatAmount, 0);
  const totalPayable = unpaidInvoices.reduce((sum, inv) => sum + inv.total, 0);

  // Group VAT by month
  const monthlyVAT = paidInvoices.reduce((acc, inv) => {
    try {
      const month = format(new Date(inv.dueDate), "MMMM yyyy");
      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month] += inv.vatAmount;
    } catch (error) {
      console.error("Error formatting date:", inv.dueDate);
    }
    return acc;
  }, {} as Record<string, number>);

  // Get overdue and upcoming invoices
  const today = new Date();
  const overdueInvoices = unpaidInvoices.filter((inv) => {
    const dueDate = new Date(inv.dueDate);
    return dueDate < today;
  });

  const upcomingInvoices = unpaidInvoices.filter((inv) => {
    const dueDate = new Date(inv.dueDate);
    const daysUntilDue = differenceInDays(dueDate, today);
    return dueDate >= today && daysUntilDue <= 7;
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>VAT Summary</CardTitle>
            <CardDescription>Output VAT from paid invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Output VAT</p>
                <p className="text-2xl font-bold">{formatCurrency(totalOutputVAT)}</p>
              </div>
              {Object.keys(monthlyVAT).length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Monthly Breakdown</p>
                  <div className="space-y-1">
                    {Object.entries(monthlyVAT)
                      .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
                      .slice(0, 6)
                      .map(([month, amount]) => (
                        <div key={month} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{month}</span>
                          <span className="font-medium">{formatCurrency(amount)}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payments Summary</CardTitle>
            <CardDescription>Pending and overdue payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Payable</p>
                <p className="text-2xl font-bold">{formatCurrency(totalPayable)}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Overdue Invoices</span>
                  <span className="font-medium text-destructive">
                    {overdueInvoices.length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Upcoming (7 days)</span>
                  <span className="font-medium text-orange-600">
                    {upcomingInvoices.length}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {overdueInvoices.length > 0 && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Overdue Invoices
            </CardTitle>
            <CardDescription>Invoices past their due date</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {overdueInvoices.map((invoice) => {
                const daysOverdue = differenceInDays(today, new Date(invoice.dueDate));
                return (
                  <div
                    key={invoice.$id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{invoice.clientName}</p>
                      <p className="text-sm text-muted-foreground">
                        Due: {formatDate(invoice.dueDate)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(invoice.total)}</p>
                      <p className="text-sm text-destructive">
                        {daysOverdue} day{daysOverdue !== 1 ? "s" : ""} overdue
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {upcomingInvoices.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Due Dates
            </CardTitle>
            <CardDescription>Invoices due in the next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingInvoices
                .sort(
                  (a, b) =>
                    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
                )
                .map((invoice) => {
                  const daysUntilDue = differenceInDays(
                    new Date(invoice.dueDate),
                    today
                  );
                  return (
                    <div
                      key={invoice.$id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{invoice.clientName}</p>
                        <p className="text-sm text-muted-foreground">
                          Due: {formatDate(invoice.dueDate)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(invoice.total)}</p>
                        <p className="text-sm text-orange-600">
                          {daysUntilDue === 0
                            ? "Due today"
                            : `${daysUntilDue} day${daysUntilDue !== 1 ? "s" : ""} left`}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

