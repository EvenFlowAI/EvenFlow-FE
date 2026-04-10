import React from 'react';
import { ContentContainer } from '../../components/wrappers/ContentContainer/ContentContainer';
import { Redirect, Switch } from 'react-router-dom';
import { Routes } from '../constants';
import { PrivateRoute } from '../PrivateRoute/PrivateRoute';
import ApplicationVehicles from '../../pages/admin/ApplicationVehicles/ApplicationVehicles';
import ApplicationOpCodeCategory from '../../pages/admin/ApplicationOpCodeCategory/ApplicationOpCodeCategory';
import RoleManagement from '../../pages/admin/RoleManagement/RoleManagement';
import RecallDatabase from '../../pages/admin/RecallDatabase/RecallDatabase';

const ApplicationRoutes = () => {
  return (
    <ContentContainer>
      <Switch>
        <PrivateRoute path={Routes.Admin.Vehicles} component={ApplicationVehicles} />
        <PrivateRoute path={Routes.Admin.OpCodeCategory} component={ApplicationOpCodeCategory} />
        <PrivateRoute path={Routes.Admin.RoleManagement} component={RoleManagement} />
        <PrivateRoute path={Routes.Admin.RecallDatabase} component={RecallDatabase} />
        <Redirect to={Routes.Admin.Vehicles} />
      </Switch>
    </ContentContainer>
  );
};

export default ApplicationRoutes;
