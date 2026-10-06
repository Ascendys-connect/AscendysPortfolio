import { useState, useEffect, useCallback } from "react";
import PageMeta from "@/components/common/PageMeta";
import PageHeader from "@/components/common/PageHeader";
import Button from "@/components/ui/button/Button";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { logsService } from "@/services/logs.service";
import { useToast } from "@/context/ToastContext";
import type { ActivityLog, ActivityLogAction, PaginatedResponse } from "@/types/content.types";

// ── Action config ─────────────────────────────────────────────────────────────

const ACTION_CONFIG: Record<
  ActivityLogAction,
  { label: string; bg: string; text: string }
> = {
  CREATE:  { label: "Création",       bg: "bg-emerald-100 dark:bg-emerald-950/40", text: "text-emerald-700 dark:text-emerald-400" },
  UPDATE:  { label: "Modification",   bg: "bg-amber-100 dark:bg-amber-950/40",     text: "text-amber-700 dark:text-amber-400"   },
  DELETE:  { label: "Suppression",    bg: "bg-rose-100 dark:bg-rose-950/40",       text: "text-rose-700 dark:text-rose-400"     },
  VIEW:    { label: "Consultation",   bg: "bg-blue-100 dark:bg-blue-950/40",       text: "text-blue-700 dark:text-blue-400"     },
  LOGIN:   { label: "Connexion",      bg: "bg-violet-100 dark:bg-violet-950/40",   text: "text-violet-700 dark:text-violet-400" },
  LOGOUT:  { label: "Déconnexion",    bg: "bg-slate-100 dark:bg-slate-800",        text: "text-slate-600 dark:text-slate-400"   },
  EXPORT:  { label: "Export",         bg: "bg-cyan-100 dark:bg-cyan-950/40",       text: "text-cyan-700 dark:text-cyan-400"     },
  IMPORT:  { label: "Import",         bg: "bg-orange-100 dark:bg-orange-950/40",   text: "text-orange-700 dark:text-orange-400" },
  OTHER:   { label: "Autre",          bg: "bg-gray-100 dark:bg-gray-800",          text: "text-gray-600 dark:text-gray-400"     },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }),
    time: d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

const PAGE_SIZE = 30;

export default function ActivityLogs() {
  const { showToast } = useToast();

  const [page, setPage] = useState(1);
  const [filterAction, setFilterAction] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [data, setData] = useState<PaginatedResponse<ActivityLog>>({
    count: 0, next: null, previous: null, results: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const raw = await logsService.getAll({
        page,
        action: filterAction || undefined,
        search: search || undefined,
      });
      // Normalize: DRF returns { count, next, previous, results }
      // Guard against unexpected shapes
      const normalized: PaginatedResponse<ActivityLog> = {
        count: raw?.count ?? 0,
        next: raw?.next ?? null,
        previous: raw?.previous ?? null,
        results: Array.isArray(raw?.results) ? raw.results : [],
      };
      setData(normalized);
    } catch {
      showToast("Erreur lors du chargement des journaux d'activite", "error");
    } finally {
      setIsLoading(false);
    }
  }, [page, filterAction, search, showToast]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);
  useEffect(() => { setPage(1); }, [filterAction, search]);

  const handleSearch = () => setSearch(searchInput);

  const handleClearLogs = async () => {
    setIsClearing(true);
    try {
      await logsService.clearAll();
      showToast("Tous les journaux d'activite ont ete effaces", "success");
      setShowClearDialog(false);
      setPage(1);
      fetchLogs();
    } catch {
      showToast("Erreur lors de l'effacement des journaux", "error");
    } finally {
      setIsClearing(false);
    }
  };

  const totalPages = Math.ceil(data.count / PAGE_SIZE);
  const logs = data.results;

  return (
    <>
      <PageMeta
        title="Journaux d'activite | Ascendys Connect"
        description="Consultez les journaux d'activite du systeme"
      />

      <PageHeader
        title="Journaux d'activite"
        description={`Historique des actions effectuees sur la plateforme${data.count > 0 ? " · " + data.count + " entree" + (data.count > 1 ? "s" : "") : ""}`}
        actions={
          <Button
            variant="secondary"
            size="sm"
            className="inline-flex items-center gap-2 text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30"
            onClick={() => setShowClearDialog(true)}
            disabled={data.count === 0}
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Effacer tout
          </Button>
        }
      />

      {/* Stat cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Total</p>
          <p className="mt-1.5 text-2xl font-bold text-gray-900 dark:text-white">{data.count}</p>
        </div>
        {(["CREATE", "UPDATE", "DELETE"] as ActivityLogAction[]).map((a) => {
          const cfg = ACTION_CONFIG[a];
          return (
            <div key={a} className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">{cfg.label}s</p>
              <p className="mt-1.5 text-2xl font-bold text-gray-900 dark:text-white">
                {logs.filter((l) => l.action === a).length}
                <span className="ml-1 text-sm font-normal text-gray-400">/ {PAGE_SIZE}</span>
              </p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            id="log-search"
            type="text"
            placeholder="Rechercher par utilisateur ou description..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
          />
        </div>
        <select
          id="log-action-filter"
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        >
          <option value="">Toutes les actions</option>
          {(Object.keys(ACTION_CONFIG) as ActivityLogAction[]).map((a) => (
            <option key={a} value={a}>{ACTION_CONFIG[a].label}</option>
          ))}
        </select>
        <Button size="sm" onClick={handleSearch}>Rechercher</Button>
        {(filterAction || search) && (
          <Button variant="secondary" size="sm" onClick={() => { setFilterAction(""); setSearch(""); setSearchInput(""); }}>
            Reinitialiser
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="size-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-gray-400 dark:text-gray-500">
            <svg className="size-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm font-medium">Aucun journal d'activite trouve</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  {["Date & Heure", "Utilisateur", "Action", "Description", "Modele", "Adresse IP"].map((h) => (
                    <th key={h} className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {logs.map((log) => {
                  const cfg = ACTION_CONFIG[log.action] ?? ACTION_CONFIG.OTHER;
                  const { date, time } = formatDate(log.created_at);
                  return (
                    <tr key={log.id} className="group transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/40">
                      {/* Date */}
                      <td className="whitespace-nowrap px-4 py-3">
                        <div className="text-sm font-medium text-gray-800 dark:text-white">{date}</div>
                        <div className="font-mono text-xs text-gray-400 dark:text-gray-500">{time}</div>
                      </td>
                      {/* User */}
                      <td className="whitespace-nowrap px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          {log.user_avatar ? (
                            <img src={log.user_avatar} alt={log.user_name} className="size-8 rounded-full object-cover" />
                          ) : (
                            <div className="flex size-8 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700 dark:bg-brand-950/50 dark:text-brand-300">
                              {getInitials(log.user_name)}
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-800 dark:text-white">{log.user_name}</div>
                            {log.user_email && <div className="text-xs text-gray-400 dark:text-gray-500">{log.user_email}</div>}
                          </div>
                        </div>
                      </td>
                      {/* Action */}
                      <td className="whitespace-nowrap px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
                          {cfg.label}
                        </span>
                      </td>
                      {/* Description */}
                      <td className="max-w-xs px-4 py-3">
                        <p className="truncate text-sm text-gray-700 dark:text-gray-300">{log.description}</p>
                        {log.metadata && Object.keys(log.metadata).length > 0 && (
                          <details className="mt-1">
                            <summary className="cursor-pointer text-xs text-brand-500 hover:text-brand-600 dark:text-brand-400">Metadonnees</summary>
                            <pre className="mt-1 max-h-28 overflow-auto rounded bg-gray-50 p-2 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                              {JSON.stringify(log.metadata, null, 2)}
                            </pre>
                          </details>
                        )}
                      </td>
                      {/* Model */}
                      <td className="whitespace-nowrap px-4 py-3">
                        {log.content_type_name ? (
                          <span className="rounded bg-gray-100 px-2 py-0.5 font-mono text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                            {log.content_type_name}
                          </span>
                        ) : <span className="text-xs text-gray-400">-</span>}
                      </td>
                      {/* IP */}
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">
                        {log.ip_address ?? "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Page <span className="font-medium text-gray-800 dark:text-white">{page}</span> sur{" "}
              <span className="font-medium text-gray-800 dark:text-white">{totalPages}</span>
              <span className="ml-2 text-xs">({data.count} entrees)</span>
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!data.previous}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Precedent
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let p: number;
                if (totalPages <= 5) p = i + 1;
                else if (page <= 3) p = i + 1;
                else if (page >= totalPages - 2) p = totalPages - 4 + i;
                else p = page - 2 + i;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${p === page ? "bg-brand-600 text-white shadow-sm" : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"}`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={!data.next}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={showClearDialog}
        onClose={() => setShowClearDialog(false)}
        onConfirm={handleClearLogs}
        title="Effacer tous les logs"
        message="Etes-vous sur de vouloir effacer tous les journaux d'activite ? Cette action est irreversible et supprimera l'historique complet."
        variant="danger"
        isLoading={isClearing}
      />
    </>
  );
}
