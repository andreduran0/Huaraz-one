
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useTranslations } from '../hooks/useTranslations';
import { Business } from '../types';
import QrCodeGenerator from '../components/QrCodeGenerator';

const StatCard: React.FC<{ title: string; value: string | number; icon: string }> = ({ title, value, icon }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center space-x-4">
    <div className="bg-teal-100 dark:bg-teal-900 p-3 rounded-full">
      <i className={`fas ${icon} text-2xl text-teal-600 dark:text-teal-400`}></i>
    </div>
    <div>
      <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  </div>
);

const AdminPage: React.FC = () => {
  const { businesses, coupons } = useAppContext();
  const t = useTranslations();

  const pendingBusinesses = businesses.filter(b => b.status === 'pending');
  const approvedBusinesses = businesses.filter(b => b.status === 'approved');
  const mapUrl = `${window.location.origin}${window.location.pathname}#/map`;


  // Mock actions
  const handleApprove = (id: string) => alert(`Business ${id} approved! (Mock action)`);
  const handleReject = (id: string) => alert(`Business ${id} rejected! (Mock action)`);
  const handleCreateCoupon = () => alert(`Create coupon form would open. (Mock action)`);
  const handleSendNewsletter = () => alert(`Newsletter sent! (Mock action)`);


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">{t('admin.title')}</h1>
      
      <section>
        <h2 className="text-xl font-semibold mb-4">{t('admin.stats')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Businesses" value={businesses.length} icon="fa-briefcase" />
          <StatCard title="Approved" value={approvedBusinesses.length} icon="fa-check-circle" />
          <StatCard title="Pending" value={pendingBusinesses.length} icon="fa-hourglass-half" />
          <StatCard title="Active Coupons" value={coupons.length} icon="fa-ticket-alt" />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">{t('admin.pending')}</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
          {pendingBusinesses.length > 0 ? (
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 dark:bg-gray-700 text-xs uppercase">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingBusinesses.map(business => (
                  <tr key={business.id} className="border-b dark:border-gray-700">
                    <td className="px-6 py-4 font-medium">{business.name}</td>
                    <td className="px-6 py-4">{t(`category.${business.category}` as keyof ReturnType<typeof useTranslations>)}</td>
                    <td className="px-6 py-4 space-x-2">
                      <button onClick={() => handleApprove(business.id)} className="font-medium text-green-600 hover:underline">{t('admin.approve')}</button>
                      <button onClick={() => handleReject(business.id)} className="font-medium text-red-600 hover:underline">{t('admin.reject')}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="p-6 text-gray-500">No pending businesses.</p>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">{t('admin.actions')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-lg mb-4">Herramientas de Marketing</h3>
                <div className="flex flex-wrap gap-4">
                    <button onClick={handleCreateCoupon} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700">
                        <i className="fas fa-plus-circle mr-2"></i>{t('admin.createCoupon')}
                    </button>
                    <button onClick={handleSendNewsletter} className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700">
                        <i className="fas fa-paper-plane mr-2"></i>{t('admin.sendNewsletter')}
                    </button>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
                <h3 className="font-bold text-lg mb-2">{t('admin.mapQr')}</h3>
                <div className="flex justify-center">
                  <QrCodeGenerator value={mapUrl} />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{t('admin.mapQr.description')}</p>
            </div>
        </div>
      </section>
    </div>
  );
};

export default AdminPage;