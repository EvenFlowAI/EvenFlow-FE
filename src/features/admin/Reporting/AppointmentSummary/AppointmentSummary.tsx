import React from 'react';
import {QrveyEndUser} from "../QrvayEndUser/QrvayEndUser";
import {DashboardsIds} from "../../../../pages/admin/Reporting/constants";
import {IEndUserConfig} from "../types";

export const AppointmentsSummary: React.FC<React.PropsWithChildren<{ settings: IEndUserConfig }>> = ({settings}) => {
    return <QrveyEndUser settings={{...settings, dashboard_id: DashboardsIds.AppointmentSummary}}/>
};