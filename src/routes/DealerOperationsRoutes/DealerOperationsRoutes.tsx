import React from 'react';
import { ContentContainer } from '../../components/wrappers/ContentContainer/ContentContainer';
import { Redirect, Switch } from 'react-router-dom';
import { PrivateRoute } from '../PrivateRoute/PrivateRoute';
import { Routes } from '../constants';
import { DealerOperationsInternal } from '../../pages/admin/DealerOperations/DealerOperationsInternal';
import DealerOperationsCustomer from '../../pages/admin/DealerOperations/DealerOperationsCustomer';

export const DealerOperationsRoutes = () => {
  return (
    <ContentContainer>
      <Switch>
        <PrivateRoute path={Routes.Dealer.DealerInternal} component={DealerOperationsInternal} />
        <PrivateRoute path={Routes.Dealer.DealerCustomer} component={DealerOperationsCustomer} />
        <Redirect to={Routes.Dealer.DealerInternal} />
      </Switch>
    </ContentContainer>
  );
};
