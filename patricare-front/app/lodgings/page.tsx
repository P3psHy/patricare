'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  MapPin,
  DollarSign,
  Home,
  Edit,
  Trash2,
  Eye,
  Loader2,
} from 'lucide-react';
import { api } from '@/lib/api';

interface LodgingApi {
  id: number;
  estLoue: boolean;
  prixLoyer: number;
  superficie: number;
  nbPiece: number;
  description?: string;
  adresseId?: number;
}

interface LodgingFormValues {
  description: string;
  prixLoyer: string;
  superficie: string;
  nbPiece: string;
  estLoue: 'true' | 'false';
}

const emptyForm: LodgingFormValues = {
  description: '',
  prixLoyer: '',
  superficie: '',
  nbPiece: '',
  estLoue: 'false',
};

const mapLodgingToDisplay = (lodging: LodgingApi) => ({
  title: lodging.description || `Bien #${lodging.id}`,
  superficie: `${lodging.superficie} m²`,
  nbPieces: `${lodging.nbPiece} pièces`,
  rent: `${lodging.prixLoyer} €`,
  status: lodging.estLoue ? 'Loué' : 'Disponible',
});

const formToPayload = (form: LodgingFormValues) => ({
  description: form.description.trim() || undefined,
  prixLoyer: Number(form.prixLoyer) || 0,
  superficie: Number(form.superficie) || 0,
  nbPiece: Number(form.nbPiece) || 0,
  estLoue: form.estLoue === 'true',
});


export default function MesBiensPage() {
  const [lodgings, setLodgings] = useState<LodgingApi[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [createForm, setCreateForm] = useState<LodgingFormValues>(emptyForm);
  const [editForm, setEditForm] = useState<LodgingFormValues>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadLodgings();
  }, []);

  const loadLodgings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.get<LodgingApi[]>('/lodgings');
      setLodgings(data);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les biens depuis l'API.");
    } finally {
      setLoading(false);
    }
  };

  const [statusFilter, setStatusFilter] = useState("all");

  const filteredLodgings = useMemo(() => {
    let result = lodgings;

    if (searchTerm) {
      const needle = searchTerm.toLowerCase();
      result = result.filter((lodging) =>
        (lodging.description || "").toLowerCase().includes(needle)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((lodging) => {
        if (statusFilter === "loue") return lodging.estLoue === true;
        if (statusFilter === "disponible") return lodging.estLoue === false;
        return true;
      });
    }

    return result;
  }, [lodgings, searchTerm, statusFilter]);

  const openAddModal = () => {
    setCreateForm(emptyForm);
    setActionError(null);
    setShowAddModal(true);
  };

  const openEditModal = (lodging: LodgingApi) => {
    setEditingId(lodging.id);
    setEditForm({
      description: lodging.description || '',
      prixLoyer: String(lodging.prixLoyer ?? ''),
      superficie: String(lodging.superficie ?? ''),
      nbPiece: String(lodging.nbPiece ?? ''),
      estLoue: lodging.estLoue ? 'true' : 'false',
    });
    setActionError(null);
    setShowEditModal(true);
  };

  const handleCreate = async () => {
    try {
      setSaving(true);
      setActionError(null);
      await api.post<LodgingApi>('/lodgings', formToPayload(createForm));
      await loadLodgings();
      setShowAddModal(false);
      setCreateForm(emptyForm);
    } catch (err) {
      console.error(err);
      setActionError("Impossible d'ajouter ce bien. Vérifiez les champs.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async () => {
    if (!editingId) return;
    try {
      setSaving(true);
      setActionError(null);
      await api.patch<LodgingApi>(`/lodgings/${editingId}`, formToPayload(editForm));
      await loadLodgings();
      setShowEditModal(false);
      setEditingId(null);
    } catch (err) {
      console.error(err);
      setActionError('Impossible de mettre à jour ce bien.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Confirmez-vous la suppression de ce bien ?')) {
      return;
    }
    try {
      await api.delete(`/lodgings/${id}`);
      setLodgings((prev) => prev.filter((lodging) => lodging.id !== id));
    } catch (err) {
      console.error(err);
      alert('La suppression a échoué.');
    }
  };

  const renderFormFields = (
    form: LodgingFormValues,
    setForm: (values: LodgingFormValues) => void,
  ) => (
    <div className="p-4 md:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
      <div>
        <label className="block text-gray-700 mb-2 text-sm">Nom / description</label>
        <input
          type="text"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
          placeholder="Ex: Appartement Paris 15ème"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <div>
          <label className="block text-gray-700 mb-2 text-sm">Surface (m²)</label>
          <input
            type="number"
            value={form.superficie}
            onChange={(e) => setForm({ ...form, superficie: e.target.value })}
            className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            placeholder="65"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2 text-sm">Nombre de pièces</label>
          <input
            type="number"
            value={form.nbPiece}
            onChange={(e) => setForm({ ...form, nbPiece: e.target.value })}
            className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            placeholder="3"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2 text-sm">Loyer (€)</label>
          <input
            type="number"
            value={form.prixLoyer}
            onChange={(e) => setForm({ ...form, prixLoyer: e.target.value })}
            className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            placeholder="1250"
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-700 mb-2 text-sm">Statut</label>
        <select
          id="estLoue"
          value={form.estLoue}
          onChange={(e) => setForm({ ...form, estLoue: e.target.value as 'true' | 'false' })}
          className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
        >
          <option value="true">Loué</option>
          <option value="false">Disponible</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="flex">
      <main className="flex-1 p-4 md:p-8 bg-gray-50 min-h-screen">
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">Mes biens immobiliers</h1>
              <p className="text-sm md:text-base text-gray-600">
                Gérez l'ensemble de votre patrimoine immobilier
              </p>
            </div>
            <button
              onClick={openAddModal}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:from-blue-700 hover:to-green-700 transition shadow-lg shadow-blue-200"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Ajouter un bien</span>
              <span className="sm:hidden">Ajouter</span>
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher un bien..."
                className="w-full pl-10 pr-4 py-2 md:py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm md:text-base"
              />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 md:px-4 py-2 md:py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm md:text-base"
            >
              <option value="all">Tous les statuts</option>
              <option value="loue">Loué</option>
              <option value="disponible">Disponible</option>
            </select>
          </div>
        </div>

        {loading && <p className="text-gray-500 mb-4">Chargement des biens...</p>}
        {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLodgings.map((lodging) => {
            const display = mapLodgingToDisplay(lodging);
            return (
              <div
                key={lodging.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition overflow-hidden group"
              >
                <div className="h-48 bg-gradient-to-br from-blue-100 to-green-100 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Home className="w-16 h-16 text-blue-600 opacity-30" />
                  </div>
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-3 py-1 rounded-full ${display.status === 'Loué'
                          ? 'bg-green-600 text-white'
                          : 'bg-blue-600 text-white'
                        }`}
                    >
                      {display.status}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="mb-3">
                    <h3 className="text-gray-900 mb-1">{display.title}</h3>
                    <p className="text-gray-500">Identifiant #{lodging.id}</p>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-gray-700">Surface {display.superficie}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-700">{display.nbPieces}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-700">ID adresse: {lodging.adresseId ?? '—'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-600">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-gray-700">{display.rent}/mois</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-gray-100">
                    <Link
                      href={`/lodgings/${lodging.id}`}
                      className="flex-1 flex items-center justify-center gap-2 px-2 md:px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="hidden sm:inline">Voir</span>
                    </Link>
                    <button
                      onClick={() => openEditModal(lodging)}
                      className="flex-1 flex items-center justify-center gap-2 px-2 md:px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      <span className="hidden sm:inline">Modifier</span>
                    </button>
                    <button
                      onClick={() => handleDelete(lodging.id)}
                      className="flex-1 sm:flex-none flex items-center justify-center px-2 md:px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-2xl w-full my-8">
              <div className="p-4 md:p-6 border-b border-gray-200">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">Ajouter un bien immobilier</h2>
              </div>
              {renderFormFields(createForm, setCreateForm)}
              {actionError && <p className="px-6 text-sm text-red-600">{actionError}</p>}
              <div className="p-4 md:p-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition text-sm"
                >
                  Annuler
                </button>
                <button
                  onClick={handleCreate}
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 transition text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Patientez...
                    </span>
                  ) : (
                    'Ajouter le bien'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {showEditModal && editingId !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-2xl w-full my-8">
              <div className="p-4 md:p-6 border-b border-gray-200">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                  Modifier le bien #{editingId}
                </h2>
              </div>
              {renderFormFields(editForm, setEditForm)}
              {actionError && <p className="px-6 text-sm text-red-600">{actionError}</p>}
              <div className="p-4 md:p-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingId(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition text-sm"
                >
                  Annuler
                </button>
                <button
                  onClick={handleEdit}
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Enregistrement...
                    </span>
                  ) : (
                    'Enregistrer les modifications'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
