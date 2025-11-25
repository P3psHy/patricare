'use client';

import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { PropertiesPage } from './components/PropertiesPage';
import { DocumentsPage } from './components/DocumentsPage';
import { TenantsPage } from './components/TenantsPage';

export type Page = 'login' | 'dashboard' | 'properties' | 'documents' | 'tenants' | 'schedule';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('login');
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage === 'dashboard' && (
        <Dashboard onNavigate={setCurrentPage} onLogout={handleLogout} />
      )}
      {currentPage === 'properties' && (
        <PropertiesPage onNavigate={setCurrentPage} onLogout={handleLogout} />
      )}
      {currentPage === 'documents' && (
        <DocumentsPage onNavigate={setCurrentPage} onLogout={handleLogout} />
      )}
      {currentPage === 'tenants' && (
        <TenantsPage onNavigate={setCurrentPage} onLogout={handleLogout} />
      )}
    </div>
  );
}
