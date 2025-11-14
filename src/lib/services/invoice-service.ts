import { databases, DATABASE_ID, INVOICES_COLLECTION_ID, ID } from "@/lib/appwrite";
import { Invoice } from "@/types";
import { Models, Query } from "appwrite";

export const invoiceService = {
  async createInvoice(invoice: Omit<Invoice, "$id">): Promise<Invoice> {
    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        INVOICES_COLLECTION_ID,
        ID.unique(),
        {
          clientName: invoice.clientName,
          clientEmail: invoice.clientEmail,
          amount: invoice.amount,
          vatPercentage: invoice.vatPercentage,
          vatAmount: invoice.vatAmount,
          total: invoice.total,
          dueDate: invoice.dueDate,
          status: invoice.status,
          userId: invoice.userId,
        }
      );
      return this.mapDocumentToInvoice(response);
    } catch (error) {
      console.error("Error creating invoice:", error);
      throw error;
    }
  },

  async getInvoices(userId: string): Promise<Invoice[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        INVOICES_COLLECTION_ID,
        [Query.equal("userId", userId), Query.orderDesc("$createdAt")]
      );
      return response.documents.map((doc) => this.mapDocumentToInvoice(doc));
    } catch (error) {
      console.error("Error fetching invoices:", error);
      throw error;
    }
  },

  async updateInvoice(
    invoiceId: string,
    updates: Partial<Invoice>
  ): Promise<Invoice> {
    try {
      const response = await databases.updateDocument(
        DATABASE_ID,
        INVOICES_COLLECTION_ID,
        invoiceId,
        updates
      );
      return this.mapDocumentToInvoice(response);
    } catch (error) {
      console.error("Error updating invoice:", error);
      throw error;
    }
  },

  async deleteInvoice(invoiceId: string): Promise<void> {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        INVOICES_COLLECTION_ID,
        invoiceId
      );
    } catch (error) {
      console.error("Error deleting invoice:", error);
      throw error;
    }
  },

  mapDocumentToInvoice(doc: Models.Document): Invoice {
    return {
      $id: doc.$id,
      clientName: doc.clientName,
      clientEmail: doc.clientEmail,
      amount: doc.amount,
      vatPercentage: doc.vatPercentage,
      vatAmount: doc.vatAmount,
      total: doc.total,
      dueDate: doc.dueDate,
      status: doc.status,
      userId: doc.userId,
      createdAt: doc.$createdAt,
      updatedAt: doc.$updatedAt,
    };
  },
};

