import React, {useEffect, useState} from 'react';
import {Titles} from "../../../config/constants";
import {TitleContainer} from "../../../components/Content/TitleContainer/TitleContainer";
import {IEndUserConfig} from "../../../features/Reporting/types";
import {Api} from "../../../config/requests";
import {useCurrentUser, useSCs} from "../../../utils/hooks";
import {Routes} from "../../../config/routes";
import {Redirect, Route, Switch} from "react-router-dom";
import {ShopLoading} from "../../../features/Reporting/ShopLoading";
import {AppointmentsSummary} from "../../../features/Reporting/AppointmentSummary";
import {ValetAppointments} from "../../../features/Reporting/ValetAppointments";
import {MobileServiceAppointments} from "../../../features/Reporting/MobileServiceAppointments";
import {CustomerBehavior} from "../../../features/Reporting/CustomerBehavior";
import {RepairOrderPerformance} from "../../../features/Reporting/RepairOrderPerformance";
import {CapacityManagementPerformance} from "../../../features/Reporting/CapacityManagementPerfomance";
import {reportingAllowedRoles} from "./constants";

const ReportingPage: React.FC<{}> = ({}) => {
    const [config, setConfig] = useState<IEndUserConfig>({
        domain: 'https://pcuxl.qrveyapp.com',
    })
    const {selectedSC} = useSCs();
    const currentUser = useCurrentUser();

    useEffect(() => {
        if (selectedSC) {
            Api.call(Api.endpoints.Qrvey.GetToken, {data: {serviceCenterId: selectedSC.id}})
                .then(result => {
                    if (result?.data?.token) setConfig(prev => ({...prev, qv_token: result.data.token}))
                })
        }
    }, [selectedSC])

    return <div style={{display: "block", width: "100%"}}>
        <TitleContainer title={Titles.Reporting} pad/>
        {config.qv_token && (!window.origin.includes("apps.evenflow.ai") || (currentUser && reportingAllowedRoles.includes(currentUser?.role)))
            ? <Switch>
                <Route
                    exact
                    path={Routes.Reporting.AppointmentsSummary}
                    render={() => <AppointmentsSummary settings={config}/>}
                />
                <Route
                    exact
                    path={Routes.Reporting.ShopLoading}
                    render={() => <ShopLoading settings={config}/>}/>
                <Route
                    exact
                    path={Routes.Reporting.ValetAppointments}
                    render={() => <ValetAppointments settings={config}/>}/>
                <Route
                    exact
                    path={Routes.Reporting.MobileServiceAppointments}
                    render={() => <MobileServiceAppointments settings={config}/>}/>
                <Route
                    exact
                    path={Routes.Reporting.CustomerBehavior}
                    render={() => <CustomerBehavior settings={config}/>}/>
                <Route
                    exact
                    path={Routes.Reporting.RepairOrderPerformance}
                    render={() => <RepairOrderPerformance settings={config}/>}/>
                <Route
                    exact
                    path={Routes.Reporting.CapacityManagementPerformance}
                    render={() => <CapacityManagementPerformance settings={config}/>}/>
                <Redirect to={Routes.Reporting.AppointmentsSummary} />
            </Switch>
            : null}
    </div>
};

export default ReportingPage;