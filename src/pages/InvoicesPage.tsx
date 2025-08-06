
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, FileText, Download, Eye } from 'lucide-react';

interface Invoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  total: number;
  status: 'paid' | 'unpaid' | 'cancelled' | 'refunded';
}

const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: '10147665',
    invoiceDate: '26th Jun 2025',
    dueDate: '1st Jul 2025',
    total: 29.95,
    status: 'unpaid'
  },
  {
    id: '2', 
    invoiceNumber: '8486029',
    invoiceDate: '29th Jan 2023',
    dueDate: '29th Jan 2023',
    total: 18.95,
    status: 'paid'
  },
  {
    id: '3',
    invoiceNumber: '8538685',
    invoiceDate: '24th Feb 2023',
    dueDate: '1st Mar 2023',
    total: 18.95,
    status: 'paid'
  },
  {
    id: '4',
    invoiceNumber: '8601573',
    invoiceDate: '27th Mar 2023',
    dueDate: '1st Apr 2023',
    total: 18.95,
    status: 'paid'
  },
  {
    id: '5',
    invoiceNumber: '8663985',
    invoiceDate: '26th Apr 2023',
    dueDate: '1st May 2023',
    total: 18.95,
    status: 'paid'
  },
  {
    id: '6',
    invoiceNumber: '8725897',
    invoiceDate: '27th May 2023',
    dueDate: '1st Jun 2023',
    total: 18.95,
    status: 'paid'
  },
  {
    id: '7',
    invoiceNumber: '8786981',
    invoiceDate: '26th Jun 2023',
    dueDate: '1st Jul 2023',
    total: 18.95,
    status: 'paid'
  }
];

const InvoicesPage = () => {
  const navigate = useNavigate();
  const [invoices] = useState<Invoice[]>(mockInvoices);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-600 dark:text-green-400';
      case 'unpaid':
        return 'text-red-600 dark:text-red-400';
      case 'cancelled':
        return 'text-gray-600 dark:text-gray-400';
      case 'refunded':
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)} USD`;
  };

  const handleViewInvoice = (invoiceId: string) => {
    navigate(`/invoice-detail/${invoiceId}`);
  };

  const handleDownloadInvoice = (invoiceNumber: string) => {
    // Create a simple text content for the invoice
    const invoiceContent = `Invoice #${invoiceNumber}\nDownloaded from CloudHouse Technologies`;
    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${invoiceNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const unpaidInvoices = invoices.filter(inv => inv.status === 'unpaid');
  const unpaidTotal = unpaidInvoices.reduce((sum, inv) => sum + inv.total, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 shadow-xl border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => navigate('/services')}
                className="text-white hover:bg-white/10 mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Services
              </Button>
              <img 
                src="/lovable-uploads/518f19f5-443d-435c-a6c8-889da6f424d4.png" 
                alt="CloudHouse Technologies" 
                className="h-8 w-auto mr-3"
              />
              <h1 className="text-xl font-semibold text-white">My Invoices</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">My Invoices</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Your invoice history with us</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Unpaid Invoices Alert */}
            {unpaidInvoices.length > 0 && (
              <Card className="mb-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-red-500 mr-2" />
                    <span className="font-medium text-red-700 dark:text-red-300">
                      {unpaidInvoices.length} Invoices Due
                    </span>
                  </div>
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    You have {unpaidInvoices.length} invoice(s) currently unpaid with a total balance of {formatCurrency(unpaidTotal)}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Status Filter */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-200">Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Paid</span>
                  <span className="text-gray-900 dark:text-white">{invoices.filter(i => i.status === 'paid').length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Unpaid</span>
                  <span className="text-gray-900 dark:text-white">{invoices.filter(i => i.status === 'unpaid').length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Cancelled</span>
                  <span className="text-gray-900 dark:text-white">{invoices.filter(i => i.status === 'cancelled').length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Refunded</span>
                  <span className="text-gray-900 dark:text-white">{invoices.filter(i => i.status === 'refunded').length}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-gray-900 dark:text-white">
                    Showing 1 to 10 of {invoices.length} entries
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-gray-700 dark:text-gray-200">Invoice #</TableHead>
                      <TableHead className="text-gray-700 dark:text-gray-200">Invoice Date</TableHead>
                      <TableHead className="text-gray-700 dark:text-gray-200">Due Date</TableHead>
                      <TableHead className="text-gray-700 dark:text-gray-200">Total</TableHead>
                      <TableHead className="text-gray-700 dark:text-gray-200">Status</TableHead>
                      <TableHead className="text-gray-700 dark:text-gray-200">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium text-gray-900 dark:text-white">
                          {invoice.invoiceNumber}
                        </TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-200">
                          {invoice.invoiceDate}
                        </TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-200">
                          {invoice.dueDate}
                        </TableCell>
                        <TableCell className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(invoice.total)}
                        </TableCell>
                        <TableCell>
                          <span className={`font-medium capitalize ${getStatusColor(invoice.status)}`}>
                            {invoice.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleViewInvoice(invoice.id)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDownloadInvoice(invoice.invoiceNumber)}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InvoicesPage;
