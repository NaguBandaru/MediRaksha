import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable from '../../components/ui/DataTable';
import type { Column } from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { Plus } from 'lucide-react';
// import api from '../../services/api';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  isActive: boolean;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock fetching
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUsers([
        { id: '1', firstName: 'Admin', lastName: 'User', email: 'admin@mediraksha.com', roles: ['Admin'], isActive: true },
        { id: '2', firstName: 'John', lastName: 'Doe', email: 'john@mediraksha.com', roles: ['Pharmacist'], isActive: true },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const columns: Column<User>[] = [
    { header: 'First Name', accessorKey: 'firstName' },
    { header: 'Last Name', accessorKey: 'lastName' },
    { header: 'Email', accessorKey: 'email' },
    { 
      header: 'Roles', 
      cell: (user) => (
        <div className="flex gap-1">
          {user.roles.map(r => (
            <span key={r} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              {r}
            </span>
          ))}
        </div>
      ) 
    },
    { 
      header: 'Status', 
      cell: (user) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {user.isActive ? 'Active' : 'Inactive'}
        </span>
      ) 
    },
    {
      header: 'Actions',
      cell: () => (
        <button className="text-primary-600 hover:text-primary-900 font-medium text-sm">
          Edit
        </button>
      )
    }
  ];

  return (
    <DashboardLayout>
      <div className="sm:flex sm:items-center mb-6">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the users in your system including their name, email, role, and status.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add User
          </Button>
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={users} 
        isLoading={isLoading} 
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Add New User"
      >
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" name="firstName" required />
            <Input label="Last Name" name="lastName" required />
          </div>
          <Input label="Email" type="email" name="email" required />
          <Input label="Password" type="password" name="password" required />
          <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
            <Button type="button" className="w-full sm:ml-3 sm:w-auto" onClick={() => setIsModalOpen(false)}>
              Save
            </Button>
            <Button type="button" variant="outline" className="mt-3 w-full sm:mt-0 sm:w-auto" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
