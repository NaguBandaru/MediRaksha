import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import HomePage from './pages/dashboard/HomePage';
import UsersPage from './pages/users/UsersPage';
import TransactionsPage from './pages/transactions/TransactionsPage';
import POSPage from './pages/transactions/POSPage';
import InventoryPage from './pages/inventory/InventoryPage';
import MedicinesPage from './pages/medicines/MedicinesPage';
import BackupPage from './pages/system/BackupPage';
import ReportsPage from './pages/reports/ReportsPage';
import ToolsPage from './pages/tools/ToolsPage';
import AutomationPage from './pages/automation/AutomationPage';
import ProtectedRoute from './components/layout/ProtectedRoute';

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/transactions/new" element={<POSPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/medicines" element={<MedicinesPage />} />
          <Route path="/backup" element={<BackupPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/automation" element={<AutomationPage />} />
          <Route path="/help" element={<div className="p-8"><h1 className="text-2xl font-bold">Help & Documentation (Coming Soon)</h1></div>} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
