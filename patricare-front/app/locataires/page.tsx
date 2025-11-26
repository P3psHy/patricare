 "use client";

import { useState } from "react";
import {
  Users,
  Plus,
  Search,
  Mail,
  Phone,
  Home,
  Calendar,
} from "lucide-react";

interface Tenant {
  id: number;
  name: string;
  email: string;
  phone: string;
  property: string;
  rent: string;
  rentDate: string;
  entryDate: string;
  status: string;
  paymentStatus: "paid" | "late";
}

const tenants: Tenant[] = [
  {
    id: 1,
    name: "Marie Dubois",
    email: "marie.dubois@email.com",
    phone: "+33 6 12 34 56 78",
    property: "Appartement Paris 15ème",
    rent: "1 250 €",
    rentDate: "1er du mois",
    entryDate: "01 Jan 2024",
    status: "À jour",
    paymentStatus: "paid",
  },
  {
    id: 2,
    name: "Pierre Martin",
    email: "pierre.martin@email.com",
    phone: "+33 6 23 45 67 89",
    property: "Maison Lyon Centre",
    rent: "1 800 €",
    rentDate: "5 du mois",
    entryDate: "15 Mar 2023",
    status: "À jour",
    paymentStatus: "paid",
  },
  {
    id: 3,
    name: "Sophie Bernard",
    email: "sophie.bernard@email.com",
    phone: "+33 6 34 56 78 90",
    property: "Bureau Lille",
    rent: "2 100 €",
    rentDate: "1er du mois",
    entryDate: "10 Jun 2024",
    status: "En retard",
    paymentStatus: "late",
  },
  {
    id: 4,
    name: "Jean Dupont",
    email: "jean.dupont@email.com",
    phone: "+33 6 45 67 89 01",
    property: "Parking Toulouse",
    rent: "120 €",
    rentDate: "1er du mois",
    entryDate: "20 Feb 2024",
    status: "À jour",
    paymentStatus: "paid",
  },
];

export default function Locataires() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredTenants = tenants.filter((tenant) =>
    [tenant.name, tenant.email, tenant.property]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  return (
    <main className="w-full flex-1 px-4 py-8 md:py-8 space-y-6 md:space-y-10 bg-gray-50">
      <header className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-blue-600">
              Gestion des locataires
            </h1>
            <p className="text-md text-gray-600">
              Suivez vos locataires et leurs paiements.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-400 hover:opacity-60 px-4 py-3 text-md font-medium text-white shadow-lg shadow-blue-200 transition hover:from-blue-700 hover:to-green-700"
          >
            <Plus className="h-5 w-5" />
            Ajouter un locataire
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          <div className="flex items-center md:col-span-2">
            <label className="sr-only" htmlFor="search">
              Rechercher un locataire
            </label>
            <div className="w-full relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Rechercher un locataire..."
                className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-10 pr-4 text-md text-gray-900 placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-md text-gray-500">Locataires actifs</p>
            <p className="text-lg font-semibold text-gray-900">
              {tenants.length}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-md text-gray-500">Revenus mensuels</p>
            <p className="text-lg font-semibold text-gray-900">5 270 €</p>
          </div>
        </div>
      </header>

      <section className="grid gap-8 md:grid-cols-2">
        {filteredTenants.map((tenant) => (
          <article
            key={tenant.id}
            className="rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
          >
            <div className="p-6">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex min-w-8 min-h-8 md:h-12 md:w-12 items-center justify-center rounded-full bg-blue-400 hover:opacity-60">
                    <Users className="w-4 h-4 md:h-6 md:w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {tenant.name}
                    </h3>
                    <p className="text-md text-gray-500">{tenant.property}</p>
                  </div>
                </div>
                <span
                  className={`rounded-2xl px-3 py-2 text-sm md:text-md text-center font-semibold ${
                    tenant.paymentStatus === "paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {tenant.status}
                </span>
              </div>

              <div className="mb-4 space-y-3 border-b border-gray-100 pb-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <a
                    href={`mailto:${tenant.email}`}
                    className="text-md text-blue-600 hover:text-blue-700"
                  >
                    {tenant.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <a
                    href={`tel:${tenant.phone}`}
                    className="text-md text-blue-600 hover:text-blue-700"
                  >
                    {tenant.phone}
                  </a>
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    <span className="text-md">Loyer mensuel</span>
                  </div>
                  <span className="font-semibold text-md text-right text-gray-900">
                    {tenant.rent}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span className="text-md">Date de paiement</span>
                  </div>
                  <span className="font-semibold text-md text-right text-gray-900">
                    {tenant.rentDate}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span className="text-md">Entrée dans les lieux</span>
                  </div>
                  <span className="font-semibold text-md text-right text-gray-900">
                    {tenant.entryDate}
                  </span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      {filteredTenants.length === 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
          <Users className="mx-auto mb-4 h-12 w-12 text-gray-300" />
          <p className="text-md text-gray-500">Aucun locataire trouvé.</p>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                Ajouter un locataire
              </h2>
              <p className="text-md text-gray-500">
                Pré-remplissez les champs ci-dessous pour créer un nouveau
                dossier.
              </p>
            </div>
            <div className="space-y-4 p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-md font-medium text-gray-700">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-md focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Marie Dubois"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-md font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-md focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="email@exemple.com"
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-md font-medium text-gray-700">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-md focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-md font-medium text-gray-700">
                    Bien loué
                  </label>
                  <select className="w-full rounded-lg border border-gray-300 px-4 py-2 text-md focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Sélectionner un bien</option>
                    <option>Appartement Paris 15ème</option>
                    <option>Maison Lyon Centre</option>
                    <option>Studio Bordeaux</option>
                    <option>Bureau Lille</option>
                  </select>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-md font-medium text-gray-700">
                    Loyer mensuel (€)
                  </label>
                  <input
                    type="number"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-md focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="1250"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-md font-medium text-gray-700">
                    Date de paiement
                  </label>
                  <select className="w-full rounded-lg border border-gray-300 px-4 py-2 text-md focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>1er du mois</option>
                    <option>5 du mois</option>
                    <option>10 du mois</option>
                    <option>15 du mois</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-md font-medium text-gray-700">
                    Date d'entrée
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-md focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-md font-medium text-gray-700">
                  Notes additionnelles
                </label>
                <textarea
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-md focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Notes concernant le locataire..."
                />
              </div>
            </div>
            <div className="flex gap-3 border-t border-gray-200 p-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-md font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 rounded-lg bg-blue-400 hover:opacity-60 px-4 py-2 text-md font-medium text-white transition hover:from-blue-700 hover:to-green-700"
              >
                Ajouter le locataire
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}