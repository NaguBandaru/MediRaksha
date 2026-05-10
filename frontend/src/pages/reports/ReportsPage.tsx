import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { FileText, Download, TrendingUp, DollarSign, Package, AlertTriangle } from 'lucide-react';
import Button from '../../components/ui/Button';

const data = [
  { name: '01 May', sales: 4000, items: 120 },
  { name: '02 May', sales: 3000, items: 98 },
  { name: '03 May', sales: 5000, items: 150 },
  { name: '04 May', sales: 2780, items: 85 },
  { name: '05 May', sales: 1890, items: 60 },
  { name: '06 May', sales: 2390, items: 75 },
  { name: '07 May', sales: 3490, items: 110 },
];

const categoryData = [
  { name: 'Tablets', value: 45 },
  { name: 'Syrups', value: 25 },
  { name: 'Injections', value: 15 },
  { name: 'Topical', value: 10 },
  { name: 'Others', value: 5 },
];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('7d');

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Business Intelligence</h1>
            <p className="text-xs text-gray-500">Sales performance and inventory analytics</p>
          </div>
          <div className="flex gap-2">
            <select 
              className="text-xs border dark:border-gray-600 rounded bg-white dark:bg-gray-800 dark:text-white px-3 py-2"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="today">Today</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="this-month">This Month</option>
            </select>
            <Button variant="outline" className="text-xs py-2">
              <Download size={14} className="mr-1" /> Export PDF
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <ReportCard title="Total Revenue" value="₹1,24,500" trend="+12.5%" icon={<DollarSign size={20} />} />
          <ReportCard title="Invoices Issued" value="452" trend="+8%" icon={<FileText size={20} />} />
          <ReportCard title="Stock Value" value="₹12,45,000" trend="-2%" icon={<Package size={20} />} />
          <ReportCard title="Profit (Est.)" value="₹34,200" trend="+15%" icon={<TrendingUp size={20} />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
            <h3 className="text-sm font-black uppercase text-gray-400 mb-6 flex items-center">
              <TrendingUp size={16} className="mr-2" /> Sales Trend
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                  <Tooltip />
                  <Area type="monotone" dataKey="sales" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
            <h3 className="text-sm font-black uppercase text-gray-400 mb-6 flex items-center">
              <Package size={16} className="mr-2" /> Category Distribution
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                  <XAxis type="number" fontSize={10} hide />
                  <YAxis dataKey="name" type="category" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0ea5e9" radius={[0, 4, 4, 0]}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black uppercase text-gray-400 flex items-center">
              <AlertTriangle size={16} className="mr-2 text-red-500" /> Critical Expiry Alerts (Next 30 Days)
            </h3>
          </div>
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="text-left text-[10px] font-black text-gray-400 uppercase py-2">Medicine</th>
                <th className="text-left text-[10px] font-black text-gray-400 uppercase py-2">Batch</th>
                <th className="text-left text-[10px] font-black text-gray-400 uppercase py-2">Stock</th>
                <th className="text-left text-[10px] font-black text-gray-400 uppercase py-2">Expiry</th>
                <th className="text-right text-[10px] font-black text-gray-400 uppercase py-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              <ExpiryRow name="Amoxicillin 500mg" batch="AMX908" stock="12" date="15 May 2026" />
              <ExpiryRow name="Cough Syrup Z" batch="CSZ221" stock="45" date="28 May 2026" />
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

function ReportCard({ title, value, trend, icon }: any) {
  const isPositive = trend.startsWith('+');
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-primary-600">
          {icon}
        </div>
        <span className={`text-xs font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {trend}
        </span>
      </div>
      <p className="text-[10px] font-black text-gray-400 uppercase">{title}</p>
      <p className="text-xl font-black text-gray-900 dark:text-white mt-1">{value}</p>
    </div>
  );
}

function ExpiryRow({ name, batch, stock, date }: any) {
  return (
    <tr>
      <td className="py-3 text-xs font-bold text-gray-900 dark:text-white">{name}</td>
      <td className="py-3 text-xs font-mono text-gray-500">{batch}</td>
      <td className="py-3 text-xs text-red-600 font-bold">{stock}</td>
      <td className="py-3 text-xs text-red-600">{date}</td>
      <td className="py-3 text-right">
        <button className="text-[10px] font-bold text-primary-600 uppercase hover:underline">Mark Damaged</button>
      </td>
    </tr>
  );
}
