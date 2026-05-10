import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import { Database, Download, RotateCcw, Shield, Clock, HardDrive } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

export default function BackupPage() {
  const [backups, setBackups] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchBackups();
  }, []);

  const fetchBackups = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/backup/history');
      setBackups(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load backup history');
    } finally {
      setIsLoading(false);
    }
  };

  const createBackup = async () => {
    setIsCreating(true);
    try {
      await api.post('/backup/create');
      toast.success('System backup created successfully!');
      fetchBackups();
    } catch (error) {
      toast.error('Failed to create backup');
    } finally {
      setIsCreating(false);
    }
  };

  const columns = [
    { 
      header: 'Backup File', 
      accessorKey: 'fileName',
      className: 'font-mono text-xs'
    },
    { 
      header: 'Size', 
      cell: (b: any) => `${(b.sizeBytes / 1024).toFixed(2)} KB`
    },
    { 
      header: 'Created At', 
      cell: (b: any) => new Date(b.createdAt).toLocaleString()
    },
    { 
      header: 'Status', 
      cell: (b: any) => (
        <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
          {b.status}
        </span>
      )
    },
    {
      header: 'Actions',
      cell: (b: any) => (
        <div className="flex gap-2">
          <button className="text-blue-600 hover:bg-blue-50 p-1 rounded" title="Download">
            <Download size={14} />
          </button>
          <button className="text-orange-600 hover:bg-orange-50 p-1 rounded" title="Restore">
            <RotateCcw size={14} />
          </button>
        </div>
      )
    }
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter flex items-center">
              <Shield className="mr-2 text-primary-600" /> Backup Center
            </h1>
            <p className="text-sm text-gray-500 mt-1">Manage database safety, manual backups, and restore points.</p>
          </div>
          <Button onClick={createBackup} disabled={isCreating}>
            {isCreating ? 'Processing...' : 'Generate New Backup'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700 flex items-center gap-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full text-blue-600">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase">Last Backup</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {backups.length > 0 ? new Date(backups[0].createdAt).toLocaleDateString() : 'Never'}
              </p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700 flex items-center gap-4">
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full text-green-600">
              <HardDrive size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase">Total Backups</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{backups.length}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700 flex items-center gap-4">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full text-purple-600">
              <Database size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase">Cloud Sync</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">Active</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase">Backup History</h3>
          </div>
          <DataTable 
            columns={columns} 
            data={backups} 
            isLoading={isLoading} 
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
