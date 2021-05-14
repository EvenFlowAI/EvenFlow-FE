import React, {useEffect, useState} from 'react';

import {CustomerSelect} from "./CustomerSelect";
import { LoginInput } from './LoginInput';
import { useHistory } from 'react-router-dom';
import {Routes} from "../../config/routes";
import {useSelector} from "react-redux";
import {RootState} from "../../store/rootReducer";
import {WelcomeLayout} from "./WelcomeLayout";
import {TView} from "./types";
import {clearStorage} from "../../store/reducers/appointment/actions";


export const Welcome = () => {
    const [view, setView] = useState<TView>("select");
    const history = useHistory();
    const scProfile = useSelector((state: RootState) => state.appointment.scProfile);

    useEffect(() => {
        clearStorage();
    }, [])

    const onComplete = () => {
        history.push(
            Routes.EndUser.Appointment.replace(":id", scProfile?.id ? String(scProfile.id) : "0")
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

    return (
        <WelcomeLayout title="Welcome!" subtitle="Schedule Your Service:">
            {getComponent()}
        </WelcomeLayout>
    );
};