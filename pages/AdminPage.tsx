
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useTranslations } from '../hooks/useTranslations';
import QrCodeGenerator from '../components/QrCodeGenerator';
import StaticMap from '../components/StaticMap';

const StatCard: React.FC<{ title: string; value: string | number; icon: string }> = ({ title, value, icon }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center space-x-4 border border-gray-100 dark:border-gray-700">
    <div className="bg-teal-100 dark:bg-teal-900/30 p-3 rounded-full">
      <i className={`fas ${icon} text-2xl text-teal-600 dark:text-teal-400`}></i>
    </div>
    <div>
      <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  </div>
);

const AdminPage: React.FC = () => {
  const { businesses, coupons, updateBusiness } = useAppContext();
  const t = useTranslations();
  const [isRepositionMode, setIsRepositionMode] = useState(false);

  const pendingBusinesses = businesses.filter(b => b.status === 'pending');
  const approvedBusinesses = businesses.filter(b => b.status === 'approved');
  const mapUrl = `${window.location.origin}${window.location.pathname}#/map`;
  const mapImageUrl = "https://i.imgur.com/G8W2FRt.jpeg";

  const handleMarkerMove = (id: string, lat: number, lng: number) => {
    const business = businesses.find(b => b.id === id);
    if (business) {
      updateBusiness({ ...business, lat, lng });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('admin.title')}</h1>
          <p className="text-gray-500 dark:text-gray-400">Panel de control de Huaraz Explorer</p>
        </div>
        <div className="flex items-center gap-4">
            <div className="flex items-center bg-white dark:bg-gray-800 p-2 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <span className="text-xs font-bold mr-3 uppercase text-gray-500">Modo Reposición</span>
                <button 
                    onClick={() => setIsRepositionMode(!isRepositionMode)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isRepositionMode ? 'bg-brand-green' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isRepositionMode ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
            </div>
            <button className="bg-brand-dark-blue text-white px-4 py-2 rounded-lg font-bold shadow-md hover:bg-blue-800">
                <i className="fas fa-plus-circle mr-2"></i>Nuevo Negocio
            </button>
        </div>
      </div>
      
      {/* Stats Grid */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Negocios" value={businesses.length} icon="fa-briefcase" />
          <StatCard title="Aprobados" value={approvedBusinesses.length} icon="fa-check-circle" />
          <StatCard title="Pendientes" value={pendingBusinesses.length} icon="fa-hourglass-half" />
          <StatCard title="Cupones Activos" value={coupons.length} icon="fa-ticket-alt" />
        </div>
      </section>

      {/* Main Admin Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Visual Map Editor (Full Span when active) */}
        <div className="lg:col-span-3">
            <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 h-[500px] relative">
                <div className="absolute top-4 left-4 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                    <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <i className={`fas fa-map-marker-alt ${isRepositionMode ? 'text-brand-green' : 'text-gray-400'}`}></i>
                        Mapa de Ubicaciones
                    </h2>
                    <p className="text-[10px] text-gray-500 mt-1">
                        {isRepositionMode ? 'ARRASTRA los círculos para cambiar su posición.' : 'Activa el interruptor arriba para mover negocios.'}
                    </p>
                </div>
                
                <StaticMap 
                    imageUrl={mapImageUrl}
                    businesses={businesses}
                    isEditable={isRepositionMode}
                    onBusinessMove={handleMarkerMove}
                />
            </section>
        </div>

        {/* Pending Approvals Section */}
        <div className="lg:col-span-2">
            <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold">{t('admin.pending')}</h2>
                </div>
                <div className="overflow-x-auto">
                    {pendingBusinesses.length > 0 ? (
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase text-gray-500">
                                <tr>
                                    <th className="px-6 py-4">Negocio</th>
                                    <th className="px-6 py-4">Categoría</th>
                                    <th className="px-6 py-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {pendingBusinesses.map(business => (
                                    <tr key={business.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900 dark:text-white">{business.name}</div>
                                            <div className="text-xs text-gray-500">{business.address}</div>
                                        </td>
                                        <td className="px-6 py-4 uppercase text-[10px] font-bold">{business.category}</td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button className="text-green-600 font-bold hover:underline">{t('admin.approve')}</button>
                                            <button className="text-red-500 font-bold hover:underline">{t('admin.reject')}</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-12 text-center text-gray-400 italic">No hay solicitudes pendientes</div>
                    )}
                </div>
            </section>
        </div>

        {/* QR & Quick Actions */}
        <div className="space-y-6">
            <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 text-center">
                <h3 className="font-bold text-lg mb-4">{t('admin.mapQr')}</h3>
                <div className="flex justify-center bg-gray-50 dark:bg-gray-900 p-4 rounded-xl mb-4">
                  <QrCodeGenerator value={mapUrl} size={150} />
                </div>
                <button className="w-full py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-bold">
                    <i className="fas fa-download mr-2"></i>Descargar QR
                </button>
            </section>

            <section className="bg-gradient-to-br from-brand-dark-blue to-blue-900 p-6 rounded-2xl shadow-xl text-white">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                    <i className="fas fa-bolt text-brand-accent"></i>
                    {t('admin.actions')}
                </h3>
                <div className="grid grid-cols-1 gap-3">
                    <button className="flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 rounded-xl text-left border border-white/10 group">
                        <div className="w-10 h-10 rounded-full bg-blue-400/20 flex items-center justify-center"><i className="fas fa-ticket-alt"></i></div>
                        <div>
                            <div className="font-bold text-sm">{t('admin.createCoupon')}</div>
                            <div className="text-[10px] text-white/60">Lanza ofertas rápidas</div>
                        </div>
                    </button>
                    <button className="flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 rounded-xl text-left border border-white/10 group">
                        <div className="w-10 h-10 rounded-full bg-purple-400/20 flex items-center justify-center"><i className="fas fa-envelope"></i></div>
                        <div>
                            <div className="font-bold text-sm">{t('admin.sendNewsletter')}</div>
                            <div className="text-[10px] text-white/60">Notifica a los suscriptores</div>
                        </div>
                    </button>
                </div>
            </section>
        </div>

      </div>
    </div>
  );
};

export default AdminPage;
