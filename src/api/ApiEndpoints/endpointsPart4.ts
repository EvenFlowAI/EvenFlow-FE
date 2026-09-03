import { IApiEndpoints } from './types';

type TEndpointsPart4 = Pick<
  IApiEndpoints,
  | 'Users'
  | 'Holidays'
  | 'ValueSettings'
  | 'Vehicles'
  | 'WaitListSettings'
  | 'ZipCodes'
  | 'DealerOperations'
  | 'ServiceCenterCredits'
  | 'ShortUrls'
>;

export const endpointsPart4: TEndpointsPart4 = {
  Users: {
    GetAll: { route: '/users/by-query', method: 'post' },
    Get: { route: '/users', method: 'get' },
    Create: { route: '/users', method: 'post' },
    Remove: { route: '/users/{id}', method: 'delete' },
    Retrieve: { route: '/users/{id}', method: 'get' },
    Update: { route: '/users/{id}', method: 'put' },
    Avatar: { route: '/users/{id}/avatar', method: 'patch' },
    Restore: { route: '/users/{id}/restore', method: 'patch' },
    GetShort: { route: '/users/short-by-query', method: 'post' },
  },
  Holidays: {
    GetAll: { route: '/holidays/by-query', method: 'post' },
    Retrieve: { route: '/holidays/{id}', method: 'get' },
    Remove: { route: '/holidays/{id}', method: 'delete' },
    Update: { route: '/holidays/{id}', method: 'put' },
    Create: { route: '/holidays', method: 'post' },
  },
  ValueSettings: {
    GetValue: { route: '/value-settings', method: 'get' },
    SetValue: { route: '/value-settings', method: 'put' },
    GetCL: { route: '/customer-lifetimes', method: 'get' },
    SetCL: { route: '/customer-lifetimes', method: 'put' },
    GetCTS: { route: '/customer-type-settings', method: 'get' },
    SetCTS: { route: '/customer-type-settings', method: 'put' },
    GetWS: { route: '/warranty-settings', method: 'get' },
    SetWS: { route: '/warranty-settings', method: 'put' },
  },
  Vehicles: {
    GetByVIN: { route: '/vehicles/by-vin', method: 'get' },
    GetByQuery: { route: '/vehicles/by-query', method: 'post' },
    Models: { route: '/vehicles/models', method: 'get' },
    Makes: { route: '/vehicles/makes-and-models/by-query', method: 'post' },
    RemoveMake: {
      route: '/vehicles/makes?serviceCenterId={serviceCenterId}&makeId={makeId}',
      method: 'delete',
    },
    UpdateMake: { route: '/vehicles/makes/{id}', method: 'put' },
    CreateMake: { route: '/vehicles/makes', method: 'put' },
    GetMileage: { route: '/vehicles/mileage', method: 'get' },
    RemoveMileage: { route: '/vehicles/mileage/{id}', method: 'delete' },
    CreateMileage: { route: '/vehicles/mileage', method: 'post' },
    MakesModels: { route: '/vehicles/makes-models', method: 'get' },
    GetEngineType: { route: '/vehicles/engine-type/by-query', method: 'get' },
    RemoveEngineType: { route: '/vehicles/engine-type/{id}', method: 'delete' },
    CreateEngineType: { route: '/vehicles/engine-type', method: 'post' },
    UpdateModel: { route: '/vehicles/models', method: 'put' },
    GetMakeCodes: { route: '/vehicles/make-codes', method: 'get' },
    GetMakeModelCodes: { route: '/vehicles/make-model-codes', method: 'get' },
  },
  WaitListSettings: {
    Get: { route: '/waitlist-settings', method: 'get' },
    Update: { route: '/waitlist-settings', method: 'put' },
    Toggle: { route: '/waitlist-settings/toggle', method: 'put' },
  },
  ZipCodes: {
    GetFiltered: { route: '/zip-codes/by-query', method: 'post' },
  },
  DealerOperations: {
    CreateEvent: { route: '/outbound-events', method: 'post' },
    GetEvents: { route: '/outbound-events', method: 'get' },
    DeleteEvent: { route: '/outbound-events/{id}', method: 'delete' },
    UpdateEvent: { route: '/outbound-events/{id}', method: 'put' },
    GetTextIntegration: { route: '/text-integration', method: 'get' },
    SetTextIntegration: { route: '/text-integration', method: 'put' },
    GetPhoneNumbers: { route: '/text-integration/phone-numbers', method: 'post' },
    SendSMSMessage: { route: '/text-integration/sms-message', method: 'post' },
    MessageTags: { route: '/outbound-events/message-tags', method: 'get' },
  },
  ServiceCenterCredits: {
    GetServiceCenterCredits: { route: '/service-center-credits', method: 'get' },
    UpdateServiceCenterCredits: { route: '/service-center-credits', method: 'patch' },
  },
  ShortUrls: {
    Resolve: { route: '/short-urls/{code}/resolve', method: 'get' },
  },
};
