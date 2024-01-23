import React from 'react';
import {IEndUserConfig} from "../types";
import {QrveyEndUser} from "../QrvayEndUser/QrvayEndUser";
import {DashboardsIds} from "../../../../pages/admin/Reporting/constants";

export const ShopLoading: React.FC<React.PropsWithChildren<React.PropsWithChildren<{ settings: IEndUserConfig }>>> = ({settings}) => {
    return <QrveyEndUser settings={{...settings, dashboard_id: DashboardsIds.ShopLoading}}/>
};