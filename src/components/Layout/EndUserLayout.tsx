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
import ReactGA, {GaOptions} from "react-ga";
import {RootState} from "../../store/rootReducer";
import {setTrackerCreated} from "../../store/reducers/appointmentFrameReducer/actions";

const nonFrameStyles = {
    display: "flex",
    flexFlow: "column nowrap",
    justifyContent: "stretch",
    width: "100%",
    height: "100%"
}
const frameStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%'
}

// todo add new parent links while go live with new dealerships

const prodParentLinks = ['https://apps.evenflow.ai/', 'https://www.riverviewford.com/', "https://www.bmwofschererville.com/"];

export const options: GaOptions = {
    siteSpeedSampleRate: 100,
    cookieDomain: 'auto',
    allowLinker: true,
    storage: 'none',
}

export const EndUserLayout = () => {
    const { trackerCreated } = useSelector((state: RootState) => state.appointmentFrame);
    const {id} = useParams();
    const dispatch = useDispatch();
    const isFrame = useLayout();

    function createTracker(opt_clientId = '', origin = '', trackerCreated: boolean) {
        const TRACKER = getTracker(origin);
        if (!trackerCreated) {
            if (opt_clientId) options.clientId = opt_clientId

            ReactGA.initialize(TRACKER, {
                debug: true,
                titleCase: false,
                gaOptions: options,
            });
            dispatch(setTrackerCreated(true));
        }
    }

    useEffect(() => {
        trackerCreated && ReactGA.ga('pageview', window.location.pathname + window.location.search);
    }, [trackerCreated])

    useEffect(() => {
        if (!trackerCreated) {
            if (window.location.ancestorOrigins.length) {
                createTracker('', window.location.ancestorOrigins[0], trackerCreated);
            }
            // window.addEventListener('message', function(event) {
            //     if (!prodParentLinks.includes(event.origin)) return;
            //     let originSite = event.origin;
            //     if (window.location.ancestorOrigins.length) originSite = window.location.ancestorOrigins[0];
            //     console.log('-------ORIGIN-----------', originSite)
            //     createTracker(event.data, originSite, trackerCreated);
            // });
            // setTimeout(createTracker, 3000);
        }
    }, [trackerCreated]);

    useEffect(() => {
        const decoded = decodeSCID(id);
        if (id && decoded) {
            dispatch(loadSCProfile(decoded));
        }
    }, [id, dispatch]);

    return <ThemeProvider theme={endUserTheme}>
        <div style={!isFrame ? nonFrameStyles : frameStyles}>
            {!isFrame ? <EndUserBar/> : null}
            <Switch>
                <Route path={Routes.EndUser.Base} exact component={Welcome} />
                <Route path={Routes.EndUser.CancelAppointment} exact component={CancelAppointment} />
                <Route path={Routes.EndUser.EditAppointment} exact component={EditAppointment} />
            </Switch>
        </div>
    </ThemeProvider>
};