import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Search, Download, Copy, Code, Globe, Key, Languages, TrendingUp, Users, BarChart3, BookOpen, AlertCircle, Heart } from 'lucide-react';

// Translation hook
const useTranslation = () => {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const isRTL = language === 'ar';

  const t = (ar: string, en: string) => language === 'ar' ? ar : en;

  const toggleLanguage = () => {
    const newLang = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLang);
  };

  useEffect(() => {
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
    document.body.className = language === 'ar' ? 'font-arabic' : 'font-english';
    
    // Update page title and meta
    const title = t(
      'أداة بحث الكلمات المفتاحية SEO - مولد أكواد Python للتحليل',
      'SEO Keyword Research Tool - Python Code Generator for Analysis'
    );
    document.title = title;
    
    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', t(
        'أداة مجانية لإنشاء أكواد Python مخصصة لبحث الكلمات المفتاحية وتحليل المنافسين باستخدام Google APIs. مولد كود للباحثين في SEO.',
        'Free tool to generate custom Python codes for SEO keyword research and competitor analysis using Google APIs. Code generator for SEO researchers.'
      ));
    }
  }, [language, isRTL, t]);

  return { t, toggleLanguage, language, isRTL };
};

const countries = [
  { code: 'US', name: 'الولايات المتحدة - United States', flag: '🇺🇸' },
  { code: 'SA', name: 'السعودية - Saudi Arabia', flag: '🇸🇦' },
  { code: 'AE', name: 'الإمارات - UAE', flag: '🇦🇪' },
  { code: 'EG', name: 'مصر - Egypt', flag: '🇪🇬' },
  { code: 'UK', name: 'المملكة المتحدة - United Kingdom', flag: '🇬🇧' },
  { code: 'CA', name: 'كندا - Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'أستراليا - Australia', flag: '🇦🇺' },
  { code: 'DE', name: 'ألمانيا - Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'فرنسا - France', flag: '🇫🇷' },
  { code: 'IT', name: 'إيطاليا - Italy', flag: '🇮🇹' },
  { code: 'ES', name: 'إسبانيا - Spain', flag: '🇪🇸' },
  { code: 'JP', name: 'اليابان - Japan', flag: '🇯🇵' },
  { code: 'BR', name: 'البرازيل - Brazil', flag: '🇧🇷' },
  { code: 'IN', name: 'الهند - India', flag: '🇮🇳' }
];

const baseCode = `# SEO Keyword Research Tool - Generated Code
import pandas as pd, numpy as np, time, re, json, os, warnings
from datetime import datetime
from urllib.parse import urljoin, urlparse
from collections import Counter
warnings.filterwarnings('ignore')

import gspread
from google.auth import default
from google.colab import auth
from googleapiclient.discovery import build
from google.auth.transport.requests import Request

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from bs4 import BeautifulSoup
import requests

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
from sklearn.metrics.pairwise import cosine_similarity

class Config:
    CUSTOM_SEARCH_API_KEY = "YOUR_API_KEY_HERE"
    CUSTOM_SEARCH_ENGINE_ID = "YOUR_ENGINE_ID_HERE"
    SEARCH_RESULTS_LIMIT = 10
    REQUEST_DELAY = 2
    TIMEOUT = 15
    MAX_CLUSTERS = 5
    SHEET_NAME_PREFIX = "SEO_Research_"
    HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
    COUNTRY_CODES = {
        'US': 'us', 'UK': 'uk', 'CA': 'ca', 'AU': 'au', 'DE': 'de', 
        'FR': 'fr', 'IT': 'it', 'ES': 'es', 'JP': 'jp', 'BR': 'br',
        'IN': 'in', 'SA': 'sa', 'AE': 'ae', 'EG': 'eg'
    }

class APIManager:
    def __init__(self):
        self.sheets_service = None
        self.custom_search_service = None
        self.gspread_client = None
        self.credentials = None
    
    def setup_authentication(self):
        try:
            auth.authenticate_user()
            self.credentials, _ = default()
            self.gspread_client = gspread.authorize(self.credentials)
            self.custom_search_service = build('customsearch', 'v1', developerKey=Config.CUSTOM_SEARCH_API_KEY)
            print("✅ Authentication successful!")
            return True
        except Exception as e:
            print(f"❌ Authentication failed: {e}")
            return False
    
    def create_research_sheet(self, keyword):
        try:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M')
            sheet_name = f"{Config.SHEET_NAME_PREFIX}{keyword.replace(' ', '_')}_{timestamp}"
            spreadsheet = self.gspread_client.create(sheet_name)
            spreadsheet.share('', perm_type='anyone', role='reader')
            print(f"✅ Created sheet: {spreadsheet.url}")
            return spreadsheet
        except Exception as e:
            print(f"❌ Failed to create sheet: {e}")
            return None

def setup_selenium_driver():
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--window-size=1920,1080')
    try:
        driver = webdriver.Chrome(options=chrome_options)
        return driver
    except Exception as e:
        print(f"❌ WebDriver failed: {e}")
        return None

class SEOResearchTool:
    def __init__(self):
        self.api_manager = APIManager()
        self.driver = None
    
    def initialize(self):
        if not self.api_manager.setup_authentication():
            return False
        self.driver = setup_selenium_driver()
        return self.driver is not None
    
    def perform_search(self, keyword, country):
        try:
            result = self.api_manager.custom_search_service.cse().list(
                q=keyword, cx=Config.CUSTOM_SEARCH_ENGINE_ID, 
                gl=Config.COUNTRY_CODES.get(country, 'us'), num=10
            ).execute()
            return result.get('items', [])
        except Exception as e:
            print(f"❌ Search failed: {e}")
            return []
    
    def run_research(self, keyword, country):
        print(f"🎯 Starting research for: {keyword} in {country}")
        if not self.initialize():
            return False
        
        # Create sheet
        sheet = self.api_manager.create_research_sheet(keyword)
        if not sheet:
            return False
            
        # Perform search
        results = self.perform_search(keyword, country)
        if not results:
            print("❌ No results found")
            return False
            
        # Create basic report
        headers = ['Position', 'Title', 'URL', 'Snippet']
        rows = [headers]
        
        for i, item in enumerate(results):
            rows.append([
                i + 1,
                item.get('title', ''),
                item.get('link', ''),
                item.get('snippet', '')
            ])
        
        worksheet = sheet.sheet1
        worksheet.update('A1', rows)
        worksheet.format('A1:D1', {'textFormat': {'bold': True}})
        
        print(f"✅ Research completed! Results: {sheet.url}")
        return True
    
    def cleanup(self):
        if self.driver:
            self.driver.quit()

# Main execution
def main():
    TARGET_KEYWORD = "{{KEYWORD}}"
    TARGET_COUNTRY = "{{COUNTRY}}"
    
    tool = SEOResearchTool()
    try:
        success = tool.run_research(TARGET_KEYWORD, TARGET_COUNTRY)
        if success:
            print("🎉 Research completed successfully!")
        else:
            print("❌ Research failed")
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        tool.cleanup()

if __name__ == "__main__":
    main()
`;

function SEOTool() {
  const [keyword, setKeyword] = useState('');
  const [country, setCountry] = useState('US');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isCodeGenerated, setIsCodeGenerated] = useState(false);
  
  const { t } = useTranslation();
  const { toast } = useToast();

  const handleGenerateCode = () => {
    if (!keyword.trim()) {
      toast({
        title: t('يرجى إدخال الكلمة المفتاحية', 'Please enter a keyword'),
        variant: "destructive",
      });
      return;
    }

    const code = baseCode
      .replace('{{KEYWORD}}', keyword)
      .replace('{{COUNTRY}}', country);
    
    setGeneratedCode(code);
    setIsCodeGenerated(true);
    
    toast({
      title: `✅ ${t('تم إنشاء الكود لـ', 'Code generated for')} "${keyword}" ${t('في', 'in')} ${country}`,
    });
  };

  const handleDownloadCode = () => {
    if (!generatedCode) return;
    
    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seo_tool_${keyword.replace(/\s+/g, '_')}.py`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: `✅ ${t('تم تحميل الكود بنجاح', 'Code downloaded successfully')}`,
    });
  };

  const handleCopyCode = async () => {
    if (!generatedCode) return;
    
    try {
      await navigator.clipboard.writeText(generatedCode);
      toast({
        title: `✅ ${t('تم نسخ الكود', 'Code copied to clipboard')}`,
      });
    } catch {
      toast({
        title: `❌ ${t('فشل في نسخ الكود', 'Failed to copy code')}`,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="shadow-elegant">
      <CardHeader>
        <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
          <Code className="h-6 w-6 text-primary" />
          {t('واجهة الأداة', 'Tool Interface')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="keyword" className="flex items-center gap-2 text-base">
                <Key className="h-4 w-4 text-success" />
                {t('الكلمة المفتاحية المستهدفة', 'Target Keyword')}
              </Label>
              <Input
                id="keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder={t('مثال: تسويق رقمي', 'Example: digital marketing')}
                className="text-lg py-6"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country" className="flex items-center gap-2 text-base">
                <Globe className="h-4 w-4 text-destructive" />
                {t('الدولة المستهدفة', 'Target Country')}
              </Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger className="text-lg py-6">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      <span className="flex items-center gap-2">
                        <span>{c.flag}</span>
                        <span>{c.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handleGenerateCode}
                className="w-full bg-gradient-primary hover:bg-gradient-primary/90 text-primary-foreground shadow-primary hover:shadow-glow transition-all duration-300"
                size="lg"
              >
                <Search className="h-5 w-5 mr-2" />
                {t('إنشاء الكود المخصص', 'Generate Custom Code')}
              </Button>
              
              <Button 
                onClick={handleDownloadCode}
                disabled={!isCodeGenerated}
                className="w-full bg-success text-success-foreground hover:bg-success/90"
                size="lg"
              >
                <Download className="h-5 w-5 mr-2" />
                {t('تحميل الكود', 'Download Code')}
              </Button>
            </div>
          </div>

          {/* Preview Area */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Code className="h-5 w-5 text-primary" />
              {t('معاينة الكود', 'Code Preview')}
            </h3>
            <div className="bg-slate-900 text-green-400 rounded-lg p-4 max-h-96 overflow-y-auto font-mono text-sm">
              <pre className="whitespace-pre-wrap">
                {generatedCode || `# ${t('اختر الكلمة المفتاحية والدولة لإنشاء الكود المخصص', 'Select keyword and country to generate custom code')}\n# ${t('ستظهر هنا معاينة الكود بعد الإنشاء', 'Code preview will appear here after generation')}`}
              </pre>
            </div>
            <Button
              onClick={handleCopyCode}
              disabled={!isCodeGenerated}
              variant="secondary"
              className="w-full"
            >
              <Copy className="h-4 w-4 mr-2" />
              {t('نسخ الكود', 'Copy Code')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const Index = () => {
  const { t, toggleLanguage, language } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
              <Search className="h-8 w-8 md:h-12 md:w-12" />
              {t('أداة بحث الكلمات المفتاحية SEO', 'SEO Keyword Research Tool')}
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-2">
              {language === 'ar' ? 'SEO Keyword Research Tool' : 'أداة بحث الكلمات المفتاحية SEO'}
            </p>
            <p className="text-lg opacity-80 max-w-3xl mx-auto">
              {t(
                'أداة شاملة لتحليل الكلمات المفتاحية والمنافسين مع تكامل Google APIs',
                'Comprehensive tool for keyword and competitor analysis with Google APIs integration'
              )}
            </p>
          </div>
        </div>
      </header>

      {/* Language Toggle */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-end">
          <Button
            onClick={toggleLanguage}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Languages className="h-4 w-4" />
            <span>{language === 'ar' ? 'English' : 'العربية'}</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Tool Interface */}
        <section>
          <SEOTool />
        </section>

        {/* Features Section */}
        <section>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center p-6">
              <div className="text-primary text-4xl mb-4 flex justify-center">
                <TrendingUp className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {t('بحث شامل', 'Comprehensive Search')}
              </h3>
              <p className="text-muted-foreground">
                {t('تحليل النتائج باستخدام Google Custom Search API', 'Analysis using Google Custom Search API')}
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="text-success text-4xl mb-4 flex justify-center">
                <Users className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {t('تحليل المنافسين', 'Competitor Analysis')}
              </h3>
              <p className="text-muted-foreground">
                {t('تحليل عميق لصفحات المنافسين وبياناتهم', 'Deep analysis of competitor pages and data')}
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="text-info text-4xl mb-4 flex justify-center">
                <BarChart3 className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {t('تقارير تفصيلية', 'Detailed Reports')}
              </h3>
              <p className="text-muted-foreground">
                {t('إنشاء تقارير Google Sheets تلقائياً', 'Automatic Google Sheets report generation')}
              </p>
            </Card>
          </div>
        </section>

        {/* Instructions */}
        <section>
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-warning" />
              {t('تعليمات الاستخدام', 'Usage Instructions')}
            </h2>

            <div className="space-y-6">
              <div className="bg-primary/10 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">
                  {t('خطوات الاستخدام:', 'Usage Steps:')}
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-foreground/80">
                  <li>{t('أدخل الكلمة المفتاحية المستهدفة في الحقل الأول', 'Enter your target keyword in the first field')}</li>
                  <li>{t('اختر الدولة المستهدفة من القائمة المنسدلة', 'Select target country from the dropdown menu')}</li>
                  <li>{t('اضغط على "إنشاء الكود المخصص" لتوليد الكود', 'Click "Generate Custom Code" to create the code')}</li>
                  <li>{t('انسخ الكود من منطقة المعاينة أو حمله كملف', 'Copy code from preview area or download as file')}</li>
                  <li>{t('افتح Google Colab وألصق الكود', 'Open Google Colab and paste the code')}</li>
                  <li>{t('شغل الكود واتبع التعليمات', 'Run the code and follow instructions')}</li>
                </ol>
              </div>

              <div className="bg-success/10 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">
                  {t('المتطلبات:', 'Requirements:')}
                </h3>
                <ul className="list-disc list-inside space-y-2 text-foreground/80">
                  <li>{t('حساب Google للمصادقة', 'Google account for authentication')}</li>
                  <li>{t('Google Colab (مجاني)', 'Google Colab (free)')}</li>
                  <li>{t('مفتاح Custom Search API (مجاني حتى 100 استعلام/يوم)', 'Custom Search API key (free up to 100 queries/day)')}</li>
                  <li>{t('معرف محرك البحث المخصص', 'Custom Search Engine ID')}</li>
                </ul>
              </div>

              <div className="bg-warning/10 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">
                  {t('ملاحظات مهمة:', 'Important Notes:')}
                </h3>
                <ul className="list-disc list-inside space-y-2 text-foreground/80">
                  <li>{t('قم بإضافة السعودية كدولة مدعومة في الكود', 'Saudi Arabia has been added as a supported country')}</li>
                  <li>{t('الأداة تستغرق 2-5 دقائق لإكمال التحليل', 'Tool takes 2-5 minutes to complete analysis')}</li>
                  <li>{t('النتائج تُحفظ تلقائياً في Google Drive', 'Results are automatically saved to Google Drive')}</li>
                  <li>{t('يتم احترام حدود API تلقائياً', 'API rate limits are respected automatically')}</li>
                </ul>
              </div>
            </div>
          </Card>
        </section>

        {/* API Configuration */}
        <section>
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-destructive" />
              {t('إعدادات API', 'API Configuration')}
            </h2>

            <div className="bg-destructive/10 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">
                {t('مطلوب: إعداد مفاتيح API', 'Required: API Keys Setup')}
              </h3>
              <p className="mb-4">
                {t(
                  'قبل استخدام الأداة، يجب إعداد مفاتيح Google APIs التالية في الكود:',
                  'Before using the tool, you need to set up the following Google APIs keys in the code:'
                )}
              </p>
              
              <div className="bg-background p-4 rounded border-l-4 border-destructive font-mono text-sm">
                <p>CUSTOM_SEARCH_API_KEY = "your_api_key_here"</p>
                <p>CUSTOM_SEARCH_ENGINE_ID = "your_engine_id_here"</p>
              </div>
              
              <p className="text-sm mt-4">
                {t('احصل على مفاتيح API من: ', 'Get API keys from: ')}
                <a href="https://developers.google.com/custom-search/v1/overview" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Google Custom Search API
                </a>
              </p>
            </div>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2">
            {t(
              '© 2024 أداة بحث الكلمات المفتاحية SEO - جميع الحقوق محفوظة',
              '© 2024 SEO Keyword Research Tool - All rights reserved'
            )}
          </p>
          <p className="text-gray-400 flex items-center justify-center gap-2">
            <Heart className="h-4 w-4 text-red-500" />
            {t('صُنع بحب للمسوقين الرقميين', 'Made with love for digital marketers')}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;