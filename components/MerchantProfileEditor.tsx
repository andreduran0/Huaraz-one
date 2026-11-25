import React, { useState, useEffect, useMemo } from 'react';
import { getSupabase } from '../services/supabase';
import { useAppContext } from '../context/AppContext';

export interface EditableMerchantBusiness {
  id: string;
  name: string;
  category: string | null;
  city: string | null;
  location: string | null;
  slug: string | null;
  is_sponsored: boolean | null;
  description: string | null;
  cultural_description: string | null;
  phone: string | null;
  whatsapp: string | null;
  whatsapp_number: string | null;
  default_message: string | null;
  website: string | null;
  opening_hours: string | null;
  logo_url: string | null;
  imagen_url: string | null;
  menu_url: string | null;
  catalog_type: string | null;
  gallery_urls: string[] | null;
}

interface MerchantProfileEditorProps {
  business: EditableMerchantBusiness;
  accessPin: string;
  onSaved: (updated: EditableMerchantBusiness) => void;
}

const cleanUrl = (val?: string | null): string => {
  if (!val) return '';
  const trimmed = String(val).trim();
  if (!trimmed || trimmed.toLowerCase() === 'null' || trimmed.toLowerCase() === 'undefined') {
    return '';
  }
  return trimmed;
};

export const MerchantProfileEditor: React.FC<MerchantProfileEditorProps> = ({
  business,
  accessPin,
  onSaved,
}) => {
  const { businesses } = useAppContext();

  // Busca el negocio equivalente en el catálogo local para rescatar sus fotos base si aún no están en Supabase
  const localCatalogMatch = useMemo(() => {
    const targetName = (business.name || '').trim().toLowerCase();
    return (
      businesses.find((b: any) => b.supabaseId === business.id || b.id === business.id) ||
      businesses.find((b) => (b.name || '').trim().toLowerCase() === targetName) ||
      null
    );
  }, [businesses, business.id, business.name]);

  // Fusiona las fotos guardadas en Supabase con las fotos base del catálogo local (sin duplicados y máx. 6)
 const initialGallery = useMemo(() => {
  const basePhotos = Array.isArray(localCatalogMatch?.photos)
    ? localCatalogMatch.photos.map(cleanUrl).filter(Boolean)
    : [];

  const dbGallery = Array.isArray(business.gallery_urls)
    ? business.gallery_urls.map(cleanUrl).filter(Boolean)
    : [];

  return Array.from(new Set([...basePhotos, ...dbGallery])).slice(0, 50);
}, [business.gallery_urls, localCatalogMatch]);

  const [description, setDescription] = useState(business.description || localCatalogMatch?.description || '');
  const [culturalDescription, setCulturalDescription] = useState(business.cultural_description || '');
  const [location, setLocation] = useState(business.location || localCatalogMatch?.address || '');
  const [phone, setPhone] = useState(business.phone || localCatalogMatch?.phone || '');
  const [whatsappNumber, setWhatsappNumber] = useState(
    business.whatsapp_number || business.whatsapp || localCatalogMatch?.whatsapp || ''
  );
  const [defaultMessage, setDefaultMessage] = useState(business.default_message || '');
  const [website, setWebsite] = useState(business.website || '');
  const [openingHours, setOpeningHours] = useState(business.opening_hours || '');

  const [logoUrl, setLogoUrl] = useState(business.logo_url || '');
  const [coverUrl, setCoverUrl] = useState(
    business.imagen_url || cleanUrl(localCatalogMatch?.photos?.[0]) || ''
  );
  const [menuUrl, setMenuUrl] = useState(business.menu_url || '');
  const [catalogType, setCatalogType] = useState(business.catalog_type || 'carta');
  const [galleryUrls, setGalleryUrls] = useState<string[]>(initialGallery);

  // Si AppContext termina de cargar después de montar el componente y aún no había fotos, las precarga
  useEffect(() => {
    if (galleryUrls.length === 0 && initialGallery.length > 0) {
      setGalleryUrls(initialGallery);
    }
  }, [initialGallery]);

  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const uploadAsset = async (file: File, folder: 'logo' | 'cover' | 'menu' | 'gallery'): Promise<string | null> => {
    const supabase = getSupabase();
    if (!supabase) {
      setBanner({ type: 'error', text: 'No hay conexión con Supabase Storage.' });
      return null;
    }

    if (file.size > 8 * 1024 * 1024) {
      setBanner({ type: 'error', text: 'El archivo supera el límite de 8 MB.' });
      return null;
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const filePath = `${business.id}/${folder}_${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from('business-assets')
      .upload(filePath, file, { upsert: true });

    if (error) {
      setBanner({ type: 'error', text: `Error al subir archivo: ${error.message}` });
      return null;
    }

    const { data } = supabase.storage.from('business-assets').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSingleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    folder: 'logo' | 'cover' | 'menu'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(folder);
    setBanner(null);

    const url = await uploadAsset(file, folder);
    if (url) {
      if (folder === 'logo') setLogoUrl(url);
      if (folder === 'cover') setCoverUrl(url);
      if (folder === 'menu') setMenuUrl(url);
      setBanner({
        type: 'success',
        text: 'Archivo subido correctamente. Presiona "Guardar cambios" al finalizar.',
      });
    }

    setUploadingField(null);
    e.target.value = '';
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remainingSlots = Math.max(0, 6 - galleryUrls.length);
    if (remainingSlots === 0) {
      setBanner({ type: 'error', text: 'Ya alcanzaste el máximo de 6 fotos en la galería.' });
      return;
    }

    setUploadingField('gallery');
    setBanner(null);

    const uploaded: string[] = [];
    for (const file of files.slice(0, remainingSlots)) {
      const url = await uploadAsset(file, 'gallery');
      if (url) uploaded.push(url);
    }

    if (uploaded.length > 0) {
      setGalleryUrls((prev) => Array.from(new Set([...prev, ...uploaded])).slice(0, 6));
      setBanner({
        type: 'success',
        text: `${uploaded.length} foto(s) agregada(s). Presiona "Guardar cambios" para publicar.`,
      });
    }

    setUploadingField(null);
    e.target.value = '';
  };

  const handleRemoveGalleryPhoto = (indexToRemove: number) => {
    setGalleryUrls((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = getSupabase();
    if (!supabase) return;

    setSaving(true);
    setBanner(null);

    const cleanWhatsapp = whatsappNumber.replace(/[^0-9]/g, '');
    const sanitizedGallery = galleryUrls.map(cleanUrl).filter(Boolean).slice(0, 6);

    try {
      const { data, error } = await supabase.rpc('update_business_profile', {
        p_business_id: business.id,
        p_access_pin: accessPin.trim(),
        p_description: description.trim() || null,
        p_cultural_description: culturalDescription.trim() || null,
        p_location: location.trim() || null,
        p_phone: phone.trim() || null,
        p_whatsapp: cleanWhatsapp || null,
        p_whatsapp_number: cleanWhatsapp || null,
        p_default_message: defaultMessage.trim() || null,
        p_website: website.trim() || null,
        p_opening_hours: openingHours.trim() || null,
        p_logo_url: logoUrl.trim() || null,
        p_imagen_url: coverUrl.trim() || null,
        p_menu_url: menuUrl.trim() || null,
        p_catalog_type: catalogType,
        p_gallery_urls: sanitizedGallery,
      });

      if (error) {
        setBanner({ type: 'error', text: `No se pudo guardar: ${error.message}` });
      } else if (!data || data.length === 0) {
        setBanner({
          type: 'error',
          text: 'No se pudo validar el PIN de acceso para guardar los cambios.',
        });
      } else {
        const updatedRow = data[0] as EditableMerchantBusiness;
        onSaved(updatedRow);
        setBanner({
          type: 'success',
          text: '¡Perfil actualizado! Los cambios ya están guardados en Huaraz Explorer.',
        });
      }
    } catch {
      setBanner({ type: 'error', text: 'Error de red al guardar el perfil.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSaveProfile} className="space-y-6">
      {banner && (
        <div
          role="alert"
          className={`rounded-2xl px-4 py-3.5 text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 border ${
            banner.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <i
              className={`fas ${
                banner.type === 'success' ? 'fa-circle-check text-emerald-600' : 'fa-circle-exclamation'
              }`}
            ></i>
            <span>{banner.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setBanner(null)}
            className="opacity-70 hover:opacity-100 p-1"
          >
            <i className="fas fa-xmark"></i>
          </button>
        </div>
      )}

      {/* TARJETA 1: IDENTIDAD VISUAL Y CARTA / CATÁLOGO */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-6">
        <div>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
            1. Imagen de Marca y Carta / Catálogo
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Sube tu logo, foto principal de portada y tu carta o catálogo en PDF o imagen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Logo */}
          <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Logo del negocio</span>
              {uploadingField === 'logo' && (
                <span className="text-[11px] font-semibold text-emerald-700">
                  <i className="fas fa-spinner fa-spin mr-1"></i>Subiendo...
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200 bg-white"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl border border-dashed border-slate-300 bg-white flex items-center justify-center text-slate-400">
                  <i className="fas fa-store text-lg"></i>
                </div>
              )}
              <label className="cursor-pointer bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold px-3.5 py-2 rounded-lg transition-colors">
                <span>{logoUrl ? 'Cambiar logo' : 'Subir logo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleSingleFileUpload(e, 'logo')}
                  disabled={uploadingField !== null}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Foto de portada */}
          <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Foto principal (Portada)</span>
              {uploadingField === 'cover' && (
                <span className="text-[11px] font-semibold text-emerald-700">
                  <i className="fas fa-spinner fa-spin mr-1"></i>Subiendo...
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              {coverUrl ? (
                <img
                  src={coverUrl}
                  alt="Portada"
                  className="w-24 h-16 rounded-xl object-cover border border-slate-200 bg-white"
                />
              ) : (
                <div className="w-24 h-16 rounded-xl border border-dashed border-slate-300 bg-white flex items-center justify-center text-slate-400">
                  <i className="fas fa-image text-lg"></i>
                </div>
              )}
              <label className="cursor-pointer bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold px-3.5 py-2 rounded-lg transition-colors">
                <span>{coverUrl ? 'Cambiar portada' : 'Subir portada'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleSingleFileUpload(e, 'cover')}
                  disabled={uploadingField !== null}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Carta / Catálogo */}
        <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50/50">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                Carta, Catálogo o Tarifario (PDF o Imagen)
              </span>
              <span className="text-[11px] text-slate-500">
                Los visitantes podrán abrirlo directo desde tu ficha.
              </span>
            </div>
            <select
              value={catalogType}
              onChange={(e) => setCatalogType(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800"
            >
              <option value="carta">Tipo: Carta / Menú</option>
              <option value="catalogo">Tipo: Catálogo de Productos</option>
              <option value="tarifario">Tipo: Tarifario / Tours</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors inline-flex items-center gap-2">
              <i className="fas fa-file-arrow-up"></i>
              <span>
                {uploadingField === 'menu'
                  ? 'Subiendo archivo...'
                  : menuUrl
                  ? 'Reemplazar archivo'
                  : 'Subir PDF o Foto'}
              </span>
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={(e) => handleSingleFileUpload(e, 'menu')}
                disabled={uploadingField !== null}
                className="hidden"
              />
            </label>

            {menuUrl && (
              <a
                href={menuUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-emerald-700 hover:underline inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg"
              >
                <i className="fas fa-arrow-up-right-from-square"></i>
                <span>Ver archivo actual</span>
              </a>
            )}
          </div>
        </div>

        {/* Galería de fotos */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">
              Galería del local / platos / habitaciones ({galleryUrls.length}/6)
            </span>
            {galleryUrls.length < 6 && (
              <label className="cursor-pointer bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
                <span>
                  {uploadingField === 'gallery' ? 'Subiendo fotos...' : '+ Agregar fotos'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryUpload}
                  disabled={uploadingField !== null}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {galleryUrls.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
              {galleryUrls.map((url, idx) => (
                <div key={`${url}-${idx}`} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200">
                  <img src={url} alt={`Galería ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveGalleryPhoto(idx)}
                    title="Eliminar foto"
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-600 text-white text-xs flex items-center justify-center opacity-90 hover:opacity-100"
                  >
                    <i className="fas fa-xmark"></i>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 bg-slate-50 border border-dashed border-slate-200 rounded-xl p-4 text-center">
              Aún no has subido fotos adicionales a tu galería.
            </p>
          )}
        </div>
      </div>

      {/* TARJETA 2: CONTACTO, DIRECCIÓN Y HORARIOS */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
        <div>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
            2. Contacto, Ubicación y Horarios
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Mantén actualizados tus canales directos para recibir reservas sin intermediarios.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">
              WhatsApp de reservas (con código 51)
            </label>
            <input
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="Ej. 51943123456"
              className="w-full bg-slate-50 border border-slate-300 focus:border-slate-900 focus:bg-white rounded-xl px-3.5 py-2.5 text-sm text-slate-900 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">
              Teléfono fijo o adicional
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ej. (043) 421234"
              className="w-full bg-slate-50 border border-slate-300 focus:border-slate-900 focus:bg-white rounded-xl px-3.5 py-2.5 text-sm text-slate-900 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Dirección exacta</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ej. Av. Luzuriaga 450, Huaraz"
              className="w-full bg-slate-50 border border-slate-300 focus:border-slate-900 focus:bg-white rounded-xl px-3.5 py-2.5 text-sm text-slate-900 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Horario de atención</label>
            <input
              type="text"
              value={openingHours}
              onChange={(e) => setOpeningHours(e.target.value)}
              placeholder="Ej. Lun - Dom: 12:00 pm a 10:30 pm"
              className="w-full bg-slate-50 border border-slate-300 focus:border-slate-900 focus:bg-white rounded-xl px-3.5 py-2.5 text-sm text-slate-900 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">
              Sitio web o red social principal
            </label>
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="Ej. https://instagram.com/tunegocio"
              className="w-full bg-slate-50 border border-slate-300 focus:border-slate-900 focus:bg-white rounded-xl px-3.5 py-2.5 text-sm text-slate-900 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">
              Mensaje predeterminado de WhatsApp
            </label>
            <input
              type="text"
              value={defaultMessage}
              onChange={(e) => setDefaultMessage(e.target.value)}
              placeholder="Ej. Hola, los vi en Huaraz Explorer y quiero reservar..."
              className="w-full bg-slate-50 border border-slate-300 focus:border-slate-900 focus:bg-white rounded-xl px-3.5 py-2.5 text-sm text-slate-900 outline-none"
            />
          </div>
        </div>
      </div>

      {/* TARJETA 3: DESCRIPCIÓN COMERCIAL Y RELATO CULTURAL */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
        <div>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
            3. Presentación y Relato Cultural
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Ayuda a los viajeros y a nuestra Guía IA Arkáiko a recomendar lo mejor de tu propuesta.
          </p>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700">
            Descripción comercial corta (qué ofrecen y especialidad)
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ej. Especialistas en pollos a la brasa al carbón, parrillas familiares y platos criollos en el corazón de Huaraz."
            className="w-full bg-slate-50 border border-slate-300 focus:border-slate-900 focus:bg-white rounded-xl px-3.5 py-2.5 text-sm text-slate-900 outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700">
            Historia y esencia cultural (opcional · aparece en tu ficha y en Arkáiko)
          </label>
          <textarea
            rows={3}
            value={culturalDescription}
            onChange={(e) => setCulturalDescription(e.target.value)}
            placeholder="Cuéntanos el origen de tu negocio, tradición familiar, insumos locales de Áncash o qué hace única la experiencia en tu local..."
            className="w-full bg-slate-50 border border-slate-300 focus:border-slate-900 focus:bg-white rounded-xl px-3.5 py-2.5 text-sm text-slate-900 outline-none"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving || uploadingField !== null}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-colors inline-flex items-center gap-2 shadow-sm"
        >
          {saving ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              <span>Guardando cambios...</span>
            </>
          ) : (
            <>
              <i className="fas fa-floppy-disk"></i>
              <span>Guardar cambios del perfil</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
