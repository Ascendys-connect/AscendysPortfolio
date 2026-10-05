import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import PageMeta from "@/components/common/PageMeta";
import { apiService } from "@/services/api.service";

// ─── Types ───────────────────────────────────────────────────────────────────
interface AnalyticsSummary {
  total_users: number;
  active_users: number;
  total_trainings: number;
  total_blog_posts: number;
  total_events: number;
  total_media: number;
  total_messages: number;
  total_subscribers: number;
  total_services: number;
  total_offers: number;
  total_logs: number;
  db_latency_ms: number;
  api_latency_ms: number;
}

interface TrafficData {
  labels: string[];
  registrations: number[];
  visits: number[];
  total_visits: number;
  total_registrations: number;
}

interface DistributionData {
  series: number[];
  labels: string[];
}

interface TrainingStatus {
  published: number;
  draft: number;
  archived: number;
}

interface EventsStatus {
  upcoming: number;
  past: number;
}

interface RecentLog {
  id: string;
  action: string;
  description: string;
  created_at: string;
  ip_address: string | null;
  user__email: string | null;
  user__first_name: string | null;
  user__last_name: string | null;
}

interface Telemetry {
  database_status: string;
  database_latency: string;
  api_response_time: string;
  system_health: string;
  uptime: string;
  server_time: string;
}

interface AnalyticsData {
  summary: AnalyticsSummary;
  traffic: TrafficData;
  roles_distribution: DistributionData;
  content_distribution: DistributionData;
  training_status: TrainingStatus;
  events_status: EventsStatus;
  logs_breakdown: Record<string, number>;
  recent_logs: RecentLog[];
  telemetry: Telemetry;
}

// ─── Action colour map ───────────────────────────────────────────────────────
const ACTION_COLORS: Record<string, string> = {
  CREATE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  UPDATE: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
  DELETE: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
  LOGIN: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400",
  LOGOUT: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
  VIEW: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

// ─── Skeleton ────────────────────────────────────────────────────────────────
function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800 ${className}`}
    />
  );
}

// ─── KPI Card ────────────────────────────────────────────────────────────────
function KpiCard({
  label,
  value,
  icon,
  accent,
  sub,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accent: string;
  sub?: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div
        className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${accent}`}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
          {label}
        </p>
        <p className="mt-0.5 text-2xl font-bold text-gray-900 dark:text-white">
          {value}
        </p>
        {sub && (
          <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">{sub}</p>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function GlobalAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchData = async () => {
    try {
      const res = await apiService.get<AnalyticsData>(
        "/dashboard/global-analytics/"
      );
      // handle both {data: ...} and raw shapes
      const payload = (res as any)?.data ?? res;
      setData(payload);
      setLastRefresh(new Date());
    } catch (err) {
      console.error("Analytics fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ── Chart options ─────────────────────────────────────────────────────────
  const trafficOpts: ApexOptions = {
    chart: {
      type: "area",
      fontFamily: "Outfit, sans-serif",
      toolbar: { show: false },
      background: "transparent",
      animations: { enabled: true, speed: 800 },
    },
    colors: ["#6366f1", "#10b981"],
    stroke: { curve: "smooth", width: 2.5 },
    fill: {
      type: "gradient",
      gradient: { opacityFrom: 0.3, opacityTo: 0.02, shadeIntensity: 0.4 },
    },
    grid: {
      borderColor: "#e5e7eb",
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
    },
    markers: { size: 0, hover: { size: 5 } },
    xaxis: {
      categories: data?.traffic.labels ?? [],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: "#9ca3af", fontSize: "11px" } },
    },
    yaxis: { labels: { style: { colors: "#9ca3af", fontSize: "11px" } } },
    tooltip: { theme: "dark", shared: true, intersect: false },
    legend: {
      position: "top",
      horizontalAlign: "right",
      labels: { colors: "#9ca3af" },
    },
    dataLabels: { enabled: false },
  };

  const trafficSeries = [
    { name: "Inscriptions", data: data?.traffic.registrations ?? [] },
    { name: "Activités", data: data?.traffic.visits ?? [] },
  ];

  const donutOpts = (colors: string[]): ApexOptions => ({
    chart: {
      type: "donut",
      fontFamily: "Outfit, sans-serif",
      background: "transparent",
      animations: { enabled: true, speed: 800 },
    },
    colors,
    stroke: { width: 0 },
    plotOptions: {
      pie: {
        donut: {
          size: "68%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total",
              fontSize: "13px",
              color: "#6b7280",
              formatter: (w) =>
                String(
                  w.globals.seriesTotals.reduce(
                    (a: number, b: number) => a + b,
                    0
                  )
                ),
            },
          },
        },
      },
    },
    legend: {
      position: "bottom",
      labels: { colors: "#9ca3af" },
      fontSize: "12px",
    },
    dataLabels: { enabled: false },
    tooltip: { theme: "dark" },
  });

  const rolesColors = ["#6366f1", "#3b82f6", "#10b981", "#f59e0b"];
  const contentColors = [
    "#6366f1",
    "#f59e0b",
    "#ec4899",
    "#10b981",
    "#f97316",
    "#06b6d4",
  ];

  const barLogsOpts: ApexOptions = {
    chart: {
      type: "bar",
      fontFamily: "Outfit, sans-serif",
      toolbar: { show: false },
      background: "transparent",
      animations: { enabled: true, speed: 600 },
    },
    colors: ["#6366f1"],
    plotOptions: {
      bar: { borderRadius: 6, columnWidth: "50%", distributed: true },
    },
    legend: { show: false },
    xaxis: {
      categories: Object.keys(data?.logs_breakdown ?? {}),
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: "#9ca3af", fontSize: "11px" } },
    },
    yaxis: { labels: { style: { colors: "#9ca3af" } } },
    grid: { borderColor: "#e5e7eb", strokeDashArray: 4 },
    dataLabels: { enabled: false },
    tooltip: { theme: "dark" },
  };

  const barLogsSeries = [
    {
      name: "Actions",
      data: Object.values(data?.logs_breakdown ?? {}),
    },
  ];

  const trainingStatusOpts: ApexOptions = {
    ...donutOpts(["#10b981", "#f59e0b", "#6b7280"]),
  };
  const trainingStatusSeries = data
    ? [
        data.training_status.published,
        data.training_status.draft,
        data.training_status.archived,
      ]
    : [];

  const latencyColor = (ms: number) =>
    ms < 100
      ? "text-emerald-500"
      : ms < 500
      ? "text-amber-500"
      : "text-red-500";

  return (
    <>
      <PageMeta
        title="Statistiques Globales | Ascendys Connect"
        description="Vue analytique complete de la plateforme : trafic, inscriptions, contenus, telemetrie systeme"
      />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Statistiques Globales
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Vue analytique complete · Donnees reelles de la base de donnees
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 dark:text-gray-500">
            Derniere mise a jour :{" "}
            {lastRefresh.toLocaleTimeString("fr-FR")}
          </span>
          <button
            id="analytics-refresh-btn"
            onClick={() => {
              setLoading(true);
              fetchData();
            }}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 transition hover:border-indigo-400 hover:text-indigo-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
          >
            <svg
              className="size-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Actualiser
          </button>
        </div>
      </div>

      {/* ── KPI Grid ───────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : (
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
          <KpiCard
            label="Utilisateurs"
            value={data?.summary.total_users ?? 0}
            sub={`${data?.summary.active_users ?? 0} actifs`}
            accent="bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400"
            icon={
              <svg
                className="size-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            }
          />
          <KpiCard
            label="Formations"
            value={data?.summary.total_trainings ?? 0}
            accent="bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
            icon={
              <svg
                className="size-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            }
          />
          <KpiCard
            label="Articles Blog"
            value={data?.summary.total_blog_posts ?? 0}
            accent="bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
            icon={
              <svg
                className="size-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            }
          />
          <KpiCard
            label="Evenements"
            value={data?.summary.total_events ?? 0}
            sub={`${data?.events_status?.upcoming ?? 0} a venir`}
            accent="bg-pink-100 text-pink-600 dark:bg-pink-950/40 dark:text-pink-400"
            icon={
              <svg
                className="size-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            }
          />
          <KpiCard
            label="Messages"
            value={data?.summary.total_messages ?? 0}
            accent="bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
            icon={
              <svg
                className="size-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            }
          />
          <KpiCard
            label="Abonnes"
            value={data?.summary.total_subscribers ?? 0}
            accent="bg-teal-100 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400"
            icon={
              <svg
                className="size-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            }
          />
          <KpiCard
            label="Mediatheque"
            value={data?.summary.total_media ?? 0}
            accent="bg-cyan-100 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400"
            icon={
              <svg
                className="size-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            }
          />
          <KpiCard
            label="Logs Systeme"
            value={data?.summary.total_logs ?? 0}
            accent="bg-violet-100 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400"
            icon={
              <svg
                className="size-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            }
          />
        </div>
      )}

      {/* ── Traffic Area Chart ─────────────────────────────────────────────── */}
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-2 flex flex-col gap-0.5">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            Trafic et Inscriptions sur 14 jours
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Inscriptions :{" "}
            <span className="font-semibold text-indigo-500">
              {data?.traffic.total_registrations ?? 0}
            </span>
            &nbsp;&middot;&nbsp; Activites enregistrees :{" "}
            <span className="font-semibold text-emerald-500">
              {data?.traffic.total_visits ?? 0}
            </span>
          </p>
        </div>
        {loading ? (
          <Skeleton className="mt-4 h-64" />
        ) : (
          <ReactApexChart
            options={trafficOpts}
            series={trafficSeries}
            type="area"
            height={260}
          />
        )}
      </div>

      {/* ── Donuts Row ─────────────────────────────────────────────────────── */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Roles */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 className="mb-0.5 text-sm font-semibold text-gray-900 dark:text-white">
            Repartition des roles
          </h3>
          <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
            Hierarchie des comptes utilisateurs
          </p>
          {loading ? (
            <Skeleton className="h-52" />
          ) : (
            <ReactApexChart
              options={{
                ...donutOpts(rolesColors),
                labels: data?.roles_distribution.labels ?? [],
              }}
              series={data?.roles_distribution.series ?? []}
              type="donut"
              height={210}
            />
          )}
        </div>

        {/* Catalogue */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 className="mb-0.5 text-sm font-semibold text-gray-900 dark:text-white">
            Catalogue de contenu
          </h3>
          <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
            Distribution par type de contenu
          </p>
          {loading ? (
            <Skeleton className="h-52" />
          ) : (
            <ReactApexChart
              options={{
                ...donutOpts(contentColors),
                labels: data?.content_distribution.labels ?? [],
              }}
              series={data?.content_distribution.series ?? []}
              type="donut"
              height={210}
            />
          )}
        </div>

        {/* Statut formations */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 className="mb-0.5 text-sm font-semibold text-gray-900 dark:text-white">
            Statut des formations
          </h3>
          <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
            Publiees · Brouillons · Archivees
          </p>
          {loading ? (
            <Skeleton className="h-52" />
          ) : (
            <ReactApexChart
              options={{
                ...trainingStatusOpts,
                labels: ["Publiees", "Brouillons", "Archivees"],
              }}
              series={trainingStatusSeries}
              type="donut"
              height={210}
            />
          )}
        </div>
      </div>

      {/* ── Bar + Telemetry Row ───────────────────────────────────────────── */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Bar */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 lg:col-span-3">
          <h3 className="mb-0.5 text-sm font-semibold text-gray-900 dark:text-white">
            Actions systeme par type
          </h3>
          <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
            Nombre total d actions enregistrees dans les logs
          </p>
          {loading ? (
            <Skeleton className="h-48" />
          ) : Object.keys(data?.logs_breakdown ?? {}).length === 0 ? (
            <div className="flex h-48 items-center justify-center text-sm text-gray-400 dark:text-gray-500">
              Aucun log systeme enregistre pour l instant
            </div>
          ) : (
            <ReactApexChart
              options={barLogsOpts}
              series={barLogsSeries}
              type="bar"
              height={200}
            />
          )}
        </div>

        {/* Telemetry */}
        <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 lg:col-span-2">
          <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
            Telemetrie Systeme
          </h3>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-9" />
              ))}
            </div>
          ) : (
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5 dark:bg-gray-800">
                <span className="text-gray-500 dark:text-gray-400">
                  Base de donnees
                </span>
                <span className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                  <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
                  {data?.telemetry.database_status}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5 dark:bg-gray-800">
                <span className="text-gray-500 dark:text-gray-400">
                  Latence BD
                </span>
                <span
                  className={`font-bold ${latencyColor(
                    data?.summary.db_latency_ms ?? 0
                  )}`}
                >
                  {data?.telemetry.database_latency}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5 dark:bg-gray-800">
                <span className="text-gray-500 dark:text-gray-400">
                  Temps reponse API
                </span>
                <span
                  className={`font-bold ${latencyColor(
                    data?.summary.api_latency_ms ?? 0
                  )}`}
                >
                  {data?.telemetry.api_response_time}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5 dark:bg-gray-800">
                <span className="text-gray-500 dark:text-gray-400">
                  Disponibilite
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {data?.telemetry.uptime}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5 dark:bg-gray-800">
                <span className="text-gray-500 dark:text-gray-400">
                  Sante systeme
                </span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {data?.telemetry.system_health}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5 dark:bg-gray-800">
                <span className="text-gray-500 dark:text-gray-400">
                  Heure serveur
                </span>
                <span className="font-mono text-xs text-gray-700 dark:text-gray-300">
                  {data?.telemetry.server_time}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Recent Logs Table ─────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Journaux d activite recents
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Les 10 dernieres actions enregistrees
            </p>
          </div>
        </div>
        {loading ? (
          <div className="space-y-2 p-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10" />
            ))}
          </div>
        ) : (data?.recent_logs ?? []).length === 0 ? (
          <div className="flex h-40 items-center justify-center">
            <div className="text-center">
              <svg
                className="mx-auto mb-3 size-10 text-gray-300 dark:text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Aucun journal enregistre
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Utilisateur
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Action
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    IP
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {(data?.recent_logs ?? []).map((log) => (
                  <tr
                    key={log.id}
                    className="transition hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="px-6 py-3 font-medium text-gray-800 dark:text-gray-200">
                      {log.user__first_name
                        ? `${log.user__first_name} ${log.user__last_name ?? ""}`
                        : log.user__email ?? "Systeme"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          ACTION_COLORS[log.action] ??
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="max-w-xs truncate px-4 py-3 text-gray-600 dark:text-gray-400">
                      {log.description}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">
                      {log.ip_address ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
                      {new Date(log.created_at).toLocaleString("fr-FR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
