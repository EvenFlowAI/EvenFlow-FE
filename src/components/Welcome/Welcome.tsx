import React, {useEffect, useState} from 'react';

import {CustomerSelect} from "./CustomerSelect";
import { LoginInput } from './LoginInput';
import {useHistory, useParams} from 'react-router-dom';
import {Routes} from "../../config/routes";
import {useSelector} from "react-redux";
import {RootState} from "../../store/rootReducer";
import {WelcomeLayout} from "./WelcomeLayout";
import {TView} from "./types";
import {clearStorage} from "../../store/reducers/appointment/actions";
import {decodeSCID, encodeSCID} from "../../utils/utils";
import {useLayout} from "../../utils/hooks";
import {FrameWelcomeLayout} from "./FrameWelcomeLayout";


export const Welcome = () => {
    const [view, setView] = useState<TView>("select");
    const history = useHistory();
    const scProfile = useSelector((state: RootState) => state.appointment.scProfile);
    const {id} = useParams();
    const isFrame = useLayout();

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

    return (isFrame ? <FrameWelcomeLayout>
                {getComponent()}
            </FrameWelcomeLayout> :
        <WelcomeLayout title="Welcome!" subtitle="Schedule Your Service:">
            {getComponent()}
        </WelcomeLayout>
    );
};