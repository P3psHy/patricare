'use client';

import { Building2, FileText, Users, TrendingUp, AlertCircle, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";

type StatColor = "blue" | "green" | "purple" | "orange";

interface StatCard {
  label: string;
  value: string;
  icon: typeof Building2;
  color: StatColor;
}

interface PropertyRow {
  id: number;
  name: string;
  type: string;
  tenant: string;
  rent: string;
  status: "Loué" | "Disponible";
}

interface UpcomingTask {
  id: number;
  title: string;
  date: string;
  priority: "high" | "medium" | "low";
}

interface LodgingApi {
  id: number;
  estLoue: boolean;
  prixLoyer: number;
  superficie: number;
  nbPiece: number;
  description?: string;
}

interface UserApi {
  id: number;
  firstname: string;
  lastname: string;
}

interface DocumentApi {
  id: number;
}

const statColorClasses: Record<StatColor, string> = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-green-50 text-green-600",
  purple: "bg-purple-50 text-purple-600",
  orange: "bg-orange-50 text-orange-600",
};

const priorityAccent: Record<UpcomingTask["priority"], { bar: string; icon: string }> = {
  high: { bar: "bg-red-500", icon: "text-red-500" },
  medium: { bar: "bg-orange-500", icon: "text-orange-500" },
  low: { bar: "bg-green-500", icon: "text-green-500" },
};

export default function Dashboard() {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [recentProperties, setRecentProperties] = useState<PropertyRow[]>([]);
  const [upcomingTasks] = useState<UpcomingTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        const [lodgings, users, documents] = await Promise.all([
          api.get<LodgingApi[]>("/lodgings"),
          api.get<UserApi[]>("/users"),
          api.get<DocumentApi[]>("/documents"),
        ]);

        const totalRents = lodgings.reduce(
          (sum, l) => sum + (l.prixLoyer || 0),
          0,
        );

        setStats([
          {
            label: "Biens immobiliers",
            value: `${lodgings.length}`,
            icon: Building2,
            color: "blue",
          },
          {
            label: "Locataires (utilisateurs)",
            value: `${users.length}`,
            icon: Users,
            color: "green",
          },
          {
            label: "Documents",
            value: `${documents.length}`,
            icon: FileText,
            color: "purple",
          },
          {
            label: "Revenus mensuels (loyers)",
            value: `${totalRents} €`,
            icon: TrendingUp,
            color: "orange",
          },
        ]);

        const mappedRecent: PropertyRow[] = lodgings.slice(0, 4).map((l) => ({
          id: l.id,
          name: l.description || `Bien #${l.id}`,
          type: "Bien",
          tenant: "-",
          rent: `${l.prixLoyer} €`,
          status: l.estLoue ? "Loué" : "Disponible",
        }));
        setRecentProperties(mappedRecent);
      } catch (e) {
        console.error(e);
        setError("Impossible de charger les données du tableau de bord.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <main className="w-full flex-1 px-4 py-8 md:py-8 space-y-4 md:space-y-8">
      <header className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">TABLEAU DE BORD</h1>
        <p className="text-md md:text-lg text-gray-600">Bienvenue dans votre espace de gestion immobilière.</p>
      </header>

      <section className="grid grid-cols-2 gap-2 md:gap-10 md:grid-cols-3 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <article key={stat.label} className="bg-white rounded-xl border border-gray-200 p-2 md:p-4 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between">
                <div className={`w-8 h-8 md:w-12 md:h-12 rounded-lg ${statColorClasses[stat.color]} flex items-center justify-center`}>
                  <Icon className="w-4 h-4 md:w-6 md:h-6" />
                </div>
              </div>
              <p className="mt-3 text-md text-gray-500">{stat.label}</p>
              <p className="text-md md:text-xl font-semibold text-gray-900">{stat.value}</p>
            </article>
          );
        })}
      </section>

      {loading && (
        <p className="text-gray-500 text-sm mb-2">
          Chargement des données du tableau de bord...
        </p>
      )}
      {error && (
        <p className="text-red-600 text-sm mb-2">{error}</p>
      )}

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <article className="lg:col-span-3 rounded-xl border border-gray-200 bg-white shadow-sm">
          <header className="flex items-center justify-between border-b border-gray-200 p-4">
            <div>
              <h2 className="text-md md:text-xl font-semibold text-gray-900">Mes biens récents</h2>
              <p className="text-md text-gray-500">Suivez vos derniers mouvements immobiliers.</p>
            </div>
            <Link href="/lodgings" className="flex text-md font-medium text-blue-600 hover:text-blue-700">
              Voir tout
            </Link>
          </header>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-md md:text-lg text-gray-500">
                  <th className="p-4 font-medium">Bien</th>
                  <th className="p-4 font-medium">Type</th>
                  <th className="p-4 font-medium">Locataire</th>
                  <th className="p-4 font-medium">Loyer</th>
                  <th className="p-4 font-medium text-center">Statut</th>
                </tr>
              </thead>
              <tbody>
                {recentProperties.map((property) => (
                  <tr key={property.id} className="border-t border-gray-100 text-md text-gray-700 hover:bg-gray-50">
                    <td className="p-4 font-medium text-md text-gray-900">{property.name}</td>
                    <td className="p-4 text-md">{property.type}</td>
                    <td className="p-4 text-md">{property.tenant}</td>
                    <td className="p-4 font-semibold text-md text-gray-900">{property.rent}</td>
                    <td className="p-4 flex justify-center">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-md font-semibold ${
                          property.status === "Loué"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {property.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <header className="flex items-center justify-between border-b border-gray-200 p-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Tâches à venir</h2>
              <p className="text-md text-gray-500">Restez à jour sur les échéances clés.</p>
            </div>
            <Calendar className="h-5 w-5 text-gray-400" />
          </header>
          <div className="p-3">
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex">
                  <div className={`h-full w-1.5 rounded-full ${priorityAccent[task.priority].bar}`} />
                  <div className="flex-1">
                    <p className="font-medium text-md text-gray-900">{task.title}</p>
                    <p className="text-md text-gray-500">{task.date}</p>
                  </div>
                  <AlertCircle className={`h-5 w-5 ${priorityAccent[task.priority].icon}`} />
                </div>
              ))}
            </div>
            <Link
              href="/documents"
              className="mt-6 inline-flex w-full items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-md font-medium text-gray-700 hover:bg-gray-50"
            >
              Voir toutes les tâches
            </Link>
          </div>
        </article>
      </section>
    </main>
  );
}