import React, {useEffect} from 'react';
import {Switch, Route, useParams} from "react-router-dom";
import {endUserTheme} from "../../theme/theme";
import {ThemeProvider} from "@material-ui/core";
import {Routes} from "../../config/routes";
import {Welcome} from "../Welcome/Welcome";
import {EndUserBar} from "../NavBar/EndUserBar";
import {useDispatch, useSelector} from "react-redux";
import {loadSCProfile} from "../../store/reducers/appointment/actions";
import {CancelAppointment} from "../Welcome/CancelAppointment";
import {EditAppointment} from "../Welcome/EditAppointment";
import {decodeSCID, getTracker} from "../../utils/utils";
import {useLayout} from "../../utils/hooks";
//import ReactGA, {GaOptions} from "react-ga";
import ReactGA from "react-ga4";
import TagManager from 'react-gtm-module'
import {RootState} from "../../store/rootReducer";
import {setTrackerCreated, setWelcomeScreenView} from "../../store/reducers/appointmentFrameReducer/actions";
import {prodParentLinks} from "./AppointmentFrameLayout";
import {loadShortSC} from "../../store/reducers/serviceCenters/actions";
import {getCurrentUser} from "../../store/reducers/users/actions";

type TGAOptions = {
    siteSpeedSampleRate: number;
    cookieDomain: string;
    allowLinker: boolean;
    storage: string;
    clientId?: string;
}

export const options: TGAOptions = {
    siteSpeedSampleRate: 100,
    cookieDomain: 'auto',
    allowLinker: true,
    storage: 'none',
}

export const EndUserLayout = () => {
    const { trackerCreated } = useSelector((state: RootState) => state.appointmentFrame);
    const { scProfile } = useSelector((state: RootState) => state.appointment);
    const {id} = useParams();
    const dispatch = useDispatch();
    const isFrame = useLayout();

    /** TRACKER CODE START **/

    function createTracker(opt_clientId = '', origin = '', trackerCreated: boolean) {
        const TRACKER = getTracker(origin);
        if (!trackerCreated) {
            if (opt_clientId) options.clientId = opt_clientId

            ReactGA.initialize(TRACKER, {
                gaOptions: options,
            });
            TagManager.initialize({
                gtmId: TRACKER
            })
            dispatch(setTrackerCreated(true));
        }
    }

    useEffect(() => {
        trackerCreated && ReactGA.ga('pageview', window.location.pathname + window.location.search);
    }, [trackerCreated])

    useEffect(() => {
        if (!trackerCreated) {
            /** expects for the post message from the parent site in order to create tracker with right trackingID **/
            window.addEventListener('message', function(event) {
                if (!prodParentLinks.includes(event?.origin)) return;
                let originSite = event.origin;
                /** in some browsers checks the parent URL and use it like origin **/
                if (window.location?.ancestorOrigins?.length) originSite = window.location.ancestorOrigins[0];
                if (originSite) createTracker(event.data, originSite, trackerCreated);
            });
        }
    }, [trackerCreated, window.location?.ancestorOrigins]);

    useEffect(() => {
        if (!trackerCreated) {
            /** if there are not a message from the parent site, try to get tracker from the document`s props **/
            if (process.env.REACT_APP_ENV === "production") {
                setTimeout(() => {
                    const url = (window.location != window.parent?.location)
                        ? document.referrer
                        : document.location.href;
                    createTracker('', url, trackerCreated);
                }, 3000);
            } else {
                /**without origin (parent site URL) creates default tracker for current environment**/
                createTracker('', '', trackerCreated);
            }
        }
    }, [window.location, document.referrer, document.location])

    /** TRACKER CODE END **/

    useEffect(() => {
        const decoded = decodeSCID(id);
        if (id && decoded && (!scProfile || decoded !== scProfile?.id)) {
            dispatch(loadSCProfile(decoded));
        }
    }, [id, dispatch, scProfile]);

    useEffect(() => {
        dispatch(getCurrentUser())
    }, [])

    useEffect(() => {
        if (scProfile) {
            try {
                dispatch(loadShortSC(false, scProfile.dealershipId));
            } catch (e) {
                dispatch(setWelcomeScreenView('select'))
            }
        }
    }, [scProfile])

    return <ThemeProvider theme={endUserTheme}>
        <div>
            {!isFrame ? <EndUserBar/> : null}
            <Switch>
                <Route path={Routes.EndUser.Base} exact component={Welcome} />
                <Route path={Routes.EndUser.CancelAppointment} exact component={CancelAppointment} />
                <Route path={Routes.EndUser.EditAppointment} exact component={EditAppointment} />
            </Switch>
        </div>
    </ThemeProvider>
};