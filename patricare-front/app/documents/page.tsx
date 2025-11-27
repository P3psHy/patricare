"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FileText,
  Upload,
  Search,
  Download,
  Eye,
  Trash2,
  FolderOpen,
  File,
  ChevronDown,
  Loader2,
} from "lucide-react";

import { api } from "@/lib/api";

interface DocumentApi {
  id: number;
  titre?: string;
  nom?: string;
  type?: string;
  cheminFichier?: string;
  dateCreation?: string;
  dateModification?: string;
}

interface DocumentRow {
  id: number;
  name: string;
  type: string;
  size: string;
  folder: string;
  date: string;
  property: string;
  path: string;
}

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [showFolders, setShowFolders] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [documents, setDocuments] = useState<DocumentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSaving, setImportSaving] = useState(false);
  const [newDocumentTitle, setNewDocumentTitle] = useState("");

  const colorMap: Record<string, string> = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    orange: "bg-orange-500",
    purple: "bg-purple-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
  };

  const folders = [
    { id: "generiques", name: "Documents génériques", count: documents.length, color: "blue" },
  ];

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const docs = await api.get<DocumentApi[]>("/documents");
      const mapped: DocumentRow[] = docs.map((d) => ({
        id: d.id,
        name: d.titre || d.nom || `Document #${d.id}`,
        type: d.type || "PDF",
        size: "-",
        folder: "Documents génériques",
        date: d.dateCreation
          ? new Date(d.dateCreation).toLocaleDateString("fr-FR")
          : d.dateModification || "—",
        property: d.cheminFichier || "-",
        path: d.cheminFichier || "",
      }));
      setDocuments(mapped);
    } catch (e) {
      console.error(e);
      setError("Impossible de charger les documents depuis l'API.");
    } finally {
      setLoading(false);
    }
  };

  const normalizedSearch = (searchTerm ?? "").toUpperCase();
  const filteredDocuments = useMemo(
    () =>
      documents.filter((doc) => {
        const name = (doc.name ?? "").toUpperCase();
        const property = (doc.property ?? "").toUpperCase();
        const folder = (doc.folder ?? "").toUpperCase();

        return (
          name.includes(normalizedSearch) ||
          property.includes(normalizedSearch) ||
          folder.includes(normalizedSearch)
        );
      }),
    [documents, normalizedSearch],
  );

  const selectedFolderName = selectedFolder
    ? folders.find((f) => f.id === selectedFolder)?.name
    : "Tous les documents";

  const handleImport = async () => {
    if (!file && !newDocumentTitle.trim()) {
      setImportError("Sélectionnez un fichier ou indiquez un titre.");
      return;
    }

    const titre = newDocumentTitle.trim() || file?.name || "Document sans nom";
    const cheminFichier = file ? `/uploads/${file.name}` : `/documents/${Date.now()}.pdf`;

    try {
      setImportSaving(true);
      setImportError(null);
      const created = await api.post<DocumentApi>("/documents", {
        titre,
        cheminFichier,
      });

      const mapped: DocumentRow = {
        id: created.id,
        name: created.titre || created.nom || titre,
        type: created.type || "PDF",
        size: "-",
        folder: "Documents génériques",
        date: new Date().toLocaleDateString("fr-FR"),
        property: created.cheminFichier || cheminFichier,
        path: created.cheminFichier || cheminFichier,
      };

      setDocuments((prev) => [mapped, ...prev]);
      setShowImportModal(false);
      setFile(null);
      setNewDocumentTitle("");
    } catch (e) {
      console.error(e);
      setImportError("L'import a échoué. Réessayez.");
    } finally {
      setImportSaving(false);
    }
  };

  const handleDeleteDocument = async (id: number) => {
    if (!confirm("Supprimer ce document ?")) {
      return;
    }
    try {
      await api.delete(`/documents/${id}`);
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    } catch (e) {
      console.error(e);
      alert("Impossible de supprimer ce document.");
    }
  };

  const openDocument = (doc: DocumentRow) => {
    if (!doc.path) {
      alert("Aucun fichier associé à ce document.");
      return;
    }
    window.open(doc.path, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex">
      <main className="flex-1 p-4 md:p-8 bg-gray-50 min-h-screen">
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
                Gestion des documents
              </h1>
              <p className="text-sm md:text-base text-gray-600">
                Centralisez tous vos documents administratifs
              </p>
            </div>
            <button
              onClick={() => {
                setShowImportModal(true);
                setImportError(null);
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:from-blue-700 hover:to-green-700 transition shadow-lg shadow-blue-200 text-sm md:text-base"
            >
              <Upload className="w-5 h-5" />
              <span className="hidden sm:inline">Importer un document</span>
              <span className="sm:hidden">Importer</span>
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un document..."
              className="w-full pl-10 pr-4 py-2 md:py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm md:text-base"
            />
          </div>
        </div>

        {loading && <p className="text-gray-500">Chargement des documents...</p>}
        {error && <p className="text-red-600">{error}</p>}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <button
                onClick={() => setShowFolders(!showFolders)}
                className="lg:hidden w-full p-4 flex items-center justify-between border-b border-gray-200"
              >
                <h3 className="text-gray-900 font-medium text-sm md:text-base">Dossiers</h3>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${showFolders ? "rotate-180" : ""}`}
                />
              </button>

              <div
                className={`${showFolders ? "block" : "hidden"} lg:block p-4 md:p-6 space-y-2`}
              >
                <h3 className="text-gray-900 mb-4 font-medium text-sm md:text-base hidden lg:block">
                  Dossiers
                </h3>
                <button
                  onClick={() => {
                    setSelectedFolder(null);
                    setShowFolders(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition text-sm ${
                    selectedFolder === null
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FolderOpen className="w-4 h-4" />
                    <span>Tous les documents</span>
                  </div>
                  <span className="text-gray-500 text-xs md:text-sm">{documents.length}</span>
                </button>

                {folders.map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() => {
                      setSelectedFolder(folder.id);
                      setShowFolders(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition text-sm ${
                      selectedFolder === folder.id
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${colorMap[folder.color]}`} />
                      <span className="truncate">{folder.name}</span>
                    </div>
                    <span className="text-gray-500 text-xs md:text-sm flex-shrink-0 ml-2">
                      {folder.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-4 md:p-6 border-b border-gray-200">
                <h3 className="text-gray-900 text-sm md:text-base font-medium">
                  {selectedFolderName}
                </h3>
              </div>

              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left p-4 text-gray-600">Nom du document</th>
                      <th className="text-left p-4 text-gray-600">Bien</th>
                      <th className="text-left p-4 text-gray-600">Type</th>
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
                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                              <File className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-gray-900 truncate text-sm">{doc.name}</p>
                              <p className="text-gray-500 text-xs">{doc.folder}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-gray-600 text-sm">{doc.property}</td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs">
                            {doc.type}
                          </span>
                        </td>
                        <td className="p-4 text-gray-600 text-sm">{doc.date}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openDocument(doc)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openDocument(doc)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteDocument(doc.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden divide-y divide-gray-100">
                {filteredDocuments.map((doc) => (
                  <div key={doc.id} className="p-4 hover:bg-gray-50 transition">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <File className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 font-medium text-sm break-words">{doc.name}</p>
                        <p className="text-gray-500 text-xs mt-1">{doc.folder}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div>
                        <p className="text-gray-500">Bien</p>
                        <p className="text-gray-900">{doc.property}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Type</p>
                        <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs">
                          {doc.type}
                        </span>
                      </div>
                      <div>
                        <p className="text-gray-500">Date</p>
                        <p className="text-gray-900">{doc.date}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => openDocument(doc)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDocument(doc)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredDocuments.length === 0 && !loading && (
                <div className="p-8 md:p-12 text-center">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm md:text-base">Aucun document trouvé</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full my-8">
            <div className="p-4 md:p-6 border-b border-gray-200">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900">Importer un document</h2>
            </div>

            <div className="p-4 md:p-6 space-y-4">
              <div>
                <label className="block text-gray-700 mb-2 text-sm font-medium">Titre du document</label>
                <input
                  type="text"
                  value={newDocumentTitle}
                  onChange={(e) => setNewDocumentTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Ex: Bail appartement Paris"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2 text-sm font-medium">Sélectionner un fichier</label>
                <label className="w-full border border-dashed border-gray-400 rounded-xl p-4 md:p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition">
                  <Upload className="w-8 h-8 text-gray-500 mb-2" />
                  <span className="text-gray-600 text-sm md:text-base text-center">
                    {file ? file.name : 'Déposez un fichier ici ou cliquez pour parcourir'}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </label>
              </div>
              {importError && <p className="text-sm text-red-600">{importError}</p>}
            </div>

            <div className="p-4 md:p-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowImportModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition text-sm"
              >
                Annuler
              </button>

              <button
                onClick={handleImport}
                disabled={importSaving}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 transition text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {importSaving ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Import en cours...
                  </span>
                ) : (
                  'Importer'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
