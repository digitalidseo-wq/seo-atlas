import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { Search, Download, Copy, Code, Globe, Key } from 'lucide-react';

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

export default function SEOTool() {
  const [keyword, setKeyword] = useState('');
  const [country, setCountry] = useState('US');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isCodeGenerated, setIsCodeGenerated] = useState(false);
  
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleGenerateCode = () => {
    if (!keyword.trim()) {
      toast({
        title: t('enterKeyword'),
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
      title: `✅ ${t('codeGenerated')} "${keyword}" ${t('in')} ${country}`,
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
      title: `✅ ${t('codeDownloaded')}`,
    });
  };

  const handleCopyCode = async () => {
    if (!generatedCode) return;
    
    try {
      await navigator.clipboard.writeText(generatedCode);
      toast({
        title: `✅ ${t('codeCopied')}`,
      });
    } catch {
      toast({
        title: `❌ ${t('copyFailed')}`,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="shadow-elegant">
      <CardHeader>
        <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
          <Code className="h-6 w-6 text-primary" />
          {t('toolInterface')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="keyword" className="flex items-center gap-2 text-base">
                <Key className="h-4 w-4 text-success" />
                {t('targetKeyword')}
              </Label>
              <Input
                id="keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder={t('placeholderKeyword')}
                className="text-lg py-6"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country" className="flex items-center gap-2 text-base">
                <Globe className="h-4 w-4 text-destructive" />
                {t('targetCountry')}
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
                {t('generateCode')}
              </Button>
              
              <Button 
                onClick={handleDownloadCode}
                disabled={!isCodeGenerated}
                className="w-full bg-success text-success-foreground hover:bg-success/90"
                size="lg"
              >
                <Download className="h-5 w-5 mr-2" />
                {t('downloadCode')}
              </Button>
            </div>
          </div>

          {/* Preview Area */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Code className="h-5 w-5 text-primary" />
              {t('codePreview')}
            </h3>
            <div className="bg-slate-900 text-green-400 rounded-lg p-4 max-h-96 overflow-y-auto font-mono text-sm">
              <pre className="whitespace-pre-wrap">
                {generatedCode || `# ${t('selectKeyword')}\n# ${t('codeWillAppear')}`}
              </pre>
            </div>
            <Button
              onClick={handleCopyCode}
              disabled={!isCodeGenerated}
              variant="secondary"
              className="w-full"
            >
              <Copy className="h-4 w-4 mr-2" />
              {t('copyCode')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}