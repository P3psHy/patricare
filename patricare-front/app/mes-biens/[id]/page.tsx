'use client';

import { notFound } from "next/navigation";
import { useState, useEffect } from "react";
import { use } from "react";

interface Bien {
  id: string;
  titre: string;
  adresse: string;
  type: string;
  superficie: number;
  description?: string;
  createdAt: string;
}

const mockBiens: Record<string, Bien> = {
  "1": {
    id: "1",
    titre: "Appartement Paris 15ème",
    adresse: "45 Rue de Vaugirard, 75015 Paris",
    type: "Appartement",
    superficie: 65,
    description: "Bel appartement lumineux proche des commerces. Rénové récemment.",
    createdAt: "2024-03-15",
  },
  "2": {
    id: "2",
    titre: "Maison Lyon Centre",
    adresse: "12 Avenue Jean Jaurès, 69007 Lyon",
    type: "Maison",
    superficie: 120,
    description: "Grande maison spacieuse avec jardin.",
    createdAt: "2024-02-20",
  },
  "3": {
    id: "3",
    titre: "Studio Bordeaux",
    adresse: "8 Cours de l'Intendance, 33000 Bordeaux",
    type: "Studio",
    superficie: 28,
    description: "Petit studio cosy idéal pour étudiant.",
    createdAt: "2024-01-10",
  },
};

async function getBien(id: string): Promise<Bien | null> {
  return mockBiens[id] || null;
}

export default function BienDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [bien, setBien] = useState<Bien | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState<Bien | null>(null);

  useEffect(() => {
    getBien(id).then((data) => {
      setBien(data);
      setFormData(data);
      setLoading(false);
    });
  }, [id]);

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
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">{bien.titre}</h1>

      <div className="bg-white rounded-xl p-6 shadow-md space-y-4 border">
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

        <div className="pt-4 border-t flex items-center gap-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            onClick={handleEdit}
          >
            Modifier
          </button>

          <button
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-gray-900 text-xl font-semibold">Modifier le bien</h2>
            </div>

            <div className="p-6 space-y-4">
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

            <div className="p-6 border-t border-gray-200 flex gap-3">
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