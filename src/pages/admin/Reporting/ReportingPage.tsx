import React, {useEffect, useState} from 'react';
import {Titles} from "../../../config/constants";
import {TitleContainer} from "../../../components/TitleContainer/TitleContainer";
import {IEndUserConfig} from "../../../features/admin/Reporting/types";
import {Api} from "../../../config/requests";
import {Routes} from "../../../config/routes";
import {Redirect, Route, Switch} from "react-router-dom";
import {ShopLoading} from "../../../features/admin/Reporting/ShopLoading/ShopLoading";
import {AppointmentsSummary} from "../../../features/admin/Reporting/AppointmentSummary/AppointmentSummary";
import {ValetAppointments} from "../../../features/admin/Reporting/ValetAppointments/ValetAppointments";
import {MobileServiceAppointments} from "../../../features/admin/Reporting/MobileServiceAppointments/MobileServiceAppointments";
import {CustomerBehavior} from "../../../features/admin/Reporting/CustomerBehavior/CustomerBehavior";
import {RepairOrderPerformance} from "../../../features/admin/Reporting/RepairOrderPerformance/RepairOrderPerformance";
import {CapacityManagementPerformance} from "../../../features/admin/Reporting/CapacityManagementPerfomance/CapacityManagementPerfomance";
import {reportingAllowedRoles} from "./constants";
import {useSCs} from "../../../hooks/useSCs/useSCs";
import {useCurrentUser} from "../../../hooks/useCurrentUser/useCurrentUser";

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