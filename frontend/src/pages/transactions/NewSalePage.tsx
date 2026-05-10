import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Search, Plus, Trash2, CreditCard, Receipt, IndianRupee, ShoppingCart } from 'lucide-react';
import api from '../../services/api';

interface CartItem {
  inventoryBatchId: string;
  medicineName: string;
  batchNumber: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export default function NewSalePage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock search result for now
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    
    // In a real app, this would fetch from API
    const mockFoundBatch = {
      inventoryBatchId: 'b1-test',
      medicineName: 'Amoxicillin 500mg',
      batchNumber: 'BATCH-2023',
      quantity: 1,
      unitPrice: 15.50,
      totalPrice: 15.50
    };
    
    const existingItem = cart.find(i => i.inventoryBatchId === mockFoundBatch.inventoryBatchId);
    if (existingItem) {
      setCart(cart.map(item => 
        item.inventoryBatchId === mockFoundBatch.inventoryBatchId 
          ? { ...item, quantity: item.quantity + 1, totalPrice: (item.quantity + 1) * item.unitPrice } 
          : item
      ));
    } else {
      setCart([...cart, mockFoundBatch]);
    }
    setSearchQuery('');
  };

  const updateQuantity = (id: string, newQty: number) => {
    if (newQty < 1) return;
    setCart(cart.map(item => 
      item.inventoryBatchId === id 
        ? { ...item, quantity: newQty, totalPrice: newQty * item.unitPrice } 
        : item
    ));
  };

  const removeItem = (id: string) => {
    setCart(cart.filter(item => item.inventoryBatchId !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const total = Math.max(0, subtotal - discount);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);
    
    try {
      const payload = {
        discountAmount: discount,
        paymentMethod: paymentMethod,
        items: cart.map(item => ({
          inventoryBatchId: item.inventoryBatchId,
          quantity: item.quantity
        }))
      };
      
      // In a real app with real data, we would uncomment this:
      // await api.post('/sales', payload);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      alert('Sale completed successfully!');
      navigate('/transactions');
    } catch (error) {
      console.error('Failed to checkout', error);
      alert('Failed to complete sale. Ensure you have valid batches.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-8rem)]">
        
        {/* Left Side: Product Search & Cart */}
        <div className="flex-1 flex flex-col bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Point of Sale</h2>
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Search medicine by name or batch..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit">Search</Button>
            </form>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <ShoppingCart className="h-16 w-16 mb-4 text-gray-300" />
                <p>Cart is empty. Search to add medicines.</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">Medicine</th>
                    <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">Qty</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">Price</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">Total</th>
                    <th className="pb-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {cart.map((item) => (
                    <tr key={item.inventoryBatchId}>
                      <td className="py-4">
                        <div className="font-medium text-gray-900">{item.medicineName}</div>
                        <div className="text-xs text-gray-500">Batch: {item.batchNumber}</div>
                      </td>
                      <td className="py-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button 
                            onClick={() => updateQuantity(item.inventoryBatchId, item.quantity - 1)}
                            className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600"
                          >-</button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.inventoryBatchId, item.quantity + 1)}
                            className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600"
                          >+</button>
                        </div>
                      </td>
                      <td className="py-4 text-right text-sm text-gray-500">₹{item.unitPrice.toFixed(2)}</td>
                      <td className="py-4 text-right font-medium text-gray-900">₹{item.totalPrice.toFixed(2)}</td>
                      <td className="py-4 text-right">
                        <button 
                          onClick={() => removeItem(item.inventoryBatchId)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right Side: Order Summary & Checkout */}
        <div className="w-full md:w-80 flex flex-col bg-gray-50 rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="p-4 border-b bg-white">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <Receipt className="mr-2 h-5 w-5 text-primary-600" />
              Order Summary
            </h3>
          </div>
          
          <div className="p-4 flex-1 space-y-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900">₹{subtotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Discount (₹)</span>
              <input 
                type="number" 
                min="0"
                className="w-20 px-2 py-1 border border-gray-300 rounded text-right focus:ring-primary-500 focus:border-primary-500"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value) || 0)}
              />
            </div>
            
            <div className="pt-4 border-t flex justify-between items-center">
              <span className="text-base font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-primary-600">₹{total.toFixed(2)}</span>
            </div>

            <div className="pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setPaymentMethod('Cash')}
                  className={`py-2 px-4 flex justify-center items-center rounded border ${paymentMethod === 'Cash' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  <IndianRupee className="h-4 w-4 mr-2" /> Cash
                </button>
                <button 
                  onClick={() => setPaymentMethod('Card')}
                  className={`py-2 px-4 flex justify-center items-center rounded border ${paymentMethod === 'Card' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  <CreditCard className="h-4 w-4 mr-2" /> Card
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-white border-t">
            <Button 
              className="w-full h-12 text-lg" 
              onClick={handleCheckout}
              disabled={cart.length === 0 || isSubmitting}
              isLoading={isSubmitting}
            >
              Complete Sale
            </Button>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
