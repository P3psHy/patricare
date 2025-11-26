"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import SidenavItem from './SidenavItem';
import Image from 'next/image';
import Logo from '../../assets/logo.png';

const Sidenav = () => {
  const routerPath = usePathname();
  const router = useRouter();

  return (
    <div className="flex flex-col w-full h-full bg-white border-r border-gray-200 text-gray-700">
      {/* En-tête / Logo */}
      <div className="p-4 border-b border-gray-100">
        <Link href="/" className="flex flex-col md:flex-row items-center space-y-1 md:space-x-2">
          <div className="p-1 bg-blue-100 rounded-full">
            <Image src={Logo} alt="PatriCare Logo" width={64} height={64} />
          </div>
          <div className='w-full flex flex-col text-center md:text-left'>
            <h1 className="text-sm md:text-lg font-bold text-gray-900 leading-tight">PatriCare</h1>
            <p className="text-xs md:text-sm text-gray-500">Gestion immobilière</p>
          </div>
        </Link>
      </div>

      {/* Menu Principal */}
      <nav className="flex-1 p-2 md:p-4 space-y-1 overflow-y-auto">
        <SidenavItem
          href="/dashboard"
          label="Tableau de bord"
          isActive={routerPath === '/dashboard' || routerPath === '/'}
        />
        <SidenavItem
          href="/mes-biens"
          label="Mes biens"
          isActive={routerPath === '/mes-biens'}
        />
        <SidenavItem
          href="/documents"
          label="Documents"
          isActive={routerPath === '/documents'}
        />
        <SidenavItem
          href="/locataires"
          label="Locataires"
          isActive={routerPath === '/locataires'}
        />
      </nav>

      {/* Menu Bas (Paramètres et Déconnexion) */}
      <div className="p-4 border-t border-gray-100 space-y-1">
        <SidenavItem
          href="/parametres"
          label="Paramètres"
          isActive={routerPath === '/parametres'}
        />
        <button
          className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          onClick={() => { router.replace("/login"); }}
        >
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export default Sidenav;