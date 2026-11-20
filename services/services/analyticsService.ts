import { getSupabase } from './supabase';
import { Business } from '../types';

export type ClickEventType =
  | 'detail_view'
  | 'promotion_click'
  | 'detail_reserve_click'
  | 'arkaiko_reserve_click';

interface CachedBusinessRef {
  id: string;
  name: string;
  slug?: string | null;
}

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const isValidUuid = (value?: string | null): value is string => {
  return typeof value === 'string' && UUID_REGEX.test(value.trim());
};

const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

let businessRefCache: CachedBusinessRef[] | null = null;
let cacheLoadedAt = 0;
let inflightLoad: Promise<CachedBusinessRef[]> | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000;

const loadSupabaseBusinessRefs = async (): Promise<CachedBusinessRef[]> => {
  const now = Date.now();
  if (businessRefCache && now - cacheLoadedAt < CACHE_TTL_MS) {
    return businessRefCache;
  }
  if (inflightLoad) {
    return inflightLoad;
  }

  const supabase = getSupabase();
  if (!supabase) return [];

  inflightLoad = (async () => {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('id, name, slug');

      if (error || !Array.isArray(data)) {
        return businessRefCache || [];
      }

      businessRefCache = data as CachedBusinessRef[];
      cacheLoadedAt = Date.now();
      return businessRefCache;
    } catch {
      return businessRefCache || [];
    } finally {
      inflightLoad = null;
    }
  })();

  return inflightLoad;
};

/**
 * Resuelve el UUID real del negocio en la tabla `businesses` de Supabase.
 * Si el negocio ya posee un UUID válido en `business.id`, lo devuelve directamente.
 */
export const resolveBusinessUuid = async (
  business: Pick<Business, 'id' | 'name'> & { slug?: string }
): Promise<string | null> => {
  if (isValidUuid(business.id)) {
    return business.id;
  }

  const supabase = getSupabase();
  if (!supabase) return null;

  const refs = await loadSupabaseBusinessRefs();
  const targetSlug = business.slug || business.id;
  const normalizedTargetName = normalizeText(business.name);

  if (refs.length > 0) {
    // 1. Coincidencia exacta por slug
    const bySlug = refs.find(
      (r) => r.slug && targetSlug && r.slug.toLowerCase() === targetSlug.toLowerCase()
    );
    if (bySlug && isValidUuid(bySlug.id)) return bySlug.id;

    // 2. Coincidencia exacta por nombre normalizado
    const byExactName = refs.find(
      (r) => r.name && normalizeText(r.name) === normalizedTargetName
    );
    if (byExactName && isValidUuid(byExactName.id)) return byExactName.id;

    // 3. Coincidencia parcial por nombre normalizado (ej. "Cumbre - Mirador Rataquenua" vs "Cumbre")
    const byPartialName = refs.find((r) => {
      if (!r.name) return false;
      const normRef = normalizeText(r.name);
      return (
        normRef.length >= 4 &&
        (normalizedTargetName.includes(normRef) || normRef.includes(normalizedTargetName))
      );
    });
    if (byPartialName && isValidUuid(byPartialName.id)) return byPartialName.id;
  }

  // Fallback directo si la caché aún no tenía ese registro
  try {
    const cleanName = business.name.split('-')[0].trim();
    if (cleanName.length >= 3) {
      const { data } = await supabase
        .from('businesses')
        .select('id')
        .ilike('name', `%${cleanName}%`)
        .limit(1)
        .maybeSingle();

      if (data && isValidUuid(data.id)) {
        return data.id;
      }
    }
  } catch {
    // Ignorar errores silenciosamente para no afectar la UX
  }

  return null;
};

/**
 * Registra una interacción en la tabla `clicks_log` de Supabase.
 */
export const logBusinessClick = async (params: {
  business: Pick<Business, 'id' | 'name'> & { slug?: string };
  eventType: ClickEventType;
  label: string;
}): Promise<void> => {
  const supabase = getSupabase();
  if (!supabase) return;

  try {
    const businessUuid = await resolveBusinessUuid(params.business);
    await supabase.from('clicks_log').insert({
      business_id: businessUuid,
      business_name: params.label,
      event_type: params.eventType,
    });
  } catch (err) {
    console.warn('Error registrando evento en clicks_log:', err);
  }
};

export interface IssueVoucherParams {
  business: Pick<Business, 'id' | 'name'> & { slug?: string };
  couponCode: string;
  couponTitle?: string;
  customerWhatsapp?: string;
  customerEmail?: string;
}

export interface IssuedVoucherResult {
  success: boolean;
  voucherCode: string;
  businessId: string | null;
  error?: string;
}

const generateVoucherCode = (prefixSource: string): string => {
  const cleanPrefix = prefixSource
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 6);
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return cleanPrefix ? `${cleanPrefix}-${randomDigits}` : `HX-${randomDigits}`;
};

/**
 * Emite un voucher en la tabla `vouchers_issued` enviando el `business_id` (UUID) real del negocio.
 */
export const issueBusinessVoucher = async (
  params: IssueVoucherParams
): Promise<IssuedVoucherResult> => {
  const voucherCode = generateVoucherCode(params.couponCode || 'HX');
  const supabase = getSupabase();

  if (!supabase) {
    return {
      success: false,
      voucherCode,
      businessId: null,
      error: 'Supabase no está configurado.',
    };
  }

  try {
    const businessUuid = await resolveBusinessUuid(params.business);

    const { error } = await supabase.from('vouchers_issued').insert({
      business_id: businessUuid,
      business_name: params.business.name,
      voucher_code: voucherCode,
      status: 'issued',
      customer_whatsapp: params.customerWhatsapp?.trim() || null,
      customer_email: params.customerEmail?.trim() || null,
      mensaje_enviado: params.couponTitle
        ? `Cupón ${params.couponCode}: ${params.couponTitle}`
        : `Cupón ${params.couponCode}`,
    });

    if (error) {
      return {
        success: false,
        voucherCode,
        businessId: businessUuid,
        error: error.message,
      };
    }

    return {
      success: true,
      voucherCode,
      businessId: businessUuid,
    };
  } catch (err: any) {
    return {
      success: false,
      voucherCode,
      businessId: null,
      error: err?.message || 'Error al emitir el voucher.',
    };
  }
};
