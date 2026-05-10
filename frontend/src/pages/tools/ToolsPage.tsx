import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { 
  Settings, 
  UserCog, 
  Bell, 
  Printer, 
  FileJson, 
  Database,
  Lock,
  Globe,
  Calculator,
  Store
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { useSettingsStore } from '../../store/settingsStore';
import { toast } from 'react-hot-toast';

export default function ToolsPage() {
  const { storeName, setStoreName } = useSettingsStore();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [newStoreName, setNewStoreName] = useState(storeName);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setStoreName(newStoreName);
    setIsProfileModalOpen(false);
    toast.success('Pharmacy profile updated successfully!');
  };

  const toolGroups = [
    {
      title: 'System Settings',
      items: [
        { 
          name: 'Pharmacy Profile', 
          icon: Settings, 
          desc: 'Address, GSTIN, and License info',
          onClick: () => setIsProfileModalOpen(true)
        },
        { name: 'Print Templates', icon: Printer, desc: 'Invoice and Label layouts' },
        { name: 'Notification Rules', icon: Bell, desc: 'Expiry and Low Stock alerts' },
      ]
    },
    {
      title: 'Data Tools',
      items: [
        { name: 'Import Medicines', icon: FileJson, desc: 'Bulk upload from CSV/Excel' },
        { name: 'Export Ledger', icon: Database, desc: 'Download sales & purchase logs' },
        { name: 'GST Calculator', icon: Calculator, desc: 'Quick tax calculation tool' },
      ]
    },
    {
      title: 'Security & Access',
      items: [
        { name: 'User Privileges', icon: UserCog, desc: 'Role-based access control' },
        { name: 'Audit Logs', icon: Lock, desc: 'Track all system changes' },
        { name: 'Cloud Sync', icon: Globe, desc: 'Real-time backup status' },
      ]
    }
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">System Tools & Settings</h1>
          <p className="text-xs text-gray-500">Configure your pharmacy ERP and manage system utilities.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {toolGroups.map((group) => (
            <div key={group.title} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-900/50 px-4 py-3 border-b dark:border-gray-700">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">{group.title}</h3>
              </div>
              <div className="p-2">
                {group.items.map((item) => (
                  <button 
                    key={item.name}
                    onClick={item.onClick}
                    className="w-full flex items-center p-3 hover:bg-primary-50 dark:hover:bg-primary-900/10 rounded-lg transition-all group text-left"
                  >
                    <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-400 group-hover:text-primary-600 transition-colors">
                      <item.icon size={20} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{item.name}</p>
                      <p className="text-[10px] text-gray-500 leading-tight">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-primary-600 rounded-xl p-6 text-white shadow-xl flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black uppercase">Need Technical Assistance?</h3>
            <p className="text-primary-100 text-sm">Our support team is available 24/7 for critical pharmacy operations.</p>
          </div>
          <Button variant="outline" className="bg-white text-primary-600 hover:bg-primary-50 border-white font-bold">
            Contact Support
          </Button>
        </div>
      </div>

      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        title="Edit Pharmacy Profile"
      >
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="flex items-center space-x-4 mb-6 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
            <div className="bg-primary-100 dark:bg-primary-800 p-3 rounded-full text-primary-600">
              <Store size={32} />
            </div>
            <div>
              <h4 className="font-black text-primary-700 dark:text-primary-300 uppercase">Store Identity</h4>
              <p className="text-[10px] text-primary-600/70">This name appears on invoices and the dashboard header.</p>
            </div>
          </div>

          <Input 
            label="Medical Store Name" 
            value={newStoreName}
            onChange={(e) => setNewStoreName(e.target.value)}
            required
            placeholder="e.g. Durga Pharmacy"
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={() => setIsProfileModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
