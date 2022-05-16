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
import {setCurrentFrameScreen} from "../../store/reducers/appointmentFrameReducer/actions";
import {LocalTokens} from "../../types/types";
import {v4 as uuidv4} from "uuid";

export const Welcome = () => {
    const [view, setView] = useState<TView>("select");
    const scProfile = useSelector((state: RootState) => state.appointment.scProfile);
    const {valueService} = useSelector((state: RootState) => state.appointmentFrame);
    const {id} = useParams();
    const history = useHistory();
    const isFrame = useLayout();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!sessionStorage.getItem(LocalTokens.sessionId)) {
            const uid = uuidv4();
            sessionStorage.setItem(LocalTokens.sessionId, uid);
        }
        window.addEventListener('unload', () => {
            sessionStorage.setItem(LocalTokens.sessionId, '')
        })
    }, [sessionStorage])

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
        dispatch(setCurrentFrameScreen("carSelection"));
        history.push(
            route.replace(":id", scProfile?.id ? encodeSCID(scProfile.id) : "0")
        );
    }

    useEffect(() => {
        window.addEventListener('message', function(event) {
            if (event.origin.includes('https://dev.evenflow.ai')) {
                if (!valueService) {
                    history.push(`/f/appointment/${id}/valueService`)
                }
            }
        });
    }, [id, valueService])

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