import { IOrder, Roles } from '../types/types';
import { TRole } from '../store/reducers/users/types';

let apiHost = 'https://be.qa.evenflow.ai';
// apiHost = "https://be.dev.evenflow.ai";
switch (process.env.REACT_APP_ENV) {
  case 'production':
    apiHost = 'https://api.evenflow.ai';
    break;
  case 'QA':
    apiHost = 'https://be.qa.evenflow.ai';
    break;
  case 'uat':
    apiHost = 'https://be.uat.evenflow.ai';
    break;
  case 'dev':
    apiHost = 'https://be.dev.evenflow.ai';
    break;
  case 'local':
    apiHost = 'http://localhost:5000';
    break;
  case 'PreProd':
    apiHost = 'https://be.preprod.evenflow.ai';
    break;
  case 'Dev':
    apiHost = 'https://be.dev.evenflow.ai';
    break;
}

export const APIHost = apiHost;
export const APIUrl = `${APIHost}/api/v0`;

export const defaultRowsPerPageOptions = [10, 50, 100];
export const defaultRowsPerPage = 10;
export const defaultOrder: IOrder = { isAscending: true };
export const superUser: TRole = Roles.EvenFlowAdmin;
