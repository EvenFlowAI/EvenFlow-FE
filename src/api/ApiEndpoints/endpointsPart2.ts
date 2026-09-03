import { IApiEndpoints } from './types';

type TEndpointsPart2 = Pick<
  IApiEndpoints,
  | 'GeographicZones'
  | 'GlobalVehicles'
  | 'GlobalRecalls'
  | 'IntervalUpsell'
  | 'MaintenancePackages'
  | 'Notifications'
  | 'OptimizationWindows'
  | 'Offers'
  | 'Qrvey'
  | 'Pods'
>;

export const endpointsPart2: TEndpointsPart2 = {
  GeographicZones: {
    GetZones: { route: '/geographic-zones/by-query', method: 'post' },
    Create: { route: '/geographic-zones', method: 'post' },
    Update: { route: '/geographic-zones/{id}', method: 'put' },
    Remove: { route: '/geographic-zones/{id}', method: 'delete' },
    ReassignZipCode: { route: '/geographic-zones/re-assign-zip-code/{id}', method: 'put' },
    RemoveZipCode: { route: '/geographic-zones/zip-code/{id}', method: 'delete' },
    GetById: { route: '/geographic-zones/{id}', method: 'get' },
    GetShort: { route: '/geographic-zones/short-by-query', method: 'get' },
  },
  GlobalVehicles: {
    GetMakes: { route: '/global-vehicle-makes/by-query', method: 'post' },
    GetModels: { route: '/global-vehicle-models/by-query', method: 'post' },
    UpdateMakes: { route: '/global-vehicle-makes', method: 'put' },
    UpdateModels: { route: '/global-vehicle-models', method: 'put' },
    GetMakesStatistic: { route: '/global-vehicle-makes/statistics', method: 'get' },
    GetModelsStatistic: { route: '/global-vehicle-models/statistics', method: 'get' },
  },
  GlobalRecalls: {
    GetGlobalRecalls: { route: '/global-recall-campaigns/by-query', method: 'get' },
    GetAllGlobalRecalls: { route: '/global-recall-campaigns/all', method: 'get' },
    GlobalRecallCampaign: {
      route: '/global-recall-campaigns/{id}/recall-component-booking-flow',
      method: 'patch',
    },
    GetAffectedModels: {
      route: '/global-recall-campaigns/{campaignId}/affected-models',
      method: 'get',
    },
    GetManufacturers: {
      route: '/global-recall-campaigns/manufacturers',
      method: 'get',
    },
    GetRecallComponent: {
      route: 'global-recall-campaigns/{id}',
      method: 'get',
    },
  },
  IntervalUpsell: {
    GetUpsellByQuery: { route: '/interval-upsells/by-query', method: 'post' },
    EditUpsell: { route: '/interval-upsells/{id}', method: 'put' },
    RemoveUpsell: { route: '/interval-upsells/{id}', method: 'delete' },
    AddUpsell: { route: '/interval-upsells', method: 'post' },
    GetUpsellById: { route: '/interval-upsells/{id}', method: 'get' },
  },
  MaintenancePackages: {
    Create: { route: '/maintenance-packages', method: 'post' },
    Update: { route: '/maintenance-packages/{id}', method: 'put' },
    Remove: { route: '/maintenance-packages/{id}', method: 'delete' },
    Retrieve: { route: '/maintenance-packages/{id}', method: 'get' },
    SetPricingOptimization: {
      route: '/maintenance-packages/{id}/pricing-optimization',
      method: 'patch',
    },
    GetByQuery: { route: '/maintenance-packages/by-query', method: 'post' },
    PackageOptions: { route: '/maintenance-packages/{id}/options', method: 'put' },
    ByVehicle: { route: '/maintenance-packages/by-vehicle', method: 'post' },
    GetShortByQuery: { route: '/maintenance-packages/short-by-query', method: 'post' },
    GetOptionsByQuery: { route: '/maintenance-packages/options-by-query', method: 'post' },
    EMenuMaintenancePackage: { route: '/emenu-maintenance-packages', method: 'post' },
    ChangePricingDisplayType: {
      route: '/maintenance-packages/{id}/pricing-display-type',
      method: 'patch',
    },
    UpdateSRDescription: {
      route: '/maintenance-packages/{id}/set-service-request-description',
      method: 'patch',
    },
    UpdateComplimentaryDescription: {
      route: '/maintenance-packages/{id}/set-complimentary-service-description',
      method: 'patch',
    },
    UpdateComplimentaryOrder: {
      route: '/maintenance-packages/{id}/set-list-complimentary-service-order-index',
      method: 'patch',
    },
    UpdateUpsellOrder: {
      route: '/maintenance-packages/{id}/set-list-interval-upsell-order-index',
      method: 'patch',
    },
    UpdateSROrder: {
      route: '/maintenance-packages/{id}/set-list-service-request-order-index',
      method: 'patch',
    },
    SetShowSuggestedPrice: {
      route: '/maintenance-packages/{id}/set-show-suggested-price',
      method: 'patch',
    },
    SetManualOverride: {
      route: '/maintenance-packages/{id}/set-manual-override-price',
      method: 'patch',
    },
    UpdatePriceTitles: { route: '/maintenance-packages/{id}/price-titles', method: 'put' },
    UpdateSegmentTitles: { route: '/maintenance-packages/{id}/segment-titles', method: 'put' },
  },
  Notifications: {
    GetAll: { route: '/appointment-notifications/{id}/configurations', method: 'get' },
    UpdateForPod: { route: '/appointment-notifications/pods', method: 'post' },
    UpdateByType: { route: '/appointment-notifications', method: 'post' },
    UpdateForTransportation: {
      route: '/appointment-notifications/transportation-options',
      method: 'post',
    },
  },
  OptimizationWindows: {
    GetParams: { route: '/optimization-windows', method: 'get' },
    SetParams: { route: '/optimization-windows', method: 'put' },
    GetOverbooking: { route: '/demand-management-settings/overbooking-factor', method: 'get' },
    SetOverbooking: { route: '/demand-management-settings/overbooking-factor', method: 'put' },
    GetAppointmentCutoff: { route: '/optimization-windows/appointment-cutoff', method: 'get' },
    SetAppointmentCutoff: { route: '/optimization-windows/appointment-cutoff', method: 'put' },
  },
  Offers: {
    Create: { route: '/offers', method: 'post' },
    GetAll: { route: '/offers/by-query', method: 'post' },
    Retrieve: { route: '/offers/{id}', method: 'get' },
    Edit: { route: '/offers/{id}', method: 'put' },
    ChangeStatus: { route: '/offers/{id}/status', method: 'patch' },
    Remove: { route: '/offers/{id}', method: 'delete' },
  },
  Qrvey: {
    GetToken: { route: '/qrvey/token', method: 'post' },
  },
  Pods: {
    Create: { route: '/pods', method: 'post' },
    Update: { route: '/pods/{id}', method: 'put' },
    Retrieve: { route: '/pods/{id}', method: 'get' },
    Remove: { route: '/pods/{id}', method: 'delete' },
    GetAll: { route: '/pods/by-query', method: 'post' },
    GetShort: { route: '/pods/short-by-query', method: 'post' },
    // todo change to real endpoint
    GetMakes: { route: '/pods/makes', method: 'get' },
    GetSummary: { route: '/pods/summary', method: 'get' },
    SetOrderIndex: { route: '/pods/order-index-assignment', method: 'patch' },
    Deactivate: { route: '/pods/{id}/deactivate', method: 'put' },
    Activate: { route: '/pods/{id}/activate', method: 'put' },
  },
};
