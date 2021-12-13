import React, {useEffect, useState} from 'react';

import {CustomerSelect} from "./CustomerSelect";
import { LoginInput } from './LoginInput';
import {useHistory, useParams} from 'react-router-dom';
import {Routes} from "../../config/routes";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/rootReducer";
import {WelcomeLayout} from "./WelcomeLayout";
import {TView} from "./types";
import {clearStorage} from "../../store/reducers/appointment/actions";
import {decodeSCID, encodeSCID} from "../../utils/utils";
import {useLayout} from "../../utils/hooks";
import {FrameWelcomeLayout} from "./FrameWelcomeLayout";
import {MuiThemeProvider} from "@material-ui/core";
import {frameTheme} from "../../theme/theme";
import {setCurrentFrameScreen, setTrackerCreated} from "../../store/reducers/appointmentFrameReducer/actions";
import ReactGA, {GaOptions} from "react-ga";
import {prodParentLinks} from "../Layout/AppointmentFrameLayout";

export const Welcome = () => {
    const [view, setView] = useState<TView>("select");
    const history = useHistory();
    const scProfile = useSelector((state: RootState) => state.appointment.scProfile);
    const { trackerCreated } = useSelector((state: RootState) => state.appointmentFrame);
    const {id} = useParams();
    const isFrame = useLayout();
    const dispatch = useDispatch();

    function createTracker(opt_clientId = '', origin = '', trackerCreated: boolean) {
        const TRACKER = process.env.REACT_APP_ENV === "stage"
            ? "UA-210743216-4"
            : process.env.REACT_APP_ENV === "production"
                ? origin.includes("bmwofschererville")
                    ? "UA-210743216-6"
                    : "UA-210743216-3"
                : "UA-210743216-5";
        if (!trackerCreated) {
            const options: GaOptions = {
                siteSpeedSampleRate: 100,
                cookieDomain: 'auto',
                allowLinker: true,
                storage: 'none',
            }
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
            window.addEventListener('message', function(event) {
                if (!prodParentLinks.includes(event.origin)) return;
                if (typeof event.data === 'string') createTracker(event.data, event.origin, trackerCreated);
            });
            setTimeout(createTracker, 1000);
        }
    }, [trackerCreated]);

    useEffect(() => {
        clearStorage();
    }, []);
    useEffect(() => {
        if (!id || !decodeSCID(id)) {
            window.location.href = "/";
        }
    }, [id]);

    const onComplete = () => {
        const route = isFrame ? Routes.EndUser.AppointmentFrame : Routes.EndUser.Appointment;
        isFrame && dispatch(setCurrentFrameScreen('serviceNeeds'));
        history.push(
            route.replace(":id", scProfile?.id ? encodeSCID(scProfile.id) : "0")
        );
    }

    const getComponent = () => {
        switch (view) {
            case "search":
            case "confirm":
                return <LoginInput
                    view={view}
                    onComplete={onComplete}
                    onConfirm={() => setView("confirm")}
                    onReturn={() => setView("select")}
                />;
            case "select":
            default:
                return <CustomerSelect
                    onComplete={onComplete}
                    onLogin={() => setView("search")}
                />;
        }
    }

    return (isFrame ? <MuiThemeProvider theme={frameTheme}>
                <FrameWelcomeLayout>
                    {getComponent()}
                </FrameWelcomeLayout>
            </MuiThemeProvider> :
            <WelcomeLayout title="Welcome!" subtitle="Schedule Your Service:">
                {getComponent()}
            </WelcomeLayout>
    );
};