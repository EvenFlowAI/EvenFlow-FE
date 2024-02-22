import React from 'react';
import {PrivateRoute} from "../PrivateRoute/PrivateRoute";
import {Routes} from "../constants";
import {Redirect, Switch} from "react-router-dom";
import {ContentContainer} from "../../components/wrappers/ContentContainer/ContentContainer";
import {Employees} from "../../pages/admin/Employees/Employees";
import EmployeesScheduleSetUp from "../../pages/admin/EmployeesScheduleSetUp/EmployeesScheduleSetUp";

const EmployeesRoutes = () => {
    return <ContentContainer>
        <Switch>
            <PrivateRoute path={Routes.Employees.AddDelete} component={Employees} />
            <PrivateRoute path={Routes.Employees.ScheduleSetUp} component={EmployeesScheduleSetUp} />
            <Redirect to={Routes.Employees.AddDelete}/>
        </Switch>
    </ContentContainer>
};

export default EmployeesRoutes;