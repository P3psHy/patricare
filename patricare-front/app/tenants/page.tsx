"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Users,
  Plus,
  Search,
  Mail,
  Phone,
  Home,
  Calendar,
  Trash2,
  Loader2,
} from "lucide-react";
import { api } from "@/lib/api";

interface LodgingApi {
  id: number;
  estLoue: boolean;
  prixLoyer: number;
  superficie: number;
  nbPiece: number;
  description?: string;
  adresse?: string;
  ville?: string;
}

interface UserApi {
  id: number;
  firstname: string;
  lastname: string;
  email?: string;
  mail?: string;
  telephone?: string;
}

interface TenantCard {
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

interface TenantForm {
  fullName: string;
  email: string;
  phone: string;
  property: string; // lodging id as string when selected, otherwise free text
  rent: string; // numeric string (we store as string for input)
  rentDate: string;
  entryDate: string;
  notes: string;
}

const emptyForm: TenantForm = {
  fullName: "",
  email: "",
  phone: "",
  property: "",
  rent: "",
  rentDate: "1er du mois",
  entryDate: "",
  notes: "",
};

export default function Locataires() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [tenants, setTenants] = useState<TenantCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<TenantForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [lodgings, setLodgings] = useState<LodgingApi[]>([]);

  // Load lodgings and tenants on mount
  useEffect(() => {
    loadLodgings();
    loadTenants();
  }, []);

  const loadLodgings = async () => {
    try {
      setError(null);
      const data = await api.get<LodgingApi[]>("/lodgings");
      setLodgings(data);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les biens.");
    }
  };

  const loadTenants = async () => {
    try {
      setLoading(true);
      setError(null);
      const users = await api.get<UserApi[]>("/users");
      // Map users to tenant cards (basic)
      setTenants(
        users.map((u) => ({
          id: u.id,
          name: `${u.firstname} ${u.lastname}`.trim(),
          email: u.email ?? u.mail ?? "",
          phone: u.telephone ?? "",
          property: "N/A",
          rent: "N/A",
          rentDate: "-",
          entryDate: "-",
          status: "Profil créé",
          paymentStatus: "paid",
        }))
      );
    } catch (e) {
      console.error(e);
      setError("Impossible de charger les locataires depuis l'API.");
    } finally {
      setLoading(false);
    }
  };

  const filteredTenants = useMemo(
    () =>
      tenants.filter((tenant) =>
        [tenant.name, tenant.email, tenant.property]
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      ),
    [tenants, searchTerm]
  );

  // When user selects a lodging in form, auto-fill rent from lodging.prixLoyer
  const handleSelectLodging = (selectedId: string) => {
    const selectedLodging = lodgings.find((l) => l.id === Number(selectedId));
    setForm((prev) => ({
      ...prev,
      property: selectedId,
      rent: selectedLodging ? String(selectedLodging.prixLoyer) : prev.rent,
    }));
  };

  const handleCreateTenant = async () => {
    if (!form.fullName.trim()) {
      setActionError("Le nom complet est requis.");
      return;
    }

    const [firstname, ...rest] = form.fullName.trim().split(" ");
    const lastname = rest.join(" ") || "Inconnu";

    try {
      setSaving(true);
      setActionError(null);

      // Create user via API
      const created = await api.post<UserApi>("/users", {
        firstname,
        lastname,
        telephone: form.phone || "",
        mail:
          form.email ||
          `${firstname.toLowerCase()}.${lastname.toLowerCase()}@patricare.local`,
        password: `PatriCare-${Date.now()}`,
      });

      // Resolve property display & rent
      const selectedLodging = lodgings.find((lg) => lg.id === Number(form.property));
      const propertyDisplay = selectedLodging
        ? `${selectedLodging.adresse ?? selectedLodging.description ?? "Bien"}${selectedLodging.ville ? ` (${selectedLodging.ville})` : ""}`
        : form.property || "N/A";

      const rentDisplay = selectedLodging
        ? `${selectedLodging.prixLoyer} €`
        : form.rent
        ? `${form.rent} €`
        : "N/A";

      // Optionally mark lodging as rented on server if we used a lodging id
      if (selectedLodging) {
        try {
          // best-effort: patch the lodging to estLoue = true
          await api.patch<LodgingApi>(`/lodgings/${selectedLodging.id}`, {
            estLoue: true,
          });
          // reload lodgings to reflect new status
          loadLodgings();
        } catch (err) {
          // non-blocking: log but continue
          console.error("Impossible de marquer le bien comme loué :", err);
        }
      }

      // Add to local tenants state (display)
      setTenants((prev) => [
        {
          id: created.id,
          name: `${created.firstname} ${created.lastname}`.trim(),
          email: created.email ?? created.mail ?? form.email,
          phone: created.telephone ?? form.phone,
          property: propertyDisplay,
          rent: rentDisplay,
          rentDate: form.rentDate || "-",
          entryDate: form.entryDate || new Date().toLocaleDateString("fr-FR"),
          status: "Nouveau locataire",
          paymentStatus: "paid",
        },
        ...prev,
      ]);

      setForm(emptyForm);
      setShowAddModal(false);
    } catch (e) {
      console.error(e);
      setActionError("Impossible d'ajouter ce locataire.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTenant = async (id: number) => {
    if (!confirm("Supprimer ce locataire ?")) return;
    try {
      await api.delete(`/users/${id}`);
      setTenants((prev) => prev.filter((tenant) => tenant.id !== id));
    } catch (e) {
      console.error(e);
      alert("La suppression a échoué.");
    }
  };

  return (
    <main className="w-full flex-1 px-4 py-8 md:py-8 space-y-6 md:space-y-10 bg-gray-50">
      <header className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-blue-600">Gestion des locataires</h1>
            <p className="text-md text-gray-600">Suivez vos locataires et leurs paiements.</p>
          </div>
          <button
            onClick={() => {
              setForm(emptyForm);
              setActionError(null);
              setShowAddModal(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-400 hover:opacity-60 px-4 py-3 text-md font-medium text-white shadow-lg shadow-blue-200 transition"
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
            <p className="text-lg font-semibold text-gray-900">{tenants.length}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-md text-gray-500">Revenus mensuels</p>
            <p className="text-lg font-semibold text-gray-900">5 270 €</p>
          </div>
        </div>
      </header>

      {loading && <p className="text-gray-500">Chargement des locataires...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <section className="grid gap-8 md:grid-cols-2">
        {filteredTenants.map((tenant) => (
          <article
            key={tenant.id}
            className="rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
          >
            <div className="p-6">
              <div className="mb-4 flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="flex min-w-8 min-h-8 md:h-12 md:w-12 items-center justify-center rounded-full bg-blue-400">
                    <Users className="w-4 h-4 md:h-6 md:w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{tenant.name}</h3>
                    <p className="text-md text-gray-500">{tenant.property}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`rounded-2xl px-3 py-2 text-sm md:text-md text-center font-semibold ${
                      tenant.paymentStatus === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {tenant.status}
                  </span>
                  <button
                    onClick={() => handleDeleteTenant(tenant.id)}
                    className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                    Supprimer
                  </button>
                </div>
              </div>

              <div className="mb-4 space-y-3 border-b border-gray-100 pb-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <a href={`mailto:${tenant.email}`} className="text-md text-blue-600 hover:text-blue-700">
                    {tenant.email || "—"}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <a href={`tel:${tenant.phone}`} className="text-md text-blue-600 hover:text-blue-700">
                    {tenant.phone || "—"}
                  </a>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      {filteredTenants.length === 0 && !loading && (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
          <Users className="mx-auto mb-4 h-12 w-12 text-gray-300" />
          <p className="text-md text-gray-500">Aucun locataire trouvé.</p>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900">Ajouter un locataire</h2>
              <p className="text-md text-gray-500">Pré-remplissez les champs ci-dessous pour créer un nouveau dossier.</p>
            </div>
            <div className="space-y-4 p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-md font-medium text-gray-700">Nom complet</label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-md focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Marie Dubois"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-md font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-md focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="email@exemple.com"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-md font-medium text-gray-700">Téléphone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-md focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>
              </div>
            </div>

            {actionError && <p className="px-6 text-sm text-red-600">{actionError}</p>}

            <div className="flex gap-3 border-t border-gray-200 p-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-md font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateTenant}
                disabled={saving}
                className="flex-1 rounded-lg bg-blue-400 px-4 py-2 text-md font-medium text-white transition hover:opacity-60 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Création...
                  </span>
                ) : (
                  "Ajouter le locataire"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
