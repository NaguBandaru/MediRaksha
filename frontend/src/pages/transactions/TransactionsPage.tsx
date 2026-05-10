import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable from '../../components/ui/DataTable';
import type { Column } from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import { Plus, Download } from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  customerName: string;
  totalAmount: number;
  paymentMethod: string;
  status: string;
}

export default function TransactionsPage() {
  const [transactions] = useState<Transaction[]>([
    { id: 'TRX-1001', date: '2023-10-27T10:30:00Z', customerName: 'Alice Smith', totalAmount: 450.50, paymentMethod: 'Card', status: 'Completed' },
    { id: 'TRX-1002', date: '2023-10-27T11:15:00Z', customerName: 'Bob Johnson', totalAmount: 120.00, paymentMethod: 'Cash', status: 'Completed' },
    { id: 'TRX-1003', date: '2023-10-27T14:20:00Z', customerName: 'Charlie Brown', totalAmount: 890.00, paymentMethod: 'UPI', status: 'Pending' },
  ]);

  const columns: Column<Transaction>[] = [
    { header: 'Transaction ID', accessorKey: 'id', className: 'font-medium text-gray-900' },
    { 
      header: 'Date', 
      cell: (tx) => new Date(tx.date).toLocaleString('en-IN')
    },
    { header: 'Customer', accessorKey: 'customerName' },
    { 
      header: 'Amount', 
      cell: (tx) => `₹${tx.totalAmount.toFixed(2)}`
    },
    { header: 'Payment Method', accessorKey: 'paymentMethod' },
    { 
      header: 'Status', 
      cell: (tx) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          tx.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {tx.status}
        </span>
      ) 
    },
    {
      header: 'Actions',
      cell: () => (
        <button className="text-primary-600 hover:text-primary-900 font-medium text-sm flex items-center">
          <Download className="h-4 w-4 mr-1" /> Receipt
        </button>
      )
    }
  ];

  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="sm:flex sm:items-center mb-6">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="mt-2 text-sm text-gray-700">
            View all billing and payment transactions.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex space-x-3">
          <Button variant="outline">
            Export CSV
          </Button>
          <Button onClick={() => navigate('/transactions/new')}>
            <Plus className="-ml-1 mr-2 h-5 w-5" />
            New Sale
          </Button>
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={transactions} 
      />
    </DashboardLayout>
  );
}
