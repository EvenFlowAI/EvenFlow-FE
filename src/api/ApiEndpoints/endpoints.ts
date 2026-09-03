import { IApiEndpoints } from './types';
import { endpointsPart1 } from './endpointsPart1';
import { endpointsPart2 } from './endpointsPart2';
import { endpointsPart3 } from './endpointsPart3';
import { endpointsPart4 } from './endpointsPart4';

export const apiEndpoints: IApiEndpoints = {
  ...endpointsPart1,
  ...endpointsPart2,
  ...endpointsPart3,
  ...endpointsPart4,
};
