
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Download, Printer } from 'lucide-react';

interface InvoiceDetail {
  id: string;
  invoiceNumber: string;
  status: 'paid' | 'unpaid';
  dueDate: string;
  invoiceDate: string;
  invoicedTo: {
    company: string;
    name: string;
    address: string[];
  };
  payTo: {
    company: string;
    address: string[];
    vatNumber: string;
  };
  items: {
    description: string;
    amount: number;
  }[];
  subTotal: number;
  credit: number;
  total: number;
  balance: number;
}

const mockInvoiceDetails: { [key: string]: InvoiceDetail } = {
  '1': {
    id: '1',
    invoiceNumber: '10147665',
    status: 'unpaid',
    dueDate: '15th Aug 2025',
    invoiceDate: '10th Aug 2025',
    invoicedTo: {
      company: 'TechStart Solutions Ltd',
      name: 'Sarah Johnson',
      address: [
        'Mumbai, Maharashtra',
        'Andheri West, Mumbai, 400058',
        'India'
      ]
    },
    payTo: {
      company: 'CloudHouse Technologies Pvt Ltd',
      address: [
        'Tech Park Plaza',
        'Electronic City Phase 1',
        'Bangalore, Karnataka',
        '560100, India'
      ],
      vatNumber: 'IN 29ABCDE1234F1Z5'
    },
    items: [
      {
        description: 'Premium Web Hosting - Annual Plan (15/08/2025 - 14/08/2026)',
        amount: 149.99
      }
    ],
    subTotal: 149.99,
    credit: 0.00,
    total: 149.99,
    balance: 149.99
  }
};

const InvoiceDetailPage = () => {
  const navigate = useNavigate();
  const { invoiceId } = useParams();
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  
  const invoice = mockInvoiceDetails[invoiceId || '1'];

  if (!invoice) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card>
          <CardContent className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Invoice Not Found</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">The requested invoice could not be found.</p>
            <Button onClick={() => navigate('/invoices')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Invoices
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const invoiceContent = `Invoice #${invoice.invoiceNumber}\nTotal: $${invoice.total.toFixed(2)} USD\nStatus: ${invoice.status.toUpperCase()}`;
    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${invoice.invoiceNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)} USD`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/invoices')}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Back to Client Area
          </Button>
        </div>

        <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
          <CardContent className="p-8">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center">
                <img 
                  src="/lovable-uploads/518f19f5-443d-435c-a6c8-889da6f424d4.png" 
                  alt="WHMCS"
                  className="h-12 w-auto mr-4"
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Invoice #{invoice.invoiceNumber}
                  </h1>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold mb-2 ${
                  invoice.status === 'unpaid' ? 'text-red-600' : 'text-green-600'
                }`}>
                  {invoice.status.toUpperCase()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Due Date: {invoice.dueDate}
                </div>
                {invoice.status === 'unpaid' && (
                  <Button className="mt-2 bg-green-600 hover:bg-green-700 text-white">
                    Pay Now
                  </Button>
                )}
              </div>
            </div>

            {/* Invoice Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Invoiced To</h3>
                <div className="text-gray-700 dark:text-gray-300">
                  <div className="font-medium">{invoice.invoicedTo.company}</div>
                  <div>{invoice.invoicedTo.name}</div>
                  {invoice.invoicedTo.address.map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Pay To</h3>
                <div className="text-gray-700 dark:text-gray-300">
                  <div className="font-medium">{invoice.payTo.company}</div>
                  {invoice.payTo.address.map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
                  <div className="mt-2">VAT Number: {invoice.payTo.vatNumber}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Invoice Date</h3>
                <div className="text-gray-700 dark:text-gray-300">{invoice.invoiceDate}</div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Payment Method</h3>
                <select 
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option>Credit Card</option>
                  <option>Bank Transfer</option>
                  <option>PayPal</option>
                </select>
              </div>
            </div>

            {/* Invoice Items */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 bg-gray-100 dark:bg-gray-700 p-3 rounded">
                Invoice Items
              </h3>
              <div className="border dark:border-gray-600 rounded">
                <div className="grid grid-cols-2 border-b dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                  <div className="p-3 font-medium text-gray-900 dark:text-white">Description</div>
                  <div className="p-3 font-medium text-gray-900 dark:text-white text-right">Amount</div>
                </div>
                {invoice.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-2 border-b dark:border-gray-600 last:border-b-0">
                    <div className="p-3 text-gray-700 dark:text-gray-300">{item.description}</div>
                    <div className="p-3 text-gray-900 dark:text-white text-right font-medium">
                      {formatCurrency(item.amount)}
                    </div>
                  </div>
                ))}
                <div className="grid grid-cols-2 border-b dark:border-gray-600">
                  <div className="p-3 text-right font-medium text-gray-900 dark:text-white">Sub Total</div>
                  <div className="p-3 text-right font-medium text-gray-900 dark:text-white">
                    {formatCurrency(invoice.subTotal)}
                  </div>
                </div>
                <div className="grid grid-cols-2 border-b dark:border-gray-600">
                  <div className="p-3 text-right font-medium text-gray-900 dark:text-white">Credit</div>
                  <div className="p-3 text-right font-medium text-gray-900 dark:text-white">
                    {formatCurrency(invoice.credit)}
                  </div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="p-3 text-right font-bold text-gray-900 dark:text-white">Total</div>
                  <div className="p-3 text-right font-bold text-gray-900 dark:text-white">
                    {formatCurrency(invoice.total)}
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Info */}
            <div className="mb-8">
              <div className="grid grid-cols-4 gap-4 border-b dark:border-gray-600 pb-2 mb-2">
                <div className="font-medium text-gray-900 dark:text-white">Transaction Date</div>
                <div className="font-medium text-gray-900 dark:text-white">Gateway</div>
                <div className="font-medium text-gray-900 dark:text-white">Transaction ID</div>
                <div className="font-medium text-gray-900 dark:text-white">Amount</div>
              </div>
              <div className="text-center text-gray-600 dark:text-gray-400 py-4">
                No Related Transactions Found
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-900 dark:text-white">
                  Balance: {formatCurrency(invoice.balance)}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <Button onClick={handlePrint} variant="outline">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button onClick={handleDownload} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvoiceDetailPage;
