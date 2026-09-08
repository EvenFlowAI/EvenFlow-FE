import ReactGA from 'react-ga4';
import TagManager from 'react-gtm-module';
import { useEffect } from 'react';
import {
  GA_CLIENT_ID_FROM_DEALER,
  GA_MEASUREMENT_ID_FROM_DEALER,
  options,
} from '../../utils/constants';
import { TReactGATracker } from '../../utils/types';
import { TArgCallback } from '../../types/types';
import { getTrackersForParentSite } from '../../utils/getTrackersForParentSite';

export const useAnalyticsForParentSite = (
  id: string,
  trackerCreated: boolean,
  setTrackerCreated: TArgCallback<string[]>
) => {
  function createTracker(trackerCreated: boolean) {
    const TRACKERS = getTrackersForParentSite(id);

    if (!trackerCreated) {
      const opt_clientId = sessionStorage.getItem(GA_CLIENT_ID_FROM_DEALER);
      const opt_measurementId = sessionStorage.getItem(GA_MEASUREMENT_ID_FROM_DEALER);
      if (opt_clientId) options.clientId = opt_clientId;

      if (opt_measurementId?.length && opt_measurementId !== TRACKERS[0].measurementId) {
        TRACKERS.push({ measurementId: opt_measurementId });
      }

      console.log('TRACKERS FOR GA4:', TRACKERS);

      const trackersData: TReactGATracker[] = TRACKERS.map(el => ({
        trackingId: el.measurementId,
        gaOptions: {
          ...options,
          name: el.measurementId,
        },
      }));

      console.log('TEMP_LOG: initialization ga4', trackersData);
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
      const clientIdFromOldDealers =
        typeof event.data === 'string' && /^\d+$/.test(event.data) ? event.data : '';

      const clientData =
        typeof event.data === 'object' &&
        event.data !== null &&
        event.data?.type === 'init' &&
        (typeof event.data?.clientId === 'string' || typeof event.data?.measurementId === 'string')
          ? event.data
          : '';

      if (clientData || clientIdFromOldDealers.length) {
        if (clientData)
          console.log('TEMP_LOG: clientData obtained from the dealer website:', clientData);
        if (clientIdFromOldDealers?.length) {
          console.log(
            'TEMP_LOG: clientIdFromOldDealers obtained from the dealer website:',
            clientIdFromOldDealers
          );
          sessionStorage.setItem(GA_CLIENT_ID_FROM_DEALER, clientIdFromOldDealers);
        }
        if (clientData?.clientId?.length)
          sessionStorage.setItem(GA_CLIENT_ID_FROM_DEALER, clientData?.clientId);
        if (clientData?.measurementId?.length)
          sessionStorage.setItem(GA_MEASUREMENT_ID_FROM_DEALER, clientData?.measurementId);

        if (!trackerCreated && id) {
          createTracker(trackerCreated);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [trackerCreated, id]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!trackerCreated && id) {
        createTracker(trackerCreated);
      }
    }, 2500);

    return () => clearTimeout(timeout);
  }, [id, trackerCreated]);

  useEffect(() => {
    trackerCreated &&
      ReactGA.send({
        hitType: 'pageview',
        page: window.location.pathname + window.location.search,
      });
  }, [trackerCreated]);
};
