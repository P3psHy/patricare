'use client';

import { notFound } from "next/navigation";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface LodgingApi {
  id: number;
  estLoue: boolean;
  prixLoyer: number;
  superficie: number;
  nbPiece: number;
  description?: string;
}

interface Bien {
  id: number;
  titre: string;
  adresse: string;
  type: string;
  superficie: number;
  description?: string;
  createdAt: string;
}

export default function BienDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(
    null,
  );
  const [bien, setBien] = useState<Bien | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState<Bien | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    params.then(setResolvedParams).catch(() => {
      setError("Paramètre invalide.");
    });
  }, [params]);

  useEffect(() => {
    if (!resolvedParams) return;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await api.get<LodgingApi>(
          `/lodgings/${resolvedParams.id}`,
        );

        const mapped: Bien = {
          id: data.id,
          titre: data.description || `Bien #${data.id}`,
          adresse: `Superficie ${data.superficie} m²`,
          type: "Bien",
          superficie: data.superficie,
          description: data.description,
          createdAt: "",
        };

        setBien(mapped);
        setFormData(mapped);
      } catch (e) {
        console.error(e);
        setError("Impossible de charger le bien depuis l'API.");
        setBien(null);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [resolvedParams]);

  if (loading) {
    return <div className="p-6">Chargement...</div>;
  }

  if (!bien) {
    return notFound();
  }

  const handleEdit = () => {
    setFormData(bien);
    setShowEditModal(true);
  };

  const handleDelete = () => {
    alert("Suppression à connecter");
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleSave = () => {
    if (formData) {
      setBien(formData);
      setShowEditModal(false);
      alert("Bien modifié avec succès");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (formData) {
      setFormData({
        ...formData,
        [name]: name === 'superficie' ? parseFloat(value) : value,
      });
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-semibold mb-6">{bien.titre}</h1>

      <div className="bg-white rounded-xl p-4 md:p-6 shadow-md space-y-4 border">
        <div>
          <h2 className="text-lg font-medium text-gray-700">Informations</h2>
          <div className="mt-2 space-y-1 text-gray-600">
            <p><span className="font-semibold">Adresse :</span> {bien.adresse}</p>
            <p><span className="font-semibold">Type :</span> {bien.type}</p>
            <p><span className="font-semibold">Superficie :</span> {bien.superficie} m²</p>
            <p><span className="font-semibold">Ajouté le :</span> {bien.createdAt}</p>
          </div>
        </div>

        {bien.description && (
          <div>
            <h2 className="text-lg font-medium text-gray-700">Description</h2>
            <p className="mt-2 text-gray-600">{bien.description}</p>
          </div>
        )}

        <div className="pt-4 border-t flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          <button
            className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            onClick={handleEdit}
          >
            Modifier
          </button>

          <button
            className="w-full sm:w-auto bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            onClick={handleDelete}
          >
            Supprimer ce bien
          </button>
        </div>
      </div>

      <button
        onClick={handleBack}
        className="mt-6 text-blue-600 underline"
      >
        ← Retour
      </button>

      {showEditModal && formData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full my-8">
            <div className="p-4 md:p-6 border-b border-gray-200">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900">Modifier le bien</h2>
            </div>

            <div className="p-4 md:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Titre du bien</label>
                <input
                  type="text"
                  name="titre"
                  value={formData.titre}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Type de bien</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option>Appartement</option>
                    <option>Maison</option>
                    <option>Studio</option>
                    <option>Commercial</option>
                    <option>Terrain</option>
                    <option>Parking</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Superficie (m²)</label>
                  <input
                    type="number"
                    name="superficie"
                    value={formData.superficie}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">Adresse</label>
                <input
                  type="text"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">Description</label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
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
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Enregistrer les modifications
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}