import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Button
      onClick={toggleLanguage}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      <Languages className="h-4 w-4" />
      <span>{language === 'ar' ? 'English' : 'العربية'}</span>
    </Button>
  );
}