import { ADSENSE_CONFIG } from '@/lib/adsense-config';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface GoogleAdProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  adLayout?: string;
  adLayoutKey?: string;
  className?: string;
  style?: React.CSSProperties;
  fullWidthResponsive?: boolean;
}

export function GoogleAd({
  adSlot,
  adFormat = 'auto',
  adLayout,
  adLayoutKey,
  className = '',
  style = {},
  fullWidthResponsive = true
}: GoogleAdProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Don't load ads in development or if using placeholder ad slots
    if (process.env.NODE_ENV === 'development' || adSlot.startsWith('1234567')) {
      return;
    }

    // Load AdSense script if not already loaded
    if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
      const script = document.createElement('script');
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CONFIG.CLIENT_ID}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }

    // Wait for script to load and container to be ready
    const initAd = () => {
      try {
        if (window.adsbygoogle && adRef.current && !isLoaded) {
          // Ensure the container has proper dimensions
          const container = adRef.current;
          if (container.offsetWidth > 0 && container.offsetHeight > 0) {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            setIsLoaded(true);
          }
        }
      } catch (error) {
        console.error('AdSense error:', error);
      }
    };

    // Delay initialization to ensure proper layout
    const timer = setTimeout(initAd, 100);
    return () => clearTimeout(timer);
  }, [adSlot, isLoaded]);

  // Show placeholder in development
  if (process.env.NODE_ENV === 'development' || adSlot.startsWith('1234567')) {
    return (
      <div 
        className={cn('bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500 text-sm', className)}
        style={style}
      >
        Ad Placeholder ({adFormat})
      </div>
    );
  }

  return (
    <div 
      ref={adRef}
      className={cn('google-ad-container overflow-hidden', className)}
      style={{ minWidth: '280px', ...style }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', height: '100%' }}
        data-ad-client={ADSENSE_CONFIG.CLIENT_ID}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-ad-layout={adLayout}
        data-ad-layout-key={adLayoutKey}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />
    </div>
  );
}

// Predefined ad components for common use cases
export function HeaderBannerAd({ className }: { className?: string }) {
  return (
    <div className={cn('w-full flex justify-center', className)}>
      <GoogleAd
        adSlot={ADSENSE_CONFIG.AD_SLOTS.HEADER_BANNER}
        adFormat="auto"
        className="w-full max-w-4xl"
        style={{ minHeight: '90px', minWidth: '320px' }}
      />
    </div>
  );
}

export function SidebarAd({ className }: { className?: string }) {
  return (
    <div className={cn('w-full', className)}>
      <GoogleAd
        adSlot={ADSENSE_CONFIG.AD_SLOTS.SIDEBAR_RECTANGLE}
        adFormat="rectangle"
        className="w-full"
        style={{ 
          minHeight: '250px', 
          width: '100%', 
          maxWidth: '300px',
          minWidth: '250px'
        }}
      />
    </div>
  );
}

export function InContentAd({ className }: { className?: string }) {
  return (
    <div className={cn('my-8 flex justify-center', className)}>
      <div className="text-center w-full max-w-2xl">
        <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
          Advertisement
        </p>
        <GoogleAd
          adSlot={ADSENSE_CONFIG.AD_SLOTS.IN_CONTENT}
          adFormat="auto"
          className="w-full"
          style={{ minHeight: '200px', minWidth: '320px' }}
        />
      </div>
    </div>
  );
}

export function MobileStickyAd() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden">
      <div className="flex justify-center p-2">
        <GoogleAd
          adSlot={ADSENSE_CONFIG.AD_SLOTS.MOBILE_STICKY}
          adFormat="auto"
          className="w-full max-w-sm"
          style={{ minHeight: '50px', minWidth: '320px' }}
        />
      </div>
    </div>
  );
}

export function FooterAd({ className }: { className?: string }) {
  return (
    <div className={cn('w-full flex justify-center py-4', className)}>
      <GoogleAd
        adSlot={ADSENSE_CONFIG.AD_SLOTS.FOOTER_BANNER}
        adFormat="auto"
        className="w-full max-w-4xl"
        style={{ minHeight: '90px', minWidth: '320px' }}
      />
    </div>
  );
}
