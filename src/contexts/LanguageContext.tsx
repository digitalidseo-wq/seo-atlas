import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations = {
  ar: {
    title: 'أداة بحث الكلمات المفتاحية SEO',
    subtitle: 'أداة شاملة لتحليل الكلمات المفتاحية والمنافسين مع تكامل Google APIs',
    toolInterface: 'واجهة الأداة',
    targetKeyword: 'الكلمة المفتاحية المستهدفة',
    targetCountry: 'الدولة المستهدفة',
    generateCode: 'إنشاء الكود المخصص',
    downloadCode: 'تحميل الكود',
    codePreview: 'معاينة الكود',
    copyCode: 'نسخ الكود',
    comprehensiveSearch: 'بحث شامل',
    searchDescription: 'تحليل النتائج باستخدام Google Custom Search API',
    competitorAnalysis: 'تحليل المنافسين',
    competitorDescription: 'تحليل عميق لصفحات المنافسين وبياناتهم',
    detailedReports: 'تقارير تفصيلية',
    reportsDescription: 'إنشاء تقارير Google Sheets تلقائياً',
    usageInstructions: 'تعليمات الاستخدام',
    usageSteps: 'خطوات الاستخدام:',
    step1: 'أدخل الكلمة المفتاحية المستهدفة في الحقل الأول',
    step2: 'اختر الدولة المستهدفة من القائمة المنسدلة',
    step3: 'اضغط على "إنشاء الكود المخصص" لتوليد الكود',
    step4: 'انسخ الكود من منطقة المعاينة أو حمله كملف',
    step5: 'افتح Google Colab وألصق الكود',
    step6: 'شغل الكود واتبع التعليمات',
    requirements: 'المتطلبات:',
    req1: 'حساب Google للمصادقة',
    req2: 'Google Colab (مجاني)',
    req3: 'مفتاح Custom Search API (مجاني حتى 100 استعلام/يوم)',
    req4: 'معرف محرك البحث المخصص',
    importantNotes: 'ملاحظات مهمة:',
    note1: 'قم بإضافة السعودية كدولة مدعومة في الكود',
    note2: 'الأداة تستغرق 2-5 دقائق لإكمال التحليل',
    note3: 'النتائج تُحفظ تلقائياً في Google Drive',
    note4: 'يتم احترام حدود API تلقائياً',
    apiConfiguration: 'إعدادات API',
    apiRequired: 'مطلوب: إعداد مفاتيح API',
    apiDescription: 'قبل استخدام الأداة، يجب إعداد مفاتيح Google APIs التالية في الكود:',
    apiLink: 'احصل على مفاتيح API من:',
    footerCopyright: '© 2024 أداة بحث الكلمات المفتاحية SEO - جميع الحقوق محفوظة',
    footerMade: 'صُنع بحب للمسوقين الرقميين',
    placeholderKeyword: 'مثال: تسويق رقمي',
    selectKeyword: 'اختر الكلمة المفتاحية والدولة لإنشاء الكود المخصص',
    codeWillAppear: 'ستظهر هنا معاينة الكود بعد الإنشاء',
    enterKeyword: 'يرجى إدخال الكلمة المفتاحية',
    codeGenerated: 'تم إنشاء الكود لـ',
    in: 'في',
    codeDownloaded: 'تم تحميل الكود بنجاح',
    codeCopied: 'تم نسخ الكود',
    copyFailed: 'فشل في نسخ الكود'
  },
  en: {
    title: 'SEO Keyword Research Tool',
    subtitle: 'Comprehensive tool for keyword and competitor analysis with Google APIs integration',
    toolInterface: 'Tool Interface',
    targetKeyword: 'Target Keyword',
    targetCountry: 'Target Country',
    generateCode: 'Generate Custom Code',
    downloadCode: 'Download Code',
    codePreview: 'Code Preview',
    copyCode: 'Copy Code',
    comprehensiveSearch: 'Comprehensive Search',
    searchDescription: 'Analysis using Google Custom Search API',
    competitorAnalysis: 'Competitor Analysis',
    competitorDescription: 'Deep analysis of competitor pages and data',
    detailedReports: 'Detailed Reports',
    reportsDescription: 'Automatic Google Sheets report generation',
    usageInstructions: 'Usage Instructions',
    usageSteps: 'Usage Steps:',
    step1: 'Enter your target keyword in the first field',
    step2: 'Select target country from the dropdown menu',
    step3: 'Click "Generate Custom Code" to create the code',
    step4: 'Copy code from preview area or download as file',
    step5: 'Open Google Colab and paste the code',
    step6: 'Run the code and follow instructions',
    requirements: 'Requirements:',
    req1: 'Google account for authentication',
    req2: 'Google Colab (free)',
    req3: 'Custom Search API key (free up to 100 queries/day)',
    req4: 'Custom Search Engine ID',
    importantNotes: 'Important Notes:',
    note1: 'Saudi Arabia has been added as a supported country',
    note2: 'Tool takes 2-5 minutes to complete analysis',
    note3: 'Results are automatically saved to Google Drive',
    note4: 'API rate limits are respected automatically',
    apiConfiguration: 'API Configuration',
    apiRequired: 'Required: API Keys Setup',
    apiDescription: 'Before using the tool, you need to set up the following Google APIs keys in the code:',
    apiLink: 'Get API keys from:',
    footerCopyright: '© 2024 SEO Keyword Research Tool - All rights reserved',
    footerMade: 'Made with love for digital marketers',
    placeholderKeyword: 'Example: digital marketing',
    selectKeyword: 'Select keyword and country to generate custom code',
    codeWillAppear: 'Code preview will appear here after generation',
    enterKeyword: 'Please enter a keyword',
    codeGenerated: 'Code generated for',
    in: 'in',
    codeDownloaded: 'Code downloaded successfully',
    codeCopied: 'Code copied to clipboard',
    copyFailed: 'Failed to copy code'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ar');

  const toggleLanguage = () => {
    const newLang = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['ar']] || key;
  };

  const isRTL = language === 'ar';

  useEffect(() => {
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
    document.body.className = isRTL ? 'font-arabic' : 'font-english';
  }, [language, isRTL]);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}