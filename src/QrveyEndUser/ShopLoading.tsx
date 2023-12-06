import React from 'react';
import {IEndUserConfig} from "./types";
import QrveyEndUser from "./parts/QrvayEndUser";
import {DashboardsIds} from "../components/Admin/ReportingPage/ReportingPage";

const ShopLoading: React.FC<{ settings: IEndUserConfig }> = ({settings}) => {
    return <QrveyEndUser settings={{...settings, dashboard_id: DashboardsIds.ShopLoading}}/>
};

export default ShopLoading;