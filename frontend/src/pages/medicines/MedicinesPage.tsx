import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable from '../../components/ui/DataTable';
import type { Column } from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { Plus, Trash2, Edit, Search, Filter, AlertCircle, Calendar, Package } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

interface Medicine {
  id: string;
  name: string;
  genericName: string;
  manufacturer: string;
  categoryName: string;
  supplierName: string;
  hsnCode: string;
  barcode: string;
  reorderLevel: number;
  totalStock: number;
  isPrescriptionRequired: boolean;
  isActive: boolean;
}

export default function MedicinesPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'low-stock' | 'expired'>('all');

  const [formData, setFormData] = useState({
    name: '',
    genericName: '',
    manufacturer: '',
    description: '',
    hsnCode: '',
    barcode: '',
    reorderLevel: '10',
    isPrescriptionRequired: false,
    categoryId: '',
    supplierId: '',
    batchNumber: '',
    manufacturingDate: '',
    expiryDate: '',
    mfgLicenseNumber: '',
    quantity: '',
    purchasePrice: '',
    sellingPrice: '',
    mrp: '',
    taxPercentage: '12'
  });

  useEffect(() => {
    fetchMedicines();
    fetchDropdownData();
  }, []);

  const fetchMedicines = async () => {
    setIsLoading(true);
    try {
      const endpoint = searchQuery ? `/medicines/search?q=${searchQuery}` : '/medicines';
      const response = await api.get(endpoint);
      setMedicines(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load medicines');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const [catRes, supRes] = await Promise.all([api.get('/categories'), api.get('/suppliers')]);
      setCategories(catRes.data.data || []);
      setSuppliers(supRes.data.data || []);
    } catch (error) {}
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/medicines', {
        ...formData,
        reorderLevel: parseInt(formData.reorderLevel),
        quantity: formData.quantity ? parseInt(formData.quantity) : 0,
        purchasePrice: parseFloat(formData.purchasePrice) || 0,
        sellingPrice: parseFloat(formData.sellingPrice) || 0,
        mrp: parseFloat(formData.mrp) || 0,
        taxPercentage: parseFloat(formData.taxPercentage) || 0
      });
      toast.success('Medicine added successfully');
      setIsModalOpen(false);
      fetchMedicines();
    } catch (error) {
      toast.error('Error saving medicine');
    }
  };

  const columns: Column<Medicine>[] = [
    { 
      header: 'Medicine Info', 
      cell: (med) => (
        <div className="flex flex-col">
          <span className="font-bold text-gray-900 dark:text-white leading-none">{med.name}</span>
          <span className="text-[10px] text-gray-500 mt-1 uppercase tracking-tighter">{med.genericName}</span>
        </div>
      ),
      className: 'min-w-[200px]'
    },
    { header: 'HSN/Barcode', cell: (m) => (
      <div className="text-[11px] font-mono text-gray-500">
        <div>HSN: {m.hsnCode || '--'}</div>
        <div>BC: {m.barcode || '--'}</div>
      </div>
    )},
    { header: 'Category', accessorKey: 'categoryName', className: 'text-xs' },
    { header: 'Manufacturer', accessorKey: 'manufacturer', className: 'text-xs' },
    { 
      header: 'Stock Status', 
      cell: (med) => {
        const isLow = med.totalStock <= med.reorderLevel;
        return (
          <div className="flex flex-col">
            <span className={`text-sm font-bold ${isLow ? 'text-red-600' : 'text-green-600'}`}>
              {med.totalStock || 0} units
            </span>
            <span className="text-[10px] text-gray-400">Min: {med.reorderLevel}</span>
          </div>
        );
      }
    },
    { 
      header: 'Presc.', 
      cell: (med) => (
        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
          med.isPrescriptionRequired ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
        }`}>
          {med.isPrescriptionRequired ? 'Rx' : 'OTC'}
        </span>
      ) 
    },
    {
      header: 'Actions',
      cell: (med) => (
        <div className="flex space-x-2">
          <button className="text-blue-600 hover:bg-blue-50 p-1 rounded transition-colors"><Edit size={14} /></button>
          <button className="text-red-600 hover:bg-red-50 p-1 rounded transition-colors"><Trash2 size={14} /></button>
        </div>
      )
    }
  ];

  return (
    <DashboardLayout>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Medicine Master</h1>
            <p className="text-xs text-gray-500">Manage pharmaceutical inventory and compliance</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search name, generic, barcode..."
                className="pl-9 pr-4 py-2 text-sm border dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 dark:text-white w-64 focus:ring-2 focus:ring-primary-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchMedicines()}
              />
            </div>
            <Button onClick={() => setIsModalOpen(true)} className="py-2">
              <Plus className="h-4 w-4 mr-1" /> Add New
            </Button>
          </div>
        </div>

        <div className="flex gap-4 mt-4 border-t dark:border-gray-700 pt-4">
          <button 
            onClick={() => setFilter('all')}
            className={`flex items-center text-xs font-bold px-3 py-1.5 rounded-full transition-all ${filter === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200'}`}
          >
            <Package size={14} className="mr-1.5" /> All Medicines
          </button>
          <button 
            onClick={() => setFilter('low-stock')}
            className={`flex items-center text-xs font-bold px-3 py-1.5 rounded-full transition-all ${filter === 'low-stock' ? 'bg-red-600 text-white' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100'}`}
          >
            <AlertCircle size={14} className="mr-1.5" /> Low Stock
          </button>
          <button 
            onClick={() => setFilter('expired')}
            className={`flex items-center text-xs font-bold px-3 py-1.5 rounded-full transition-all ${filter === 'expired' ? 'bg-orange-600 text-white' : 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 hover:bg-orange-100'}`}
          >
            <Calendar size={14} className="mr-1.5" /> Expiring Soon
          </button>
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={medicines} 
        isLoading={isLoading}
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Register New Medicine"
        maxWidth="3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-900/40 p-4 rounded-lg border dark:border-gray-700">
            <div className="col-span-2">
              <Input label="Medicine Name" name="name" value={formData.name} onChange={handleInputChange} required />
            </div>
            <Input label="HSN Code" name="hsnCode" value={formData.hsnCode} onChange={handleInputChange} />
            
            <div className="col-span-2">
              <Input label="Generic Name" name="genericName" value={formData.genericName} onChange={handleInputChange} required />
            </div>
            <Input label="Barcode" name="barcode" value={formData.barcode} onChange={handleInputChange} />
            
            <Input label="Manufacturer" name="manufacturer" value={formData.manufacturer} onChange={handleInputChange} required />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
              <select name="categoryId" value={formData.categoryId} onChange={handleInputChange} required className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 dark:text-white sm:text-sm">
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <Input label="Reorder Level" name="reorderLevel" type="number" value={formData.reorderLevel} onChange={handleInputChange} />
          </div>

          <div className="grid grid-cols-3 gap-4 bg-primary-50/30 dark:bg-primary-900/10 p-4 rounded-lg border border-primary-100 dark:border-primary-900/30">
            <h4 className="col-span-3 text-xs font-black text-primary-700 dark:text-primary-400 uppercase">Opening Stock & Pricing</h4>
            <Input label="Batch Number" name="batchNumber" value={formData.batchNumber} onChange={handleInputChange} />
            <Input label="Expiry Date" name="expiryDate" type="date" value={formData.expiryDate} onChange={handleInputChange} />
            <Input label="Initial Qty" name="quantity" type="number" value={formData.quantity} onChange={handleInputChange} />
            
            <Input label="Purchase Price" name="purchasePrice" type="number" step="0.01" value={formData.purchasePrice} onChange={handleInputChange} />
            <Input label="Selling Price" name="sellingPrice" type="number" step="0.01" value={formData.sellingPrice} onChange={handleInputChange} />
            <Input label="MRP" name="mrp" type="number" step="0.01" value={formData.mrp} onChange={handleInputChange} />
          </div>

          <div className="flex justify-between items-center pt-4 border-t dark:border-gray-700">
            <div className="flex items-center">
              <input type="checkbox" name="isPrescriptionRequired" checked={formData.isPrescriptionRequired} onChange={handleInputChange} className="rounded text-primary-600 mr-2" />
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Prescription Required (Rx)</label>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Discard</Button>
              <Button type="submit">Save Medicine</Button>
            </div>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
