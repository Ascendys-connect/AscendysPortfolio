import { useState, useMemo, useEffect } from "react";
import PageMeta from "@/components/common/PageMeta";
import PageHeader from "@/components/common/PageHeader";
import { useToast } from "@/context/ToastContext";
import { enrollmentsService } from "@/services/enrollments.service";
import { trainingsService } from "@/services/trainings.service";
import type { Enrollment, EnrollmentStatus } from "@/types/enrollment.types";
import type { Training } from "@/types/content.types";
import {
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  Mail,
  Send,
  ExternalLink,
  Copy,
  RefreshCw,
  Search,
  BookOpen,
  DollarSign,
  Calendar,
  Check,
} from "lucide-react";

export default function EnrollmentsList() {
  const { showSuccess, showError, showInfo } = useToast();

  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingBatch, setIsProcessingBatch] = useState(false);
  const [sendingReminderId, setSendingReminderId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTrainingId, setSelectedTrainingId] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  const extractArray = (res: any): any[] => {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.results)) return res.results;
    if (Array.isArray(res?.data?.results)) return res.data.results;
    return [];
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [enrollmentsData, trainingsData] = await Promise.all([
        enrollmentsService.list(),
        trainingsService.getAll().catch(() => []),
      ]);
      setEnrollments(extractArray(enrollmentsData));
      setTrainings(extractArray(trainingsData));
    } catch {
      showError("Erreur", "Impossible de charger la liste des inscriptions.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered enrollments
  const filteredEnrollments = useMemo(() => {
    return enrollments.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.phone.includes(searchQuery) ||
        item.training_title.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTraining =
        selectedTrainingId === "ALL" ||
        item.training === selectedTrainingId ||
        item.training_slug === selectedTrainingId;

      const matchesStatus =
        selectedStatus === "ALL" || item.status === selectedStatus;

      return matchesSearch && matchesTraining && matchesStatus;
    });
  }, [enrollments, searchQuery, selectedTrainingId, selectedStatus]);

  // KPIs
  const stats = useMemo(() => {
    const total = enrollments.length;
    const paid = enrollments.filter((e) => e.status === "PAID");
    const pending = enrollments.filter((e) => e.status === "PENDING" || e.status === "PROCESSING");
    const failed = enrollments.filter((e) => e.status === "FAILED");
    const totalRevenue = paid.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
    const totalReminders = enrollments.reduce((acc, curr) => acc + (curr.reminders_count || 0), 0);

    return {
      total,
      paidCount: paid.length,
      pendingCount: pending.length,
      failedCount: failed.length,
      totalRevenue,
      totalReminders,
    };
  }, [enrollments]);

  // Trigger manual reminder
  const handleSendReminder = async (enrollment: Enrollment, stage: string = "manual") => {
    try {
      setSendingReminderId(enrollment.id);
      await enrollmentsService.sendReminder(enrollment.id, stage);
      showSuccess(
        "Relance envoyée",
        `Un email de rappel a été envoyé à ${enrollment.email}`
      );
      loadData();
    } catch (err: any) {
      showError(
        "Erreur d'envoi",
        err?.response?.data?.message || "Impossible d'envoyer la relance."
      );
    } finally {
      setSendingReminderId(null);
    }
  };

  // Trigger automated reminder scan
  const handleProcessAllReminders = async () => {
    try {
      setIsProcessingBatch(true);
      const res = await enrollmentsService.processReminders();
      const report = res?.data || res;
      const totalSent = (report.sent_1h || 0) + (report.sent_24h || 0) + (report.sent_7d || 0);

      if (totalSent > 0) {
        showSuccess(
          "Relances effectuées",
          `${totalSent} relance(s) envoyée(s) : ${report.sent_1h} à 1h, ${report.sent_24h} à 24h, ${report.sent_7d} à 7j.`
        );
      } else {
        showInfo(
          "Traitement terminé",
          "Aucune relance en attente n'était requise pour le moment."
        );
      }
      loadData();
    } catch {
      showError("Erreur", "Impossible d'exécuter les relances automatiques.");
    } finally {
      setIsProcessingBatch(false);
    }
  };

  // Copy payment link
  const handleCopyPaymentLink = (id: string) => {
    const url = `${window.location.origin}/payment/${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    showSuccess("Lien copié", "Le lien de paiement a été copié dans le presse-papier.");
    setTimeout(() => setCopiedId(null), 2500);
  };

  const getStatusBadge = (status: EnrollmentStatus) => {
    switch (status) {
      case "PAID":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
            <CheckCircle2 className="size-3.5" />
            Payé
          </span>
        );
      case "PROCESSING":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-400">
            <RefreshCw className="size-3.5 animate-spin" />
            En cours
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
            <Clock className="size-3.5" />
            En attente
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 dark:bg-red-950/40 dark:text-red-400">
            <AlertCircle className="size-3.5" />
            Échoué
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
            Annulé
          </span>
        );
      case "EXPIRED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-950/40 dark:text-orange-400">
            Expiré
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <>
      <PageMeta
        title="Inscriptions & Abonnements | Ascendys Connect Admin"
        description="Gestion des inscriptions aux formations, suivi des paiements et relances automatiques."
      />

      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Inscriptions & Abonnements"
          description="Suivi en direct des inscriptions, validation des paiements et gestion des relances automatiques (1h, 24h, 7j)."
          action={{
            label: isProcessingBatch ? "Exécution en cours..." : "Lancer relances automatiques",
            onClick: handleProcessAllReminders,
            icon: <Send className="size-4" />,
            disabled: isProcessingBatch,
          }}
        />

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Inscrits</span>
              <div className="flex size-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
                <Users className="size-5" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-black text-gray-900 dark:text-white">
              {stats.total}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Inscriptions Payées</span>
              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                <CheckCircle2 className="size-5" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {stats.paidCount}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">En Attente</span>
              <div className="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                <Clock className="size-5" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-black text-amber-600 dark:text-amber-400">
              {stats.pendingCount}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Échecs Paiement</span>
              <div className="flex size-10 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
                <AlertCircle className="size-5" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-black text-red-600 dark:text-red-400">
              {stats.failedCount}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Revenus Encaissés</span>
              <div className="flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400">
                <DollarSign className="size-5" />
              </div>
            </div>
            <div className="mt-3 text-xl font-black text-gray-900 dark:text-white">
              {stats.totalRevenue.toLocaleString("fr-FR")} <span className="text-xs font-semibold">XOF</span>
            </div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
            {/* Search Input */}
            <div className="relative md:col-span-5">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, email, téléphone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 transition focus:border-brand-500 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            {/* Filter by Training */}
            <div className="md:col-span-4">
              <div className="relative">
                <BookOpen className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                <select
                  value={selectedTrainingId}
                  onChange={(e) => setSelectedTrainingId(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 transition focus:border-brand-500 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="ALL">Toutes les formations</option>
                  {(Array.isArray(trainings) ? trainings : []).map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filter by Status */}
            <div className="md:col-span-3">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 px-3 text-sm text-gray-900 transition focus:border-brand-500 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="ALL">Tous les statuts</option>
                <option value="PAID">Payé</option>
                <option value="PENDING">En attente</option>
                <option value="FAILED">Échoué</option>
                <option value="PROCESSING">En cours</option>
                <option value="CANCELLED">Annulé</option>
                <option value="EXPIRED">Expiré</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table / List */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          {isLoading ? (
            <div className="flex items-center justify-center py-20 text-gray-500">
              <RefreshCw className="mr-3 size-6 animate-spin text-brand-600" />
              Chargement des inscriptions...
            </div>
          ) : filteredEnrollments.length === 0 ? (
            <div className="py-16 text-center">
              <Users className="mx-auto mb-3 size-12 text-gray-300 dark:text-gray-600" />
              <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                Aucune inscription trouvée
              </h4>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Essayez d'ajuster vos critères de recherche ou de filtre.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                <thead className="border-b border-gray-200 bg-gray-50/75 text-xs font-semibold uppercase text-gray-700 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-300">
                  <tr>
                    <th scope="col" className="px-6 py-4">Apprenant</th>
                    <th scope="col" className="px-6 py-4">Formation</th>
                    <th scope="col" className="px-6 py-4">Montant</th>
                    <th scope="col" className="px-6 py-4">Statut</th>
                    <th scope="col" className="px-6 py-4">Date & Relances</th>
                    <th scope="col" className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {filteredEnrollments.map((item) => {
                    const isSendingThis = sendingReminderId === item.id;
                    const canRemind = item.status !== "PAID" && item.status !== "CANCELLED";

                    return (
                      <tr
                        key={item.id}
                        className="transition hover:bg-gray-50/80 dark:hover:bg-gray-800/40"
                      >
                        {/* Apprenant */}
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900 dark:text-white">
                            {item.full_name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {item.email}
                          </div>
                          <div className="text-xs font-mono text-gray-400">
                            {item.phone}
                          </div>
                          {item.education_level_display && (
                            <span className="mt-1 inline-block rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                              {item.education_level_display}
                            </span>
                          )}
                        </td>

                        {/* Formation */}
                        <td className="px-6 py-4">
                          <div className="max-w-xs font-semibold text-gray-900 dark:text-white">
                            {item.training_title}
                          </div>
                          <span className="text-xs text-gray-400">
                            ID: {item.id.slice(0, 8)}...
                          </span>
                        </td>

                        {/* Montant */}
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900 dark:text-white">
                            {parseInt(item.amount).toLocaleString("fr-FR")} {item.currency}
                          </div>
                          {item.payment_attempts > 0 && (
                            <span className="text-[11px] text-gray-400">
                              {item.payment_attempts} tentative(s)
                            </span>
                          )}
                        </td>

                        {/* Statut */}
                        <td className="px-6 py-4">
                          {getStatusBadge(item.status)}
                        </td>

                        {/* Date & Suivi Relances */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Calendar className="size-3.5" />
                            {new Date(item.created_at).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>

                          {/* Badges de relance */}
                          <div className="mt-2 flex flex-wrap items-center gap-1">
                            <span
                              title={item.reminder_1h_sent_at ? `Envoyée le ${new Date(item.reminder_1h_sent_at).toLocaleString('fr-FR')}` : "1h non envoyée"}
                              className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                                item.reminder_1h_sent_at
                                  ? "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300"
                                  : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
                              }`}
                            >
                              1h {item.reminder_1h_sent_at ? "✓" : "—"}
                            </span>
                            <span
                              title={item.reminder_24h_sent_at ? `Envoyée le ${new Date(item.reminder_24h_sent_at).toLocaleString('fr-FR')}` : "24h non envoyée"}
                              className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                                item.reminder_24h_sent_at
                                  ? "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300"
                                  : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
                              }`}
                            >
                              24h {item.reminder_24h_sent_at ? "✓" : "—"}
                            </span>
                            <span
                              title={item.reminder_7d_sent_at ? `Envoyée le ${new Date(item.reminder_7d_sent_at).toLocaleString('fr-FR')}` : "7j non envoyée"}
                              className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                                item.reminder_7d_sent_at
                                  ? "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300"
                                  : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
                              }`}
                            >
                              7j {item.reminder_7d_sent_at ? "✓" : "—"}
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Bouton Relance par email */}
                            {canRemind && (
                              <button
                                onClick={() => handleSendReminder(item)}
                                disabled={isSendingThis}
                                title="Envoyer une relance par email maintenant"
                                className="inline-flex items-center gap-1 rounded-lg border border-purple-200 bg-purple-50 px-2.5 py-1.5 text-xs font-semibold text-purple-700 transition hover:bg-purple-100 active:scale-95 disabled:opacity-50 dark:border-purple-800 dark:bg-purple-950/40 dark:text-purple-300"
                              >
                                {isSendingThis ? (
                                  <RefreshCw className="size-3.5 animate-spin" />
                                ) : (
                                  <Mail className="size-3.5" />
                                )}
                                <span>Relancer</span>
                              </button>
                            )}

                            {/* Copier le lien de paiement */}
                            <button
                              onClick={() => handleCopyPaymentLink(item.id)}
                              title="Copier le lien direct de paiement"
                              className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                            >
                              {copiedId === item.id ? (
                                <Check className="size-4 text-emerald-600" />
                              ) : (
                                <Copy className="size-4" />
                              )}
                            </button>

                            {/* Ouvrir la page de paiement */}
                            <a
                              href={`/payment/${item.id}`}
                              target="_blank"
                              rel="noreferrer"
                              title="Voir la page de paiement"
                              className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                            >
                              <ExternalLink className="size-4" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
