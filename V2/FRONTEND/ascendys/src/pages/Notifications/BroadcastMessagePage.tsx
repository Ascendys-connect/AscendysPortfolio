/**
 * Page de diffusion de messages (Broadcast) aux utilisateurs
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import PageMeta from '@/components/common/PageMeta';
import DeleteConfirmModal from '@/components/common/DeleteConfirmModal';
import { notificationsService } from '@/services/notifications.service';
import { usersService } from '@/services/users.service';
import { useToast } from '@/context/ToastContext';
import { useNotifications } from '@/context/NotificationContext';
import { UserRole } from '@/types/auth.types';
import type { User } from '@/types/auth.types';
import { cn } from '@/utils';

export default function BroadcastMessagePage() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const { refreshUnreadCount, refreshRecentNotifications } = useNotifications();

  // Users data
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(true);

  // Form State
  const [targetType, setTargetType] = useState<'ALL' | 'ROLE' | 'CUSTOM'>('ALL');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([UserRole.ADMIN, UserRole.EDITOR]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [userSearch, setUserSearch] = useState<string>('');

  const [title, setTitle] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [link, setLink] = useState<string>('');
  const [priority, setPriority] = useState<'NORMAL' | 'HIGH'>('NORMAL');

  const [isSending, setIsSending] = useState<boolean>(false);

  // Load all users for targeting
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoadingUsers(true);
        const data = await usersService.getUsers();
        // Support wrapped or array response
        const list = Array.isArray(data) ? data : (data as any)?.data || [];
        setUsers(list);
      } catch (err) {
        console.error('Erreur chargement utilisateurs:', err);
      } finally {
        setIsLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  // Filtered users for manual selection
  const filteredUsers = useMemo(() => {
    if (!userSearch.trim()) return users;
    const q = userSearch.toLowerCase();
    return users.filter(
      (u) =>
        u.email?.toLowerCase().includes(q) ||
        `${u.first_name} ${u.last_name}`.toLowerCase().includes(q) ||
        u.role?.toLowerCase().includes(q)
    );
  }, [users, userSearch]);

  // Compute targeted recipients list
  const targetedRecipients = useMemo(() => {
    if (targetType === 'ALL') {
      return users;
    }
    if (targetType === 'ROLE') {
      return users.filter((u) => selectedRoles.includes(u.role));
    }
    if (targetType === 'CUSTOM') {
      return users.filter((u) => selectedUserIds.includes(u.id));
    }
    return [];
  }, [users, targetType, selectedRoles, selectedUserIds]);

  const handleRoleToggle = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleUserToggle = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSelectAllFiltered = () => {
    const ids = filteredUsers.map((u) => u.id);
    setSelectedUserIds((prev) => Array.from(new Set([...prev, ...ids])));
  };

  const handleDeselectAll = () => {
    setSelectedUserIds([]);
  };

  const [sendConfirm, setSendConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      showError('Validation', 'Veuillez saisir un titre pour le message.');
      return;
    }

    if (!message.trim()) {
      showError('Validation', 'Veuillez saisir le contenu du message.');
      return;
    }

    if (targetedRecipients.length === 0) {
      showError('Destinataires', 'Aucun destinataire sélectionné.');
      return;
    }

    setSendConfirm(true);
  };

  const confirmSend = async () => {
    try {
      setIsSending(true);
      const res = await notificationsService.sendBroadcast({
        target_type: targetType,
        roles: targetType === 'ROLE' ? selectedRoles : undefined,
        user_ids: targetType === 'CUSTOM' ? selectedUserIds : undefined,
        title: title.trim(),
        message: message.trim(),
        link: link.trim() || undefined,
        priority,
      });

      showSuccess(
        'Message diffusé',
        res.message || `Message envoyé avec succès à ${targetedRecipients.length} destinataire(s).`
      );

      refreshUnreadCount();
      refreshRecentNotifications();

      setTitle('');
      setMessage('');
      setLink('');
      setSendConfirm(false);

      navigate('/notifications');
    } catch (err: any) {
      console.error('Erreur diffusion:', err);
      showError('Erreur', err?.response?.data?.message || "Impossible d'envoyer la notification de masse.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Diffusion de messages | Ascendys Connect"
        description="Envoyez des messages de masse ciblés à vos utilisateurs et administrateurs."
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/notifications')}
                className="rounded-xl border border-gray-200 bg-white p-2 text-gray-500 transition hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
                title="Retour aux notifications"
              >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                Diffusion de messages
              </h1>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Diffusez des notifications internes instantanées aux équipes et utilisateurs
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/notifications')}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <svg className="size-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            Consulter les notifications
          </button>
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column: Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 1. Target Selection Card */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
                  1. Sélection des destinataires
                </h2>

                {/* Target Type Cards */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 mb-5">
                  <button
                    type="button"
                    onClick={() => setTargetType('ALL')}
                    className={cn(
                      "flex flex-col items-start rounded-xl border p-3.5 text-left transition",
                      targetType === 'ALL'
                        ? "border-brand-500 bg-brand-50/40 ring-1 ring-brand-500 dark:bg-brand-950/20"
                        : "border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700"
                    )}
                  >
                    <div className="flex w-full items-center justify-between mb-2">
                      <span className="flex size-7 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400">
                        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </span>
                      <span className={cn(
                        "size-3 rounded-full border-2",
                        targetType === 'ALL' ? "border-brand-500 bg-brand-500" : "border-gray-300 dark:border-gray-700"
                      )} />
                    </div>
                    <span className="text-xs font-bold text-gray-900 dark:text-white">Tous les utilisateurs</span>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                      {users.length} utilisateur{users.length > 1 ? 's' : ''}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetType('ROLE')}
                    className={cn(
                      "flex flex-col items-start rounded-xl border p-3.5 text-left transition",
                      targetType === 'ROLE'
                        ? "border-brand-500 bg-brand-50/40 ring-1 ring-brand-500 dark:bg-brand-950/20"
                        : "border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700"
                    )}
                  >
                    <div className="flex w-full items-center justify-between mb-2">
                      <span className="flex size-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </span>
                      <span className={cn(
                        "size-3 rounded-full border-2",
                        targetType === 'ROLE' ? "border-brand-500 bg-brand-500" : "border-gray-300 dark:border-gray-700"
                      )} />
                    </div>
                    <span className="text-xs font-bold text-gray-900 dark:text-white">Par rôle</span>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                      Admins, éditeurs...
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetType('CUSTOM')}
                    className={cn(
                      "flex flex-col items-start rounded-xl border p-3.5 text-left transition",
                      targetType === 'CUSTOM'
                        ? "border-brand-500 bg-brand-50/40 ring-1 ring-brand-500 dark:bg-brand-950/20"
                        : "border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700"
                    )}
                  >
                    <div className="flex w-full items-center justify-between mb-2">
                      <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </span>
                      <span className={cn(
                        "size-3 rounded-full border-2",
                        targetType === 'CUSTOM' ? "border-brand-500 bg-brand-500" : "border-gray-300 dark:border-gray-700"
                      )} />
                    </div>
                    <span className="text-xs font-bold text-gray-900 dark:text-white">Sélection manuelle</span>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                      {selectedUserIds.length} sélectionné{selectedUserIds.length > 1 ? 's' : ''}
                    </span>
                  </button>
                </div>

                {/* Sub-selection: By Role */}
                {targetType === 'ROLE' && (
                  <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4 dark:border-gray-800 dark:bg-gray-800/40 space-y-3">
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Sélectionnez les rôles à inclure dans la diffusion :
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { role: UserRole.SUPER_ADMIN, label: 'Super Administrateurs' },
                        { role: UserRole.ADMIN, label: 'Administrateurs' },
                        { role: UserRole.EDITOR, label: 'Éditeurs' },
                      ].map(({ role, label }) => {
                        const count = users.filter((u) => u.role === role).length;
                        const isChecked = selectedRoles.includes(role);
                        return (
                          <button
                            key={role}
                            type="button"
                            onClick={() => handleRoleToggle(role)}
                            className={cn(
                              "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition",
                              isChecked
                                ? "border-brand-500 bg-brand-500 text-white shadow-sm"
                                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                            )}
                          >
                            <span className={cn(
                              "size-2 rounded-full",
                              isChecked ? "bg-white" : "bg-gray-400"
                            )} />
                            <span>{label}</span>
                            <span className={cn(
                              "rounded-full px-1.5 py-0.2 text-[10px] font-bold",
                              isChecked ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                            )}>
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Sub-selection: Custom Users Selection */}
                {targetType === 'CUSTOM' && (
                  <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4 dark:border-gray-800 dark:bg-gray-800/40 space-y-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={userSearch}
                          onChange={(e) => setUserSearch(e.target.value)}
                          placeholder="Rechercher par nom, prénom ou email..."
                          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-1.5 pl-8 text-xs text-gray-900 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        />
                        <svg className="absolute left-2.5 top-2 size-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleSelectAllFiltered}
                          className="text-[11px] font-medium text-brand-600 hover:underline dark:text-brand-400"
                        >
                          Tout cocher
                        </button>
                        <span className="text-gray-300 dark:text-gray-600">|</span>
                        <button
                          type="button"
                          onClick={handleDeselectAll}
                          className="text-[11px] font-medium text-gray-500 hover:underline"
                        >
                          Tout décocher
                        </button>
                      </div>
                    </div>

                    {/* Users checklist */}
                    <div className="custom-scrollbar max-h-52 overflow-y-auto rounded-lg border border-gray-200 bg-white divide-y divide-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:divide-gray-700">
                      {isLoadingUsers ? (
                        <p className="p-4 text-center text-xs text-gray-400">Chargement des utilisateurs...</p>
                      ) : filteredUsers.length === 0 ? (
                        <p className="p-4 text-center text-xs text-gray-400">Aucun utilisateur trouvé.</p>
                      ) : (
                        filteredUsers.map((u) => {
                          const isSelected = selectedUserIds.includes(u.id);
                          return (
                            <label
                              key={u.id}
                              className={cn(
                                "flex cursor-pointer items-center justify-between p-2.5 px-3 transition hover:bg-gray-50 dark:hover:bg-gray-700/50",
                                isSelected && "bg-brand-50/30 dark:bg-brand-950/20"
                              )}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleUserToggle(u.id)}
                                  className="size-3.5 rounded border-gray-300 text-brand-600 focus:ring-brand-500 dark:border-gray-600"
                                />
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                                    {u.first_name} {u.last_name}
                                  </p>
                                  <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                                    {u.email}
                                  </p>
                                </div>
                              </div>
                              <span className="shrink-0 rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                                {u.role}
                              </span>
                            </label>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Message Composition Card */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  2. Contenu du message
                </h2>

                {/* Priority Selection */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Niveau de priorité
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPriority('NORMAL')}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition",
                        priority === 'NORMAL'
                          ? "border-brand-500 bg-brand-500 text-white font-semibold shadow-sm"
                          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      )}
                    >
                      <span className="size-1.5 rounded-full bg-current" />
                      Normal
                    </button>
                    <button
                      type="button"
                      onClick={() => setPriority('HIGH')}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition",
                        priority === 'HIGH'
                          ? "border-red-500 bg-red-500 text-white font-semibold shadow-sm"
                          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      )}
                    >
                      <span className="size-1.5 rounded-full bg-current animate-pulse" />
                      Urgent / Prioritaire
                    </button>
                  </div>
                </div>

                {/* Message Title */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Titre du message <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Réunion générale d'équipe vendredi à 10h"
                    maxLength={150}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs text-gray-900 outline-none transition focus:border-brand-500 focus:bg-white dark:border-gray-800 dark:bg-gray-800/60 dark:text-white"
                  />
                  <div className="mt-1 flex justify-end text-[10px] text-gray-400">
                    {title.length} / 150
                  </div>
                </div>

                {/* Message Body */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Corps du message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Rédigez votre message à l'attention des utilisateurs ciblés..."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3.5 text-xs text-gray-900 outline-none transition focus:border-brand-500 focus:bg-white dark:border-gray-800 dark:bg-gray-800/60 dark:text-white"
                  />
                </div>

                {/* Optional Action Link */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Lien d'action optionnel
                  </label>
                  <input
                    type="text"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="Ex: /admin/trainings ou https://..."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2 text-xs text-gray-900 outline-none transition focus:border-brand-500 focus:bg-white dark:border-gray-800 dark:bg-gray-800/60 dark:text-white"
                  />
                  <p className="mt-1 text-[11px] text-gray-400">
                    Permet au destinataire d'accéder directement à une page en cliquant sur la notification.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Destinataires ciblés : <strong className="text-gray-900 dark:text-white">{targetedRecipients.length}</strong>
                </p>

                <button
                  type="submit"
                  disabled={isSending || targetedRecipients.length === 0}
                  className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm shadow-purple-500/30 transition hover:bg-purple-700 disabled:opacity-50"
                >
                  {isSending ? (
                    <>
                      <div className="size-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Diffusion en cours...
                    </>
                  ) : (
                    <>
                      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                      </svg>
                      Diffuser à {targetedRecipients.length} utilisateur{targetedRecipients.length > 1 ? 's' : ''}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Live Preview & Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live Preview Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Aperçu en temps réel
                </h3>
                <span className="rounded-full bg-brand-500/10 px-2 py-0.5 text-[10px] font-semibold text-brand-600 dark:text-brand-400">
                  Vue destinataire
                </span>
              </div>

              <p className="text-xs text-gray-400 mb-3">
                Voici comment la notification apparaîtra dans le centre de notifications du destinataire :
              </p>

              {/* Notification Card Mockup */}
              <div className="relative rounded-2xl border border-brand-200/80 bg-brand-50/30 p-4 shadow-sm dark:border-brand-900/50 dark:bg-brand-950/20">
                <span className="absolute -left-[1px] top-4 bottom-4 w-1 rounded-r-full bg-brand-500" />

                <div className="flex items-start gap-3 pl-2">
                  <div className="pt-1">
                    <span className="block size-2.5 rounded-full bg-red-500 animate-pulse ring-2 ring-white dark:ring-gray-900" />
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
                        <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                        </svg>
                        Diffusion
                      </span>
                      {priority === 'HIGH' && (
                        <span className="inline-flex items-center rounded-md bg-red-500/10 px-2 py-0.5 text-[10px] font-bold text-red-600">
                          Prioritaire
                        </span>
                      )}
                      <span className="text-[11px] text-gray-400">
                        À l'instant
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                      {title.trim() || "Titre de la notification..."}
                    </h4>

                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                      {message.trim() || "Le contenu de votre message apparaîtra ici tel qu'il sera affiché au destinataire."}
                    </p>

                    {link.trim() && (
                      <div className="pt-2">
                        <span className="inline-flex items-center gap-1 rounded-xl bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-600 dark:bg-brand-950/50 dark:text-brand-400">
                          Consulter
                          <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Target Breakdown Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Récapitulatif de la diffusion
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-500">Mode de ciblage :</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {targetType === 'ALL' && 'Tous les utilisateurs'}
                    {targetType === 'ROLE' && `Par rôle (${selectedRoles.join(', ')})`}
                    {targetType === 'CUSTOM' && 'Sélection manuelle'}
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-500">Destinataires ciblés :</span>
                  <span className="font-semibold text-purple-600 dark:text-purple-400">
                    {targetedRecipients.length} utilisateur{targetedRecipients.length > 1 ? 's' : ''}
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-500">Priorité :</span>
                  <span className={cn(
                    "font-semibold",
                    priority === 'HIGH' ? "text-red-500" : "text-gray-700 dark:text-gray-300"
                  )}>
                    {priority === 'HIGH' ? 'Haute / Urgente' : 'Normale'}
                  </span>
                </div>

                <div className="flex justify-between py-1.5">
                  <span className="text-gray-500">Statut initial :</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    Non lu (Badge rouge actif)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Send Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={sendConfirm}
        onClose={() => setSendConfirm(false)}
        onConfirm={confirmSend}
        title="Confirmer la diffusion du message ?"
        message={`Vous êtes sur le point d'envoyer ce message à ${targetedRecipients.length} destinataire${targetedRecipients.length > 1 ? 's' : ''}. Cette notification apparaîtra instantanément dans leur centre de notifications.`}
        confirmText="Diffuser maintenant"
        cancelText="Annuler"
      />
    </>
  );
}
