import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Cookie, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  advertising: boolean;
  functional: boolean;
}

const defaultPreferences: CookiePreferences = {
  necessary: true, // Always required
  analytics: false,
  advertising: false,
  functional: false,
};

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);

  useEffect(() => {
    // Check if user has already made a choice
    const savedPreferences = localStorage.getItem('cookiePreferences');
    if (!savedPreferences) {
      setShowBanner(true);
    } else {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookiePreferences', JSON.stringify(prefs));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setPreferences(prefs);
    setShowBanner(false);
    setShowSettings(false);

    // Initialize tracking based on preferences
    if (prefs.analytics) {
      initializeGoogleAnalytics();
    }
    if (prefs.advertising) {
      initializeGoogleAds();
    }
  };

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      advertising: true,
      functional: true,
    };
    savePreferences(allAccepted);
  };

  const acceptNecessary = () => {
    savePreferences(defaultPreferences);
  };

  const initializeGoogleAnalytics = () => {
    // Initialize Google Analytics
    if (typeof window !== 'undefined' && !window.gtag) {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      const gtag = (...args: any[]) => {
        window.dataLayer.push(args);
      };
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', 'GA_MEASUREMENT_ID');
    }
  };

  const initializeGoogleAds = () => {
    // Initialize Google AdSense
    if (typeof window !== 'undefined' && !document.querySelector('script[src*="adsbygoogle.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX';
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }
  };

  if (!showBanner && !showSettings) return null;

  return (
    <>
      {/* Cookie Banner */}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background border-t shadow-lg">
          <Card className="max-w-6xl mx-auto">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <Cookie className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      We use cookies to enhance your experience
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      We use essential cookies to make our site work. We'd also like to set optional cookies to help us 
                      improve our website and show you relevant ads. We won't set optional cookies unless you enable them.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSettings(true)}
                    className="order-3 sm:order-1"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Customize
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={acceptNecessary}
                    className="order-2"
                  >
                    Necessary Only
                  </Button>
                  <Button
                    size="sm"
                    onClick={acceptAll}
                    className="order-1 sm:order-3"
                  >
                    Accept All
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Cookie Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cookie className="h-5 w-5" />
              Cookie Preferences
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We use different types of cookies to optimize your experience on our website. 
                You can choose which categories you'd like to allow.
              </p>
            </div>

            {/* Necessary Cookies */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h4 className="font-medium">Necessary Cookies</h4>
                  <Badge variant="secondary">Required</Badge>
                </div>
                <Checkbox checked={true} disabled />
              </div>
              <p className="text-sm text-muted-foreground">
                These cookies are essential for the website to function properly. They enable core functionality 
                such as security, network management, and accessibility.
              </p>
            </div>

            {/* Analytics Cookies */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Analytics Cookies</h4>
                <Checkbox
                  checked={preferences.analytics}
                  onCheckedChange={(checked) =>
                    setPreferences(prev => ({ ...prev, analytics: checked as boolean }))
                  }
                />
              </div>
              <p className="text-sm text-muted-foreground">
                These cookies help us understand how visitors interact with our website by collecting 
                and reporting information anonymously.
              </p>
            </div>

            {/* Advertising Cookies */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Advertising Cookies</h4>
                <Checkbox
                  checked={preferences.advertising}
                  onCheckedChange={(checked) =>
                    setPreferences(prev => ({ ...prev, advertising: checked as boolean }))
                  }
                />
              </div>
              <p className="text-sm text-muted-foreground">
                These cookies are used to make advertising messages more relevant to you and your interests. 
                They may also be used to limit the number of times you see an advertisement.
              </p>
            </div>

            {/* Functional Cookies */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Functional Cookies</h4>
                <Checkbox
                  checked={preferences.functional}
                  onCheckedChange={(checked) =>
                    setPreferences(prev => ({ ...prev, functional: checked as boolean }))
                  }
                />
              </div>
              <p className="text-sm text-muted-foreground">
                These cookies enable enhanced functionality and personalization, such as remembering your 
                preferences and improving your user experience.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setPreferences(defaultPreferences)}
                className="flex-1"
              >
                Reset to Default
              </Button>
              <Button
                onClick={() => savePreferences(preferences)}
                className="flex-1"
              >
                Save Preferences
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Hook to check if cookies are accepted
export function useCookieConsent() {
  const [preferences, setPreferences] = useState<CookiePreferences | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('cookiePreferences');
    if (saved) {
      setPreferences(JSON.parse(saved));
    }
  }, []);

  return {
    preferences,
    hasConsent: (type: keyof CookiePreferences) => preferences?.[type] || false,
    isLoaded: preferences !== null,
  };
}
