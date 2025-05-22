import { formatCurrency, formatDateTime } from './format';

interface InvoiceItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  total: number;
  taxRate?: number;
}

interface Customer {
  id: number;
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

interface InvoiceData {
  invoiceId: string;
  date: Date;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount?: number;
  total: number;
  customer?: Customer;
  paymentMethod: 'cash' | 'card';
  paidAmount?: number;
  notes?: string;
  storeName: string;
  storeAddress?: string;
  storePhone?: string;
  storeEmail?: string;
  storeWebsite?: string;
  logoUrl?: string;
}

/**
 * Generate a printable invoice and open in a new window
 */
export const printInvoice = (data: InvoiceData): void => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow pop-ups to print the invoice');
    return;
  }
  
  const { 
    invoiceId, 
    date, 
    items, 
    subtotal, 
    tax, 
    discount = 0, 
    total, 
    customer,
    paymentMethod, 
    paidAmount,
    notes,
    storeName,
    storeAddress,
    storePhone,
    storeEmail,
    storeWebsite,
    logoUrl
  } = data;
  
  // Generate HTML for the invoice
  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice #${invoiceId}</title>
      <style>
        @media print {
          @page { margin: 0; }
          body { margin: 1cm; }
        }
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          color: #333;
          font-size: 12px;
        }
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .invoice-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
        }
        .logo {
          max-height: 80px;
          max-width: 200px;
        }
        .invoice-title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 5px;
          color: #2563eb;
        }
        .invoice-id {
          font-size: 16px;
          margin-bottom: 5px;
        }
        .invoice-meta {
          margin-top: 20px;
          display: flex;
          justify-content: space-between;
        }
        .customer-info, .invoice-info {
          width: 48%;
        }
        .section-title {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 8px;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 5px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th {
          background-color: #f3f4f6;
          text-align: left;
          padding: 10px;
          font-size: 12px;
          font-weight: bold;
        }
        td {
          padding: 10px;
          border-bottom: 1px solid #e5e7eb;
          font-size: 12px;
        }
        .text-right {
          text-align: right;
        }
        .summary {
          margin-top: 20px;
          margin-left: auto;
          width: 300px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 5px 0;
        }
        .total {
          font-weight: bold;
          padding-top: 10px;
          margin-top: 10px;
          font-size: 16px;
          border-top: 1px solid #e5e7eb;
        }
        .notes {
          margin-top: 30px;
          border-top: 1px solid #e5e7eb;
          padding-top: 10px;
        }
        .footer {
          margin-top: 50px;
          text-align: center;
          font-size: 12px;
          color: #6b7280;
        }
        .payment-method {
          padding: 10px;
          background-color: #f3f4f6;
          border-radius: 5px;
          margin-top: 20px;
          display: inline-block;
        }
        .barcode {
          text-align: center;
          margin-top: 40px;
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="invoice-header">
          <div>
            ${logoUrl ? `<img src="${logoUrl}" alt="Company Logo" class="logo">` : ''}
            <div class="invoice-title">${storeName}</div>
            ${storeAddress ? `<div>${storeAddress}</div>` : ''}
            ${storePhone ? `<div>Phone: ${storePhone}</div>` : ''}
            ${storeEmail ? `<div>Email: ${storeEmail}</div>` : ''}
            ${storeWebsite ? `<div>Website: ${storeWebsite}</div>` : ''}
          </div>
          <div>
            <div class="invoice-title">INVOICE</div>
            <div class="invoice-id">Invoice #: ${invoiceId}</div>
            <div>Date: ${formatDateTime(date)}</div>
          </div>
        </div>
        
        <div class="invoice-meta">
          <div class="customer-info">
            <div class="section-title">BILL TO</div>
            <div>${customer ? customer.name : 'Walk-in Customer'}</div>
            ${customer?.phone ? `<div>Phone: ${customer.phone}</div>` : ''}
            ${customer?.email ? `<div>Email: ${customer.email}</div>` : ''}
            ${customer?.address ? `<div>Address: ${customer.address}</div>` : ''}
          </div>
          <div class="invoice-info">
            <div class="section-title">PAYMENT INFO</div>
            <div>Method: ${paymentMethod === 'cash' ? 'Cash' : 'Card'}</div>
            <div>Status: Paid</div>
            <div>Amount: ${formatCurrency(paidAmount || total)}</div>
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${formatCurrency(item.price)}</td>
                <td class="text-right">${formatCurrency(item.total)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="summary">
          <div class="summary-row">
            <div>Subtotal:</div>
            <div>${formatCurrency(subtotal)}</div>
          </div>
          <div class="summary-row">
            <div>Tax:</div>
            <div>${formatCurrency(tax)}</div>
          </div>
          ${discount > 0 ? `
            <div class="summary-row">
              <div>Discount:</div>
              <div>-${formatCurrency(discount)}</div>
            </div>
          ` : ''}
          <div class="summary-row total">
            <div>Total:</div>
            <div>${formatCurrency(total)}</div>
          </div>
        </div>
        
        ${notes ? `
          <div class="notes">
            <div class="section-title">NOTES</div>
            <div>${notes}</div>
          </div>
        ` : ''}
        
        <div class="footer">
          <p>Thank you for your business!</p>
        </div>
        
        <div class="barcode">
          <svg id="barcode"></svg>
        </div>
      </div>
      
      <!-- Include barcode generator -->
      <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
      <script>
        // Generate barcode with the invoice ID
        JsBarcode("#barcode", "${invoiceId}", {
          format: "CODE128",
          lineColor: "#000",
          width: 2,
          height: 50,
          displayValue: true
        });
        
        // Automatically print and then close if in print mode
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 500);
        };
      </script>
    </body>
    </html>
  `);
  
  printWindow.document.close();
  printWindow.focus();
};

/**
 * Generate a unique invoice ID
 */
export const generateInvoiceId = (): string => {
  const prefix = 'INV';
  const timestamp = Date.now().toString().substring(5);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${timestamp}${random}`;
};
