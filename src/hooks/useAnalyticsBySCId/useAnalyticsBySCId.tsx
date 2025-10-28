import ReactGA from 'react-ga4';
import TagManager from 'react-gtm-module';
import { useEffect, useRef, useState } from 'react';
import { options } from '../../utils/constants';
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
      const opt_clientId = sessionStorage.getItem('clientId');
      if (opt_clientId) options.clientId = opt_clientId;

      const trackersData: TReactGATracker[] = TRACKERS.map(el => ({
        trackingId: el.measurementId,
        gaOptions: {
          ...options,
          name: el.measurementId,
        },
      }));

      console.log('TEMP_LOG: initialization ga4', opt_clientId);
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
        if (clientId?.length) sessionStorage.setItem('clientId', clientId);

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
