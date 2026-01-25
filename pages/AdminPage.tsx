
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useTranslations } from '../hooks/useTranslations';
import QrCodeGenerator from '../components/QrCodeGenerator';
import StaticMap from '../components/StaticMap';
import { Business, BusinessCategory, AdLevel } from '../types';
import { BlogPost } from '../data/blogPosts';

const ADMIN_PASSWORD = "Huaraz2025"; 

const StatCard: React.FC<{ title: string; value: string | number; icon: string }> = ({ title, value, icon }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm flex items-center space-x-4 border border-gray-100 dark:border-gray-700">
    <div className="bg-teal-100 dark:bg-teal-900/30 p-3 rounded-xl">
      <i className={`fas ${icon} text-xl text-teal-600 dark:text-teal-400`}></i>
    </div>
    <div>
      <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest">{title}</p>
      <p className="text-2xl font-black text-gray-900 dark:text-white">{value}</p>
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
    title: '', excerpt: '', content: '', author: 'Admin', category: 'tips', readTime: '5 min',
    image: '', date: new Date().toISOString().split('T')[0]
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
    const id = Math.random().toString(36).substr(2, 9);
    addBlogPost({ ...newPost, id, category: 'tips' } as BlogPost);
    setShowBlogForm(false);
    setNewPost({
      title: '', excerpt: '', content: '', author: 'Admin', category: 'tips', readTime: '5 min',
      image: '', date: new Date().toISOString().split('T')[0]
    });
    alert('Artículo publicado');
  };

  const handleSaveSocial = (e: React.FormEvent) => {
    e.preventDefault();
    updateSocialLinks(tempSocialLinks);
    alert('Enlaces de redes sociales actualizados correctamente');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 w-full max-w-md space-y-6 text-center animate-fadeIn">
          <div className="w-20 h-20 bg-brand-dark-blue rounded-2xl flex items-center justify-center text-white text-3xl mx-auto shadow-lg">
            <i className="fas fa-user-shield"></i>
          </div>
          <div>
            <h1 className="text-2xl font-black text-brand-dark-blue dark:text-white uppercase tracking-tighter">Acceso Restringido</h1>
            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Solo administradores autorizados</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1 text-left">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">Contraseña Maestra</label>
              <input 
                type="password" 
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className={`w-full p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border-2 focus:outline-none transition-all ${loginError ? 'border-red-500 animate-shake' : 'border-transparent focus:border-brand-blue'}`}
                placeholder="••••••••"
                required
              />
              {loginError && <p className="text-red-500 text-[10px] font-bold uppercase mt-1 ml-2">Contraseña incorrecta</p>}
            </div>
            <button 
              type="submit" 
              className="w-full bg-brand-dark-blue hover:bg-brand-blue text-white font-black py-4 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 uppercase text-sm tracking-widest"
            >
              Entrar al Panel <i className="fas fa-sign-in-alt"></i>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-brand-dark-blue dark:text-white uppercase tracking-tighter">Panel de Administración</h1>
          <div className="flex items-center gap-2">
            <p className="text-gray-500 dark:text-gray-400 font-bold text-xs uppercase tracking-widest">Huaraz Explorer Control Center</p>
            <button onClick={handleLogout} className="text-[10px] text-red-500 font-black uppercase hover:underline">Cerrar Sesión</button>
          </div>
        </div>
        
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl overflow-x-auto no-scrollbar">
            {(['stats', 'businesses', 'blog', 'map', 'config'] as const).map(tab => (
                <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg text-xs font-black uppercase transition-all whitespace-nowrap ${activeTab === tab ? 'bg-white dark:bg-gray-700 text-brand-blue shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    {tab === 'stats' ? 'Resumen' : tab === 'businesses' ? 'Negocios' : tab === 'blog' ? 'Blog' : tab === 'map' ? 'Mapa' : 'Config'}
                </button>
            ))}
        </div>
      </div>

      {activeTab === 'stats' && (
        <div className="space-y-8 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Negocios" value={businesses.length} icon="fa-briefcase" />
                <StatCard title="Posts Blog" value={blogPosts.length} icon="fa-newspaper" />
                <StatCard title="Imágenes Hero" value={heroImages.length} icon="fa-images" />
                <StatCard title="Cupones" value={coupons.length} icon="fa-ticket-alt" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 text-center">
                    <h3 className="font-black uppercase text-sm mb-6 text-brand-dark-blue dark:text-white tracking-widest flex items-center justify-center gap-2">
                        <i className="fas fa-qrcode text-brand-orange"></i> QR Acceso Rápido
                    </h3>
                    <div className="flex flex-col items-center gap-4">
                        <QrCodeGenerator value={window.location.origin} size={150} />
                        <p className="text-xs text-center text-gray-400 font-bold max-w-xs">Usa este código para que los turistas escaneen y entren directo a la web.</p>
                    </div>
                </div>
                <div className="bg-brand-dark-blue p-8 rounded-3xl shadow-xl text-white flex flex-col justify-center relative overflow-hidden">
                    <h3 className="font-black uppercase text-lg mb-4 tracking-tighter italic">Exportar Datos</h3>
                    <p className="text-white/70 text-sm mb-6">Descarga toda la base de datos actual en formato JSON para copias de seguridad.</p>
                    <button 
                        onClick={() => {
                            const data = { businesses, blogPosts, heroImages, socialLinks };
                            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `huaraz_explorer_full_data.json`;
                            a.click();
                        }}
                        className="bg-brand-green text-brand-dark-blue px-6 py-3 rounded-full font-black uppercase text-xs shadow-lg hover:scale-105 transition-transform"
                    >
                        Descargar JSON <i className="fas fa-download ml-2"></i>
                    </button>
                </div>
            </div>
        </div>
      )}

      {activeTab === 'config' && (
        <div className="animate-fadeIn max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-black text-brand-dark-blue dark:text-white uppercase tracking-tighter mb-8 flex items-center gap-3">
              <i className="fas fa-cog text-gray-400"></i> Configuración de Redes Sociales
            </h2>
            <form onSubmit={handleSaveSocial} className="space-y-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase text-pink-500 tracking-widest">
                  <i className="fab fa-instagram text-base"></i> Instagram URL
                </label>
                <input 
                  type="url" 
                  value={tempSocialLinks.instagram}
                  onChange={e => setTempSocialLinks({...tempSocialLinks, instagram: e.target.value})}
                  className="w-full p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border-none focus:ring-2 focus:ring-pink-500 transition-all"
                  placeholder="https://instagram.com/tu_usuario"
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-900 dark:text-white tracking-widest">
                  <i className="fab fa-tiktok text-base"></i> TikTok URL
                </label>
                <input 
                  type="url" 
                  value={tempSocialLinks.tiktok}
                  onChange={e => setTempSocialLinks({...tempSocialLinks, tiktok: e.target.value})}
                  className="w-full p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border-none focus:ring-2 focus:ring-gray-400 transition-all"
                  placeholder="https://tiktok.com/@tu_usuario"
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase text-red-600 tracking-widest">
                  <i className="fab fa-youtube text-base"></i> YouTube URL
                </label>
                <input 
                  type="url" 
                  value={tempSocialLinks.youtube}
                  onChange={e => setTempSocialLinks({...tempSocialLinks, youtube: e.target.value})}
                  className="w-full p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border-none focus:ring-2 focus:ring-red-500 transition-all"
                  placeholder="https://youtube.com/@tu_canal"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-brand-dark-blue text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-brand-blue transition-all active:scale-95"
              >
                Guardar Cambios <i className="fas fa-save ml-2"></i>
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'businesses' && (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-black text-brand-dark-blue dark:text-white uppercase tracking-tighter">Gestión de Negocios</h2>
                <button onClick={() => setShowBusinessForm(!showBusinessForm)} className="bg-brand-blue text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-lg">
                    {showBusinessForm ? 'Cerrar' : 'Añadir Negocio'}
                </button>
            </div>
            {showBusinessForm && (
                <form onSubmit={handleAddBusiness} className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl border-2 border-brand-blue space-y-4">
                    <input required type="text" placeholder="Nombre" className="w-full p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border-none" value={newBusiness.name} onChange={e => setNewBusiness({...newBusiness, name: e.target.value})} />
                    <button type="submit" className="w-full bg-brand-blue text-white py-4 rounded-xl font-black uppercase tracking-widest">Guardar Negocio</button>
                </form>
            )}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-900/50 text-[10px] uppercase font-black tracking-widest text-gray-400">
                        <tr><th className="px-6 py-4">Negocio</th><th className="px-6 py-4 text-right">Acciones</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {businesses.map(b => (
                            <tr key={b.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                                <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{b.name}</td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => deleteBusiness(b.id)} className="text-red-400 hover:text-red-600 p-2"><i className="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      )}

      {activeTab === 'blog' && (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-black text-brand-dark-blue dark:text-white uppercase tracking-tighter">Gestión de Blog</h2>
                <button onClick={() => setShowBlogForm(!showBlogForm)} className="bg-brand-orange text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-lg">
                    {showBlogForm ? 'Cerrar' : 'Escribir Artículo'}
                </button>
            </div>
            {showBlogForm && (
                <form onSubmit={handleAddBlogPost} className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl border-2 border-brand-orange space-y-4">
                    <input required type="text" placeholder="Título" className="w-full p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border-none" value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value})} />
                    <textarea placeholder="Contenido" className="w-full p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border-none h-64" value={newPost.content} onChange={e => setNewPost({...newPost, content: e.target.value})} />
                    <button type="submit" className="w-full bg-brand-orange text-white py-4 rounded-xl font-black uppercase tracking-widest">Publicar Artículo</button>
                </form>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogPosts.map(post => (
                    <div key={post.id} className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700">
                        <div className="h-32 bg-gray-200 dark:bg-gray-700 relative">
                            <img src={post.image} className="w-full h-full object-cover" alt={post.title} />
                            <button onClick={() => deleteBlogPost(post.id)} className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full shadow-lg"><i className="fas fa-trash-alt text-xs"></i></button>
                        </div>
                        <div className="p-4"><h4 className="font-bold text-gray-900 dark:text-white line-clamp-1">{post.title}</h4></div>
                    </div>
                ))}
            </div>
        </div>
      )}

      {activeTab === 'map' && (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isRepositionMode ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-400'}`}>
                        <i className="fas fa-crosshair"></i>
                    </div>
                    <div>
                        <h3 className="font-black uppercase text-xs tracking-widest text-gray-900 dark:text-white">Editor de Ubicaciones</h3>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                            {isRepositionMode ? 'Modo Arrastre Activo: Mueve los pines' : 'Mapa bloqueado: Solo lectura'}
                        </p>
                    </div>
                </div>
                <button 
                    onClick={() => setIsRepositionMode(!isRepositionMode)}
                    className={`px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg transition-all active:scale-95 ${
                        isRepositionMode 
                        ? 'bg-red-500 hover:bg-red-600 text-white' 
                        : 'bg-brand-blue hover:bg-blue-600 text-white'
                    }`}
                >
                    {isRepositionMode ? 'Bloquear Mapa y Guardar' : 'Activar Edición de Pins'}
                </button>
            </div>

            {lastMovedBusiness && (
                <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[100] bg-brand-green text-brand-dark-blue px-8 py-4 rounded-2xl shadow-2xl font-black uppercase text-xs animate-bounce flex items-center gap-3 border-2 border-white">
                    <i className="fas fa-check-circle"></i>
                    <span>{lastMovedBusiness.name} Actualizado!</span>
                </div>
            )}

            <div className={`h-[600px] rounded-[3rem] overflow-hidden shadow-2xl border-4 transition-all duration-300 relative ${isRepositionMode ? 'border-red-500/50 ring-8 ring-red-500/10' : 'border-white dark:border-gray-800'}`}>
                <StaticMap 
                    businesses={businesses}
                    isEditable={isRepositionMode}
                    onBusinessMove={handleMarkerMove}
                />
                
                {isRepositionMode && (
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-xl z-50 pointer-events-none italic">
                        <i className="fas fa-exclamation-triangle mr-2"></i> Estás editando el mapa en vivo
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
