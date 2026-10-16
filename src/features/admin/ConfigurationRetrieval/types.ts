import { IMake, IModel } from '../../../api/types';

export type TConfigurationQueryForm = {
  make: IMake | null;
  model: IModel | null;
  year: string | null;
};

export const defaultConfigurationQueryForm: TConfigurationQueryForm = {
  make: null,
  model: null,
  year: null,
};

export enum EConfigurationResultsTab {
  OpCodes = 'opCodes',
  Advisors = 'advisors',
  Transportation = 'transportation',
}

export enum EOpCodeStatusFilter {
  All = 'all',
  Configured = 'configured',
  NotConfigured = 'notConfigured',
}
