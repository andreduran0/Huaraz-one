import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getSupabase } from '../services/supabase';

type PeriodKey = '7d' | '30d' | 'month';
type VoucherFilter = 'all' | 'issued' | 'redeemed';

interface MerchantBusiness {
  id: string;
  name: string;
  category: string | null;
  city: string | null;
  location: string | null;
  slug: string | null;
  is_sponsored: boolean | null;
}

interface ClickLogRow {
  id: string;
  business_id: string | null;
  business_name: string | null;
  event_type: string | null;
  created_at: string;
}

interface VoucherIssuedRow {
  id: string;
  business_id: string | null;
  business_name: string | null;
  voucher_code: string | null;
  status: string | null;
  created_at: string;
  customer_whatsapp: string | null;
  customer_email: string | null;
  mensaje_enviado: string | null;
}

const PERIOD_OPTIONS: { key: PeriodKey; label: string; contextLabel: string }[] = [
  { key: '7d', label: 'Últimos 7 días', contextLabel: 'de los últimos 7 días' },
  { key: '30d', label: 'Últimos 30 días', contextLabel: 'de los últimos 30 días' },
  { key: 'month', label: 'Este mes', contextLabel: 'de este mes' },
];

const getPeriodStartIso = (period: PeriodKey): string => {
  const now = new Date();
  if (period === '7d') {
    return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  }
  if (period === '30d') {
    return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
  }
  return new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0).toISOString();
};

const formatSoles = (amount: number): string => {
  return new Intl.NumberFormat('es-PE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatRelativeTime = (isoDate: string): string => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return 'Reciente';
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Hace un momento';
  if (diffMin < 60) return `Hace ${diffMin} min`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `Hace ${diffHours} h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `Hace ${diffDays} días`;
  return date.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' });
};

const formatDateTime = (isoDate: string): string => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('es-PE', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const maskContact = (whatsapp?: string | null, email?: string | null): string | null => {
  if (whatsapp && whatsapp.trim().length > 4) {
    const clean = whatsapp.trim();
    return `WhatsApp •••${clean.slice(-4)}`;
  }
  if (email && email.includes('@')) {
    const [local, domain] = email.split('@');
    return `${local.slice(0, 2)}•••@${domain}`;
  }
  return null;
};

const getDefaultTicketForCategory = (category?: string | null): number => {
  const cat = (category || '').toLowerCase();
  if (cat.includes('hotel') || cat.includes('hosped')) return 180;
  if (cat.includes('tour') || cat.includes('agencia')) return 120;
  if (cat.includes('restaur') || cat.includes('poller') || cat.includes('cevich')) return 65;
  return 100;
};

const describeClickEvent = (
  row: ClickLogRow
): { description: string; channelLabel: string; channelType: 'ai' | 'direct' | 'promo' } => {
  const nameText = row.business_name || '';
  const lowerName = nameText.toLowerCase();
  const eventType = row.event_type || '';

  if (eventType === 'arkaiko_reserve_click' || lowerName.startsWith('arkaiko')) {
    return {
      description: 'Un turista pidió recomendación en Arkáiko y pulsó Reservar',
      channelLabel: 'Guía IA Arkáiko',
      channelType: 'ai',
    };
  }
  if (eventType === 'promotion_click' || lowerName.startsWith('promo')) {
    return {
      description: 'Visitante tocó tu promoción o generó un cupón de descuento',
      channelLabel: 'Promoción / Cupón',
      channelType: 'promo',
    };
  }
  if (lowerName.startsWith('whatsapp')) {
    return {
      description: 'Un cliente tocó el botón directo de WhatsApp en tu perfil',
      channelLabel: 'WhatsApp directo',
      channelType: 'direct',
    };
  }
  if (lowerName.startsWith('telefono')) {
    return {
      description: 'Un cliente tocó el botón de llamada telefónica directa',
      channelLabel: 'Llamada directa',
      channelType: 'direct',
    };
  }
  if (eventType === 'detail_reserve_click') {
    return {
      description: nameText.includes('Voucher:')
        ? `Reserva iniciada desde ficha (${nameText.split('Voucher:')[1]?.trim() || 'Voucher'})`
        : 'Cliente pulsó Reservar desde tu ficha del directorio',
      channelLabel: 'Ficha directa',
      channelType: 'direct',
    };
  }
  return {
    description: 'Un turista abrió la ficha completa de tu negocio',
    channelLabel: 'Visita al perfil',
    channelType: 'direct',
  };
};

export const MerchantMetricsDashboard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlPin = searchParams.get('pin');

  const [pinInput, setPinInput] = useState(urlPin || '');
  const [showPin, setShowPin] = useState(false);
  const [authLoading, setAuthLoading] = useState(Boolean(urlPin));
  const [authError, setAuthError] = useState<string | null>(null);
  const [business, setBusiness] = useState<MerchantBusiness | null>(null);

  const [period, setPeriod] = useState<PeriodKey>('30d');
  const [avgTicket, setAvgTicket] = useState<number>(150);

  const [clicks, setClicks] = useState<ClickLogRow[]>([]);
  const [vouchers, setVouchers] = useState<VoucherIssuedRow[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);

  const [voucherSearch, setVoucherSearch] = useState('');
  const [voucherFilter, setVoucherFilter] = useState<VoucherFilter>('all');
  const [redeemingId, setRedeemingId] = useState<string | null>(null);
  const [actionBanner, setActionBanner] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const authenticateWithPin = useCallback(async (rawPin: string) => {
    const cleanPin = rawPin.trim();
    if (!cleanPin) {
      setAuthError('Ingresa el PIN de acceso de tu negocio.');
      setAuthLoading(false);
      return;
    }

    const supabase = getSupabase();
    if (!supabase) {
      setAuthError('No se pudo conectar con la base de datos en este momento.');
      setAuthLoading(false);
      return;
    }

    setAuthLoading(true);
    setAuthError(null);

    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('id, name, category, city, location, slug, is_sponsored')
        .eq('access_pin', cleanPin)
        .limit(1)
        .maybeSingle();

      if (error) {
        setAuthError('Ocurrió un error al verificar el PIN. Inténtalo nuevamente.');
        setBusiness(null);
      } else if (!data) {
        setAuthError('PIN incorrecto o negocio no encontrado.');
        setBusiness(null);
      } else {
        const matched = data as MerchantBusiness;
        setBusiness(matched);
        setAvgTicket(getDefaultTicketForCategory(matched.category));
      }
    } catch {
      setAuthError('Error de conexión al verificar el PIN.');
      setBusiness(null);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    if (urlPin && !business) {
      setPinInput(urlPin);
      void authenticateWithPin(urlPin);
    }
  }, [urlPin, business, authenticateWithPin]);

  const fetchMerchantData = useCallback(async (businessId: string, selectedPeriod: PeriodKey) => {
    const supabase = getSupabase();
    if (!supabase) {
      setDataError('Conexión con Supabase no disponible.');
      return;
    }

    setDataLoading(true);
    setDataError(null);
    const periodStartIso = getPeriodStartIso(selectedPeriod);

    try {
      const [clicksResponse, vouchersResponse] = await Promise.all([
        supabase
          .from('clicks_log')
          .select('id, business_id, business_name, event_type, created_at')
          .eq('business_id', businessId)
          .gte('created_at', periodStartIso)
          .order('created_at', { ascending: false }),
        supabase
          .from('vouchers_issued')
          .select(
            'id, business_id, business_name, voucher_code, status, created_at, customer_whatsapp, customer_email, mensaje_enviado'
          )
          .eq('business_id', businessId)
          .order('created_at', { ascending: false }),
      ]);

      if (clicksResponse.error) {
        throw new Error(clicksResponse.error.message);
      }
      if (vouchersResponse.error) {
        throw new Error(vouchersResponse.error.message);
      }

      setClicks((clicksResponse.data || []) as ClickLogRow[]);
      setVouchers((vouchersResponse.data || []) as VoucherIssuedRow[]);
    } catch (err: any) {
      setDataError(err?.message || 'No pudimos cargar las métricas actualizadas.');
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    if (business?.id) {
      void fetchMerchantData(business.id, period);
    }
  }, [business?.id, period, fetchMerchantData]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void authenticateWithPin(pinInput);
  };

  const handleLogout = () => {
    setBusiness(null);
    setClicks([]);
    setVouchers([]);
    setPinInput('');
    setAuthError(null);
    if (searchParams.has('pin')) {
      const next = new URLSearchParams(searchParams);
      next.delete('pin');
      setSearchParams(next, { replace: true });
    }
  };

  const handleRedeemVoucher = async (voucher: VoucherIssuedRow) => {
    if (!business?.id || voucher.status === 'redeemed') return;
    const supabase = getSupabase();
    if (!supabase) return;

    setRedeemingId(voucher.id);
    setActionBanner(null);

    try {
      const { error } = await supabase
        .from('vouchers_issued')
        .update({ status: 'redeemed' })
        .eq('id', voucher.id)
        .eq('business_id', business.id);

      if (error) {
        setActionBanner({
          type: 'error',
          text: `No se pudo validar el voucher ${voucher.voucher_code || ''}: ${error.message}`,
        });
      } else {
        setVouchers((prev) =>
          prev.map((v) => (v.id === voucher.id ? { ...v, status: 'redeemed' } : v))
        );
        setActionBanner({
          type: 'success',
          text: `Voucher ${voucher.voucher_code || ''} marcado como canjeado en caja.`,
        });
      }
    } catch {
      setActionBanner({
        type: 'error',
        text: 'Error de red al validar el voucher. Intenta nuevamente.',
      });
    } finally {
      setRedeemingId(null);
    }
  };

  const metrics = useMemo(() => {
    let detail_view = 0;
    let promotion_click = 0;
    let detail_reserve_click = 0;
    let arkaiko_reserve_click = 0;

    for (const row of clicks) {
      switch (row.event_type) {
        case 'detail_view':
          detail_view += 1;
          break;
        case 'promotion_click':
          promotion_click += 1;
          break;
        case 'detail_reserve_click':
          detail_reserve_click += 1;
          break;
        case 'arkaiko_reserve_click':
          arkaiko_reserve_click += 1;
          break;
        default:
          break;
      }
    }

    return {
      detail_view,
      promotion_click,
      detail_reserve_click,
      arkaiko_reserve_click,
    };
  }, [clicks]);

  const voucherCounts = useMemo(() => {
    let issued = 0;
    let redeemed = 0;
    for (const v of vouchers) {
      if (v.status === 'redeemed') {
        redeemed += 1;
      } else {
        issued += 1;
      }
    }
    return { issued, redeemed, total: vouchers.length };
  }, [vouchers]);

  const filteredVouchers = useMemo(() => {
    const q = voucherSearch.trim().toLowerCase();
    return vouchers.filter((v) => {
      const statusMatch =
        voucherFilter === 'all' ||
        (voucherFilter === 'redeemed' ? v.status === 'redeemed' : v.status !== 'redeemed');
      if (!statusMatch) return false;
      if (!q) return true;
      return (
        (v.voucher_code || '').toLowerCase().includes(q) ||
        (v.customer_whatsapp || '').toLowerCase().includes(q) ||
        (v.mensaje_enviado || '').toLowerCase().includes(q)
      );
    });
  }, [vouchers, voucherSearch, voucherFilter]);

  const periodMeta = PERIOD_OPTIONS.find((p) => p.key === period) || PERIOD_OPTIONS[1];
  const totalReservationIntents = metrics.detail_reserve_click + metrics.arkaiko_reserve_click;
  const estimatedReturn = totalReservationIntents * avgTicket;
  const midFunnelInterested = metrics.promotion_click + metrics.arkaiko_reserve_click;

  const conversionRate = useMemo(() => {
    if (metrics.detail_view === 0) return '0.0';
    return ((totalReservationIntents / metrics.detail_view) * 100).toFixed(1);
  }, [totalReservationIntents, metrics.detail_view]);

  const channels = useMemo(() => {
    const raw = [
      {
        id: 'detail_reserve_click',
        label: 'Directorio / Ficha directa',
        sublabel: 'Clics en WhatsApp, teléfono y reserva desde tu perfil',
        value: metrics.detail_reserve_click,
        unit: 'clics',
        barClass: 'bg-emerald-600',
        valueClass: 'text-emerald-700',
      },
      {
        id: 'arkaiko_reserve_click',
        label: 'Recomendación del Guía IA Arkáiko',
        sublabel: 'Turistas atendidos por el asistente que eligieron tu local',
        value: metrics.arkaiko_reserve_click,
        unit: 'reservas',
        barClass: 'bg-indigo-600',
        valueClass: 'text-indigo-700',
      },
      {
        id: 'promotion_click',
        label: 'Promociones y Vouchers',
        sublabel: 'Personas que tocaron tus ofertas y cupones',
        value: metrics.promotion_click,
        unit: 'clics',
        barClass: 'bg-slate-800',
        valueClass: 'text-slate-900',
      },
      {
        id: 'vouchers_redeemed',
        label: 'Vouchers canjeados en caja',
        sublabel: 'Cupones validados físicamente en tu negocio',
        value: voucherCounts.redeemed,
        unit: 'canjes',
        barClass: 'bg-emerald-500',
        valueClass: 'text-emerald-700',
      },
    ];

    const maxVal = Math.max(...raw.map((c) => c.value), 1);
    const totalVal = raw.reduce((acc, c) => acc + c.value, 0) || 1;

    return raw.map((c) => ({
      ...c,
      barPercent: c.value === 0 ? 0 : Math.max(Math.round((c.value / maxVal) * 100), 4),
      sharePercent: totalVal === 1 && raw.every((r) => r.value === 0) ? 0 : Math.round((c.value / totalVal) * 100),
    }));
  }, [metrics, voucherCounts.redeemed]);

  const topReservationChannel =
    metrics.detail_reserve_click === 0 && metrics.arkaiko_reserve_click === 0
      ? 'Sin reservas registradas aún'
      : metrics.detail_reserve_click >= metrics.arkaiko_reserve_click
      ? 'Directorio / Ficha directa'
      : 'Guía IA Arkáiko';

  const recentActivities = useMemo(() => {
    return clicks.slice(0, 5).map((row) => {
      const info = describeClickEvent(row);
      return {
        id: row.id,
        timeAgo: formatRelativeTime(row.created_at),
        ...info,
      };
    });
  }, [clicks]);

  const handleTicketChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/[^0-9]/g, '');
    const numeric = cleaned === '' ? 0 : Math.min(Number(cleaned), 99999);
    setAvgTicket(numeric);
  };

  // PANTALLA DE ACCESO PRIVADO POR PIN
  if (!business) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 font-['Plus_Jakarta_Sans'] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="space-y-2 text-center">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-lock text-lg" aria-hidden="true"></i>
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                Huaraz Explorer · Socios
              </p>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                Acceso Privado al Panel
              </h1>
              <p className="text-sm text-slate-500">
                Ingresa el PIN de tu negocio para ver tus visitas, reservas reales y validar vouchers en caja.
              </p>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="merchant-pin" className="block text-xs font-bold text-slate-700">
                  PIN de acceso
                </label>
                <div className="relative">
                  <input
                    id="merchant-pin"
                    type={showPin ? 'text' : 'password'}
                    value={pinInput}
                    onChange={(e) => {
                      setPinInput(e.target.value);
                      if (authError) setAuthError(null);
                    }}
                    placeholder="Ingresa tu código PIN"
                    autoComplete="one-time-code"
                    disabled={authLoading}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-slate-900 focus:bg-white rounded-xl px-4 py-3 pr-11 text-base font-bold tracking-widest text-slate-900 outline-none transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                    aria-label={showPin ? 'Ocultar PIN' : 'Mostrar PIN'}
                  >
                    <i className={`fas ${showPin ? 'fa-eye-slash' : 'fa-eye'} text-sm`}></i>
                  </button>
                </div>
              </div>

              {authError && (
                <div
                  role="alert"
                  className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl px-4 py-3 flex items-center gap-2.5"
                >
                  <i className="fas fa-circle-exclamation shrink-0" aria-hidden="true"></i>
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white font-bold text-sm py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {authLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin" aria-hidden="true"></i>
                    <span>Verificando acceso...</span>
                  </>
                ) : (
                  <>
                    <span>Ver métricas de mi negocio</span>
                    <i className="fas fa-arrow-right text-xs" aria-hidden="true"></i>
                  </>
                )}
              </button>
            </form>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <Link to="/" className="hover:text-slate-900 font-medium flex items-center gap-1.5">
                <i className="fas fa-arrow-left text-[11px]" aria-hidden="true"></i>
                <span>Volver al inicio</span>
              </Link>
              <span>Soporte para afiliados</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-['Plus_Jakarta_Sans'] pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6">
        {/* Barra superior */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
            <Link
              to="/"
              className="hover:text-slate-900 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <i className="fas fa-arrow-left text-[11px]" aria-hidden="true"></i>
              <span>Huaraz Explorer</span>
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-slate-800 font-semibold whitespace-nowrap">Panel Privado de Socios</span>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => void fetchMerchantData(business.id, period)}
              disabled={dataLoading}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-semibold text-slate-700 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <i className={`fas fa-rotate-right text-[11px] ${dataLoading ? 'fa-spin' : ''}`} aria-hidden="true"></i>
              <span>Actualizar</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:border-red-200 hover:text-red-700 rounded-lg text-xs font-semibold text-slate-600 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <i className="fas fa-right-from-bracket text-[11px]" aria-hidden="true"></i>
              <span>Cerrar acceso</span>
            </button>
          </div>
        </div>

        {dataError && (
          <div
            role="alert"
            className="bg-red-50 border border-red-200 text-red-700 text-sm font-medium rounded-xl px-4 py-3 flex items-center justify-between gap-4"
          >
            <span>{dataError}</span>
            <button
              type="button"
              onClick={() => void fetchMerchantData(business.id, period)}
              className="text-xs font-bold underline shrink-0"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* 1. ENCABEZADO DEL NEGOCIO Y RESUMEN EJECUTIVO */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-medium text-slate-500">
                <span>{business.category || 'Comercio Afiliado'}</span>
                <span aria-hidden="true">·</span>
                <span>{business.city || business.location || 'Huaraz'}</span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold">
                  <i className="fas fa-circle-check text-[11px]" aria-hidden="true"></i>
                  {business.is_sponsored ? 'Socio Activo' : 'Perfil Activo'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 text-balance">
                {business.name}
              </h1>
              <p className="text-sm text-slate-600 max-w-2xl">
                Métricas reales de los turistas y clientes que interactuaron con tu negocio en Huaraz Explorer y Arkáiko.
              </p>
            </div>

            {/* Selector de Periodo */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl self-start shrink-0">
              {PERIOD_OPTIONS.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setPeriod(option.key)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    period === option.key
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tarjeta destacada: Retorno Estimado */}
          <div className="pt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-2">
              <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                Retorno estimado ({periodMeta.contextLabel})
              </p>
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 tabular-nums">
                  S/ {formatSoles(estimatedReturn)}
                </span>
                <span className="text-sm font-semibold text-emerald-700 tabular-nums">
                  en ventas potenciales
                </span>
              </div>
              <p className="text-sm text-slate-600">
                Calculado con{' '}
                <strong className="font-bold text-slate-900 tabular-nums">
                  {totalReservationIntents} intenciones de reserva
                </strong>{' '}
                ({metrics.detail_reserve_click} desde tu ficha + {metrics.arkaiko_reserve_click} recomendadas por Arkáiko)
                multiplicadas por tu consumo promedio.
              </p>
            </div>

            <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <label
                  htmlFor="avg-ticket-input"
                  className="block text-xs font-bold text-slate-800"
                >
                  Tu ticket promedio (S/)
                </label>
                <p className="text-xs text-slate-500">Ajusta el monto promedio por cliente o reserva</p>
              </div>
              <div className="flex items-center bg-white border border-slate-300 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/15 rounded-lg px-3 py-2 w-full sm:w-36 shrink-0">
                <span className="text-sm font-bold text-slate-400 mr-1.5 select-none">S/</span>
                <input
                  id="avg-ticket-input"
                  type="text"
                  inputMode="numeric"
                  value={avgTicket === 0 ? '' : avgTicket}
                  onChange={handleTicketChange}
                  placeholder="0"
                  className="w-full text-right font-bold text-slate-900 text-base tabular-nums bg-transparent outline-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 2. LOS 4 CONVERTIDORES PRINCIPALES (Tarjetas KPI reales de clicks_log) */}
        <section aria-label="Indicadores principales" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1: Visitas a tu ficha (detail_view) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-500">Visitas a tu ficha</span>
              <i className="fas fa-eye text-slate-400 text-sm" aria-hidden="true"></i>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums">
                {dataLoading ? '—' : metrics.detail_view}{' '}
                <span className="text-base font-semibold text-slate-500">vistas</span>
              </p>
              <p className="text-xs font-medium text-slate-500 mt-1">
                {periodMeta.label}
              </p>
            </div>
            <p className="text-xs text-slate-500 pt-3 border-t border-slate-100">
              Turistas y locales que abrieron tu perfil
            </p>
          </div>

          {/* KPI 2: Clics en promociones/cupones (promotion_click) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-500">Clics en promociones</span>
              <i className="fas fa-ticket text-emerald-600 text-sm" aria-hidden="true"></i>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums">
                {dataLoading ? '—' : metrics.promotion_click}{' '}
                <span className="text-base font-semibold text-slate-500">clics</span>
              </p>
              <p className="text-xs font-medium text-slate-500 mt-1">
                Ofertas y cupones tocados
              </p>
            </div>
            <p className="text-xs text-slate-500 pt-3 border-t border-slate-100">
              Personas interesadas en tus ofertas y vouchers
            </p>
          </div>

          {/* KPI 3: Reservas desde tu ficha (detail_reserve_click) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-500">Reservas desde tu ficha</span>
              <i className="fab fa-whatsapp text-emerald-600 text-base" aria-hidden="true"></i>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-emerald-700 tracking-tight tabular-nums">
                {dataLoading ? '—' : metrics.detail_reserve_click}{' '}
                <span className="text-base font-semibold text-emerald-700/80">clics</span>
              </p>
              <p className="text-xs font-semibold text-emerald-700 mt-1">
                WhatsApp, Teléfono y Reserva
              </p>
            </div>
            <p className="text-xs text-slate-500 pt-3 border-t border-slate-100">
              Clientes que dieron clic para contactarte directo
            </p>
          </div>

          {/* KPI 4: Reservas recomendadas por Arkáiko (arkaiko_reserve_click) */}
          <div className="bg-white border border-indigo-200 rounded-2xl p-5 flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-indigo-700">Recomendadas por Arkáiko</span>
              <i className="fas fa-robot text-indigo-600 text-sm" aria-hidden="true"></i>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-indigo-700 tracking-tight tabular-nums">
                {dataLoading ? '—' : metrics.arkaiko_reserve_click}{' '}
                <span className="text-base font-semibold text-indigo-600/80">reservas</span>
              </p>
              <p className="text-xs font-semibold text-indigo-600 mt-1">
                Desde el Chat IA de Huaraz Explorer
              </p>
            </div>
            <p className="text-xs text-slate-500 pt-3 border-t border-slate-100">
              Turistas que pidieron recomendación al guía IA y eligieron tu local
            </p>
          </div>
        </section>

        {/* 3. COMPARATIVA DE CANALES + 4. EMBUDO DE INTERÉS */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Comparativa de Canales de Conversión */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">¿De dónde vienen tus clientes?</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Comparativa de canales registrados en {periodMeta.label.toLowerCase()}
                </p>
              </div>
              <span className="text-xs font-semibold text-emerald-700 whitespace-nowrap">
                Canal líder: {topReservationChannel}
              </span>
            </div>

            <div className="space-y-5">
              {channels.map((channel) => (
                <div key={channel.id} className="space-y-2">
                  <div className="flex items-baseline justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{channel.label}</p>
                      <p className="text-xs text-slate-500">{channel.sublabel}</p>
                    </div>
                    <div className="text-right shrink-0 tabular-nums">
                      <span className={`text-sm font-extrabold ${channel.valueClass}`}>
                        {channel.value} {channel.unit}
                      </span>
                      <span className="text-xs text-slate-400 ml-2">({channel.sharePercent}%)</span>
                    </div>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${channel.barClass}`}
                      style={{ width: `${channel.barPercent}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Embudo de Interés Simple */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-6">
            <div className="pb-4 border-b border-slate-100 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">De visita a cliente</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Avance real hacia contacto o reserva
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-slate-500">Conversión</p>
                <p className="text-xl font-extrabold text-emerald-700 tabular-nums">{conversionRate}%</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-700">1. Abrieron tu ficha</span>
                  <span className="font-extrabold text-slate-900 tabular-nums">{metrics.detail_view}</span>
                </div>
                <div className="w-full h-8 bg-slate-100 rounded-lg overflow-hidden flex items-center">
                  <div
                    className="h-full bg-slate-700 rounded-lg transition-all duration-300"
                    style={{ width: metrics.detail_view > 0 ? '100%' : '0%' }}
                  ></div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-700">2. Vieron promo o hablaron con Arkáiko</span>
                  <span className="font-extrabold text-indigo-700 tabular-nums">{midFunnelInterested}</span>
                </div>
                <div className="w-full h-8 bg-slate-100 rounded-lg overflow-hidden flex items-center">
                  <div
                    className="h-full bg-indigo-600 rounded-lg transition-all duration-300"
                    style={{
                      width: `${
                        midFunnelInterested === 0
                          ? 0
                          : Math.max(
                              Math.min(
                                Math.round(
                                  (midFunnelInterested / Math.max(metrics.detail_view, midFunnelInterested, 1)) * 100
                                ),
                                100
                              ),
                              8
                            )
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-700">3. Pulsaron Reservar / WhatsApp</span>
                  <span className="font-extrabold text-emerald-700 tabular-nums">{totalReservationIntents}</span>
                </div>
                <div className="w-full h-8 bg-slate-100 rounded-lg overflow-hidden flex items-center">
                  <div
                    className="h-full bg-emerald-600 rounded-lg transition-all duration-300"
                    style={{
                      width: `${
                        totalReservationIntents === 0
                          ? 0
                          : Math.max(
                              Math.min(
                                Math.round(
                                  (totalReservationIntents /
                                    Math.max(metrics.detail_view, totalReservationIntents, 1)) *
                                    100
                                ),
                                100
                              ),
                              8
                            )
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 pt-3 border-t border-slate-100">
              {metrics.detail_view > 0 ? (
                <>
                  Por cada 100 personas que ven tu perfil,{' '}
                  <strong className="text-slate-800 font-bold tabular-nums">
                    {Math.round(Number(conversionRate))}
                  </strong>{' '}
                  dan el paso para contactarte o reservar.
                </>
              ) : (
                'Aún no hay suficientes visitas en este periodo para calcular la proporción.'
              )}
            </p>
          </div>
        </section>

        {/* 5. VOUCHERS EMITIDOS Y VALIDACIÓN EN CAJA (vouchers_issued) */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Vouchers y Cupones en Caja</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Valida el código del cliente cuando lo presente en tu local para marcarlo como canjeado
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs tabular-nums">
              <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                <span className="text-slate-500">Emitidos (por canjear): </span>
                <strong className="text-amber-700 font-extrabold">{voucherCounts.issued}</strong>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                <span className="text-emerald-800">Canjeados: </span>
                <strong className="text-emerald-700 font-extrabold">{voucherCounts.redeemed}</strong>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                <span className="text-slate-500">Total: </span>
                <strong className="text-slate-900 font-extrabold">{voucherCounts.total}</strong>
              </div>
            </div>
          </div>

          {actionBanner && (
            <div
              role="status"
              className={`rounded-xl px-4 py-3 text-xs font-semibold border flex items-center justify-between gap-3 ${
                actionBanner.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}
            >
              <span>{actionBanner.text}</span>
              <button
                type="button"
                onClick={() => setActionBanner(null)}
                className="text-current opacity-70 hover:opacity-100"
                aria-label="Cerrar aviso"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          )}

          {/* Barra de búsqueda y filtro */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
              <input
                type="text"
                value={voucherSearch}
                onChange={(e) => setVoucherSearch(e.target.value)}
                placeholder="Buscar código de voucher (ej. HX-...)"
                className="w-full bg-slate-50 border border-slate-200 focus:border-slate-400 focus:bg-white rounded-xl pl-9 pr-4 py-2 text-sm font-medium text-slate-900 outline-none"
              />
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl self-start">
              {(
                [
                  { key: 'all', label: 'Todos' },
                  { key: 'issued', label: 'Por canjear' },
                  { key: 'redeemed', label: 'Canjeados' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setVoucherFilter(tab.key)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    voucherFilter === tab.key
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {filteredVouchers.length === 0 ? (
            <div className="py-10 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl">
              <p className="text-sm font-semibold text-slate-500">
                {vouchers.length === 0
                  ? 'Aún no se han emitido vouchers para este negocio.'
                  : 'Ningún voucher coincide con el filtro actual.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
              {filteredVouchers.map((voucher) => {
                const isRedeemed = voucher.status === 'redeemed';
                const contactLabel = maskContact(voucher.customer_whatsapp, voucher.customer_email);
                const isUpdating = redeemingId === voucher.id;

                return (
                  <div
                    key={voucher.id}
                    className="p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-mono text-sm font-extrabold text-slate-900 tracking-wide">
                          {voucher.voucher_code || 'SIN-CÓDIGO'}
                        </span>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                            isRedeemed
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {isRedeemed ? 'Canjeado' : 'Emitido · Por canjear'}
                        </span>
                        <span className="text-xs text-slate-400 tabular-nums">
                          {formatDateTime(voucher.created_at)}
                        </span>
                      </div>
                      {(voucher.mensaje_enviado || contactLabel) && (
                        <p className="text-xs text-slate-500 truncate">
                          {[voucher.mensaje_enviado, contactLabel].filter(Boolean).join(' · ')}
                        </p>
                      )}
                    </div>

                    <div className="shrink-0">
                      {isRedeemed ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                          <i className="fas fa-circle-check" aria-hidden="true"></i>
                          Validado en caja
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => void handleRedeemVoucher(voucher)}
                          disabled={isUpdating}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-bold rounded-lg transition-colors whitespace-nowrap"
                        >
                          {isUpdating ? 'Validando...' : 'Validar / Marcar canjeado'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* 6. ÚLTIMA ACTIVIDAD RECIENTE (Feed real desde clicks_log) */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Última actividad reciente</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Interacciones reales más recientes registradas en tu perfil ({periodMeta.label.toLowerCase()})
              </p>
            </div>
            <span className="text-xs font-medium text-slate-500">
              Mostrando {recentActivities.length} recientes
            </span>
          </div>

          {recentActivities.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm text-slate-500 font-medium">
                No hay interacciones registradas en {periodMeta.label.toLowerCase()}.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentActivities.map((item) => {
                const channelColor =
                  item.channelType === 'ai'
                    ? 'text-indigo-700'
                    : item.channelType === 'direct'
                    ? 'text-emerald-700'
                    : 'text-slate-700';

                return (
                  <li
                    key={item.id}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 min-w-0">
                      <span className="text-xs font-semibold text-slate-400 tabular-nums shrink-0 w-28">
                        {item.timeAgo}
                      </span>
                      <span className="text-sm text-slate-800 font-medium">{item.description}</span>
                    </div>
                    <span className={`text-xs font-semibold whitespace-nowrap shrink-0 ${channelColor}`}>
                      {item.channelLabel}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default MerchantMetricsDashboard;
