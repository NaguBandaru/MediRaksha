import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { 
  Cpu, 
  Zap, 
  BellRing, 
  MessageSquare, 
  ShieldAlert,
  Repeat,
  Mail,
  Smartphone
} from 'lucide-react';
import Button from '../../components/ui/Button';

export default function AutomationPage() {
  const automations = [
    { name: 'Auto-Reorder', icon: Zap, status: 'Active', desc: 'Automatically generate purchase orders when stock hits reorder level.' },
    { name: 'Expiry Alerts', icon: BellRing, status: 'Active', desc: 'Send daily notifications for medicines expiring in 30 days.' },
    { name: 'SMS Invoicing', icon: Smartphone, status: 'Inactive', desc: 'Send digital invoice links to customer mobile numbers.' },
    { name: 'Supplier Sync', icon: Repeat, status: 'Active', desc: 'Sync inventory data with preferred suppliers every 24 hours.' },
    { name: 'Email Reports', icon: Mail, status: 'Inactive', desc: 'Email daily sales and profit summary to the owner.' },
    { name: 'Backup Automation', icon: ShieldAlert, status: 'Active', desc: 'Cloud backup triggered every night at 2:00 AM.' },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight flex items-center">
              <Cpu className="mr-2 text-primary-600" /> Automation Center
            </h1>
            <p className="text-xs text-gray-500">Configure AI-driven workflows and scheduled tasks.</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-1" /> New Workflow
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {automations.map((a) => (
            <div key={a.name} className="bg-white dark:bg-gray-800 p-5 rounded-xl border dark:border-gray-700 flex gap-4 transition-all hover:shadow-md">
              <div className={`p-3 rounded-lg ${a.status === 'Active' ? 'bg-green-50 dark:bg-green-900/20 text-green-600' : 'bg-gray-50 dark:bg-gray-700 text-gray-400'}`}>
                <a.icon size={24} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-bold text-gray-900 dark:text-white">{a.name}</h3>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${a.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {a.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-3">{a.desc}</p>
                <div className="flex gap-2">
                  <button className="text-[10px] font-bold text-primary-600 uppercase hover:underline">Configure</button>
                  <button className="text-[10px] font-bold text-gray-400 uppercase hover:underline">View Logs</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

function Plus({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
}
