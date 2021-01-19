import React from 'react';
import {Titles} from "../../config/constants";
import {TitleContainer} from "../Content/TitleContainer/TitleContainer";
import {AppointmentActions} from "./AppointmentActions";

export const Appointments = () => {
    return <>
        <TitleContainer title={Titles.Appointments} pad actions={<AppointmentActions />} />
    </>
};