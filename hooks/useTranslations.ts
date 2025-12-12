
import { useAppContext } from '../context/AppContext';
import { messages } from '../i18n/locales';

export const useTranslations = () => {
  const { language } = useAppContext();

  const t = (key: keyof typeof messages.es) => {
    return messages[language][key] || key;
  };

  return t;
};