/**
 * Page de gestion et consultation de toutes les notifications administrateur
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import PageMeta from '@/components/common/PageMeta';
import DeleteConfirmModal from '@/components/common/DeleteConfirmModal';
import { useNotifications } from '@/context/NotificationContext';
import { notificationsService } from '@/services/notifications.service';
import type { NotificationItem, NotificationType } from '@/types/notification.types';
import { cn } from '@/utils';

export default function NotificationsPage() {
  const navigate = useNavigate();
  const {
    unreadCount,
    refreshUnreadCount,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'ALL' | 'UNREAD' | NotificationType>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const pageSize = 15;

  const fetchList = useCallback(async () => {
    try {
      setIsLoading(true);
      const filterParams: any = {
        page,
        page_size: pageSize,
      };

      if (activeTab === 'UNREAD') {
        filterParams.is_read = false;
      } else if (activeTab !== 'ALL') {
        filterParams.type = activeTab;
      }

      if (searchQuery.trim()) {
        filterParams.search = searchQuery.trim();
      }

      const res = await notificationsService.getNotifications(filterParams);
      setNotifications(res.results || []);
      setTotalCount(res.count || 0);
    } catch (err) {
      console.error('Erreur chargement notifications:', err);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, searchQuery, page]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const handleTabChange = (tab: 'ALL' | 'UNREAD' | NotificationType) => {
    setActiveTab(tab);
    setPage(1);
  };

  const handleToggleRead = async (notif: NotificationItem) => {
    if (notif.is_read) {
      await markAsUnread(notif.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, is_read: false, read_at: null } : n))
      );
    } else {
      await markAsRead(notif.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n))
      );
    }
  };

  const handleActionClick = async (notif: NotificationItem) => {
    if (!notif.is_read) {
      await markAsRead(notif.id);
    }
    if (notif.link) {
      navigate(notif.link);
    }
  };

  const [deleteTarget, setDeleteTarget] = useState<NotificationItem | null>(null);

  const handleDelete = async (id: string) => {
    const notif = notifications.find(n => n.id === id);
    if (notif) {
      setDeleteTarget(notif);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await deleteNotification(deleteTarget.id);
    setNotifications((prev) => prev.filter((n) => n.id !== deleteTarget.id));
    setTotalCount((prev) => Math.max(0, prev - 1));
    setDeleteTarget(null);
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, is_read: true, read_at: new Date().toISOString() }))
    );
    refreshUnreadCount();
  };

  const [clearReadConfirm, setClearReadConfirm] = useState(false);

  const handleClearRead = async () => {
    setClearReadConfirm(true);
  };

  const confirmClearRead = async () => {
    await notificationsService.clearAllRead();
    fetchList();
    refreshUnreadCount();
    setClearReadConfirm(false);
  };

  const formatDateTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  const renderBadge = (type: NotificationType) => {
    switch (type) {
      case 'PAYMENT':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
            <span className="size-1.5 rounded-full bg-emerald-500"></span>
            Paiement
          </span>
        );
      case 'CONTACT':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
            <span className="size-1.5 rounded-full bg-blue-500"></span>
            Message contact
          </span>
        );
      case 'NEWSLETTER':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 px-2.5 py-1 text-xs font-semibold text-purple-600 dark:bg-purple-500/20 dark:text-purple-400">
            <span className="size-1.5 rounded-full bg-purple-500"></span>
            Newsletter
          </span>
        );
      case 'BROADCAST':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
            <span className="size-1.5 rounded-full bg-amber-500"></span>
            Diffusion
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-500/10 px-2.5 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-500/20 dark:text-gray-400">
            <span className="size-1.5 rounded-full bg-gray-500"></span>
            Système
          </span>
        );
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <>
      <PageMeta
        title="Centre de notifications | Ascendys Connect"
        description="Gérez et consultez toutes vos notifications administratives en temps réel."
      />

      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                Centre de notifications
              </h1>
              {unreadCount > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-sm shadow-red-500/30">
                  <span className="size-2 rounded-full bg-white animate-pulse" />
                  {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Paiements en ligne, demandes de contact et inscriptions à la newsletter
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <svg className="size-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Tout marquer comme lu
              </button>
            )}

            <button
              type="button"
              onClick={handleClearRead}
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <svg className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Effacer les lues
            </button>

            <button
              type="button"
              onClick={() => navigate('/notifications/broadcast')}
              className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm shadow-purple-500/25 transition hover:bg-purple-700"
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              Diffuser un message
            </button>

            <button
              type="button"
              onClick={() => fetchList()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-500 px-3.5 py-2 text-xs font-semibold text-white shadow-sm shadow-brand-500/25 transition hover:bg-brand-600"
            >
              <svg className={cn("size-4", isLoading && "animate-spin")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Actualiser
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between dark:border-gray-800 dark:bg-gray-900">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleTabChange('ALL')}
              className={cn(
                "rounded-xl px-3.5 py-2 text-xs font-medium transition",
                activeTab === 'ALL'
                  ? "bg-brand-500 font-semibold text-white shadow-sm shadow-brand-500/20"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              )}
            >
              Toutes
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('UNREAD')}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-medium transition",
                activeTab === 'UNREAD'
                  ? "bg-red-500 font-semibold text-white shadow-sm shadow-red-500/20"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              )}
            >
              <span>Non lues</span>
              {unreadCount > 0 && (
                <span className={cn(
                  "rounded-full px-1.5 py-0.2 text-[10px] font-bold",
                  activeTab === 'UNREAD' ? "bg-white text-red-600" : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                )}>
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('PAYMENT')}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-medium transition",
                activeTab === 'PAYMENT'
                  ? "bg-emerald-600 font-semibold text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              )}
            >
              <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span>Paiements</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('CONTACT')}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-medium transition",
                activeTab === 'CONTACT'
                  ? "bg-blue-600 font-semibold text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              )}
            >
              <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>Contacts</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('NEWSLETTER')}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-medium transition",
                activeTab === 'NEWSLETTER'
                  ? "bg-purple-600 font-semibold text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              )}
            >
              <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Newsletter</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('BROADCAST')}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-medium transition",
                activeTab === 'BROADCAST'
                  ? "bg-amber-600 font-semibold text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              )}
            >
              <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              <span>Diffusions</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative min-w-[240px] max-w-sm">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une notification..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2 pl-9 text-xs text-gray-900 outline-none transition focus:border-brand-500 focus:bg-white dark:border-gray-800 dark:bg-gray-800/60 dark:text-white dark:focus:border-brand-500"
            />
            <svg
              className="absolute left-3 top-2.5 size-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
              <div className="text-center">
                <div className="mx-auto size-8 animate-spin rounded-full border-3 border-brand-500 border-t-transparent" />
                <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">Chargement des notifications...</p>
              </div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex min-h-[340px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-950/40 text-brand-500">
                <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Aucune notification trouvée
              </h3>
              <p className="mt-1 max-w-sm text-xs text-gray-500 dark:text-gray-400">
                {activeTab === 'UNREAD'
                  ? "Toutes vos notifications sont lues. Vous êtes parfaitement à jour !"
                  : "Aucune notification ne correspond à vos filtres actuels."}
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={cn(
                  "relative flex flex-col gap-4 rounded-2xl border p-4 transition-all duration-200 sm:flex-row sm:items-start sm:justify-between",
                  notif.is_read
                    ? "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-700"
                    : "border-brand-200/80 bg-brand-50/20 dark:border-brand-900/50 dark:bg-brand-950/20 shadow-sm"
                )}
              >
                {/* Left accent indicator for unread */}
                {!notif.is_read && (
                  <span className="absolute -left-[1px] top-4 bottom-4 w-1 rounded-r-full bg-brand-500" />
                )}

                <div className="flex items-start gap-3.5 pl-1 sm:pl-2">
                  {/* Status dot */}
                  <div className="pt-1">
                    <span
                      className={cn(
                        "block size-2.5 rounded-full ring-2 ring-white dark:ring-gray-900",
                        notif.is_read ? "bg-gray-300 dark:bg-gray-700" : "bg-red-500 animate-pulse"
                      )}
                      title={notif.is_read ? "Lu" : "Non lu"}
                    />
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {renderBadge(notif.type)}
                      <span className="text-[11px] text-gray-400">
                        {formatDateTime(notif.created_at)}
                      </span>
                    </div>

                    <h4 className={cn(
                      "text-sm",
                      notif.is_read ? "font-semibold text-gray-800 dark:text-gray-200" : "font-bold text-gray-900 dark:text-white"
                    )}>
                      {notif.title}
                    </h4>

                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                      {notif.message}
                    </p>

                    {/* Metadata tags */}
                    {notif.metadata && Object.keys(notif.metadata).length > 0 && (
                      <div className="mt-2 flex flex-wrap items-center gap-2 pt-1 text-[11px] text-gray-500">
                        {notif.metadata.amount && (
                          <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                            Montant: {notif.metadata.amount} {notif.metadata.currency || 'XOF'}
                          </span>
                        )}
                        {notif.metadata.training_title && (
                          <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-0.5 font-medium text-purple-700 dark:bg-purple-950/40 dark:text-purple-300">
                            Formation: {notif.metadata.training_title}
                          </span>
                        )}
                        {notif.metadata.email && (
                          <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                            {notif.metadata.email}
                          </span>
                        )}
                        {notif.metadata.company && (
                          <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                            {notif.metadata.company}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-2 self-end sm:self-center pl-7 sm:pl-0">
                  {notif.link && (
                    <button
                      type="button"
                      onClick={() => handleActionClick(notif)}
                      className="inline-flex items-center gap-1 rounded-xl bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-600 transition hover:bg-brand-500 hover:text-white dark:bg-brand-950/50 dark:text-brand-400 dark:hover:bg-brand-600 dark:hover:text-white"
                    >
                      Consulter
                      <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleToggleRead(notif)}
                    className="rounded-xl border border-gray-200 bg-white p-2 text-gray-500 transition hover:bg-gray-50 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    title={notif.is_read ? "Marquer comme non lu" : "Marquer comme lu"}
                  >
                    {notif.is_read ? (
                      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                      </svg>
                    ) : (
                      <svg className="size-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(notif.id)}
                    className="rounded-xl border border-gray-200 bg-white p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600 dark:border-gray-800 dark:bg-gray-800 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                    title="Supprimer la notification"
                  >
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Page {page} sur {totalPages} ({totalCount} notifications au total)
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className="rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition disabled:opacity-40 dark:border-gray-800 dark:text-gray-300"
              >
                Précédent
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                className="rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition disabled:opacity-40 dark:border-gray-800 dark:text-gray-300"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Notification Modal */}
      {deleteTarget && (
        <DeleteConfirmModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
          title="Supprimer cette notification ?"
          message={`Êtes-vous sûr de vouloir supprimer définitivement la notification "${deleteTarget.title}" ? Cette action est irréversible.`}
          confirmText="Supprimer"
          cancelText="Annuler"
        />
      )}

      {/* Clear Read Notifications Modal */}
      <DeleteConfirmModal
        isOpen={clearReadConfirm}
        onClose={() => setClearReadConfirm(false)}
        onConfirm={confirmClearRead}
        title="Effacer toutes les notifications lues ?"
        message="Cette action supprimera définitivement toutes les notifications marquées comme lues. Cette opération est irréversible."
        confirmText="Effacer tout"
        cancelText="Annuler"
      />
    </>
  );
}
