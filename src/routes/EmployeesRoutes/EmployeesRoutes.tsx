import React from 'react';
import {PrivateRoute} from "../PrivateRoute/PrivateRoute";
import {Routes} from "../constants";
import {Redirect, Switch} from "react-router-dom";
import {ContentContainer} from "../../components/wrappers/ContentContainer/ContentContainer";
import {Employees} from "../../pages/admin/Employees/Employees";

const EmployeesRoutes = () => {
    return <ContentContainer>
        <Switch>
            <PrivateRoute path={Routes.Employees.AddDelete} component={Employees} />
            <Redirect to={Routes.Employees.AddDelete}/>
        </Switch>
    </ContentContainer>
};

export default EmployeesRoutes;