import React, {useState} from 'react';

import {CustomerSelect} from "./CustomerSelect";
import { LoginInput } from './LoginInput';
import { useHistory } from 'react-router-dom';
import {Routes} from "../../config/routes";
import {useSelector} from "react-redux";
import {RootState} from "../../store/rootReducer";
import {WelcomeLayout} from "./WelcomeLayout";


export const Welcome = () => {
    const [isSelect, setSelect] = useState<boolean>(false);
    const history = useHistory();
    const scProfile = useSelector((state: RootState) => state.appointment.scProfile);

    const toggleSelect = (b?: boolean) => {
        setSelect(b !== undefined ? b : !isSelect);
    }
    const onComplete = () => {
        history.push(
            Routes.EndUser.Appointment.replace(":id", scProfile?.id ? String(scProfile.id) : "0")
        );
    }
    return (
        <WelcomeLayout title="Welcome!" subtitle="Schedule Your Service:">
            {!isSelect
                ? <CustomerSelect onSelect={toggleSelect} onComplete={onComplete}/>
                : <LoginInput onSelect={toggleSelect} onComplete={onComplete}/>
            }
        </WelcomeLayout>
    );
};