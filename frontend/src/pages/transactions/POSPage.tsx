import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Plus, 
  Trash2, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  Printer, 
  PauseCircle, 
  PlayCircle,
  AlertTriangle,
  Barcode as BarcodeIcon,
  X
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface CartItem {
  id: string; // Batch ID
  medicineId: string;
  name: string;
  batchNumber: string;
  expiryDate: string;
  mrp: number;
  unitPrice: number;
  quantity: number;
  availableQuantity: number;
  taxPercentage: number;
  discountPercentage: number;
}

export default function POSPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'Card' | 'UPI'>('Cash');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [isHeld, setIsHeld] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Totals
  const subtotal = cart.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
  const totalTax = cart.reduce((acc, item) => {
    const itemTotal = item.unitPrice * item.quantity;
    const itemDiscount = itemTotal * (item.discountPercentage / 100);
    return acc + ((itemTotal - itemDiscount) * (item.taxPercentage / 100));
  }, 0);
  const totalDiscount = cart.reduce((acc, item) => acc + (item.unitPrice * item.quantity * (item.discountPercentage / 100)), 0) + Number(discountAmount);
  const netAmount = subtotal + totalTax - totalDiscount;

  useEffect(() => {
    // Focus search on mount
    searchInputRef.current?.focus();

    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F1') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'F2') {
        e.preventDefault();
        handleCompleteSale();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      // Search by Name or Barcode
      const response = await axios.get(`/api/medicines/search?q=${query}`);
      // Also need to fetch batches for these medicines
      const results = response.data.data;
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed', error);
    }
  };

  const addToCart = async (medicine: any) => {
    // Fetch latest batches for this medicine
    try {
      const response = await axios.get(`/api/inventorybatches?medicineId=${medicine.id}`);
      const batches = response.data.data;
      
      if (!batches || batches.length === 0) {
        toast.error('No stock available for this medicine');
        return;
      }

      const activeBatch = batches[0]; // Take first available batch for now

      const existingItem = cart.find(item => item.id === activeBatch.id);
      if (existingItem) {
        if (existingItem.quantity + 1 > activeBatch.availableQuantity) {
          toast.error('Not enough stock');
          return;
        }
        updateQuantity(activeBatch.id, existingItem.quantity + 1);
      } else {
        const newItem: CartItem = {
          id: activeBatch.id,
          medicineId: medicine.id,
          name: medicine.name,
          batchNumber: activeBatch.batchNumber,
          expiryDate: activeBatch.expiryDate,
          mrp: activeBatch.mrp,
          unitPrice: activeBatch.sellingPrice,
          quantity: 1,
          availableQuantity: activeBatch.availableQuantity,
          taxPercentage: activeBatch.taxPercentage,
          discountPercentage: 0
        };
        setCart([...cart, newItem]);
      }
      setSearchQuery('');
      setSearchResults([]);
      searchInputRef.current?.focus();
    } catch (error) {
      toast.error('Failed to add medicine');
    }
  };

  const updateQuantity = (batchId: string, qty: number) => {
    setCart(cart.map(item => {
      if (item.id === batchId) {
        if (qty > item.availableQuantity) {
          toast.error('Quantity exceeds available stock');
          return item;
        }
        return { ...item, quantity: Math.max(1, qty) };
      }
      return item;
    }));
  };

  const removeItem = (batchId: string) => {
    setCart(cart.filter(item => item.id !== batchId));
  };

  const handleCompleteSale = async () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    try {
      const saleRequest = {
        customerName,
        paymentMode,
        discountAmount,
        items: cart.map(item => ({
          medicineId: item.medicineId,
          batchId: item.id,
          quantity: item.quantity,
          discountPercentage: item.discountPercentage
        }))
      };

      const response = await axios.post('/api/sales', saleRequest);
      if (response.data.success) {
        toast.success('Sale completed successfully!');
        setCart([]);
        setSearchQuery('');
        setCustomerName('Walk-in Customer');
        // Trigger Print? 
        window.open(`/api/sales/${response.data.data.id}/invoice`, '_blank');
      }
    } catch (error) {
      toast.error('Failed to complete sale');
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-120px)]">
        {/* Top Search Bar */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-4 border dark:border-gray-700">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 sm:text-lg transition-all"
              placeholder="Search Medicine (F1), Scan Barcode or Batch Number..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {searchResults.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 shadow-xl rounded-md border dark:border-gray-700 max-h-60 overflow-y-auto">
                {searchResults.map((m) => (
                  <div 
                    key={m.id}
                    className="p-3 hover:bg-primary-50 dark:hover:bg-primary-900/20 cursor-pointer flex justify-between items-center border-b dark:border-gray-700 last:border-0"
                    onClick={() => addToCart(m)}
                  >
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white">{m.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{m.genericName} | {m.manufacturer}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-primary-600 font-semibold">MRP: ₹{m.mrp || '--'}</div>
                      <div className="text-xs text-gray-400">Barcode: {m.barcode || 'N/A'}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-1 gap-4 overflow-hidden">
          {/* Cart Table */}
          <div className="flex-[3] bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 flex flex-col overflow-hidden">
            <div className="overflow-y-auto flex-1">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900/50 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicine</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GST%</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {cart.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-10 text-center text-gray-400">
                        No items in cart. Start searching to add medicines.
                      </td>
                    </tr>
                  ) : (
                    cart.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-4 py-2">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</div>
                          <div className="text-xs text-gray-400">Exp: {new Date(item.expiryDate).toLocaleDateString()}</div>
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 font-mono">
                          {item.batchNumber}
                        </td>
                        <td className="px-4 py-2">
                          <input 
                            type="number" 
                            className="w-20 px-2 py-1 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                          />
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300">
                          ₹{item.unitPrice.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300">
                          {item.taxPercentage}%
                        </td>
                        <td className="px-4 py-2 text-right text-sm font-semibold text-gray-900 dark:text-white">
                          ₹{(item.unitPrice * item.quantity).toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-right">
                          <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 p-1">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Quick Summary Footer for items */}
            <div className="bg-gray-50 dark:bg-gray-900/50 p-3 border-t dark:border-gray-700 flex justify-between text-sm">
              <span className="text-gray-500">Items: {cart.length}</span>
              <span className="text-gray-900 dark:text-white font-bold">Total Quantity: {cart.reduce((a, b) => a + b.quantity, 0)}</span>
            </div>
          </div>

          {/* Checkout Panel */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Customer Details */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Customer Details</h3>
              <div className="space-y-3">
                <Input 
                  label="Name / Mobile" 
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="py-1"
                />
              </div>
            </div>

            {/* Payment & Totals */}
            <div className="flex-1 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700 flex flex-col">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Payment</h3>
              
              <div className="grid grid-cols-3 gap-2 mb-4">
                <button 
                  onClick={() => setPaymentMode('Cash')}
                  className={`flex flex-col items-center justify-center p-2 border rounded-lg transition-all ${paymentMode === 'Cash' ? 'bg-primary-50 border-primary-500 text-primary-600 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700 text-gray-400'}`}
                >
                  <Banknote className="h-5 w-5 mb-1" />
                  <span className="text-xs">Cash</span>
                </button>
                <button 
                  onClick={() => setPaymentMode('Card')}
                  className={`flex flex-col items-center justify-center p-2 border rounded-lg transition-all ${paymentMode === 'Card' ? 'bg-primary-50 border-primary-500 text-primary-600 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700 text-gray-400'}`}
                >
                  <CreditCard className="h-5 w-5 mb-1" />
                  <span className="text-xs">Card</span>
                </button>
                <button 
                  onClick={() => setPaymentMode('UPI')}
                  className={`flex flex-col items-center justify-center p-2 border rounded-lg transition-all ${paymentMode === 'UPI' ? 'bg-primary-50 border-primary-500 text-primary-600 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700 text-gray-400'}`}
                >
                  <Smartphone className="h-5 w-5 mb-1" />
                  <span className="text-xs">UPI</span>
                </button>
              </div>

              <div className="space-y-2 mb-4 flex-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-900 dark:text-white">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax</span>
                  <span className="text-gray-900 dark:text-white">₹{totalTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-red-500">
                  <span>Discount</span>
                  <span>-₹{totalDiscount.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t dark:border-gray-700 flex justify-between">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">Net Total</span>
                  <span className="text-2xl font-black text-primary-600">₹{netAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button 
                  className="w-full py-4 text-lg font-bold shadow-lg" 
                  onClick={handleCompleteSale}
                >
                  Complete Sale (F2)
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="text-xs py-2" onClick={() => setIsHeld(!isHeld)}>
                    {isHeld ? <PlayCircle className="mr-1 h-4 w-4" /> : <PauseCircle className="mr-1 h-4 w-4" />}
                    {isHeld ? 'Resume Bill' : 'Hold Bill'}
                  </Button>
                  <Button variant="outline" className="text-xs py-2" onClick={() => window.print()}>
                    <Printer className="mr-1 h-4 w-4" />
                    Print Last
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
