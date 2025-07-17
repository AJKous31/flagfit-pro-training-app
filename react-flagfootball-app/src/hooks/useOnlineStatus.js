import { useState, useEffect } from 'react';

/**
 * Custom hook for tracking online/offline status and network quality
 * @returns {Object} - Object containing online status, network quality, and connection info
 */
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [networkQuality, setNetworkQuality] = useState('unknown');
  const [connectionInfo, setConnectionInfo] = useState(null);

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    const updateNetworkQuality = () => {
      if ('connection' in navigator) {
        const connection = navigator.connection;
        setConnectionInfo({
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData
        });

        // Determine network quality based on effective type
        switch (connection.effectiveType) {
          case '4g':
            setNetworkQuality('excellent');
            break;
          case '3g':
            setNetworkQuality('good');
            break;
          case '2g':
            setNetworkQuality('poor');
            break;
          case 'slow-2g':
            setNetworkQuality('very-poor');
            break;
          default:
            setNetworkQuality('unknown');
        }
      }
    };

    // Initial check
    updateNetworkQuality();

    // Event listeners
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    if ('connection' in navigator) {
      navigator.connection.addEventListener('change', updateNetworkQuality);
    }

    // Cleanup
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      
      if ('connection' in navigator) {
        navigator.connection.removeEventListener('change', updateNetworkQuality);
      }
    };
  }, []);

  return {
    isOnline,
    networkQuality,
    connectionInfo
  };
}; 