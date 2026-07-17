
import { useUser, useDoc } from '@/firebase';
import { translations, type Language } from '@/lib/translations';

export function useTranslation() {
  const { user } = useUser();

  const { data: profile } = useDoc<any>(user ? { table: 'users', id: user.uid } : null);

  const currentLanguage: Language = (profile?.preferredLanguage as Language) || 'English';

  const t = (key: string) => {
    return translations[currentLanguage]?.[key] || translations['English'][key] || key;
  };

  return { t, currentLanguage };
}
