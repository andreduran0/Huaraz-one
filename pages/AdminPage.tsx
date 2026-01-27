
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useTranslations } from '../hooks/useTranslations';
import QrCodeGenerator from '../components/QrCodeGenerator';
import StaticMap from '../components/StaticMap';
import { Business, BusinessCategory, AdLevel } from '../types';
import { BlogPost } from '../data/blogPosts';

const ADMIN_PASSWORD = "Huaraz2025"; 

const StatCard: React.FC<{ title: string; value: string | number; icon: string }> = ({ title, value, icon }) => (
  <div className="bg-[#0D0D0D] p-6 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden group hover:border-[#39FF14]/30 transition-all">
    <div className="absolute top-0 right-0 w-24 h-24 bg-[#39FF14]/5 blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
    <div className="flex items-center space-x-5 relative z-10">
        <div className="bg-[#39FF14]/10 p-4 rounded-2xl border border-[#39FF14]/20 group-hover:bg-[#39FF14] group-hover:text-black transition-all">
            <i className={`fas ${icon} text-xl text-[#39FF14] group-hover:text-black`}></i>
        </div>
        <div>
            <p className="text-gray-500 text-[9px] font-black uppercase tracking-[0.3em] mb-1">{title}</p>
            <p className="text-3xl font-black text-white italic tracking-tighter">{value}</p>
        </div>
    </div>
  </div>
);

const AdminPage: React.FC = () => {
  const { 
    businesses, coupons, updateBusiness, addBusiness, deleteBusiness,
    heroImages, setHeroImages, blogPosts, addBlogPost, deleteBlogPost,
    socialLinks, updateSocialLinks
  } = useAppContext();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'stats' | 'businesses' | 'blog' | 'map' | 'config'>('stats');
  const [isRepositionMode, setIsRepositionMode] = useState(false);
  const [lastMovedBusiness, setLastMovedBusiness] = useState<Business | null>(null);

  // Forms State
  const [showBusinessForm, setShowBusinessForm] = useState(false);
  const [newBusiness, setNewBusiness] = useState<Partial<Business>>({
    name: '', category: BusinessCategory.RESTAURANT, adLevel: AdLevel.NONE, status: 'approved',
    photos: [''], schedule: { 'Lun - Dom': '9:00 AM - 9:00 PM' }, lat: -9.528, lng: -77.528, address: ''
  });

  const [showBlogForm, setShowBlogForm] = useState(false);
  const [newPost, setNewPost] = useState<Partial<BlogPost>>({
    title: '', excerpt: '', content: '', author: 'Huaraz Explorer Team', category: 'tips', readTime: '5 min',
    image: '', youtubeId: '', date: new Date().toISOString().split('T')[0]
  });

  // Social Config State
  const [tempSocialLinks, setTempSocialLinks] = useState(socialLinks);

  useEffect(() => {
    const authStatus = sessionStorage.getItem('isAdminAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setLoginError(false);
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

  const handleMarkerMove = (id: string, lat: number, lng: number) => {
    const business = businesses.find(b => b.id === id);
    if (business) {
      const updated = { ...business, lat, lng };
      updateBusiness(updated);
      setLastMovedBusiness(updated);
      
      // Mostrar feedback temporal
      setTimeout(() => setLastMovedBusiness(null), 3000);
    }
  };

  const handleAddBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    const id = Math.random().toString(36).substr(2, 9);
    addBusiness({ ...newBusiness, id } as Business);
    setShowBusinessForm(false);
    alert('Negocio añadido correctamente');
  };

  const handleAddBlogPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content || !newPost.image) {
        alert("Por favor completa los campos obligatorios: Título, Contenido e Imagen.");
        return;
    }
    const id = Math.random().toString(36).substr(2, 9);
    addBlogPost({ ...newPost, id } as BlogPost);
    setShowBlogForm(false);
    setNewPost({
      title: '', excerpt: '', content: '', author: 'Huaraz Explorer Team', category: 'tips', readTime: '5 min',
      image: '', youtubeId: '', date: new Date().toISOString().split('T')[0]
    });
    alert('Artículo publicado exitosamente');
  };

  const handleSaveSocial = (e: React.FormEvent) => {
    e.preventDefault();
    updateSocialLinks(tempSocialLinks);
    alert('Enlaces de redes sociales actualizados correctamente');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6 relative overflow-hidden font-['Plus_Jakarta_Sans']">
        {/* Background Grid & Glows */}
        <div className="absolute inset-0 pointer-events-none opacity-5" style={{ backgroundImage: 'radial-gradient(#39FF14 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#39FF14]/5 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="bg-[#0D0D0D] p-12 rounded-[3.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] border border-[#39FF14]/20 w-full max-w-md space-y-10 text-center animate-fadeIn relative z-10">
          <div className="relative inline-block group">
            <div className="absolute -inset-4 bg-[#39FF14]/20 rounded-full blur-xl animate-pulse"></div>
            <div className="relative w-24 h-24 bg-[#050505] border-2 border-[#39FF14]/40 rounded-[2rem] flex items-center justify-center text-[#39FF14] text-4xl shadow-2xl">
              <i className="fas fa-fingerprint"></i>
            </div>
          </div>
          
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">Protocolo <span className="text-[#39FF14]">Admin</span></h1>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em] mt-3">SISTEMA DE CONTROL HUARAZ EXPLORER</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2 text-left">
              <label className="text-[9px] font-black uppercase text-gray-600 tracking-[0.3em] ml-4">Clave de Acceso</label>
              <input 
                type="password" 
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className={`w-full p-6 bg-[#050505] rounded-[1.8rem] border-2 focus:outline-none transition-all text-white font-black text-center tracking-[0.5em] ${loginError ? 'border-red-500 animate-shake' : 'border-white/5 focus:border-[#39FF14]/50 focus:ring-4 focus:ring-[#39FF14]/5'}`}
                placeholder="••••••••"
                required
              />
              {loginError && <p className="text-red-500 text-[9px] font-black uppercase mt-2 text-center tracking-widest">Error de autenticación</p>}
            </div>
            <button 
              type="submit" 
              className="w-full bg-[#39FF14] text-black font-black py-6 rounded-[1.8rem] shadow-[0_15px_40px_rgba(57,255,20,0.3)] hover:scale-105 transition-all active:scale-95 flex items-center justify-center gap-3 uppercase text-xs tracking-[0.2em]"
            >
              Iniciar Sistema <i className="fas fa-bolt"></i>
            </button>
          </form>
          
          <div className="pt-4 opacity-30">
              <p className="text-[8px] font-black text-gray-500 uppercase tracking-[0.5em]">Secure Terminal v4.2.0</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] font-['Plus_Jakarta_Sans'] pb-40">
      
      {/* Header Panel - Futuristic Style */}
      <div className="bg-[#0A0A0A] pt-12 pb-24 border-b border-[#39FF14]/10 shadow-2xl px-8">
        <div className="container mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#39FF14]/10 border border-[#39FF14]/30 px-4 py-1.5 rounded-full mb-4">
                <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse"></span>
                <span className="text-[9px] font-black text-[#39FF14] uppercase tracking-widest">Operation Center Active</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter italic">Huaraz <span className="text-[#39FF14]">Operations</span></h1>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-gray-500 font-bold text-xs uppercase tracking-[0.2em]">Dashboard de Control Principal</p>
              <button onClick={handleLogout} className="bg-white/5 hover:bg-red-500/10 text-red-500 px-4 py-1 rounded-full text-[9px] font-black uppercase border border-white/5 hover:border-red-500/30 transition-all">
                <i className="fas fa-power-off mr-1"></i> Desconectar
              </button>
            </div>
          </div>
          
          <div className="flex bg-[#050505] p-2 rounded-[2rem] border border-white/5 overflow-x-auto no-scrollbar shadow-inner">
              {(['stats', 'businesses', 'blog', 'map', 'config'] as const).map(tab => (
                  <button 
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-8 py-3.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-[#39FF14] text-black shadow-[0_0_20px_rgba(57,255,20,0.2)]' : 'text-gray-500 hover:text-white'}`}
                  >
                      {tab === 'stats' ? 'Métricas' : tab === 'businesses' ? 'Negocios' : tab === 'blog' ? 'Editorial' : tab === 'map' ? 'Geoloc' : 'Ajustes'}
                  </button>
              ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-8 -mt-12 space-y-12">
          
          {activeTab === 'stats' && (
            <div className="space-y-10 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Total Negocios" value={businesses.length} icon="fa-briefcase" />
                    <StatCard title="Publicaciones" value={blogPosts.length} icon="fa-newspaper" />
                    <StatCard title="Hero Visuals" value={heroImages.length} icon="fa-images" />
                    <StatCard title="Cupones Activos" value={coupons.length} icon="fa-ticket-alt" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="bg-[#0D0D0D] p-10 rounded-[3rem] shadow-2xl border border-white/5 text-center group">
                        <h3 className="font-black uppercase text-xs mb-8 text-[#39FF14] tracking-[0.4em] italic flex items-center justify-center gap-3">
                            <i className="fas fa-qrcode"></i> Puerta de Enlace QR
                        </h3>
                        <div className="flex flex-col items-center gap-6">
                            <div className="p-6 bg-white rounded-[2.5rem] shadow-[0_0_50px_rgba(255,255,255,0.1)] group-hover:scale-105 transition-transform">
                                <QrCodeGenerator value={window.location.origin} size={180} />
                            </div>
                            <p className="text-[10px] text-center text-gray-500 font-bold max-w-xs uppercase leading-relaxed tracking-widest">
                                Código de acceso universal para turistas y exploradores.
                            </p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#0D0D0D] to-[#050505] p-12 rounded-[3rem] shadow-2xl text-white flex flex-col justify-center relative overflow-hidden border border-[#39FF14]/15">
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#39FF14]/5 rounded-full blur-[100px]"></div>
                        <h3 className="font-black uppercase text-2xl mb-4 tracking-tighter italic">Respaldo <span className="text-[#39FF14]">Data Cloud</span></h3>
                        <p className="text-gray-500 text-sm mb-10 leading-relaxed font-medium">Exporta toda la inteligencia de negocio y contenido editorial en un solo paquete JSON de alta fidelidad.</p>
                        <button 
                            onClick={() => {
                                const data = { businesses, blogPosts, heroImages, socialLinks };
                                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `huaraz_explorer_backup_${new Date().toISOString().split('T')[0]}.json`;
                                a.click();
                            }}
                            className="bg-white/5 hover:bg-[#39FF14] hover:text-black border border-white/10 text-[#39FF14] px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl transition-all active:scale-95 self-start flex items-center gap-3"
                        >
                            Exportar Base de Datos <i className="fas fa-download"></i>
                        </button>
                    </div>
                </div>
            </div>
          )}

          {activeTab === 'config' && (
            <div className="animate-fadeIn max-w-3xl mx-auto pb-20">
              <div className="bg-[#0D0D0D] p-12 rounded-[3.5rem] shadow-2xl border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#39FF14]/5 blur-[100px]"></div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-10 flex items-center gap-4 italic">
                  <i className="fas fa-share-nodes text-[#39FF14]"></i> Enlaces de <span className="text-[#39FF14]">Comunidad</span>
                </h2>
                <form onSubmit={handleSaveSocial} className="space-y-8">
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 text-[10px] font-black uppercase text-gray-500 tracking-[0.3em] ml-2">
                      <i className="fab fa-instagram text-[#E4405F]"></i> Instagram Oficial
                    </label>
                    <input 
                      type="url" 
                      value={tempSocialLinks.instagram}
                      onChange={e => setTempSocialLinks({...tempSocialLinks, instagram: e.target.value})}
                      className="w-full p-5 bg-[#050505] rounded-2xl border border-white/5 focus:border-[#39FF14]/50 focus:ring-0 text-white font-semibold transition-all"
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 text-[10px] font-black uppercase text-gray-500 tracking-[0.3em] ml-2">
                      <i className="fab fa-tiktok text-white"></i> TikTok Oficial
                    </label>
                    <input 
                      type="url" 
                      value={tempSocialLinks.tiktok}
                      onChange={e => setTempSocialLinks({...tempSocialLinks, tiktok: e.target.value})}
                      className="w-full p-5 bg-[#050505] rounded-2xl border border-white/5 focus:border-[#39FF14]/50 focus:ring-0 text-white font-semibold transition-all"
                      placeholder="https://tiktok.com/..."
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 text-[10px] font-black uppercase text-gray-500 tracking-[0.3em] ml-2">
                      <i className="fab fa-youtube text-[#FF0000]"></i> YouTube Oficial
                    </label>
                    <input 
                      type="url" 
                      value={tempSocialLinks.youtube}
                      onChange={e => setTempSocialLinks({...tempSocialLinks, youtube: e.target.value})}
                      className="w-full p-5 bg-[#050505] rounded-2xl border border-white/5 focus:border-[#39FF14]/50 focus:ring-0 text-white font-semibold transition-all"
                      placeholder="https://youtube.com/..."
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-[#39FF14] text-black py-6 rounded-2xl font-black uppercase tracking-[0.2em] shadow-[0_15px_40px_rgba(57,255,20,0.2)] hover:scale-[1.02] transition-all active:scale-95 text-xs"
                  >
                    Guardar Configuración <i className="fas fa-check-circle ml-2"></i>
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'businesses' && (
            <div className="space-y-8 animate-fadeIn">
                <div className="flex justify-between items-center bg-[#0D0D0D] p-6 rounded-[2rem] border border-white/5">
                    <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Gestión de <span className="text-[#39FF14]">Ecosistema</span></h2>
                    <button onClick={() => setShowBusinessForm(!showBusinessForm)} className="bg-[#39FF14] text-black px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all active:scale-95">
                        {showBusinessForm ? 'Cancelar' : 'Añadir Local +'}
                    </button>
                </div>
                {showBusinessForm && (
                    <form onSubmit={handleAddBusiness} className="bg-[#0D0D0D] p-10 rounded-[3rem] border-2 border-[#39FF14]/40 shadow-2xl space-y-6 animate-slideUp">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input required type="text" placeholder="Nombre Comercial" className="w-full p-4 bg-[#050505] rounded-2xl border border-white/10 text-white outline-none focus:border-[#39FF14]" value={newBusiness.name} onChange={e => setNewBusiness({...newBusiness, name: e.target.value})} />
                            <select className="w-full p-4 bg-[#050505] rounded-2xl border border-white/10 text-white outline-none focus:border-[#39FF14]" value={newBusiness.category} onChange={e => setNewBusiness({...newBusiness, category: e.target.value as BusinessCategory})}>
                                {Object.values(BusinessCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <button type="submit" className="w-full bg-[#39FF14] text-black py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl">Confirmar Registro de Negocio</button>
                    </form>
                )}
                
                <div className="grid grid-cols-1 gap-4">
                    {businesses.map(b => (
                        <div key={b.id} className="bg-[#0D0D0D] p-6 rounded-[2rem] border border-white/5 flex items-center justify-between group hover:border-[#39FF14]/20 transition-all">
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-[#050505] border border-white/5 flex items-center justify-center text-[#39FF14] overflow-hidden">
                                    {b.photos[0] ? <img src={b.photos[0]} className="w-full h-full object-cover opacity-60 group-hover:opacity-100" alt={b.name} /> : <i className="fas fa-store"></i>}
                                </div>
                                <div>
                                    <h4 className="font-black text-white uppercase italic tracking-tighter text-lg">{b.name}</h4>
                                    <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.2em]">{b.category} • {b.address}</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-gray-500 hover:text-[#39FF14] transition-all"><i className="fas fa-edit text-xs"></i></button>
                                <button onClick={() => deleteBusiness(b.id)} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-gray-500 hover:text-red-500 transition-all"><i className="fas fa-trash text-xs"></i></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          )}

          {activeTab === 'blog' && (
            <div className="space-y-8 animate-fadeIn">
                <div className="flex justify-between items-center bg-[#0D0D0D] p-6 rounded-[2rem] border border-white/5">
                    <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Bitácora <span className="text-[#39FF14]">Editorial</span></h2>
                    <button onClick={() => setShowBlogForm(!showBlogForm)} className="bg-[#39FF14] text-black px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all active:scale-95">
                        {showBlogForm ? 'Cerrar Editor' : 'Nuevo Articulo +'}
                    </button>
                </div>
                {showBlogForm && (
                    <form onSubmit={handleAddBlogPost} className="bg-[#0D0D0D] p-10 rounded-[3rem] border-2 border-[#39FF14]/40 shadow-2xl space-y-8 animate-slideUp relative">
                        {/* Indicador de Estado del Formulario */}
                        <div className="absolute top-0 right-10 -translate-y-1/2 flex items-center gap-2 bg-[#39FF14] text-black px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-[0_0_15px_#39FF14]">
                           <i className="fas fa-edit"></i> Editando Borrador Neural
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase text-gray-500 tracking-[0.3em] ml-2">Título del Relato</label>
                                    <input required type="text" placeholder="Ej: Las 5 rutas más secretas..." className="w-full p-5 bg-[#050505] rounded-2xl border border-white/10 text-white text-xl font-black italic tracking-tighter outline-none focus:border-[#39FF14]" value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value})} />
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase text-gray-500 tracking-[0.3em] ml-2">Resumen (Excerpt)</label>
                                    <input type="text" placeholder="Breve descripción del artículo..." className="w-full p-4 bg-[#050505] rounded-2xl border border-white/10 text-gray-400 font-medium outline-none focus:border-[#39FF14]" value={newPost.excerpt} onChange={e => setNewPost({...newPost, excerpt: e.target.value})} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase text-gray-500 tracking-[0.3em] ml-2">Autor</label>
                                        <input type="text" placeholder="Huaraz Explorer Team" className="w-full p-4 bg-[#050505] rounded-2xl border border-white/10 text-gray-400 font-medium outline-none focus:border-[#39FF14]" value={newPost.author} onChange={e => setNewPost({...newPost, author: e.target.value})} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase text-gray-500 tracking-[0.3em] ml-2">Tiempo Lectura</label>
                                        <input type="text" placeholder="5 min" className="w-full p-4 bg-[#050505] rounded-2xl border border-white/10 text-gray-400 font-medium outline-none focus:border-[#39FF14]" value={newPost.readTime} onChange={e => setNewPost({...newPost, readTime: e.target.value})} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase text-gray-500 tracking-[0.3em] ml-2">Categoría</label>
                                    <select className="w-full p-4 bg-[#050505] rounded-2xl border border-white/10 text-gray-400 font-medium outline-none focus:border-[#39FF14]" value={newPost.category} onChange={e => setNewPost({...newPost, category: e.target.value as any})}>
                                        <option value="tips">Consejos (Tips)</option>
                                        <option value="trekking">Aventura (Trekking)</option>
                                        <option value="food">Gastronomía (Food)</option>
                                        <option value="culture">Cultura (Culture)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase text-gray-500 tracking-[0.3em] ml-2">Miniatura (URL de Imagen)</label>
                                    <input required type="url" placeholder="https://..." className="w-full p-4 bg-[#050505] rounded-2xl border border-white/10 text-[#39FF14] text-xs font-mono outline-none focus:border-[#39FF14]" value={newPost.image} onChange={e => setNewPost({...newPost, image: e.target.value})} />
                                    {newPost.image && (
                                        <div className="mt-3 rounded-2xl overflow-hidden border border-white/10 h-32 relative">
                                            <img src={newPost.image} className="w-full h-full object-cover" alt="Preview" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-[8px] font-black uppercase tracking-widest text-white">Preview Digital</div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase text-gray-500 tracking-[0.3em] ml-2">YouTube Video ID (Opcional)</label>
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 relative">
                                            <i className="fab fa-youtube absolute left-4 top-1/2 -translate-y-1/2 text-red-600"></i>
                                            <input type="text" placeholder="dQw4w9WgXcQ" className="w-full p-4 pl-12 bg-[#050505] rounded-2xl border border-white/10 text-white font-mono text-sm outline-none focus:border-[#39FF14]" value={newPost.youtubeId} onChange={e => setNewPost({...newPost, youtubeId: e.target.value})} />
                                        </div>
                                    </div>
                                    <p className="text-[8px] text-gray-600 font-black uppercase mt-1 ml-2">Solo ingresa el ID (caracteres finales después del ?v=)</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase text-gray-500 tracking-[0.3em] ml-2">Contenido Editorial (Markdown)</label>
                            <textarea placeholder="Escribe tu historia aquí usando formato Markdown..." className="w-full p-8 bg-[#050505] rounded-[2rem] border border-white/10 text-gray-300 font-medium h-[450px] outline-none focus:border-[#39FF14] no-scrollbar shadow-inner" value={newPost.content} onChange={e => setNewPost({...newPost, content: e.target.value})} />
                        </div>

                        <button type="submit" className="w-full bg-[#39FF14] text-black py-7 rounded-[2rem] font-black uppercase tracking-[0.3em] shadow-[0_15px_40px_rgba(57,255,20,0.3)] hover:scale-[1.01] active:scale-95 transition-all text-xs">
                           Subir a la Red Huaraz Explorer <i className="fas fa-satellite-dish ml-3 animate-pulse"></i>
                        </button>
                    </form>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map(post => (
                        <div key={post.id} className="group bg-[#0D0D0D] rounded-[2.5rem] overflow-hidden shadow-xl border border-white/5 hover:border-[#39FF14]/30 transition-all">
                            <div className="h-44 bg-gray-900 relative overflow-hidden">
                                <img src={post.image} className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" alt={post.title} />
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <span className="bg-[#39FF14] text-black text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest">{post.category}</span>
                                    {post.youtubeId && <i className="fab fa-youtube text-red-600 bg-white/20 p-1 rounded-sm text-[10px]"></i>}
                                </div>
                                <button onClick={() => deleteBlogPost(post.id)} className="absolute top-4 right-4 bg-red-600/20 hover:bg-red-600 text-white w-10 h-10 rounded-xl backdrop-blur-md flex items-center justify-center transition-all border border-red-600/30"><i className="fas fa-trash-alt text-xs"></i></button>
                            </div>
                            <div className="p-8">
                                <h4 className="font-black text-white uppercase italic tracking-tighter text-xl line-clamp-1 mb-2 group-hover:text-[#39FF14] transition-colors">{post.title}</h4>
                                <div className="flex items-center justify-between">
                                    <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.2em]">{post.date}</p>
                                    <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest italic">{post.author}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          )}

          {activeTab === 'map' && (
            <div className="space-y-8 animate-fadeIn pb-32">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#0D0D0D] p-8 rounded-[3rem] border border-white/5">
                    <div className="flex items-center gap-5">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${isRepositionMode ? 'bg-red-600 text-white animate-pulse border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.4)]' : 'bg-white/5 text-gray-600 border-white/10'}`}>
                            <i className="fas fa-crosshair text-xl"></i>
                        </div>
                        <div>
                            <h3 className="font-black uppercase text-lg italic tracking-tighter text-white">Geolocalización <span className="text-[#39FF14]">Live</span></h3>
                            <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.3em] mt-1">
                                {isRepositionMode ? 'Modo de edición activado. Arrastra los pines sobre el terreno.' : 'Mapa bloqueado. Activa edición para mover puntos.'}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsRepositionMode(!isRepositionMode)}
                        className={`px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 ${
                            isRepositionMode 
                            ? 'bg-red-600 hover:bg-red-700 text-white shadow-[0_10px_30px_rgba(220,38,38,0.3)]' 
                            : 'bg-[#39FF14] hover:bg-[#39FF14]/80 text-black shadow-[0_10px_30px_rgba(57,255,20,0.2)]'
                        }`}
                    >
                        {isRepositionMode ? 'Desactivar y Guardar' : 'Entrar en Modo Edición'}
                    </button>
                </div>

                {lastMovedBusiness && (
                    <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[100] bg-[#39FF14] text-black px-10 py-5 rounded-[2rem] shadow-[0_20px_60px_rgba(57,255,20,0.4)] font-black uppercase text-[10px] tracking-[0.2em] animate-bounce border-4 border-white">
                        <i className="fas fa-satellite mr-3"></i> {lastMovedBusiness.name} Actualizado
                    </div>
                )}

                <div className={`h-[700px] rounded-[4rem] overflow-hidden shadow-3xl border-4 transition-all duration-700 relative ${isRepositionMode ? 'border-red-600/40 ring-[20px] ring-red-600/5' : 'border-[#0D0D0D]'}`}>
                    <StaticMap 
                        businesses={businesses}
                        isEditable={isRepositionMode}
                        onBusinessMove={handleMarkerMove}
                    />
                    
                    {isRepositionMode && (
                        <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-red-600 text-white px-8 py-3 rounded-full font-black text-[9px] uppercase tracking-[0.4em] shadow-2xl z-50 pointer-events-none italic border border-white/20">
                            <i className="fas fa-radiation mr-3 animate-pulse"></i> Sobreescribiendo Coordenadas del Satélite
                        </div>
                    )}
                </div>
            </div>
          )}
      </div>

      <div className="py-20 text-center opacity-20">
         <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.8em] italic">Huaraz Explorer Network • Operations v4.5.1</p>
      </div>
    </div>
  );
};

export default AdminPage;
