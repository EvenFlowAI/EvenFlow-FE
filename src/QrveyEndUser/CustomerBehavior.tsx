import React from 'react';
import {IEndUserConfig} from "./types";
import QrveyEndUser from "./parts/QrvayEndUser";
import {DashboardsIds} from "../components/Admin/ReportingPage/ReportingPage";

const CustomerBehavior: React.FC<{ settings: IEndUserConfig }> = ({settings}) => {
    return <QrveyEndUser settings={{...settings, dashboard_id: DashboardsIds.CustomerBehavior}}/>
};

export default CustomerBehavior;