
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import StaticMap from '../components/StaticMap';
import { Business, BusinessCategory, AdLevel } from '../types';
import { BlogPost } from '../data/blogPosts';
import { useTranslations } from '../hooks/useTranslations';

const ADMIN_PASSWORD = "Huaraz2025"; 

const StatCard: React.FC<{ title: string; value: string | number; icon: string }> = ({ title, value, icon }) => (
  <div className="bg-gray-900/50 p-8 rounded-[2.5rem] border border-[#39FF14]/10 shadow-[0_0_20px_rgba(57,255,20,0.02)] relative overflow-hidden group hover:border-[#39FF14]/30 transition-all duration-500">
    <div className="absolute -inset-1 bg-gradient-to-br from-[#39FF14]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
    <div className="flex items-center space-x-5 relative z-10">
        <div className="bg-[#39FF14]/10 p-5 rounded-3xl text-[#39FF14] group-hover:bg-[#39FF14] group-hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(57,255,20,0.1)] group-hover:shadow-[0_0_25px_rgba(57,255,20,0.4)]">
            <i className={`fas ${icon} text-2xl`}></i>
        </div>
        <div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-1">{title}</p>
            <p className="text-3xl font-black text-white italic tracking-tighter group-hover:text-[#39FF14] transition-colors">{value}</p>
        </div>
    </div>
  </div>
);

const AdminPage: React.FC = () => {
  const { 
    businesses, updateBusiness, addBusiness, deleteBusiness,
    heroImages, blogPosts, addBlogPost, deleteBlogPost,
    socialLinks, updateSocialLinks, lastSync
  } = useAppContext();
  const t = useTranslations();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [activeTab, setActiveTab] = useState<'stats' | 'businesses' | 'blog' | 'map' | 'config'>('stats');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [showBusinessForm, setShowBusinessForm] = useState(false);
  const [newBusiness, setNewBusiness] = useState<Partial<Business>>({
    name: '', category: BusinessCategory.RESTAURANT, adLevel: AdLevel.NONE, status: 'approved',
    photos: [''], address: '', lat: -9.528, lng: -77.528, description: '', schedule: { 'Lunes - Domingo': '9:00 AM - 8:00 PM' }
  });

  const [showBlogForm, setShowBlogForm] = useState(false);
  const [newPost, setNewPost] = useState<Partial<BlogPost>>({
    title: '', excerpt: '', content: '', author: 'Huaraz Explorer', category: 'tips',
    image: '', youtubeId: '', date: new Date().toISOString().split('T')[0]
  });

  const [tempSocial, setTempSocial] = useState(socialLinks);

  useEffect(() => {
    const authStatus = sessionStorage.getItem('isAdminAuthenticated');
    if (authStatus === 'true') setIsAuthenticated(true);
  }, []);

  const showToast = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const cleanYoutubeId = (input: string): string => {
    if (!input) return '';
    const trimmed = input.trim();
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = trimmed.match(regExp);
    if (match && match[2].length === 11) return match[2];
    return trimmed.length === 11 ? trimmed : '';
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('isAdminAuthenticated', 'true');
    } else {
      setLoginError(true);
      setPasswordInput('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('isAdminAuthenticated');
  };

  const onAddBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    const id = 'biz-' + Math.random().toString(36).substr(2, 9);
    addBusiness({ ...newBusiness, id } as Business);
    showToast("¡Negocio guardado en la memoria local!");
    setShowBusinessForm(false);
    setNewBusiness({ name: '', category: BusinessCategory.RESTAURANT, adLevel: AdLevel.NONE, status: 'approved', photos: [''], address: '', lat: -9.528, lng: -77.528, description: '', schedule: { 'Lunes - Domingo': '9:00 AM - 8:00 PM' } });
  };

  const onAddBlogPost = (e: React.FormEvent) => {
    e.preventDefault();
    const id = 'post-' + Math.random().toString(36).substr(2, 9);
    const finalId = cleanYoutubeId(newPost.youtubeId || '');
    // Cálculo automático de tiempo de lectura
    const words = (newPost.content || "").split(/\s+/).length;
    const readTime = Math.ceil(words / 200) + " min";
    
    addBlogPost({ ...newPost, youtubeId: finalId, id, readTime } as BlogPost);
    showToast("¡Artículo publicado con éxito localmente!");
    setShowBlogForm(false);
    setNewPost({ title: '', excerpt: '', content: '', author: 'Huaraz Explorer', category: 'tips', image: '', youtubeId: '', date: new Date().toISOString().split('T')[0] });
  };

  const handleMarkerMove = (id: string, lat: number, lng: number) => {
    const business = businesses.find(b => b.id === id);
    if (business) {
        updateBusiness({ ...business, lat, lng });
        showToast("Ubicación actualizada");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6 overflow-hidden relative">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#39FF14]/10 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#39FF14]/10 rounded-full blur-[120px]"></div>
        
        <div className="bg-gray-900 p-12 rounded-[4rem] shadow-2xl border border-[#39FF14]/20 w-full max-w-md text-center relative z-10 backdrop-blur-xl">
          <div className="w-20 h-20 bg-[#39FF14] rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(57,255,20,0.4)] text-black text-3xl">
             <i className="fas fa-lock"></i>
          </div>
          <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">Panel <span className="text-[#39FF14]">Admin</span></h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-2 mb-8">Acceso restringido • Huaraz Explorer</p>
          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            <input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)}
              className={`w-full p-6 bg-black rounded-[2rem] border-2 text-center tracking-[0.5em] outline-none transition-all text-white ${loginError ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'border-gray-800 focus:border-[#39FF14] focus:shadow-[0_0_15px_rgba(57,255,20,0.2)]'}`}
              placeholder="••••••••" required />
            <button type="submit" className="w-full bg-[#39FF14] text-black font-black py-6 rounded-[2rem] text-xs tracking-[0.3em] uppercase shadow-xl hover:bg-white transition-all active:scale-95">AUTENTICAR</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] font-['Plus_Jakarta_Sans'] pb-40 relative">
      {/* Toast de Éxito */}
      {successMessage && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-[#39FF14] text-black px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-[0_0_30px_rgba(57,255,20,0.5)] animate-bounce">
              {successMessage}
          </div>
      )}

      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#39FF14]/5 to-transparent pointer-events-none"></div>
      
      <div className="bg-gray-900/80 backdrop-blur-xl pt-16 pb-24 border-b border-[#39FF14]/10 shadow-lg px-8 relative z-10">
        <div className="container mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-[#39FF14] rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(57,255,20,0.4)]">
                <img src="https://i.imgur.com/Cax54U1.png?v=4" className="w-8 h-8 brightness-0" alt="Logo" />
            </div>
            <div>
                <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">Gestión <span className="text-[#39FF14]">Global</span></h1>
                <button onClick={handleLogout} className="text-[#39FF14]/60 text-[10px] font-black uppercase mt-1 tracking-widest hover:text-red-500 transition-colors">Cerrar Sesión Segura</button>
            </div>
          </div>
          
          <div className="flex bg-black/50 p-1.5 rounded-full border border-gray-800 overflow-x-auto no-scrollbar shadow-inner backdrop-blur-md">
              {(['stats', 'businesses', 'blog', 'map', 'config'] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                      className={`px-7 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-[#39FF14] text-black shadow-[0_0_15px_rgba(57,255,20,0.3)]' : 'text-slate-500 hover:text-[#39FF14]'}`}>
                      {tab === 'stats' ? 'Dashboard' : tab === 'businesses' ? 'Negocios' : tab === 'blog' ? 'Editorial' : tab === 'map' ? 'Mapa' : 'Ajustes'}
                  </button>
              ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-8 -mt-10 space-y-12 relative z-20">
          {activeTab === 'stats' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeIn">
                <StatCard title="Directorio" value={businesses.length} icon="fa-building" />
                <StatCard title="Relatos" value={blogPosts.length} icon="fa-feather" />
                <StatCard title="Hero Slider" value={heroImages.length} icon="fa-images" />
                <StatCard title="Última Sync" value={new Date(lastSync).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} icon="fa-sync" />
            </div>
          )}

          {activeTab === 'businesses' && (
            <div className="space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-900 p-8 rounded-[3rem] border border-[#39FF14]/10 gap-6">
                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Locales <span className="text-[#39FF14]">Comerciales</span></h2>
                    <button onClick={() => setShowBusinessForm(!showBusinessForm)} className="bg-[#39FF14] text-black px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-colors">
                      {showBusinessForm ? 'CANCELAR' : 'NUEVO LOCAL +'}
                    </button>
                </div>
                {showBusinessForm && (
                    <form onSubmit={onAddBusiness} className="bg-gray-900 p-12 rounded-[3.5rem] border-2 border-dashed border-[#39FF14]/20 space-y-8 animate-slideUp">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <input required type="text" placeholder="Nombre del Negocio" className="w-full p-5 bg-black rounded-2xl border border-gray-800 font-bold text-white focus:border-[#39FF14] outline-none" value={newBusiness.name} onChange={e => setNewBusiness({...newBusiness, name: e.target.value})} />
                            <select className="w-full p-5 bg-black rounded-2xl border border-gray-800 font-bold text-white focus:border-[#39FF14] outline-none" value={newBusiness.category} onChange={e => setNewBusiness({...newBusiness, category: e.target.value as BusinessCategory})}>
                                {Object.values(BusinessCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                            <select className="w-full p-5 bg-black rounded-2xl border border-gray-800 font-bold text-white focus:border-[#39FF14] outline-none" value={newBusiness.adLevel} onChange={e => setNewBusiness({...newBusiness, adLevel: e.target.value as AdLevel})}>
                                <option value={AdLevel.NONE}>Plan Básico</option>
                                <option value={AdLevel.ESTANDAR}>Plan Estándar</option>
                                <option value={AdLevel.PREMIUM}>Plan Premium</option>
                            </select>
                        </div>
                        <input type="text" placeholder="URL de Imagen (Unsplash, Imgur...)" className="w-full p-5 bg-black rounded-2xl border border-gray-800 font-bold text-white focus:border-[#39FF14] outline-none" value={newBusiness.photos?.[0]} onChange={e => setNewBusiness({...newBusiness, photos: [e.target.value]})} />
                        <button type="submit" className="w-full bg-[#39FF14] text-black py-6 rounded-3xl font-black uppercase text-xs tracking-widest hover:bg-white transition-all shadow-[0_0_20px_rgba(57,255,20,0.2)]">REGISTRAR EN DIRECTORIO VIVO</button>
                    </form>
                )}
                <div className="grid grid-cols-1 gap-4">
                    {businesses.map(biz => (
                        <div key={biz.id} className="bg-gray-900 p-6 rounded-[2.5rem] border border-gray-800 flex items-center justify-between shadow-sm group hover:border-[#39FF14]/20 transition-all">
                            <div className="flex items-center gap-6">
                                <img src={biz.photos[0]} className="w-16 h-16 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                <div>
                                  <h3 className="font-black text-white uppercase italic tracking-tighter">{biz.name}</h3>
                                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{t(`category.${biz.category}` as any)}</p>
                                </div>
                            </div>
                            <button onClick={() => { deleteBusiness(biz.id); showToast("Eliminado de la memoria"); }} className="w-12 h-12 rounded-2xl bg-red-950/30 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center">
                              <i className="fas fa-trash"></i>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
          )}

          {activeTab === 'blog' && (
            <div className="space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-900 p-8 rounded-[3rem] border border-[#39FF14]/10 gap-6">
                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Editor <span className="text-[#39FF14]">Editorial</span></h2>
                    <button onClick={() => setShowBlogForm(!showBlogForm)} className="bg-[#39FF14] text-black px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-colors">
                      {showBlogForm ? 'CERRAR' : 'NUEVO ARTICULO +'}
                    </button>
                </div>
                {showBlogForm && (
                    <form onSubmit={onAddBlogPost} className="bg-gray-900 p-12 rounded-[3.5rem] border-2 border-dashed border-[#39FF14]/20 space-y-8 animate-slideUp">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <input required type="text" placeholder="Título Impactante" className="w-full p-5 bg-black rounded-2xl border border-gray-800 font-bold text-white focus:border-[#39FF14] outline-none" value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value})} />
                            <input required type="text" placeholder="Resumen corto" className="w-full p-5 bg-black rounded-2xl border border-gray-800 font-bold text-white focus:border-[#39FF14] outline-none" value={newPost.excerpt} onChange={e => setNewPost({...newPost, excerpt: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">URL Imagen Portada</label>
                                <input type="text" placeholder="https://..." className="w-full p-5 bg-black rounded-2xl border border-gray-800 font-bold text-white focus:border-[#39FF14] outline-none" value={newPost.image} onChange={e => setNewPost({...newPost, image: e.target.value})} />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">YouTube ID</label>
                                <input type="text" placeholder="ID o URL del video" className="w-full p-5 bg-black rounded-2xl border border-gray-800 font-bold text-white focus:border-[#39FF14] outline-none" value={newPost.youtubeId} onChange={e => setNewPost({...newPost, youtubeId: e.target.value})} />
                            </div>
                        </div>
                        <textarea required placeholder="Contenido del relato (Soporta Markdown)..." className="w-full p-5 bg-black rounded-2xl border border-gray-800 font-medium text-white h-64 focus:border-[#39FF14] outline-none" value={newPost.content} onChange={e => setNewPost({...newPost, content: e.target.value})} />
                        <button type="submit" className="w-full bg-[#39FF14] text-black py-6 rounded-3xl font-black uppercase text-xs tracking-[0.3em] shadow-[0_0_20px_rgba(57,255,20,0.2)]">PUBLICAR RELATO</button>
                    </form>
                )}
                <div className="grid grid-cols-1 gap-4">
                    {blogPosts.map(post => (
                        <div key={post.id} className="bg-gray-900 p-6 rounded-[2.5rem] border border-gray-800 flex items-center justify-between shadow-sm group hover:border-[#39FF14]/20 transition-all">
                            <div className="flex items-center gap-6">
                                <div className="relative w-16 h-16 rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                                  <img src={post.image || (post.youtubeId ? `https://img.youtube.com/vi/${post.youtubeId}/mqdefault.jpg` : 'https://via.placeholder.com/100')} className="w-full h-full object-cover" />
                                  {post.youtubeId && <div className="absolute inset-0 bg-red-600/20 flex items-center justify-center"><i className="fas fa-play text-[8px] text-white"></i></div>}
                                </div>
                                <div>
                                  <h3 className="font-black text-white uppercase italic tracking-tighter">{post.title}</h3>
                                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{post.date}</p>
                                </div>
                            </div>
                            <button onClick={() => { deleteBlogPost(post.id); showToast("Artículo eliminado"); }} className="w-12 h-12 rounded-2xl bg-red-950/30 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
                              <i className="fas fa-trash"></i>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
          )}

          {activeTab === 'map' && (
            <div className="space-y-8 animate-fadeIn">
                <div className="bg-gray-900 p-8 rounded-[3rem] border border-[#39FF14]/10 shadow-sm">
                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Geolocalizador <span className="text-[#39FF14]">Admin</span></h2>
                </div>
                <div className="h-[600px] rounded-[4rem] overflow-hidden shadow-2xl border-4 border-gray-900 relative">
                    <div className="absolute inset-0 bg-[#39FF14]/5 pointer-events-none z-10 rounded-[4rem]"></div>
                    <StaticMap businesses={businesses} isEditable={true} onBusinessMove={handleMarkerMove} />
                </div>
            </div>
          )}

          {activeTab === 'config' && (
            <div className="space-y-8 animate-fadeIn">
                <div className="bg-gray-900 p-8 rounded-[3rem] border border-[#39FF14]/10 shadow-sm">
                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Configuración <span className="text-[#39FF14]">Social</span></h2>
                </div>
                <div className="bg-gray-900 p-12 rounded-[3.5rem] border border-gray-800 space-y-10 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#39FF14]/5 blur-[80px]"></div>
                    <div className="space-y-6 relative z-10">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Instagram URL</label>
                          <input type="text" className="w-full p-5 bg-black rounded-2xl border border-gray-800 font-bold text-white focus:border-[#39FF14] outline-none" value={tempSocial.instagram} onChange={e => setTempSocial({...tempSocial, instagram: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">TikTok URL</label>
                          <input type="text" className="w-full p-5 bg-black rounded-2xl border border-gray-800 font-bold text-white focus:border-[#39FF14] outline-none" value={tempSocial.tiktok} onChange={e => setTempSocial({...tempSocial, tiktok: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">YouTube URL</label>
                          <input type="text" className="w-full p-5 bg-black rounded-2xl border border-gray-800 font-bold text-white focus:border-[#39FF14] outline-none" value={tempSocial.youtube} onChange={e => setTempSocial({...tempSocial, youtube: e.target.value})} />
                        </div>
                    </div>
                    <button onClick={() => { updateSocialLinks(tempSocial); showToast("Redes actualizadas"); }} className="w-full bg-[#39FF14] text-black py-6 rounded-3xl font-black uppercase text-xs tracking-[0.3em] shadow-xl hover:bg-white transition-all relative z-10">GUARDAR CAMBIOS EN LA RED</button>
                </div>
            </div>
          )}
      </div>
      
      <div className="py-20 text-center opacity-20">
         <p className="text-[8px] font-black text-[#39FF14] uppercase tracking-[0.6em] italic">Huaraz Explorer Admin System v6.5 • Stable Update</p>
      </div>
    </div>
  );
};

export default AdminPage;
