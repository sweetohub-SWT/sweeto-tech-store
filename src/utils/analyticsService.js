import apiService from '../services/api';

const analyticsService = {
  /**
   * Generates or retrieves a session ID for unique-session tracking (no PII stored)
   */
  getSessionId: () => {
    let sessionId = sessionStorage.getItem('sweeto_session_id');
    if (!sessionId) {
      sessionId = crypto.randomUUID?.() || Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem('sweeto_session_id', sessionId);
    }
    return sessionId;
  },

  /**
   * Derives the referrer source/channel from document.referrer
   */
  getReferrerSource: () => {
    const ref = document.referrer;
    if (!ref || ref === '') return 'Direct';
    if (ref.includes('google')) return 'Google';
    if (ref.includes('facebook') || ref.includes('fb.com')) return 'Facebook';
    if (ref.includes('instagram')) return 'Instagram';
    if (ref.includes('twitter') || ref.includes('x.com')) return 'Twitter/X';
    if (ref.includes('whatsapp')) return 'WhatsApp';
    if (ref.includes('tiktok')) return 'TikTok';
    return 'Other';
  },

  /**
   * Derives the device type from the user agent string
   */
  getDeviceType: () => {
    const ua = navigator.userAgent.toLowerCase();
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return 'Tablet';
    if (/mobile|android|iphone|ipod|blackberry|windows phone/i.test(ua)) return 'Mobile';
    return 'Desktop';
  },

  /**
   * Derives the browser name from the user agent
   */
  getBrowser: () => {
    const ua = navigator.userAgent;
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('SamsungBrowser')) return 'Samsung Browser';
    if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
    if (ua.includes('Edge')) return 'Edge';
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Safari')) return 'Safari';
    return 'Other';
  },

  /**
   * Logs a page visit to json-server API. De-duplicated per session per path.
   * @param {string} path - The page path visited
   * @param {object} userInfo - Optional user info (if logged in)
   */
  logVisit: async (path, userInfo = null) => {
    const currentPath = path || window.location.pathname;
    const loggedPaths = JSON.parse(sessionStorage.getItem('logged_paths') || '[]');
    
    // Check if recently logged (prevent double logging on strict mode)
    if (loggedPaths.includes(currentPath)) return;

    try {
      // Fetch location data (Country)
      let country = 'Unknown';
      try {
        const locResponse = await fetch('https://ipapi.co/json/');
        if (locResponse.ok) {
          const locData = await locResponse.json();
          country = locData.country_name || 'Unknown';
        }
      } catch (e) {
        console.warn('Analytics: Could not fetch location');
      }

      const startTime = Date.now();
      const visitData = {
        session_id: analyticsService.getSessionId(),
        path: currentPath,
        referrer: document.referrer || '',
        referrer_source: analyticsService.getReferrerSource(),
        device: analyticsService.getDeviceType(),
        browser: analyticsService.getBrowser(),
        country: country,
        user_label: userInfo ? (userInfo.user_metadata?.display_name || userInfo.email || userInfo.display_name || 'User') : 'Guest',
        timestamp: new Date().toISOString(),
        duration: 0
      };

      const data = await apiService.create('visits', visitData);
      const visitId = data.id;
      
      // Heartbeat: Update duration every 20 seconds
      const heartbeatInterval = setInterval(async () => {
        try {
          const durationSeconds = Math.round((Date.now() - startTime) / 1000);
          await apiService.update('visits', visitId, { duration: durationSeconds });
        } catch (e) {
          console.error('Analytics: Heartbeat update failed', e);
          clearInterval(heartbeatInterval);
        }
      }, 20000);

      // Final attempt on leave
      window.addEventListener('beforeunload', () => {
        clearInterval(heartbeatInterval);
      }, { once: true });

      loggedPaths.push(currentPath);
      sessionStorage.setItem('logged_paths', JSON.stringify(loggedPaths));
    } catch (error) {
      console.error('Analytics: failed to log visit:', error);
    }
  }
};

export default analyticsService;
