
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useTranslations } from '../hooks/useTranslations';
import { Link } from 'react-router-dom';

const CouponsPage: React.FC = () => {
  const { coupons, businesses } = useAppContext();
  const t = useTranslations();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">{t('coupons.title')}</h1>
        <p className="text-gray-600 dark:text-gray-400">{t('coupons.available')}</p>
      </div>
      
      {coupons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coupons.map(coupon => {
            const business = businesses.find(b => b.id === coupon.businessId);
            if (!business) return null;

            return (
              <div key={coupon.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border-l-4 border-teal-500 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">{coupon.title}</h2>
                      <Link to={`/business/${business.id}`} className="text-sm font-semibold text-teal-600 hover:underline">
                        {business.name}
                      </Link>
                    </div>
                    <div className="bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 text-lg font-mono p-2 rounded-md border-2 border-dashed border-teal-300">
                      {coupon.code}
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">{coupon.description}</p>
                </div>
                <div className="text-right text-xs text-gray-500 mt-4">
                  <span>{t('coupons.validUntil')} {new Date(coupon.expiryDate).toLocaleDateString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-500">No hay cupones disponibles en este momento.</p>
      )}
    </div>
  );
};

export default CouponsPage;