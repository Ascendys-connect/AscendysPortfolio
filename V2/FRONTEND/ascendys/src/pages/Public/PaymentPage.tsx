/**
 * Page de paiement — design premium avec récapitulatif et intégration FedaPay
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { enrollmentsService } from '@/services/enrollments.service';
import type { Enrollment } from '@/types/enrollment.types';
import { ENROLLMENT_STATUS_COLORS } from '@/types/enrollment.types';
import PageMeta from '@/components/common/PageMeta';
import PublicNavbar from '@/components/public/PublicNavbar';
import PublicFooter from '@/components/public/PublicFooter';
import WhatsAppButton from '@/components/public/WhatsAppButton';
import {
  ShieldCheck,
  CreditCard,
  User,
  Mail,
  Phone,
  GraduationCap,
  BookOpen,
  AlertCircle,
  RefreshCw,
  Home,
  ChevronRight,
  Loader2,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export default function PaymentPage() {
  const { enrollmentId } = useParams<{ enrollmentId: string }>();
  const navigate = useNavigate();

  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enrollmentId) { navigate('/'); return; }
    loadEnrollment();
  }, [enrollmentId]);

  const loadEnrollment = async () => {
    try {
      setIsLoading(true);
      const data = await enrollmentsService.get(enrollmentId!);
      setEnrollment(data);
      if (data.status === 'PAID') navigate(`/payment/success?id=${enrollmentId}`);
    } catch {
      setError("Impossible de charger les détails de l'inscription.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!enrollment) return;
    try {
      setIsProcessing(true);
      setError(null);
      const paymentData = await enrollmentsService.initiatePayment(enrollment.id);
      window.location.href = paymentData.checkout_url;
    } catch (err: any) {
      setError(err.response?.data?.message || "Une erreur est survenue lors de l'initialisation du paiement.");
      setIsProcessing(false);
    }
  };

  const handleRetryPayment = async () => {
    if (!enrollment) return;
    try {
      setIsProcessing(true);
      setError(null);
      const paymentData = await enrollmentsService.retryPayment(enrollment.id);
      window.location.href = paymentData.checkout_url;
    } catch (err: any) {
      setError(err.response?.data?.message || "Une erreur est survenue lors du réessai du paiement.");
      setIsProcessing(false);
    }
  };

  // ── Loading ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <>
        <PublicNavbar />
        <div className="flex min-h-screen items-center justify-center bg-[#f8f6ff] pt-20 dark:bg-gray-950">
          <div className="text-center">
            <Loader2 className="mx-auto mb-4 size-12 animate-spin text-[#9800BF]" />
            <p className="text-gray-500 dark:text-gray-400">Chargement de votre inscription...</p>
          </div>
        </div>
      </>
    );
  }

  // ── Not found ────────────────────────────────────────────────────
  if (!enrollment) {
    return (
      <>
        <PublicNavbar />
        <div className="flex min-h-screen items-center justify-center bg-[#f8f6ff] pt-20 dark:bg-gray-950">
          <div className="text-center">
            <AlertCircle className="mx-auto mb-4 size-16 text-red-400" />
            <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Inscription introuvable</h1>
            <p className="mb-6 text-gray-500 dark:text-gray-400">Nous n'avons pas pu trouver votre inscription.</p>
            <button onClick={() => navigate('/')} className="rounded-lg bg-[#9800BF] px-6 py-3 font-semibold text-white hover:bg-[#7a0099] transition-colors">
              Retour à l'accueil
            </button>
          </div>
        </div>
      </>
    );
  }

  const isExpired = enrollment.is_expired;
  const canPay = enrollment.can_retry_payment;
  const formattedAmount = parseFloat(enrollment.amount).toLocaleString('fr-FR');

  return (
    <>
      <PageMeta
        title={`Paiement — ${enrollment.training_title} | Ascendys Connect`}
        description="Finalisez votre inscription en procédant au paiement sécurisé."
      />

      <div className="min-h-screen bg-[#f8f6ff] dark:bg-gray-950">
        <PublicNavbar />

        {/* Hero band */}
        <div
          className="relative overflow-hidden pt-16 md:pt-[72px]"
          style={{ background: 'linear-gradient(135deg, #1a0033 0%, #2d0057 50%, #9800BF 100%)' }}
        >
          <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-white/5 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 size-48 rounded-full bg-[#FFC000]/10 blur-2xl" />

          <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
            {/* Breadcrumb */}
            <nav className="mb-6 flex items-center gap-1.5 text-xs text-white/50">
              <Link to="/" className="hover:text-white/80 transition-colors">Accueil</Link>
              <ChevronRight className="size-3" />
              <Link to="/trainings" className="hover:text-white/80 transition-colors">Formations</Link>
              <ChevronRight className="size-3" />
              <span className="text-white/80">Paiement</span>
            </nav>

            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white/10">
                <CreditCard className="size-6 text-[#FFC000]" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-white sm:text-3xl">Finaliser votre inscription</h1>
                <p className="mt-1 text-sm text-white/60">Récapitulatif et paiement sécurisé via FedaPay</p>
              </div>
            </div>
          </div>

          <svg viewBox="0 0 1440 40" className="w-full" preserveAspectRatio="none" style={{ display: 'block', marginBottom: -1 }}>
            <path fill="#f8f6ff" d="M0,40 C360,0 1080,0 1440,40 L1440,40 L0,40 Z" />
          </svg>
        </div>

        {/* Main */}
        <main className="mx-auto max-w-4xl px-4 pb-20 sm:px-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:-mt-4">

            {/* ── Récapitulatif (3/5) ── */}
            <div className="space-y-6 lg:col-span-3">

              {/* Erreur */}
              {error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800/40 dark:bg-red-950/30">
                  <AlertCircle className="size-5 shrink-0 text-red-500 mt-0.5" />
                  <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                </div>
              )}

              {/* Statut */}
              <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-xl shadow-purple-100/30 dark:border-gray-800 dark:bg-gray-900 dark:shadow-none">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Statut de l'inscription</span>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${ENROLLMENT_STATUS_COLORS[enrollment.status]}`}>
                    {enrollment.status_display}
                  </span>
                </div>

                <div className="mt-4 border-t border-gray-100 pt-4 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-[#9800BF]/10">
                      <BookOpen className="size-5 text-[#9800BF]" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Formation</div>
                      <div className="font-bold text-gray-900 dark:text-white">{enrollment.training_title}</div>
                    </div>
                  </div>
                </div>

                {enrollment.payment_attempts > 0 && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-400">
                    <RefreshCw className="size-3" />
                    {enrollment.payment_attempts} tentative(s) de paiement précédente(s)
                  </div>
                )}
              </div>

              {/* Infos personnelles */}
              <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-xl shadow-purple-100/30 dark:border-gray-800 dark:bg-gray-900 dark:shadow-none">
                <h3 className="mb-4 flex items-center gap-2 font-bold text-gray-900 dark:text-white">
                  <User className="size-4 text-[#9800BF]" />
                  Vos informations
                </h3>

                <div className="space-y-3">
                  <InfoRow icon={<User className="size-4 text-gray-400" />} label="Nom complet" value={enrollment.full_name} />
                  <InfoRow icon={<Mail className="size-4 text-gray-400" />} label="Email" value={enrollment.email} />
                  <InfoRow icon={<Phone className="size-4 text-gray-400" />} label="Téléphone" value={enrollment.phone} />
                  <InfoRow
                    icon={<GraduationCap className="size-4 text-gray-400" />}
                    label="Niveau d'études"
                    value={`${enrollment.education_level_display}${enrollment.education_level_other ? ` (${enrollment.education_level_other})` : ''}`}
                  />
                </div>
              </div>

            </div>

            {/* ── Paiement (2/5) ── */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 space-y-4">

                {/* Montant */}
                <div className="rounded-2xl border border-purple-100 bg-white shadow-xl shadow-purple-100/30 dark:border-gray-800 dark:bg-gray-900 dark:shadow-none overflow-hidden">
                  <div
                    className="p-6 text-white"
                    style={{ background: 'linear-gradient(135deg, #1a0033 0%, #9800BF 100%)' }}
                  >
                    <div className="text-xs font-semibold uppercase tracking-widest text-white/60">
                      Montant à payer
                    </div>
                    <div className="mt-1 text-4xl font-extrabold">
                      {formattedAmount}
                    </div>
                    <div className="text-sm font-semibold text-[#FFC000]">
                      {enrollment.currency}
                    </div>
                  </div>

                  <div className="p-6">
                    {/* CTA paiement */}
                    {isExpired ? (
                      <div className="rounded-xl bg-orange-50 p-4 text-center dark:bg-orange-950/30">
                        <Clock className="mx-auto mb-2 size-8 text-orange-400" />
                        <p className="text-sm font-semibold text-orange-700 dark:text-orange-400">Inscription expirée</p>
                        <p className="mt-1 text-xs text-orange-600 dark:text-orange-500">Veuillez créer une nouvelle inscription.</p>
                        <button
                          onClick={() => navigate('/trainings')}
                          className="mt-3 text-sm font-medium text-[#9800BF] hover:text-[#7a0099] transition-colors"
                        >
                          Voir les formations →
                        </button>
                      </div>
                    ) : enrollment.status === 'PROCESSING' ? (
                      <div className="rounded-xl bg-blue-50 p-4 text-center dark:bg-blue-950/30">
                        <Loader2 className="mx-auto mb-2 size-8 animate-spin text-blue-400" />
                        <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">Paiement en cours...</p>
                        <p className="mt-1 text-xs text-blue-600 dark:text-blue-500">Finalisez le paiement sur FedaPay.</p>
                      </div>
                    ) : enrollment.status === 'PAID' ? (
                      <div className="rounded-xl bg-green-50 p-4 text-center dark:bg-green-950/30">
                        <CheckCircle2 className="mx-auto mb-2 size-8 text-green-500" />
                        <p className="text-sm font-semibold text-green-700 dark:text-green-400">Paiement effectué !</p>
                      </div>
                    ) : (
                      <button
                        onClick={enrollment.status === 'FAILED' ? handleRetryPayment : handlePayment}
                        disabled={isProcessing || !canPay}
                        className="w-full rounded-xl bg-[#9800BF] px-6 py-4 font-bold text-white shadow-lg shadow-purple-500/30 transition-all hover:bg-[#7a0099] hover:shadow-purple-500/50 disabled:cursor-not-allowed disabled:opacity-50 active:scale-95"
                      >
                        {isProcessing ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 className="size-5 animate-spin" />
                            Redirection vers FedaPay...
                          </span>
                        ) : enrollment.status === 'FAILED' ? (
                          <span className="flex items-center justify-center gap-2">
                            <RefreshCw className="size-5" />
                            Réessayer le paiement
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <CreditCard className="size-5" />
                            Payer maintenant
                          </span>
                        )}
                      </button>
                    )}

                    <button
                      onClick={() => navigate('/')}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-6 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                    >
                      <Home className="size-4" />
                      Retour à l'accueil
                    </button>
                  </div>
                </div>

                {/* Sécurité */}
                <div className="rounded-2xl border border-green-100 bg-green-50 p-4 dark:border-green-900/30 dark:bg-green-950/20">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="size-5 shrink-0 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <div className="text-sm font-semibold text-green-800 dark:text-green-300">
                        Paiement 100% sécurisé
                      </div>
                      <div className="mt-0.5 text-xs text-green-700 dark:text-green-400">
                        Protégé par FedaPay — leader du paiement en ligne en Afrique de l'Ouest.
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </main>

        <PublicFooter />
        <WhatsAppButton />
      </div>
    </>
  );
}

// Helper component
function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg bg-gray-50 px-3 py-2.5 dark:bg-gray-800/50">
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 shrink-0">
        {icon}
        {label}
      </div>
      <span className="text-sm font-medium text-gray-900 dark:text-white text-right">{value}</span>
    </div>
  );
}
