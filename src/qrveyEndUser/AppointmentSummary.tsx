import React from 'react';
import {IEndUserConfig} from "./types";
import QrveyEndUser from "./QrvayEndUser";
import {DashboardsIds} from "../components/Admin/ReportingPage/ReportingPage";

const AppointmentsSummary: React.FC<{ settings: IEndUserConfig }> = ({settings}) => {
    return <QrveyEndUser settings={{...settings, dashboard_id: DashboardsIds.AppointmentSummary}}/>
};

export default AppointmentsSummary;