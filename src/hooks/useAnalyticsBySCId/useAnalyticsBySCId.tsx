import {getTrackerById, getTrackersForParentSite} from "../../utils/utils";
import ReactGA from "react-ga4";
import TagManager from "react-gtm-module";
import {useEffect} from "react";
import {options} from "../../utils/constants";

export const useAnalyticsBySCId = (id: string, trackerCreated: boolean, setTrackerCreated: () => void) => {
    function createTracker(opt_clientId = '', trackerCreated: boolean) {
        const TRACKER = getTrackerById(id);
        if (!trackerCreated) {
            if (opt_clientId) options.clientId = opt_clientId

            ReactGA.initialize(TRACKER, {
                gaOptions: options,
            });
            TagManager.initialize({
                gtmId: TRACKER
            })
            setTrackerCreated();
        }
    }

    useEffect(() => {
        if (!trackerCreated && id) {
            createTracker('', trackerCreated);
        }
    }, [id])

    useEffect(() => {
        trackerCreated && ReactGA.send({ hitType: "pageview", page: window.location.pathname + window.location.search });
    }, [trackerCreated])

}
export const useAnalyticsForParentSite = (id: string, trackerCreated: boolean, setTrackerCreated: () => void) => {
    function createTracker(opt_clientId = '', trackerCreated: boolean) {
        const TRACKERS = getTrackersForParentSite(id);
        if (!trackerCreated) {
            if (opt_clientId) options.clientId = opt_clientId
            TRACKERS.forEach(item => {
                ReactGA.initialize(item.measurementId, {
                    gaOptions: options,
                });
                TagManager.initialize({
                    gtmId: item.gmtId
                })
            })
            setTrackerCreated();
        }
    }

    useEffect(() => {
        if (!trackerCreated && id) {
            createTracker('', trackerCreated);
        }
    }, [id])

    useEffect(() => {
        trackerCreated && ReactGA.send({ hitType: "pageview", page: window.location.pathname + window.location.search });
    }, [trackerCreated])
}