import ReactGA from 'react-ga4';
import TagManager from 'react-gtm-module';
import { useEffect, useRef, useState } from 'react';
import { options } from '../../utils/constants';
import { TReactGATracker } from '../../utils/types';
import { TArgCallback } from '../../types/types';
import { getTrackersForParentSite } from '../../utils/getTrackersForParentSite';
import { getTrackerById } from '../../utils/getTrackerById';

export const useAnalyticsForParentSite = (
  id: string,
  trackerCreated: boolean,
  setTrackerCreated: TArgCallback<string[]>
) => {
  const [clientId2, setClientId] = useState<string | null>(null);

  function createTracker(opt_clientId = '', trackerCreated: boolean) {
    const TRACKERS = getTrackersForParentSite(id);

    if (!trackerCreated) {
      console.log(TRACKERS[0]?.measurementId);
      if (opt_clientId) options.clientId = opt_clientId || (clientId2 as string);

      const trackersData: TReactGATracker[] = TRACKERS.map(el => ({
        trackingId: el.measurementId,
        gaOptions: {
          ...options,
          name: el.measurementId,
        },
      }));

      console.log('TEMP_LOG: initialization ga4');
      ReactGA.initialize(trackersData);

      TRACKERS.forEach(item => {
        if (item.gmtId) {
          TagManager.initialize({
            gtmId: item.gmtId,
          });
        }
      });

      setTrackerCreated(trackersData.map(el => el.trackingId));
    }
  }

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const clientId = typeof event.data === 'string' ? event.data : '';

      if (clientId) {
        console.log('TEMP_LOG: client_id obtained from the dealer website:', clientId);
        if (clientId?.length) {
          console.log('clientId.length, trackerCreated, id', clientId, trackerCreated, id);
          setClientId(clientId);
        }

        if (!trackerCreated && id) {
          createTracker(clientId, trackerCreated);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [trackerCreated, id]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!trackerCreated && id) {
        createTracker(clientId2 || '', trackerCreated);
        console.log('TEMP_LOG: create tracker with no-client-id', clientId2);
      }
    }, 3500);

    return () => clearTimeout(timeout);
  }, [id, trackerCreated, clientId2]);

  useEffect(() => {
    trackerCreated &&
      ReactGA.send({
        hitType: 'pageview',
        page: window.location.pathname + window.location.search,
      });
  }, [trackerCreated]);
};
