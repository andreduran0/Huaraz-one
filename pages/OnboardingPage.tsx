
import React from 'react';
import { useTranslations } from '../hooks/useTranslations';

const PlanCard: React.FC<{
  title: string;
  price: string;
  features: string[];
  isPremium?: boolean;
}> = ({ title, price, features, isPremium }) => {
  const t = useTranslations();
  const handleSelectPlan = () => {
    // Mock payment flow
    alert(`Redirecting to payment for ${title}. (Mock action)`);
  };

  return (
    <div className={`border rounded-xl p-8 flex flex-col ${isPremium ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20' : 'border-gray-300 dark:border-gray-700'}`}>
      {isPremium && <span className="text-center bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full -mt-12 mx-auto shadow-lg">Más Popular</span>}
      <h3 className="text-2xl font-bold text-center mt-4">{title}</h3>
      <p className="text-4xl font-extrabold text-center my-4">{price}</p>
      <ul className="space-y-3 mb-8 flex-grow">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center">
            <i className="fas fa-check-circle text-green-500 mr-3"></i>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <button onClick={handleSelectPlan} className={`w-full py-3 rounded-lg font-semibold transition-colors ${isPremium ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>
        {t('onboarding.selectPlan')}
      </button>
    </div>
  );
};


const OnboardingPage: React.FC = () => {
  const t = useTranslations();

  return (
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">{t('onboarding.title')}</h1>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">{t('onboarding.subtitle')}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 text-left">
        <PlanCard
          title={t('onboarding.standard.title')}
          price={t('onboarding.standard.price')}
          features={[
            t('onboarding.standard.feature1'),
            t('onboarding.standard.feature2'),
            t('onboarding.standard.feature3'),
          ]}
        />
        <PlanCard
          title={t('onboarding.premium.title')}
          price={t('onboarding.premium.price')}
          features={[
            t('onboarding.premium.feature1'),
            t('onboarding.premium.feature2'),
            t('onboarding.premium.feature3'),
            t('onboarding.premium.feature4'),
          ]}
          isPremium
        />
      </div>
    </div>
  );
};

export default OnboardingPage;