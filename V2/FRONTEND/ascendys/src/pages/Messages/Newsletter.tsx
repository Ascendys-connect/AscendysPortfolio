import { useState, useEffect, useMemo } from "react";
import PageMeta from "@/components/common/PageMeta";
import PageHeader from "@/components/common/PageHeader";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import { contactService, type NewsletterSubscriber } from "@/services/contact.service";
import { useToast } from "@/context/ToastContext";
import {
  Mail,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Trash2,
  Copy,
  RefreshCw,
  Download,
  Users,
  Send,
} from "lucide-react";

export default function Newsletter() {
  const { showSuccess, showError } = useToast();

  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [deleteTarget, setDeleteTarget] = useState<NewsletterSubscriber | null>(null);

  const fetchSubscribers = async () => {
    setIsLoading(true);
    try {
      const data = await contactService.getSubscribers();
      setSubscribers(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Erreur de chargement des abonnés:", err);
      showError("Erreur", "Impossible de charger les abonnés à la newsletter.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await contactService.deleteSubscriber(id);
      setSubscribers((prev) => prev.filter((s) => s.id !== id));
      showSuccess("Supprimé", "L'abonné a été supprimé.");
    } catch (err: any) {
      showError("Erreur", "Impossible de supprimer cet abonné.");
    }
  };

  const handleCopyAllEmails = () => {
    const activeEmails = subscribers
      .filter((s) => s.is_active)
      .map((s) => s.email)
      .join(", ");
    if (!activeEmails) {
      showError("Info", "Aucun email d'abonné actif à copier.");
      return;
    }
    navigator.clipboard.writeText(activeEmails);
    showSuccess("Copié !", `${subscribers.filter((s) => s.is_active).length} adresses email copiées dans le presse-papier.`);
  };

  const handleExportCSV = () => {
    if (subscribers.length === 0) {
      showError("Info", "Aucun abonné à exporter.");
      return;
    }
    const headers = ["Email", "Statut", "Date d'inscription"];
    const rows = subscribers.map((s) => [
      s.email,
      s.is_active ? "Actif" : "Désabonné",
      new Date(s.created_at).toLocaleDateString("fr-FR"),
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `abonnes_newsletter_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showSuccess("Exporté", "Fichier CSV téléchargé avec succès.");
  };

  const filteredSubscribers = useMemo(() => {
    return subscribers.filter((sub) => {
      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && sub.is_active) ||
        (statusFilter === "INACTIVE" && !sub.is_active);
      const term = searchTerm.toLowerCase();
      const matchesSearch = !term || sub.email.toLowerCase().includes(term);
      return matchesStatus && matchesSearch;
    });
  }, [subscribers, statusFilter, searchTerm]);

  const stats = useMemo(() => {
    const total = subscribers.length;
    const active = subscribers.filter((s) => s.is_active).length;
    const inactive = total - active;
    return { total, active, inactive };
  }, [subscribers]);

  return (
    <>
      <PageMeta
        title="Newsletter | Ascendys Connect"
        description="Gérez les abonnés à la newsletter enregistrés en base de données"
      />

      <PageHeader
        title="Newsletter"
        description="Liste des personnes inscrites à la newsletter depuis le site public"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyAllEmails}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              title="Copier les emails actifs"
            >
              <Copy className="size-4" />
              <span className="hidden sm:inline">Copier les emails</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <Download className="size-4" />
              <span className="hidden sm:inline">Exporter CSV</span>
            </button>
            <button
              onClick={fetchSubscribers}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-50"
            >
              <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
              <span>Actualiser</span>
            </button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400">
              <Users className="size-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Total Abonnés</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 shadow-sm dark:border-emerald-900/40 dark:bg-emerald-950/20">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
              <CheckCircle2 className="size-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Abonnés Actifs</p>
              <p className="mt-1 text-2xl font-bold text-emerald-700 dark:text-emerald-300">{stats.active}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              <XCircle className="size-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Désabonnés</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{stats.inactive}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="mb-6 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par adresse email..."
            className="w-full rounded-lg border border-gray-200 bg-gray-50/50 py-2 pl-9 pr-4 text-sm text-gray-900 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="size-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-2 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="ALL">Tous les abonnés</option>
            <option value="ACTIVE">Actifs uniquement</option>
            <option value="INACTIVE">Désabonnés</option>
          </select>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="size-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Chargement des abonnés...</p>
          </div>
        ) : filteredSubscribers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Mail className="size-12 text-gray-400" />
            <h3 className="mt-3 text-base font-semibold text-gray-900 dark:text-white">Aucun abonné trouvé</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {subscribers.length === 0
                ? "Les adresses inscrites depuis la newsletter du site apparaîtront ici."
                : "Aucune adresse ne correspond à votre recherche."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50/75 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-300">
                <tr>
                  <th className="px-6 py-3.5">Adresse email</th>
                  <th className="px-6 py-3.5">Statut</th>
                  <th className="px-6 py-3.5">Date d'inscription</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredSubscribers.map((sub) => (
                  <tr key={sub.id} className="transition-colors hover:bg-gray-50/70 dark:hover:bg-gray-800/40">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Mail className="size-4 text-gray-400" />
                        <span className="font-medium text-gray-900 dark:text-white">{sub.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {sub.is_active ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                          <CheckCircle2 className="size-3" />
                          Actif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                          <XCircle className="size-3" />
                          Désabonné
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                      {new Date(sub.created_at).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`mailto:${sub.email}`}
                          title="Envoyer un email"
                          className="rounded-lg p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                        >
                          <Send className="size-4" />
                        </a>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(sub.email);
                            showSuccess("Copié !", sub.email);
                          }}
                          title="Copier l'email"
                          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                        >
                          <Copy className="size-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(sub)}
                          title="Supprimer"
                          className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) handleDelete(deleteTarget.id);
          setDeleteTarget(null);
        }}
        itemName={deleteTarget?.email}
      />
    </>
  );
}
