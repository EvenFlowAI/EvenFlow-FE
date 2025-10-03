import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getTrackersForParentSite } from '../getTrackersForParentSite';

const sendGA4SessionDataToParent = (clientId: string, sessionId: string) => {
  const message = {
    type: 'GA4_SESSION_DATA',
    client_id: clientId,
    session_id: sessionId,
  };

  console.log('message to parent website', message);

  window.parent.postMessage(message, '*');
};

const GA4SessionSync = () => {
  const { id } = useParams<{ id: string }>();
  const ids = getTrackersForParentSite(id);
  const measurementId = ids[0]?.measurementId;
  useEffect(() => {
    const trySend = () => {
      // Get client_id from the GA4
      if (typeof window.gtag === 'function') {
        window.gtag('get', measurementId, 'client_id', (clientId: string) => {
          const sessionId = Date.now().toString();
          sendGA4SessionDataToParent(clientId, sessionId);
        });
      } else {
        console.warn('gtag is not available yet');
      }
    };

    // Try again after 500 ms after loading
    const timeout = setTimeout(trySend, 500);

    return () => clearTimeout(timeout);
  }, []);

  return null;
};

export default GA4SessionSync;
