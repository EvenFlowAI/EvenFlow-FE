import React from 'react';
import {PrivateRoute} from "../PrivateRoute/PrivateRoute";
import {Routes} from "../constants";
import {Redirect, Switch} from "react-router-dom";
import {ContentContainer} from "../../components/wrappers/ContentContainer/ContentContainer";
import {EmployeesAddDelete} from "../../pages/admin/EmployeesAddDelete/EmployeesAddDelete";
import EmployeesScheduleSetUp from "../../pages/admin/EmployeesScheduleSetUp/EmployeesScheduleSetUp";
import EmployeesScheduleManagement from "../../features/admin/EmployeesScheduleManagement/EmployeesScheduleManagement";
import EmployeeCapacity from "../../pages/admin/EmployeeCapacity/EmployeeCapacity";

const EmployeesRoutes = () => {
    return <ContentContainer>
        <Switch>
            <PrivateRoute path={Routes.Employees.AddDelete} component={EmployeesAddDelete} />
            <PrivateRoute path={Routes.Employees.ScheduleSetUp} component={EmployeesScheduleSetUp} />
            <PrivateRoute path={Routes.Employees.ScheduleManagement} component={EmployeesScheduleManagement} />
            <PrivateRoute path={Routes.Employees.EmployeeCapacity} component={EmployeeCapacity} />
            <Redirect to={Routes.Employees.AddDelete}/>
        </Switch>
    </ContentContainer>
};

export default EmployeesRoutes;