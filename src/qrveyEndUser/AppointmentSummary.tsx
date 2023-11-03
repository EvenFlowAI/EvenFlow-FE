import React from 'react';
import QrveyEndUser from "./QrvayEndUser";
import {DashboardsIds} from "../components/Admin/ReportingPage/ReportingPage";
import {IEndUserConfig} from "./types";

const AppointmentsSummary: React.FC<{ settings: IEndUserConfig }> = ({settings}) => {
    return <QrveyEndUser settings={{...settings, dashboard_id: DashboardsIds.AppointmentSummary}}/>
};

export default AppointmentsSummary;