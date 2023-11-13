import React, {useEffect, useState} from 'react';
import {Titles} from "../../../config/constants";
import {TitleContainer} from "../../Content/TitleContainer/TitleContainer";
import {IEndUserConfig} from "../../../qrveyEndUser/types";
import {Api} from "../../../config/requests";
import {useCurrentUser, useSCs} from "../../../utils/hooks";
import {Routes} from "../../../config/routes";
import {Redirect, Route, Switch} from "react-router-dom";
import ShopLoading from "../../../qrveyEndUser/ShopLoading";
import AppointmentsSummary from "../../../qrveyEndUser/AppointmentSummary";
import ValetAppointments from "../../../qrveyEndUser/ValetAppointments";
import MobileServiceAppointments from "../../../qrveyEndUser/MobileServiceAppointments";
import CustomerBehavior from "../../../qrveyEndUser/CustomerBehavior";
import RepairOrderPerformance from "../../../qrveyEndUser/RepairOrderPerformance";
import CapacityManagementPerformance from "../../../qrveyEndUser/CapacityManagementPerfomance";
import {TRole} from "../../../store/reducers/users/types";

// const configObject = {
//     appid: 'jjaR5hX2q',
//     apikey: '0nv7hbDaQmjdTbBLWGV81ldOgX9QGLmKGYH3t6Dt',
// };

export const DashboardsIds = {
    AppointmentSummary: "Bioab5mEC",
    ShopLoading: "dXaJXN4Bx",
    ValetAppointments: "-p7lXERDK",
    MobileServiceAppointments: "KILliymYmVIBMazCnOQMG",
    CustomerBehavior: "psDZZLXdRm3CJXaZUPbnm",
    RepairOrderPerformance: "oK0YxEfcoDkhsmMtFjGxo",
    CapacityManagementPerformance: "nO0UhbMtl58MxO59VCC3x",
}

export const reportingAllowedRoles: TRole[] = ["Service Director", "Owner", "Super Admin", "Manager"]

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