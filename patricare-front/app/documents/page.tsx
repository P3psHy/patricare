"use client";

import { useState } from "react";
import {
  FileText,
  Upload,
  Search,
  Download,
  Eye,
  Trash2,
  FolderOpen,
  File,
} from "lucide-react";

import { useRouter } from "next/navigation";

export default function DocumentsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  // Modal importer document
  const [showImportModal, setShowImportModal] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const colorMap: Record<string, string> = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    orange: "bg-orange-500",
    purple: "bg-purple-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
  };

  const folders = [
    { id: "baux", name: "Baux de location", count: 12, color: "blue" },
    { id: "factures", name: "Factures", count: 45, color: "green" },
    { id: "taxes", name: "Taxes & Impôts", count: 18, color: "orange" },
    { id: "assurances", name: "Assurances", count: 8, color: "purple" },
    { id: "travaux", name: "Travaux & Réparations", count: 23, color: "red" },
    { id: "diagnostics", name: "Diagnostics", count: 15, color: "yellow" },
  ];

  const documents = [
    {
      id: 1,
      name: "Bail - Appartement Paris 15ème - Marie Dubois.pdf",
      type: "PDF",
      size: "2.4 MB",
      folder: "Baux de location",
      date: "15 Nov 2025",
      property: "Appartement Paris 15ème",
    },
    {
      id: 2,
      name: "Taxe foncière 2025 - Maison Lyon.pdf",
      type: "PDF",
      size: "1.2 MB",
      folder: "Taxes & Impôts",
      date: "10 Nov 2025",
      property: "Maison Lyon Centre",
    },
    {
      id: 3,
      name: "Assurance habitation - Studio Bordeaux.pdf",
      type: "PDF",
      size: "890 KB",
      folder: "Assurances",
      date: "05 Nov 2025",
      property: "Studio Bordeaux",
    },
    {
      id: 4,
      name: "Facture plomberie - Bureau Lille.pdf",
      type: "PDF",
      size: "450 KB",
      folder: "Factures",
      date: "28 Oct 2025",
      property: "Bureau Lille",
    },
    {
      id: 5,
      name: "Diagnostic énergétique - Appartement Paris.pdf",
      type: "PDF",
      size: "3.1 MB",
      folder: "Diagnostics",
      date: "20 Oct 2025",
      property: "Appartement Paris 15ème",
    },
    {
      id: 6,
      name: "Facture électricité - Maison Lyon.pdf",
      type: "PDF",
      size: "320 KB",
      folder: "Factures",
      date: "15 Oct 2025",
      property: "Maison Lyon Centre",
    },
    {
      id: 7,
      name: "Travaux peinture - Studio Bordeaux.xlsx",
      type: "XLSX",
      size: "156 KB",
      folder: "Travaux & Réparations",
      date: "12 Oct 2025",
      property: "Studio Bordeaux",
    },
    {
      id: 8,
      name: "Contrat assurance propriétaire - Bureau Lille.pdf",
      type: "PDF",
      size: "1.8 MB",
      folder: "Assurances",
      date: "08 Oct 2025",
      property: "Bureau Lille",
    },
  ];

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.folder.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex">

      <main className="flex-1 p-8 bg-gray-50">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-gray-900 mb-2">Gestion des documents</h1>
              <p className="text-gray-600">
                Centralisez tous vos documents administratifs
              </p>
            </div>
            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-green-700 transition shadow-lg shadow-blue-200"
            >
              <Upload className="w-5 h-5" />
              Importer un document
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un document..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-gray-900 mb-4">Dossiers</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedFolder(null)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition ${selectedFolder === null
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <FolderOpen className="w-4 h-4" />
                    <span>Tous les documents</span>
                  </div>
                  <span className="text-gray-500">{documents.length}</span>
                </button>

                {folders.map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() => setSelectedFolder(folder.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition ${selectedFolder === folder.id
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${colorMap[folder.color]}`}
                      />
                      <span>{folder.name}</span>
                    </div>
                    <span className="text-gray-500">{folder.count}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-900">
                    {selectedFolder
                      ? folders.find((f) => f.id === selectedFolder)?.name
                      : "Tous les documents"}
                  </h3>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left p-4 text-gray-600">Nom du document</th>
                      <th className="text-left p-4 text-gray-600">Bien</th>
                      <th className="text-left p-4 text-gray-600">Type</th>
                      <th className="text-left p-4 text-gray-600">Taille</th>
                      <th className="text-left p-4 text-gray-600">Date</th>
                      <th className="text-left p-4 text-gray-600">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredDocuments.map((doc) => (
                      <tr
                        key={doc.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                              <File className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-gray-900">{doc.name}</p>
                              <p className="text-gray-500">{doc.folder}</p>
                            </div>
                          </div>
                        </td>

                        <td className="p-4 text-gray-600">{doc.property}</td>

                        <td className="p-4">
                          <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-700">
                            {doc.type}
                          </span>
                        </td>

                        <td className="p-4 text-gray-600">{doc.size}</td>
                        <td className="p-4 text-gray-600">{doc.date}</td>

                        <td className="p-4">
                          <div className="flex gap-2">
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition">
                              <Download className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredDocuments.length === 0 && (
                <div className="p-12 text-center">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Aucun document trouvé</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-gray-900">Importer un document</h2>
            </div>

            <div className="p-6 space-y-4">

              <div>
                <label className="block text-gray-700 mb-2">
                  Sélectionner un fichier
                </label>

                <label className="w-full border border-dashed border-gray-400 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition">
                  <Upload className="w-8 h-8 text-gray-500 mb-2" />
                  <span className="text-gray-600">
                    {file ? file.name : "Déposez un fichier ici ou cliquez pour parcourir"}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowImportModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Annuler
              </button>

              <button
                onClick={() => {
                  setShowImportModal(false);
                  setFile(null);
                }}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 transition"
              >
                Importer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
