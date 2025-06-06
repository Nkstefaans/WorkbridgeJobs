import { ADSENSE_CONFIG } from '@/lib/adsense-config';
import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';

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

  useEffect(() => {
    // Load AdSense script if not already loaded
    if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
      const script = document.createElement('script');
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CONFIG.CLIENT_ID}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }

    // Initialize ad
    try {
      if (window.adsbygoogle && adRef.current) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  return (
    <div 
      ref={adRef}
      className={cn('google-ad-container', className)}
      style={style}
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
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
    <GoogleAd
      adSlot={ADSENSE_CONFIG.AD_SLOTS.HEADER_BANNER}
      adFormat="auto"
      className={cn('w-full max-w-4xl mx-auto my-4', className)}
      style={{ minHeight: '90px' }}
    />
  );
}

export function SidebarAd({ className }: { className?: string }) {
  return (
    <GoogleAd
      adSlot={ADSENSE_CONFIG.AD_SLOTS.SIDEBAR_RECTANGLE}
      adFormat="rectangle"
      className={cn('w-full max-w-xs', className)}
      style={{ minHeight: '250px', width: '300px' }}
    />
  );
}

export function InContentAd({ className }: { className?: string }) {
  return (
    <div className={cn('my-8 flex justify-center', className)}>
      <div className="text-center">
        <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
          Advertisement
        </p>
        <GoogleAd
          adSlot={ADSENSE_CONFIG.AD_SLOTS.IN_CONTENT}
          adFormat="auto"
          className="w-full max-w-lg"
          style={{ minHeight: '200px' }}
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
          style={{ minHeight: '50px' }}
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
        style={{ minHeight: '90px' }}
      />
    </div>
  );
}
