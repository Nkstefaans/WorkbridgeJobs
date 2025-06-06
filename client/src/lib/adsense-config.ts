// Google AdSense Configuration for WorkbridgeJobs
// Replace the values below with your actual AdSense credentials

export const ADSENSE_CONFIG = {
  // Replace with your AdSense Client ID after approval
  CLIENT_ID: 'ca-pub-XXXXXXXXXX',
  
  // Replace with your actual ad slot IDs after setting up ad units
  AD_SLOTS: {
    HEADER_BANNER: '1234567890',
    SIDEBAR_RECTANGLE: '1234567891', 
    IN_CONTENT: '1234567892',
    MOBILE_STICKY: '1234567893',
    FOOTER_BANNER: '1234567894',
  },
  
  // AdSense settings
  SETTINGS: {
    // Enable test mode during development
    TEST_MODE: process.env.NODE_ENV === 'development',
    
    // Data collection consent (for GDPR compliance)
    DATA_AD_CLIENT: process.env.NODE_ENV === 'development' ? 'ca-google-adsense-test' : 'ca-pub-XXXXXXXXXX',
    
    // Ad formats
    FORMATS: {
      AUTO: 'auto',
      RECTANGLE: 'rectangle', 
      VERTICAL: 'vertical',
      HORIZONTAL: 'horizontal',
    },
    
    // Responsive settings
    FULL_WIDTH_RESPONSIVE: true,
  }
};

// Analytics configuration
export const ANALYTICS_CONFIG = {
  // Replace with your Google Analytics 4 Measurement ID
  GA4_MEASUREMENT_ID: 'G-XXXXXXXXXX',
  
  // Custom events for job board
  EVENTS: {
    JOB_SEARCH: 'job_search',
    JOB_VIEW: 'job_view', 
    JOB_APPLY: 'job_apply',
    JOB_SAVE: 'job_save',
    AD_CLICK: 'ad_click',
  }
};

// Initialize Google Analytics
export function initializeAnalytics() {
  if (typeof window !== 'undefined' && ANALYTICS_CONFIG.GA4_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
    // Load Google Analytics
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.GA4_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    const gtag = (...args: any[]) => {
      window.dataLayer.push(args);
    };
    window.gtag = gtag;
    
    gtag('js', new Date());
    gtag('config', ANALYTICS_CONFIG.GA4_MEASUREMENT_ID, {
      // Enhanced e-commerce for job board
      custom_map: {
        'custom_parameter_1': 'job_category',
        'custom_parameter_2': 'job_location',
        'custom_parameter_3': 'salary_range'
      }
    });
  }
}

// Track custom events
export function trackEvent(eventName: string, parameters?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
}

// Track job-specific events
export function trackJobEvent(eventType: keyof typeof ANALYTICS_CONFIG.EVENTS, jobData: any) {
  trackEvent(ANALYTICS_CONFIG.EVENTS[eventType], {
    job_id: jobData.id,
    job_title: jobData.title,
    company: jobData.company,
    location: jobData.location,
    job_type: jobData.job_type,
    salary_min: jobData.salary_min,
    salary_max: jobData.salary_max,
  });
}

// Revenue optimization settings
export const REVENUE_CONFIG = {
  // Ad placement strategy
  PLACEMENT_STRATEGY: {
    // Desktop layout
    DESKTOP: {
      header_banner: true,
      sidebar_ads: true,
      in_content_frequency: 4, // Show ad every 4 job listings
      footer_banner: true,
    },
    
    // Mobile layout  
    MOBILE: {
      header_banner: false, // Skip header on mobile for UX
      sticky_bottom: true,
      in_content_frequency: 6, // Less frequent on mobile
      interstitial: false, // Avoid aggressive mobile ads
    }
  },
  
  // A/B testing configurations
  AB_TESTS: {
    ad_frequency: ['conservative', 'moderate', 'aggressive'],
    ad_positions: ['top_heavy', 'distributed', 'bottom_heavy'],
    ad_formats: ['responsive', 'fixed_size', 'mixed'],
  }
};

// Declare global gtag function
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}
