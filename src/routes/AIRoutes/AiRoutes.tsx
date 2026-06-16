import React from 'react';
import { ContentContainer } from '../../components/wrappers/ContentContainer/ContentContainer';
import { Redirect, Switch } from 'react-router-dom';
import { PrivateRoute } from '../PrivateRoute/PrivateRoute';
import { Routes } from '../constants';
import AiAgents from '../../pages/admin/AiAgents/AiAgents';
import AlertDashboard from '../../features/admin/AlertDashboard/AlertDashboard';

const AIRoutes = () => {
  return (
    <ContentContainer>
      <Switch>
        <PrivateRoute path={Routes.AiAgent.AiAgents} component={AiAgents} />
        <PrivateRoute path={Routes.AiAgent.AlertDashboard} component={AlertDashboard} />
        <Redirect to={Routes.AiAgent.AiAgents} />
      </Switch>
    </ContentContainer>
  );
};

export default AIRoutes;
