'use client';

import { XMarkIcon, PrinterIcon, CurrencyDollarIcon, CalendarIcon, ReceiptRefundIcon } from '@heroicons/react/24/outline';
import { formatCurrency, formatDateTime } from '@/lib/utils/format';
import { ShiftSummary as ShiftSummaryType } from '@/lib/api/services/shifts';

interface ShiftSummaryProps {
  shiftSummary: ShiftSummaryType;
  onClose: () => void;
}

export default function ShiftSummary({ shiftSummary, onClose }: ShiftSummaryProps) {
  if (!shiftSummary) return null;
  
  const shift = shiftSummary.shift;
  const summary = shiftSummary.summary;
  
  const printShiftSummary = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups to print the shift summary');
      return;
    }
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Shift Summary #${shift.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 30px; }
            h1, h2 { text-align: center; }
            .summary-box { border: 1px solid #ccc; padding: 15px; margin-bottom: 15px; }
            .row { display: flex; justify-content: space-between; padding: 5px 0; }
            .total { font-weight: bold; border-top: 1px solid #ccc; padding-top: 10px; margin-top: 10px; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>Shift Summary</h1>
          <h2>Shift #${shift.id}</h2>
          
          <div class="summary-box">
            <div class="row">
              <span>Staff:</span>
              <span>${shift.user?.name || 'N/A'}</span>
            </div>
            <div class="row">
              <span>Warehouse:</span>
              <span>${shift.warehouse?.name || 'N/A'}</span>
            </div>
            <div class="row">
              <span>Start Time:</span>
              <span>${formatDateTime(shift.startTime)}</span>
            </div>
            <div class="row">
              <span>End Time:</span>
              <span>${shift.endTime ? formatDateTime(shift.endTime) : 'N/A'}</span>
            </div>
            <div class="row">
              <span>Start Amount:</span>
              <span>${formatCurrency(shift.startAmount)}</span>
            </div>
            <div class="row">
              <span>End Amount:</span>
              <span>${shift.endAmount ? formatCurrency(shift.endAmount) : 'N/A'}</span>
            </div>
          </div>
          
          <h3>Sales Summary</h3>
          <div class="summary-box">
            <div class="row">
              <span>Total Sales:</span>
              <span>${formatCurrency(summary.totalSales)}</span>
            </div>
            <div class="row">
              <span>Total Received:</span>
              <span>${formatCurrency(summary.totalReceived)}</span>
            </div>
            <div class="row">
              <span>Total Paid:</span>
              <span>${formatCurrency(summary.totalPaid)}</span>
            </div>
            <div class="row total">
              <span>Calculated Balance:</span>
              <span>${formatCurrency(summary.calculatedBalance)}</span>
            </div>
            <div class="row">
              <span>Declared End Amount:</span>
              <span>${formatCurrency(summary.declaredEndAmount)}</span>
            </div>
            <div class="row total">
              <span>Difference:</span>
              <span>${formatCurrency(summary.difference)}</span>
            </div>
          </div>
          
          <h3>Transactions (${shiftSummary.invoices.length})</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Time</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              ${shiftSummary.invoices.map((invoice: any) => `
                <tr>
                  <td>${invoice.code || invoice.id}</td>
                  <td>${formatDateTime(invoice.createdAt)}</td>
                  <td>${invoice.customer?.name || 'Walk-in customer'}</td>
                  <td>${formatCurrency(invoice.total)}</td>
                  <td>${invoice.paymentMethod}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
          <h3 className="font-medium text-lg">Shift Summary #<span className="font-bold">{shift.id}</span></h3>
          <div className="flex space-x-2">
            <button 
              onClick={printShiftSummary}
              className="text-blue-600 hover:text-blue-700 flex items-center"
              title="Print summary"
            >
              <PrinterIcon className="h-5 w-5" />
            </button>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              title="Close"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shift Details */}
            <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
              <h4 className="text-lg font-medium mb-4 flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2 text-blue-600" />
                Shift Details
              </h4>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Staff:</span>
                  <span className="font-medium">{shift.user?.name || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Warehouse:</span>
                  <span className="font-medium">{shift.warehouse?.name || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Start Time:</span>
                  <span className="font-medium">{formatDateTime(shift.startTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">End Time:</span>
                  <span className="font-medium">{shift.endTime ? formatDateTime(shift.endTime) : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Start Amount:</span>
                  <span className="font-medium">{formatCurrency(shift.startAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">End Amount:</span>
                  <span className="font-medium">{shift.endAmount ? formatCurrency(shift.endAmount) : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${shift.status === 'open' ? 'text-green-600' : 'text-gray-600'}`}>
                    {shift.status === 'open' ? 'Open' : 'Closed'}
                  </span>
                </div>
                {shift.notes && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <span className="text-gray-600 block mb-1">Notes:</span>
                    <p className="text-gray-800 text-sm">{shift.notes}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Financial Summary */}
            <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
              <h4 className="text-lg font-medium mb-4 flex items-center">
                <CurrencyDollarIcon className="h-5 w-5 mr-2 text-blue-600" />
                Financial Summary
              </h4>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Sales:</span>
                  <span className="font-medium">{formatCurrency(summary.totalSales)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Received:</span>
                  <span className="font-medium">{formatCurrency(summary.totalReceived)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Paid:</span>
                  <span className="font-medium">{formatCurrency(summary.totalPaid)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-300 pt-2 mt-2">
                  <span className="text-gray-700 font-medium">Calculated Balance:</span>
                  <span className="font-bold text-blue-700">{formatCurrency(summary.calculatedBalance)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Declared End Amount:</span>
                  <span className="font-medium">{formatCurrency(summary.declaredEndAmount)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-300 pt-2 mt-2">
                  <span className="text-gray-700 font-medium">Difference:</span>
                  <span className={`font-bold ${
                    summary.difference === 0 
                      ? 'text-green-600' 
                      : Math.abs(summary.difference) < 10 
                        ? 'text-yellow-600' 
                        : 'text-red-600'
                  }`}>
                    {formatCurrency(summary.difference)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Transaction List */}
          <div className="mt-6">
            <h4 className="text-lg font-medium mb-4 flex items-center">
              <ReceiptRefundIcon className="h-5 w-5 mr-2 text-blue-600" />
              Transactions ({shiftSummary.invoices.length})
            </h4>
            
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              {shiftSummary.invoices.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Invoice #
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {shiftSummary.invoices.map((invoice: any) => (
                      <tr key={invoice.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {invoice.code || invoice.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDateTime(invoice.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {invoice.customer?.name || 'Walk-in customer'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {formatCurrency(invoice.total)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            invoice.paymentMethod === 'cash' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {invoice.paymentMethod === 'cash' ? 'Cash' : 'Card'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  No transactions during this shift
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 px-6 py-4 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
