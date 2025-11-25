"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SidenavItem from './SidenavItem';

const Sidenav = () => {
  const router = usePathname();

  return (
    <div className="flex flex-col h-screen w-64 bg-white border-r border-gray-200 text-gray-700">
      {/* En-tête / Logo */}
      <div className="p-6 border-b border-gray-100">
        <Link href="/" className="flex items-center space-x-3">
          {/* Remplacez par votre logo */}
          <div className="p-2 bg-blue-100 rounded-full">
            <span className="h-6 w-6 text-blue-600">Logo</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">PatriCare</h1>
            <p className="text-sm text-gray-500">Gestion immobilière</p>
          </div>
        </Link>
      </div>

      {/* Menu Principal */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <SidenavItem
          href="/dashboard"
          label="Tableau de bord"
          isActive={router === '/dashboard' || router === '/'}
        />
        <SidenavItem
          href="/mes-biens"
          label="Mes biens"
          isActive={router === '/mes-biens'}
        />
        <SidenavItem
          href="/documents"
          label="Documents"
          isActive={router === '/documents'}
        />
        <SidenavItem
          href="/locataires"
          label="Locataires"
          isActive={router === '/locataires'}
        />
        <SidenavItem
          href="/planification"
          label="Planification"
          isActive={router === '/planification'}
        />
      </nav>

      {/* Menu Bas (Paramètres et Déconnexion) */}
      <div className="p-4 border-t border-gray-100 space-y-1">
        <SidenavItem
          href="/parametres"
          label="Paramètres"
          isActive={router === '/parametres'}
        />
        <button
          className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          onClick={() => { /* Logique de déconnexion */ console.log('Déconnexion'); }}
        >
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export default Sidenav;