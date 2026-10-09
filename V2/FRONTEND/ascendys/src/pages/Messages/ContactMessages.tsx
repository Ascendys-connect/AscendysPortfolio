import { useState, useEffect, useMemo } from "react";
import PageMeta from "@/components/common/PageMeta";
import PageHeader from "@/components/common/PageHeader";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import { contactService, type ContactMessage } from "@/services/contact.service";
import { useToast } from "@/context/ToastContext";
import {
  Mail,
  Phone,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Trash2,
  Check,
  Send,
  Building,
  RefreshCw,
  X,
} from "lucide-react";

export default function ContactMessages() {
  const { showSuccess, showError } = useToast();

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const data = await contactService.getMessages();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Erreur de chargement des messages:", err);
      showError("Erreur", "Impossible de charger les messages de contact.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkResolved = async (message: ContactMessage) => {
    setIsUpdating(true);
    try {
      const updated = await contactService.markResolved(message.id);
      setMessages((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
      if (selectedMessage?.id === updated.id) {
        setSelectedMessage(updated);
      }
      showSuccess("Succès", "Message marqué comme résolu.");
    } catch (err: any) {
      showError("Erreur", "Impossible de marquer le message comme résolu.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangeStatus = async (id: number, newStatus: string) => {
    setIsUpdating(true);
    try {
      const updated = await contactService.updateMessageStatus(id, { status: newStatus });
      setMessages((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
      if (selectedMessage?.id === updated.id) {
        setSelectedMessage(updated);
      }
      showSuccess("Statut mis à jour", `Le statut a été mis à jour.`);
    } catch (err: any) {
      showError("Erreur", "Impossible de modifier le statut.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await contactService.deleteMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
      showSuccess("Supprimé", "Le message a été supprimé.");
    } catch (err: any) {
      showError("Erreur", "Impossible de supprimer le message.");
    }
  };

  const filteredMessages = useMemo(() => {
    return messages.filter((msg) => {
      const matchesStatus = statusFilter === "ALL" || msg.status === statusFilter;
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        !term ||
        msg.first_name.toLowerCase().includes(term) ||
        msg.last_name.toLowerCase().includes(term) ||
        msg.email.toLowerCase().includes(term) ||
        (msg.phone && msg.phone.includes(term)) ||
        (msg.company && msg.company.toLowerCase().includes(term)) ||
        msg.message.toLowerCase().includes(term);
      return matchesStatus && matchesSearch;
    });
  }, [messages, statusFilter, searchTerm]);

  // Stats
  const stats = useMemo(() => {
    const total = messages.length;
    const newCount = messages.filter((m) => m.status === "NEW").length;
    const inProgress = messages.filter((m) => m.status === "IN_PROGRESS").length;
    const resolved = messages.filter((m) => m.status === "RESOLVED").length;
    return { total, newCount, inProgress, resolved };
  }, [messages]);

  const getStatusBadge = (status: string, statusDisplay: string) => {
    switch (status) {
      case "NEW":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-950/40 dark:text-blue-300">
            <span className="size-1.5 rounded-full bg-blue-600" />
            {statusDisplay || "Nouveau"}
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
            <Clock className="size-3" />
            {statusDisplay || "En cours"}
          </span>
        );
      case "RESOLVED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
            <CheckCircle2 className="size-3" />
            {statusDisplay || "Résolu"}
          </span>
        );
      case "CLOSED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-800 dark:bg-gray-800 dark:text-gray-300">
            {statusDisplay || "Fermé"}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-300">
            {statusDisplay || status}
          </span>
        );
    }
  };

  return (
    <>
      <PageMeta
        title="Messages de contact | Ascendys Connect"
        description="Gérez les messages reçus depuis le formulaire de contact du site"
      />

      <PageHeader
        title="Messages de contact"
        description="Messages enregistrés en base de données depuis les pages publiques"
        actions={
          <button
            onClick={fetchMessages}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
            <span>Actualiser</span>
          </button>
        }
      />

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Total reçus</p>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 shadow-sm dark:border-blue-900/40 dark:bg-blue-950/20">
          <p className="text-xs font-medium uppercase tracking-wider text-blue-700 dark:text-blue-400">Nouveaux</p>
          <p className="mt-2 text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.newCount}</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 shadow-sm dark:border-amber-900/40 dark:bg-amber-950/20">
          <p className="text-xs font-medium uppercase tracking-wider text-amber-700 dark:text-amber-400">En cours</p>
          <p className="mt-2 text-2xl font-bold text-amber-700 dark:text-amber-300">{stats.inProgress}</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-sm dark:border-emerald-900/40 dark:bg-emerald-950/20">
          <p className="text-xs font-medium uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Résolus</p>
          <p className="mt-2 text-2xl font-bold text-emerald-700 dark:text-emerald-300">{stats.resolved}</p>
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
            placeholder="Rechercher par nom, email, entreprise ou mot-clé..."
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
            <option value="ALL">Tous les statuts</option>
            <option value="NEW">Nouveaux</option>
            <option value="IN_PROGRESS">En cours</option>
            <option value="RESOLVED">Résolus</option>
            <option value="CLOSED">Fermés</option>
          </select>
        </div>
      </div>

      {/* Messages Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="size-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Chargement des messages...</p>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Mail className="size-12 text-gray-400" />
            <h3 className="mt-3 text-base font-semibold text-gray-900 dark:text-white">Aucun message trouvé</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {messages.length === 0
                ? "Les messages soumis sur le site apparaîtront ici."
                : "Aucun message ne correspond à vos critères de recherche."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50/75 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-300">
                <tr>
                  <th className="px-6 py-3.5">Expéditeur</th>
                  <th className="px-6 py-3.5">Sujet</th>
                  <th className="px-6 py-3.5">Message</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5">Statut</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredMessages.map((msg) => (
                  <tr
                    key={msg.id}
                    className={`transition-colors hover:bg-gray-50/70 dark:hover:bg-gray-800/40 ${
                      msg.status === "NEW" ? "bg-blue-50/20 font-medium" : ""
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {msg.first_name} {msg.last_name}
                        </div>
                        <div className="flex flex-col gap-0.5 text-xs text-gray-500 dark:text-gray-400">
                          <a href={`mailto:${msg.email}`} className="hover:text-brand-600 hover:underline">
                            {msg.email}
                          </a>
                          {msg.phone && (
                            <a href={`tel:${msg.phone}`} className="hover:text-brand-600 hover:underline">
                              {msg.phone}
                            </a>
                          )}
                          {msg.company && (
                            <span className="flex items-center gap-1 text-gray-400">
                              <Building className="size-3" />
                              {msg.company}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                        {msg.subject_display || msg.subject}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate text-gray-600 dark:text-gray-300" title={msg.message}>
                      {msg.message}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                      {new Date(msg.created_at).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(msg.status, msg.status_display)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedMessage(msg)}
                          title="Voir les détails"
                          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-brand-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-brand-400"
                        >
                          <Eye className="size-4" />
                        </button>
                        {msg.status !== "RESOLVED" && (
                          <button
                            onClick={() => handleMarkResolved(msg)}
                            title="Marquer comme résolu"
                            className="rounded-lg p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                          >
                            <Check className="size-4" />
                          </button>
                        )}
                        <a
                          href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject_display || msg.subject)}`}
                          title="Répondre par email"
                          className="rounded-lg p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                        >
                          <Send className="size-4" />
                        </a>
                        <button
                          onClick={() => setDeleteTarget(msg)}
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

      {/* Modal Détail Message */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-start justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedMessage.first_name} {selectedMessage.last_name}
                </h3>
                <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                  Reçu le{" "}
                  {new Date(selectedMessage.created_at).toLocaleString("fr-FR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Expéditeur Info */}
            <div className="my-5 grid grid-cols-1 gap-3 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50 sm:grid-cols-2">
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <Mail className="size-4 text-brand-500" />
                <a href={`mailto:${selectedMessage.email}`} className="font-medium hover:underline">
                  {selectedMessage.email}
                </a>
              </div>
              {selectedMessage.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <Phone className="size-4 text-brand-500" />
                  <a href={`tel:${selectedMessage.phone}`} className="font-medium hover:underline">
                    {selectedMessage.phone}
                  </a>
                </div>
              )}
              {selectedMessage.company && (
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <Building className="size-4 text-brand-500" />
                  <span>Entreprise : {selectedMessage.company}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold text-gray-500">Sujet :</span>
                <span>{selectedMessage.subject_display || selectedMessage.subject}</span>
              </div>
            </div>

            {/* Message Body */}
            <div className="mb-6">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Message
              </h4>
              <div className="whitespace-pre-wrap rounded-xl border border-gray-100 bg-white p-4 text-sm leading-relaxed text-gray-800 shadow-xs dark:border-gray-800 dark:bg-gray-950 dark:text-gray-200">
                {selectedMessage.message}
              </div>
            </div>

            {/* Status Selector */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-100 p-4 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Statut actuel :</span>
                <select
                  value={selectedMessage.status}
                  onChange={(e) => handleChangeStatus(selectedMessage.id, e.target.value)}
                  disabled={isUpdating}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-800 shadow-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="NEW">Nouveau</option>
                  <option value="IN_PROGRESS">En cours</option>
                  <option value="RESOLVED">Résolu</option>
                  <option value="CLOSED">Fermé</option>
                </select>
              </div>

              {selectedMessage.status !== "RESOLVED" && (
                <button
                  onClick={() => handleMarkResolved(selectedMessage)}
                  disabled={isUpdating}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-sm font-medium text-white shadow-xs transition hover:bg-emerald-700 disabled:opacity-50"
                >
                  <Check className="size-4" />
                  <span>Marquer comme résolu</span>
                </button>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
              <button
                onClick={() => setDeleteTarget(selectedMessage)}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-rose-600 transition hover:text-rose-700 dark:text-rose-400"
              >
                <Trash2 className="size-4" />
                <span>Supprimer le message</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  Fermer
                </button>
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject_display || selectedMessage.subject)}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
                >
                  <Send className="size-4" />
                  <span>Répondre par email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal de Suppression */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            handleDelete(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
        title="Supprimer le message"
        message="Êtes-vous sûr de vouloir supprimer le message de"
        itemName={deleteTarget ? `${deleteTarget.first_name} ${deleteTarget.last_name}` : "ce contact"}
      />
    </>
  );
}
