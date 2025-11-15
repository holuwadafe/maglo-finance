import { Invoice } from "@/types";

// DEMO MODE: Mock storage (Appwrite backend commented out)
// Replace this with actual Appwrite calls when ready for production
const mockInvoiceStorage: { [key: string]: Invoice[] } = {};

const generateId = () => {
  return `invoice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const invoiceService = {
  async createInvoice(invoice: Omit<Invoice, "$id">): Promise<Invoice> {
    try {
      // DEMO MODE: Generate local ID and store locally
      const id = generateId();
      const now = new Date().toISOString();
      const created: Invoice = {
        ...invoice,
        $id: id,
        createdAt: now,
        updatedAt: now,
      };

      if (!mockInvoiceStorage[invoice.userId]) {
        mockInvoiceStorage[invoice.userId] = [];
      }
      mockInvoiceStorage[invoice.userId].push(created);
      return created;
      
      /* APPWRITE BACKEND (commented out for demo)
      const response = await databases.createDocument(
        DATABASE_ID,
        INVOICES_COLLECTION_ID,
        ID.unique(),
        { ...invoice }
      );
      return this.mapDocumentToInvoice(response);
      */
    } catch (error) {
      console.error("Error creating invoice:", error);
      throw error;
    }
  },

  async getInvoices(userId: string): Promise<Invoice[]> {
    try {
      // DEMO MODE: Return mock data
      return mockInvoiceStorage[userId] || [];
      
      /* APPWRITE BACKEND (commented out for demo)
      const response = await databases.listDocuments(
        DATABASE_ID,
        INVOICES_COLLECTION_ID,
        [Query.equal("userId", userId), Query.orderDesc("$createdAt")]
      );
      return response.documents.map((doc) => this.mapDocumentToInvoice(doc));
      */
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
      // DEMO MODE: Find and update in mock storage
      for (const userId in mockInvoiceStorage) {
        const invoice = mockInvoiceStorage[userId].find((inv) => inv.$id === invoiceId);
        if (invoice) {
          const updated = { ...invoice, ...updates, updatedAt: new Date().toISOString() };
          const index = mockInvoiceStorage[userId].indexOf(invoice);
          mockInvoiceStorage[userId][index] = updated;
          return updated;
        }
      }
      throw new Error("Invoice not found");
      
      /* APPWRITE BACKEND (commented out for demo)
      const response = await databases.updateDocument(
        DATABASE_ID,
        INVOICES_COLLECTION_ID,
        invoiceId,
        updates
      );
      return this.mapDocumentToInvoice(response);
      */
    } catch (error) {
      console.error("Error updating invoice:", error);
      throw error;
    }
  },

  async deleteInvoice(invoiceId: string): Promise<void> {
    try {
      // DEMO MODE: Delete from mock storage
      for (const userId in mockInvoiceStorage) {
        const index = mockInvoiceStorage[userId].findIndex((inv) => inv.$id === invoiceId);
        if (index !== -1) {
          mockInvoiceStorage[userId].splice(index, 1);
          return;
        }
      }
      throw new Error("Invoice not found");
      
      /* APPWRITE BACKEND (commented out for demo)
      await databases.deleteDocument(
        DATABASE_ID,
        INVOICES_COLLECTION_ID,
        invoiceId
      );
      */
    } catch (error) {
      console.error("Error deleting invoice:", error);
      throw error;
    }
  },

  /* APPWRITE HELPER (commented out)
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
  */
};

