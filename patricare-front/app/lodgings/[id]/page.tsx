'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

interface LodgingApi {
  id: number;
  estLoue: boolean;
  prixLoyer: number;
  superficie: number;
  nbPiece: number;
  description?: string;
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

const formToPayload = (form: LodgingFormValues) => ({
  description: form.description.trim() || undefined,
  prixLoyer: Number(form.prixLoyer) || 0,
  superficie: Number(form.superficie) || 0,
  nbPiece: Number(form.nbPiece) || 0,
  estLoue: form.estLoue === 'true',
});

export default function BienDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const [lodging, setLodging] = useState<LodgingApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState<LodgingFormValues>(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    params
      .then((value) => setResolvedParams(value))
      .catch(() => setError('Paramètres invalides.'));
  }, [params]);

  useEffect(() => {
    if (!resolvedParams) return;
    loadLodging(resolvedParams.id);
  }, [resolvedParams]);

  const loadLodging = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.get<LodgingApi>(`/lodgings/${id}`);
      setLodging(data);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger ce bien.");
      setLodging(null);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = () => {
    if (!lodging) return;
    setFormData({
      description: lodging.description || '',
      prixLoyer: String(lodging.prixLoyer ?? ''),
      superficie: String(lodging.superficie ?? ''),
      nbPiece: String(lodging.nbPiece ?? ''),
      estLoue: lodging.estLoue ? 'true' : 'false',
    });
    setShowEditModal(true);
  };

  const handleSave = async () => {
    if (!lodging) return;
    try {
      setSaving(true);
      await api.patch(`/lodgings/${lodging.id}`, formToPayload(formData));
      await loadLodging(String(lodging.id));
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
      alert('La mise à jour a échoué.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!lodging) return;
    if (!confirm('Supprimer définitivement ce bien ?')) return;
    try {
      await api.delete(`/lodgings/${lodging.id}`);
      router.push('/lodgings');
    } catch (err) {
      console.error(err);
      alert('Impossible de supprimer ce bien.');
    }
  };

  if (!loading && !lodging) {
    return (
      <div className="p-4 md:p-6 max-w-3xl mx-auto">
        <p className="text-red-600">Ce bien est introuvable.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center w-full h-full p-4 md:p-6 max-w-3xl mx-auto">
      {loading && <p>Chargement...</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {lodging && (
        <>
          <h1 className="text-center text-2xl md:text-3xl font-semibold mb-10">
            {lodging.description?.toUpperCase() || `Bien #${lodging.id}`}
          </h1>

          <div className="bg-white rounded-xl p-4 md:p-6 shadow-md space-y-4 border">

          <button
            onClick={() => router.back()}
            className="w-full sm:w-auto text-blue-400 underline"
          >
            Retour
          </button>

            <div>
              <h2 className="text-lg font-medium text-gray-700">Informations</h2>
              <div className="mt-2 space-y-1 text-gray-600">
                <p>
                  <span className="font-semibold">Identifiant :</span> #{lodging.id}
                </p>
                <p>
                  <span className="font-semibold">Statut :</span>{' '}
                  {lodging.estLoue ? 'Loué' : 'Disponible'}
                </p>
                <p>
                  <span className="font-semibold">Superficie :</span> {lodging.superficie} m²
                </p>
                <p>
                  <span className="font-semibold">Pièces :</span> {lodging.nbPiece}
                </p>
                <p>
                  <span className="font-semibold">Loyer :</span> {lodging.prixLoyer} € / mois
                </p>
              </div>
            </div>

            <div className="pt-4 border-t flex flex-col justify-center sm:flex-row items-center gap-3 sm:gap-4">
              <button
                className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-300"
                onClick={openEditModal}
              >
                Modifier
              </button>

              <button
                className="w-full sm:w-auto bg-orange-400 text-white px-4 py-2 rounded-lg hover:bg-orange-300"
                onClick={handleDelete}
              >
                Supprimer ce bien
              </button>
            </div>
          </div>
        </>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full my-8">
            <div className="p-4 md:p-6 border-b border-gray-200">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                Modifier le bien
              </h2>
            </div>

            <div className="p-4 md:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Loyer (€)
                  </label>
                  <input
                    type="number"
                    value={formData.prixLoyer}
                    onChange={(e) => setFormData({ ...formData, prixLoyer: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Superficie (m²)
                  </label>
                  <input
                    type="number"
                    value={formData.superficie}
                    onChange={(e) => setFormData({ ...formData, superficie: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Nombre de pièces
                  </label>
                  <input
                    type="number"
                    value={formData.nbPiece}
                    onChange={(e) => setFormData({ ...formData, nbPiece: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Statut</label>
                  <select
                    value={formData.estLoue}
                    onChange={(e) => setFormData({ ...formData, estLoue: e.target.value as 'true' | 'false' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="true">Loué</option>
                    <option value="false">Disponible</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-4 md:p-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
