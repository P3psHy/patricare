'use client';

import { useState, useEffect } from 'react';
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
} from 'lucide-react';

interface Property {
  id: number;
  name: string;
  type: string;
  address: string;
  size: string;
  rooms: string;
  rent: string;
  tenant: string | null;
  status: string;
  image: string;
}

const API_BASE_URL = 'http://localhost:3000/lodgings';

export default function MesBiensPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState<Partial<Property> | null>(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(API_BASE_URL);
      if (!response.ok) throw new Error('Erreur lors du chargement des biens');
      const data = await response.json();
      setProperties(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter((property) =>
    property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (property: Property) => {
    setEditingProperty(property);
    setFormData({ ...property });
    setShowEditModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (formData) {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleAddProperty = async () => {
    if (!formData?.name || !formData?.type) {
      alert('Veuillez remplir les champs obligatoires');
      return;
    }

    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Erreur lors de l\'ajout du bien');

      setShowAddModal(false);
      setFormData(null);
      await fetchProperties();
      alert('Bien ajouté avec succès');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors de l\'ajout');
    }
  };

  const handleSave = async () => {
    if (!formData || !editingProperty) return;

    try {
      const response = await fetch(`${API_BASE_URL}/${editingProperty.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Erreur lors de la modification');

      setShowEditModal(false);
      setEditingProperty(null);
      setFormData(null);
      await fetchProperties();
      alert('Bien modifié avec succès');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors de la modification');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce bien ?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression');

      await fetchProperties();
      alert('Bien supprimé avec succès');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des biens...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <main className="flex-1 p-4 md:p-8 bg-gray-50 min-h-screen">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">Mes biens immobiliers</h1>
              <p className="text-sm md:text-base text-gray-600">Gérez l'ensemble de votre patrimoine immobilier</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
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
            <select className="px-3 md:px-4 py-2 md:py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm md:text-base">
              <option>Tous les types</option>
              <option>Appartement</option>
              <option>Maison</option>
              <option>Studio</option>
              <option>Commercial</option>
              <option>Terrain</option>
              <option>Parking</option>
            </select>
            <select className="px-3 md:px-4 py-2 md:py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm md:text-base">
              <option>Tous les statuts</option>
              <option>Loué</option>
              <option>Disponible</option>
              <option>Non loué</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600">Aucun bien trouvé</p>
            </div>
          ) : (
            filteredProperties.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition overflow-hidden group"
              >
                <div className="h-48 bg-gradient-to-br from-blue-100 to-green-100 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Home className="w-16 h-16 text-blue-600 opacity-30" />
                  </div>
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-3 py-1 rounded-full ${
                        property.status === 'Loué'
                          ? 'bg-green-600 text-white'
                          : property.status === 'Disponible'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-600 text-white'
                      }`}
                    >
                      {property.status}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="mb-3">
                    <h3 className="text-gray-900 mb-1">{property.name}</h3>
                    <p className="text-gray-500">{property.type}</p>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-gray-700">{property.address}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-700">{property.size}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-700">{property.rooms}</span>
                    </div>
                    {property.rent !== '-' && (
                      <div className="flex items-center gap-2 text-green-600">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-gray-700">{property.rent}/mois</span>
                      </div>
                    )}
                    {property.tenant && (
                      <div className="text-gray-600">
                        Locataire: <span className="text-gray-900">{property.tenant}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-gray-100">
                    <Link
                      href={`/lodgings/${property.id}`}
                      className="flex-1 flex items-center justify-center gap-2 px-2 md:px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="hidden sm:inline">Voir</span>
                    </Link>
                    <button
                      onClick={() => handleEditClick(property)}
                      className="flex-1 flex items-center justify-center gap-2 px-2 md:px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      <span className="hidden sm:inline">Modifier</span>
                    </button>
                    <button
                      onClick={() => handleDelete(property.id)}
                      className="flex-1 sm:flex-none flex items-center justify-center px-2 md:px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Ajouter */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-2xl w-full my-8">
              <div className="p-4 md:p-6 border-b border-gray-200">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">Ajouter un bien immobilier</h2>
              </div>

              <div className="p-4 md:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2 text-sm">Nom du bien *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData?.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                      placeholder="Ex: Appartement Paris 15ème"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2 text-sm">Type de bien *</label>
                    <select
                      name="type"
                      value={formData?.type || ''}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    >
                      <option value="">Sélectionner</option>
                      <option>Appartement</option>
                      <option>Maison</option>
                      <option>Studio</option>
                      <option>Commercial</option>
                      <option>Terrain</option>
                      <option>Parking</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 text-sm">Adresse</label>
                  <input
                    type="text"
                    name="address"
                    value={formData?.address || ''}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    placeholder="Ex: 45 Rue de Vaugirard, 75015 Paris"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2 text-sm">Surface (m²)</label>
                    <input
                      type="text"
                      name="size"
                      value={formData?.size || ''}
                      onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                      className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                      placeholder="65"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2 text-sm">Pièces</label>
                    <input
                      type="text"
                      name="rooms"
                      value={formData?.rooms || ''}
                      onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
                      className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                      placeholder="3"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2 text-sm">Loyer (€)</label>
                    <input
                      type="text"
                      name="rent"
                      value={formData?.rent || ''}
                      onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
                      className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                      placeholder="1250"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 md:p-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setFormData(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition text-sm"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAddProperty}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 transition text-sm"
                >
                  Ajouter le bien
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Modifier */}
        {showEditModal && formData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-2xl w-full my-8">
              <div className="p-4 md:p-6 border-b border-gray-200">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">Modifier le bien</h2>
              </div>

              <div className="p-4 md:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium text-sm">Nom du bien</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium text-sm">Type de bien</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
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
                    <label className="block text-gray-700 mb-2 font-medium text-sm">Adresse</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium text-sm">Surface</label>
                    <input
                      type="text"
                      name="size"
                      value={formData.size}
                      onChange={handleInputChange}
                      className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium text-sm">Pièces</label>
                    <input
                      type="text"
                      name="rooms"
                      value={formData.rooms}
                      onChange={handleInputChange}
                      className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium text-sm">Loyer</label>
                    <input
                      type="text"
                      name="rent"
                      value={formData.rent}
                      onChange={handleInputChange}
                      className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-medium text-sm">Statut</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                  >
                    <option>Loué</option>
                    <option>Disponible</option>
                    <option>Non loué</option>
                  </select>
                </div>
              </div>

              <div className="p-4 md:p-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition text-sm"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                >
                  Enregistrer les modifications
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}