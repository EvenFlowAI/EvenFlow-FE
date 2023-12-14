import React from 'react';
import {IEndUserConfig} from "../types";
import {QrveyEndUser} from "../QrvayEndUser";
import {DashboardsIds} from "../../../pages/admin/Reporting/constants";

export const RepairOrderPerformance: React.FC<{ settings: IEndUserConfig }> = ({settings}) => {
    return <QrveyEndUser settings={{...settings, dashboard_id: DashboardsIds.RepairOrderPerformance}}/>
};