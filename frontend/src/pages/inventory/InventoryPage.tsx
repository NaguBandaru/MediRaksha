import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable from '../../components/ui/DataTable';
import type { Column } from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import { Package, AlertCircle, Calendar, ArrowUpRight, ArrowDownLeft, History } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

interface InventoryBatch {
  id: string;
  medicineName: string;
  batchNumber: string;
  manufacturingDate: string;
  expiryDate: string;
  availableQuantity: number;
  purchasePrice: number;
  sellingPrice: number;
  taxPercentage: number;
}

export default function InventoryPage() {
  const [batches, setBatches] = useState<InventoryBatch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<'all' | 'low-stock' | 'expiring'>('all');

  useEffect(() => {
    fetchInventory();
  }, [view]);

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      // In a real app, these would be filtered on backend
      const response = await api.get('/inventorybatches');
      let data = response.data.data || [];
      
      if (view === 'low-stock') {
        data = data.filter((b: any) => b.availableQuantity < 50);
      } else if (view === 'expiring') {
        const soon = new Date();
        soon.setMonth(soon.getMonth() + 3);
        data = data.filter((b: any) => new Date(b.expiryDate) <= soon);
      }
      
      setBatches(data);
    } catch (error) {
      toast.error('Failed to load inventory');
    } finally {
      setIsLoading(false);
    }
  };

  const columns: Column<InventoryBatch>[] = [
    { 
      header: 'Medicine', 
      accessorKey: 'medicineName',
      className: 'font-bold text-gray-900 dark:text-white'
    },
    { 
      header: 'Batch No.', 
      accessorKey: 'batchNumber',
      className: 'font-mono text-xs uppercase'
    },
    { 
      header: 'Stock', 
      cell: (b) => (
        <span className={`font-bold ${b.availableQuantity < 20 ? 'text-red-600' : 'text-green-600'}`}>
          {b.availableQuantity}
        </span>
      )
    },
    { 
      header: 'Expiry', 
      cell: (b) => {
        const expDate = new Date(b.expiryDate);
        const isExpired = expDate < new Date();
        return (
          <span className={isExpired ? 'text-red-600 font-bold' : 'text-gray-600 dark:text-gray-400'}>
            {expDate.toLocaleDateString()}
          </span>
        );
      }
    },
    { header: 'Purchase', cell: (b) => `₹${b.purchasePrice.toFixed(2)}` },
    { header: 'Selling', cell: (b) => `₹${b.sellingPrice.toFixed(2)}` },
    { 
      header: 'Value', 
      cell: (b) => <span className="font-bold">₹{(b.availableQuantity * b.purchasePrice).toFixed(2)}</span>
    }
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        {/* Inventory Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <Package className="text-primary-600" size={20} />
              <span className="text-[10px] font-bold text-gray-400 uppercase">Total Items</span>
            </div>
            <div className="text-2xl font-black text-gray-900 dark:text-white">{batches.length}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700 border-l-4 border-l-red-500">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="text-red-600" size={20} />
              <span className="text-[10px] font-bold text-gray-400 uppercase">Low Stock</span>
            </div>
            <div className="text-2xl font-black text-red-600">12</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700 border-l-4 border-l-orange-500">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="text-orange-600" size={20} />
              <span className="text-[10px] font-bold text-gray-400 uppercase">Expiring (3m)</span>
            </div>
            <div className="text-2xl font-black text-orange-600">5</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <History className="text-blue-600" size={20} />
              <span className="text-[10px] font-bold text-gray-400 uppercase">Inventory Value</span>
            </div>
            <div className="text-2xl font-black text-gray-900 dark:text-white">₹2,45,000</div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border dark:border-gray-700 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            <button 
              onClick={() => setView('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded ${view === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 hover:bg-gray-200'}`}
            >
              All Stock
            </button>
            <button 
              onClick={() => setView('low-stock')}
              className={`px-3 py-1.5 text-xs font-bold rounded ${view === 'low-stock' ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 hover:bg-gray-200'}`}
            >
              Critical Stock
            </button>
            <button 
              onClick={() => setView('expiring')}
              className={`px-3 py-1.5 text-xs font-bold rounded ${view === 'expiring' ? 'bg-orange-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 hover:bg-gray-200'}`}
            >
              Expiring Batches
            </button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="py-1 text-xs">
              <ArrowDownLeft size={14} className="mr-1" /> Stock In
            </Button>
            <Button variant="outline" className="py-1 text-xs">
              <ArrowUpRight size={14} className="mr-1" /> Stock Out
            </Button>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 overflow-hidden">
          <DataTable 
            columns={columns} 
            data={batches} 
            isLoading={isLoading} 
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
