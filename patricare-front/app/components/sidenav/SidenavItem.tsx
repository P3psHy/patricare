import React from 'react';
import Link from 'next/link';

interface SidenavItemProps {
  href: string;
  label: string;
  isActive?: boolean;
}

const SidenavItem: React.FC<SidenavItemProps> = ({ href, label, isActive }) => {
  // Classes conditionnelles pour l'état actif
  const baseClasses = "flex items-center px-2 md:px-3 py-2.5 text-md font-medium rounded-lg transition-colors";
  const activeClasses = isActive
    ? "bg-blue-100 text-blue-700" // Style pour l'élément actif
    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"; // Style par défaut

  return (
    <Link href={href} className={`${baseClasses} ${activeClasses}`}>
      {label}
    </Link>
  );
};

export default SidenavItem;