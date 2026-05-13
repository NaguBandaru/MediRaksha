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
  X,
  Pill,
  ChevronDown,
  User,
  Phone,
  Calendar,
  Stethoscope,
  Info,
  Clock,
  LayoutGrid,
  Settings,
  LogOut
} from 'lucide-react';
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
  const [customerName, setCustomerName] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  
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
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    searchInputRef.current?.focus();

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
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(timer);
    };
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get(`/api/medicines/search?q=${query}`);
      setSearchResults(response.data.data);
    } catch (error) {
      console.error('Search failed', error);
    }
  };

  const addToCart = async (medicine: any) => {
    try {
      const response = await axios.get(`/api/inventorybatches?medicineId=${medicine.id}`);
      const batches = response.data.data;
      
      if (!batches || batches.length === 0) {
        toast.error('No stock available');
        return;
      }

      const activeBatch = batches[0];
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
    toast.success('Sale completed successfully!');
    setCart([]);
  };

  return (
    <div className="h-screen w-screen bg-[#e1e5e8] text-[#333] font-sans text-[11px] flex flex-col overflow-hidden select-none">
      
      {/* Header Info Bar */}
      <div className="bg-[#f0f3f5] border-b border-[#bdc3c7] p-1 grid grid-cols-4 gap-2 shadow-sm z-10">
        <div className="flex items-center space-x-2 border-r border-gray-300 pr-2">
          <span className="font-bold text-blue-800">Internet Status:</span>
          <span className="text-green-600 font-bold">Online</span>
        </div>
        <div className="flex items-center space-x-2 border-r border-gray-300 pr-2">
          <span className="font-bold">Terminal:</span>
          <span className="text-blue-600">POS-003</span>
        </div>
        <div className="flex items-center space-x-2 border-r border-gray-300 pr-2">
          <span className="font-bold">Store:</span>
          <span>Gowlidoddi Tellapur Road [25631]</span>
        </div>
        <div className="flex items-center justify-end font-bold text-gray-600">
          {currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString()}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Main Section (Left) */}
        <div className="flex-[3] flex flex-col border-r border-[#bdc3c7]">
          
          {/* Patient & Transaction Info Grid */}
          <div className="bg-[#f0f3f5] p-2 grid grid-cols-3 gap-x-4 gap-y-1 border-b border-[#bdc3c7]">
            <div className="space-y-1">
              <div className="flex items-center">
                <label className="w-24 font-semibold">Consumer No:</label>
                <div className="flex-1 flex space-x-1">
                  <input type="text" className="flex-1 border border-gray-400 px-1 h-5 bg-white focus:border-blue-500 outline-none" />
                  <button className="bg-[#f39c12] text-white px-1"><Search size={12} /></button>
                </div>
              </div>
              <div className="flex items-center">
                <label className="w-24 font-semibold">Tracking Ref:</label>
                <select className="flex-1 border border-gray-400 h-5 bg-white outline-none">
                  <option>0-NS NORMAL SALES</option>
                </select>
              </div>
              <div className="flex items-center">
                <label className="w-24 font-semibold">Telephone:</label>
                <input type="text" className="flex-1 border border-gray-400 px-1 h-5 bg-white outline-none" />
              </div>
              <div className="flex items-center">
                <label className="w-24 font-semibold">Customer Name:</label>
                <input type="text" className="flex-1 border border-gray-400 px-1 h-5 bg-white outline-none font-bold" value={customerName} onChange={e => setCustomerName(e.target.value)} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center">
                <label className="w-24 font-semibold">Doctor:</label>
                <div className="flex-1 flex space-x-1">
                  <select className="flex-1 border border-gray-400 h-5 bg-white outline-none">
                    <option>Z-others</option>
                  </select>
                  <button className="bg-[#f39c12] text-white px-1"><Search size={12} /></button>
                </div>
              </div>
              <div className="flex items-center">
                <label className="w-24 font-semibold">Sales Origin:</label>
                <select className="flex-1 border border-gray-400 h-5 bg-white outline-none">
                  <option>Regular sales</option>
                </select>
              </div>
              <div className="flex items-center">
                <label className="w-24 font-semibold">Manual Bill No:</label>
                <input type="text" className="flex-1 border border-gray-400 px-1 h-5 bg-white outline-none" />
              </div>
              <div className="flex items-center">
                <label className="w-24 font-semibold">Available Amt:</label>
                <input type="text" className="flex-1 border border-gray-400 px-1 h-5 bg-gray-200 outline-none" readOnly />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center">
                <label className="w-24 font-semibold">Txn Id:</label>
                <input type="text" className="flex-1 border border-gray-400 px-1 h-5 bg-gray-200 outline-none" value="300013394" readOnly />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input type="checkbox" id="prescribed" />
                  <label htmlFor="prescribed" className="ml-1 font-semibold">Prescribed</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="lab" />
                  <label htmlFor="lab" className="ml-1 font-semibold">Lab Test</label>
                </div>
              </div>
              <div className="flex items-center">
                <label className="w-24 font-semibold">Patient Type:</label>
                <select className="flex-1 border border-gray-400 h-5 bg-white outline-none">
                  <option>CASH PATIENT</option>
                </select>
              </div>
              <div className="flex items-center justify-end">
                <button className="bg-[#27ae60] text-white font-bold px-4 h-6 rounded shadow-sm hover:bg-[#2ecc71]">APL Dashboard</button>
              </div>
            </div>
          </div>

          {/* Sale Grid Area */}
          <div className="flex-1 flex flex-col bg-white overflow-hidden">
            
            {/* Tabs & Search */}
            <div className="flex items-center bg-[#f0f3f5] border-b border-[#bdc3c7]">
              <div className="flex">
                <div className="bg-[#f39c12] text-white px-6 py-2 font-bold cursor-pointer border-r border-[#d35400]">Sale</div>
                <div className="bg-[#bdc3c7] text-white px-6 py-2 font-bold cursor-pointer border-r border-gray-400 opacity-60">Payment</div>
              </div>
              <div className="flex-1 px-2 flex items-center space-x-2">
                <span className="font-bold italic">Search</span>
                <div className="relative flex-1 max-w-md">
                  <input 
                    ref={searchInputRef}
                    type="text" 
                    placeholder="Enter Medicine Name / Art Code..."
                    className="w-full border border-gray-400 h-6 px-2 outline-none focus:border-blue-500 font-bold"
                    value={searchQuery}
                    onChange={e => handleSearch(e.target.value)}
                  />
                  {searchResults.length > 0 && (
                    <div className="absolute top-7 left-0 w-full bg-white border border-gray-400 shadow-xl z-50 max-h-40 overflow-y-auto">
                      {searchResults.map(m => (
                        <div key={m.id} className="p-1 hover:bg-blue-100 cursor-pointer flex justify-between border-b text-[10px]" onClick={() => addToCart(m)}>
                          <span className="font-bold">{m.name}</span>
                          <span className="text-blue-600">MRP: {m.mrp}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button className="bg-[#27ae60] text-white px-3 h-6 font-bold flex items-center">ABV</button>
                <button className="bg-[#27ae60] text-white px-3 h-6 font-bold flex items-center" onClick={() => setCart([])}>Clear All <span className="ml-2 bg-white/20 px-1">F1</span></button>
              </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto border-b border-[#bdc3c7]">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#f0f3f5] text-[10px] uppercase font-bold sticky top-0 z-10 border-b border-[#bdc3c7]">
                  <tr>
                    <th className="border-r border-[#bdc3c7] p-1 w-8">S.No</th>
                    <th className="border-r border-[#bdc3c7] p-1 w-20">ArtCode</th>
                    <th className="border-r border-[#bdc3c7] p-1">Description</th>
                    <th className="border-r border-[#bdc3c7] p-1 w-12 text-center">Qty</th>
                    <th className="border-r border-[#bdc3c7] p-1 w-12 text-center">Cat.</th>
                    <th className="border-r border-[#bdc3c7] p-1 w-12 text-center">Batch</th>
                    <th className="border-r border-[#bdc3c7] p-1 w-20 text-center">Expiry</th>
                    <th className="border-r border-[#bdc3c7] p-1 w-16 text-right">MRP</th>
                    <th className="border-r border-[#bdc3c7] p-1 w-10 text-center">Tax%</th>
                    <th className="border-r border-[#bdc3c7] p-1 w-16 text-right">TaxVal</th>
                    <th className="border-r border-[#bdc3c7] p-1 w-16 text-right bg-[#f1c40f]/20">Total</th>
                    <th className="p-1 w-6"></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, idx) => (
                    <tr key={item.id} className={`${idx % 2 === 0 ? 'bg-[#f9f9f9]' : 'bg-white'} hover:bg-[#fff9c4] transition-colors`}>
                      <td className="border-r border-[#bdc3c7] p-1 text-center">{idx + 1}</td>
                      <td className="border-r border-[#bdc3c7] p-1 font-mono">{item.id.substring(0, 8)}</td>
                      <td className="border-r border-[#bdc3c7] p-1 font-bold">{item.name}</td>
                      <td className="border-r border-[#bdc3c7] p-1 text-center">
                        <input 
                          type="number" 
                          className="w-10 border border-gray-300 text-center bg-transparent" 
                          value={item.quantity}
                          onChange={e => updateQuantity(item.id, parseInt(e.target.value))}
                        />
                      </td>
                      <td className="border-r border-[#bdc3c7] p-1 text-center text-gray-500">FMCG</td>
                      <td className="border-r border-[#bdc3c7] p-1 text-center">{item.batchNumber}</td>
                      <td className="border-r border-[#bdc3c7] p-1 text-center">{new Date(item.expiryDate).toLocaleDateString()}</td>
                      <td className="border-r border-[#bdc3c7] p-1 text-right">₹{item.mrp.toFixed(2)}</td>
                      <td className="border-r border-[#bdc3c7] p-1 text-center">{item.taxPercentage}</td>
                      <td className="border-r border-[#bdc3c7] p-1 text-right">₹{(item.unitPrice * item.quantity * 0.12).toFixed(2)}</td>
                      <td className="border-r border-[#bdc3c7] p-1 text-right font-bold bg-[#f1c40f]/10">₹{(item.unitPrice * item.quantity).toFixed(2)}</td>
                      <td className="p-1 text-center">
                        <button className="text-red-600 hover:scale-110" onClick={() => removeItem(item.id)}><X size={14} /></button>
                      </td>
                    </tr>
                  ))}
                  {Array.from({ length: Math.max(0, 15 - cart.length) }).map((_, i) => (
                    <tr key={`empty-${i}`} className={i % 2 === 0 ? 'bg-[#f9f9f9]' : 'bg-white'}>
                      <td colSpan={12} className="p-1 border-r border-[#bdc3c7] h-6"></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom Summary Bar */}
            <div className="bg-[#f0f3f5] p-2 flex items-center justify-between border-t border-[#bdc3c7] text-[10px] font-bold">
              <div className="flex space-x-6">
                <div>
                  <span className="text-blue-800">Donation Amount:</span>
                  <input type="text" className="w-12 ml-2 border border-gray-400 bg-white px-1 h-4" value="0.00" readOnly />
                </div>
                <div>
                  <span className="text-blue-800">Pharma:</span>
                  <input type="text" className="w-16 ml-2 border border-gray-400 bg-white px-1 h-4" value={subtotal.toFixed(2)} readOnly />
                </div>
                <div>
                  <span className="text-blue-800">FMCG:</span>
                  <input type="text" className="w-16 ml-2 border border-gray-400 bg-white px-1 h-4" value="0.00" readOnly />
                </div>
              </div>
              <div className="flex space-x-6 items-center">
                <div className="text-[14px]">
                  <span className="text-red-700">Net Total:</span>
                  <span className="ml-2 text-red-700 font-black">₹{netAmount.toFixed(2)}</span>
                </div>
                <div className="text-blue-900">
                  <span>Savings:</span>
                  <span className="ml-2 font-black text-green-700">₹0.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar (Right) */}
        <div className="w-[280px] bg-[#f0f3f5] flex flex-col">
          
          {/* Logo & Branding Area */}
          <div className="p-3 bg-white border-b border-[#bdc3c7]">
            <div className="flex justify-between items-center mb-1">
              <div className="flex space-x-1">
                <div className="bg-[#27ae60] text-white px-2 py-0.5 rounded font-black text-[9px]">INFORMATION</div>
                <div className="bg-[#bdc3c7] text-white px-2 py-0.5 rounded font-black text-[9px] opacity-40">ORDERS</div>
              </div>
              <Info size={14} className="text-blue-600" />
            </div>
            <div className="flex flex-col items-center justify-center py-2 border border-blue-100 rounded bg-blue-50/30">
              <div className="flex items-center space-x-2 text-[#27ae60]">
                <Pill size={32} strokeWidth={2.5} />
                <h1 className="text-2xl font-black italic tracking-tighter leading-none">MediRaksha</h1>
              </div>
              <div className="text-[9px] font-bold tracking-widest text-[#27ae60] mt-1 border-t border-[#27ae60] w-full text-center pt-0.5">PHARMACY ERP</div>
            </div>
          </div>

          {/* Action Grid */}
          <div className="flex-1 p-2 grid grid-cols-2 gap-1 overflow-y-auto content-start">
            
            {/* Category: Billing */}
            <div className="col-span-2 flex items-center space-x-1 mt-1 mb-0.5">
               <div className="bg-[#27ae60] h-3 w-1"></div>
               <span className="font-bold text-gray-500 uppercase text-[9px]">Billing Controls</span>
            </div>
            <button className="bg-[#1abc9c] text-white p-1.5 rounded flex flex-col items-center justify-center shadow hover:brightness-95">
              <span className="font-bold text-[10px]">Change Quantity</span>
              <span className="text-[8px] bg-white/20 px-1 rounded">Alt + F1</span>
            </button>
            <button className="bg-[#1abc9c] text-white p-1.5 rounded flex flex-col items-center justify-center shadow hover:brightness-95">
              <span className="font-bold text-[10px]">Loyalty Points</span>
              <span className="text-[8px] bg-white/20 px-1 rounded">F2</span>
            </button>
            <button className="bg-[#1abc9c] text-white p-1.5 rounded flex flex-col items-center justify-center shadow hover:brightness-95">
              <span className="font-bold text-[10px]">Park Transaction</span>
              <span className="text-[8px] bg-white/20 px-1 rounded">Alt + F4</span>
            </button>
            <button className="bg-[#1abc9c] text-white p-1.5 rounded flex flex-col items-center justify-center shadow hover:brightness-95">
              <span className="font-bold text-[10px]">Manual Bill</span>
              <span className="text-[8px] bg-white/20 px-1 rounded">Alt + F6</span>
            </button>

            {/* Category: Inventory */}
            <div className="col-span-2 flex items-center space-x-1 mt-3 mb-0.5">
               <div className="bg-[#f39c12] h-3 w-1"></div>
               <span className="font-bold text-gray-500 uppercase text-[9px]">Inventory & Management</span>
            </div>
            <button className="bg-[#e67e22] text-white p-1.5 rounded flex flex-col items-center justify-center shadow hover:brightness-95">
              <span className="font-bold text-[10px]">Show Journals</span>
              <span className="text-[8px] bg-white/20 px-1 rounded">F2</span>
            </button>
            <button className="bg-[#e67e22] text-white p-1.5 rounded flex flex-col items-center justify-center shadow hover:brightness-95">
              <span className="font-bold text-[10px]">Sync Stock</span>
              <span className="text-[8px] bg-white/20 px-1 rounded">Ctrl + F2</span>
            </button>
            <button className="bg-[#e67e22] text-white p-1.5 rounded flex flex-col items-center justify-center shadow hover:brightness-95">
              <span className="font-bold text-[10px]">Healing Card</span>
              <span className="text-[8px] bg-white/20 px-1 rounded">Alt + F7</span>
            </button>
            <button className="bg-[#e67e22] text-white p-1.5 rounded flex flex-col items-center justify-center shadow hover:brightness-95">
              <span className="font-bold text-[10px]">OMS Journals</span>
              <span className="text-[8px] bg-white/20 px-1 rounded">Alt + F3</span>
            </button>

             {/* Category: Payment */}
             <div className="col-span-2 flex items-center space-x-1 mt-3 mb-0.5">
               <div className="bg-[#2980b9] h-3 w-1"></div>
               <span className="font-bold text-gray-500 uppercase text-[9px]">Quick Payment (F12)</span>
            </div>
          </div>

          {/* Payment Shortcuts Area */}
          <div className="p-1 grid grid-cols-2 gap-1 bg-[#bdc3c7]">
            <button className="bg-[#7f8c8d] text-white h-12 rounded flex flex-col items-center justify-center font-bold text-[12px] shadow-inner hover:bg-[#95a5a6]" onClick={handleCompleteSale}>
              <Banknote size={16} />
              <span>CASH</span>
            </button>
            <button className="bg-[#3498db] text-white h-12 rounded flex flex-col items-center justify-center font-bold text-[12px] shadow-inner hover:bg-[#2980b9]">
              <Smartphone size={16} />
              <span>UPI / QR</span>
            </button>
            <button className="bg-[#9b59b6] text-white h-12 rounded flex flex-col items-center justify-center font-bold text-[12px] shadow-inner hover:bg-[#8e44ad]">
              <CreditCard size={16} />
              <span>CARD</span>
            </button>
            <button className="bg-[#c0392b] text-white h-12 rounded flex flex-col items-center justify-center font-bold text-[12px] shadow-inner hover:bg-[#e74c3c]">
              <LogOut size={16} />
              <span>EXIT</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer System Info */}
      <div className="bg-[#2c3e50] text-[#ecf0f1] h-6 flex items-center px-4 justify-between font-mono text-[9px]">
        <div className="flex space-x-6">
          <span>CASHIER: ADMIN [APL126818]</span>
          <span>TERMINAL ID: 003</span>
          <span>STORE CODE: 25631</span>
        </div>
        <div className="flex space-x-4 items-center">
          <div className="bg-green-500 w-2 h-2 rounded-full animate-pulse"></div>
          <span>MediRaksha v1.2.4 (Ready)</span>
        </div>
      </div>
    </div>
  );
}
