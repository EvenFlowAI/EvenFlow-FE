import { IApiEndpoints } from './types';

type TEndpointsPart3 = Pick<
  IApiEndpoints,
  | 'PricingSettings'
  | 'Recalls'
  | 'Audit'
  | 'ServiceCategories'
  | 'ServiceCenters'
  | 'ServiceConsultants'
  | 'ServiceRequests'
  | 'ServiceTypes'
  | 'SlotScoring'
  | 'ServiceValet'
  | 'TransportationOptions'
>;

export const endpointsPart3: TEndpointsPart3 = {
  PricingSettings: {
    GetList: { route: '/pricing-settings', method: 'get' },
    Edit: { route: '/pricing-settings', method: 'put' },
    GetDayOfWeek: { route: '/pricing-settings/day-of-week', method: 'get' },
    SetDayOfWeek: { route: '/pricing-settings/day-of-week', method: 'put' },
    CreateTimeOfYear: { route: '/pricing-settings/time-of-year', method: 'post' },
    GetTimeOfYear: { route: '/pricing-settings/time-of-year', method: 'get' },
    UpdateTimeOfYear: { route: '/pricing-settings/time-of-year/{id}', method: 'put' },
    RemoveTimeOfYear: { route: '/pricing-settings/time-of-year/{id}', method: 'delete' },
    GetLevels: { route: '/pricing-settings/levels', method: 'get' },
    SetLevels: { route: '/pricing-settings/levels', method: 'put' },
    Calculation: { route: '/pricing-settings/calculation', method: 'get' },
    GetServiceRequestsPricingLevels: {
      route: '/pricing-settings/service-requests/pricing-levels',
      method: 'get',
    },
    ChangeServiceRequestPricingLevels: {
      route: '/pricing-settings/service-requests/pricing-levels/{id}',
      method: 'put',
    },
    GetServiceRequestsPricingSettings: {
      route: '/pricing-settings/service-requests',
      method: 'get',
    },
    UpdateServiceRequestPricingSettings: {
      route: '/pricing-settings/service-requests/{id}',
      method: 'put',
    },
    DeleteServiceRequestPricingSettings: {
      route: '/pricing-settings/service-requests/{id}',
      method: 'delete',
    },
    AddServiceRequests: { route: '/pricing-settings/service-requests', method: 'post' },
    GetPackagePricingLevels: {
      route: '/pricing-settings/maintenance-package-options/pricing-levels',
      method: 'get',
    },
    ChangePackagePricingLevels: {
      route: '/pricing-settings/maintenance-package-options/pricing-levels/{id}',
      method: 'put',
    },
    ChangePackagePricingSettings: {
      route: '/pricing-settings/maintenance-package-options/{id}',
      method: 'put',
    },
    GetPackagePricingSettings: {
      route: '/pricing-settings/maintenance-package-options',
      method: 'get',
    },
    AddPackagePricingSettings: {
      route: '/pricing-settings/maintenance-package-options',
      method: 'post',
    },
    RemovePackagePricingSettings: {
      route: '/pricing-settings/maintenance-package-options/{id}',
      method: 'delete',
    },
    UpdateMaxPrice: { route: '/price/max-price/{id}', method: 'put' },
  },
  Recalls: {
    GetAll: { route: '/recall/by-query', method: 'post' },
    GetById: { route: '/recall/{id}', method: 'get' },
    GetByVin: { route: '/recall/by-vin', method: 'post' },
    Create: { route: '/recall', method: 'post' },
    Update: { route: '/recall/{id}', method: 'put' },
    Remove: { route: '/recall/{id}', method: 'delete' },
    UpdateRecallParts: { route: '/recall', method: 'put' },
    GetRecallEvents: { route: '/recall-events/by-query', method: 'get' },
    CreateRecallEvent: { route: '/recall-events', method: 'post' },
    UpdateRecallEvent: { route: '/recall-events', method: 'put' },
    DeleteRecallEvent: { route: '/recall-events/{id}', method: 'delete' },
    UploadCSV: { route: '/recall-events/{id}/upload-csv', method: 'patch' },
    RecallTrigger: { route: '/recall/groups/{id}/trigger', method: 'patch' },
  },
  Audit: {
    History: { route: '/audit/history', method: 'get' },
  },
  ServiceCategories: {
    Create: { route: '/service-categories', method: 'post' },
    UpdateIcon: { route: '/service-categories/{id}/icon', method: 'patch' },
    Update: { route: '/service-categories/{id}', method: 'put' },
    Remove: { route: '/service-categories/{id}', method: 'delete' },
    Retrieve: { route: '/service-categories/{id}', method: 'get' },
    GetByQuery: { route: '/service-categories/by-query', method: 'post' },
    GetByPage: { route: '/service-categories/by-page', method: 'post' },
    GetShortByQuery: { route: '/service-categories/short-by-query', method: 'post' },
  },
  ServiceCenters: {
    Create: { route: '/service-centers', method: 'post' },
    GetShort: { route: '/service-centers', method: 'get' },
    Update: { route: '/service-centers/{id}', method: 'put' },
    Remove: { route: '/service-centers/{id}', method: 'delete' },
    Retrieve: { route: '/service-centers/{id}', method: 'get' },
    UpdateAddress: { route: '/service-centers/{id}/address', method: 'put' },
    GetAll: { route: '/service-centers/by-query', method: 'post' },
    Avatar: { route: '/service-centers/{id}/avatar', method: 'patch' },
    ChangePricingOpt: { route: '/service-centers/{id}/pricing-optimization', method: 'patch' },
    GetSelection: { route: '/service-centers/selection', method: 'get' },
    GetHOO: { route: '/service-centers/{id}/hours-of-operations', method: 'get' },
    SetHOO: { route: '/service-centers/{id}/hours-of-operations', method: 'put' },
    GetWS: { route: '/service-centers/{id}/weekly-schedules', method: 'get' },
    SetWS: { route: '/service-centers/{id}/weekly-schedules', method: 'put' },
    GetBreaks: { route: '/service-centers/{id}/breaks', method: 'get' },
    SetBreaks: { route: '/service-centers/{id}/breaks', method: 'put' },
    WorkingDays: { route: '/service-centers/{id}/working-days', method: 'get' },
    GetRoundPrice: { route: '/service-centers/{id}/round-price', method: 'get' },
    ChangeRoundPrice: { route: '/service-centers/{id}/round-price', method: 'patch' },
    GetMaxPriceDateRange: { route: '/service-centers/{id}/max-price-date-range', method: 'get' },
    UpdateMaxPriceDateRange: {
      route: '/service-centers/{id}/max-price-date-range',
      method: 'patch',
    },
    GetReminders: { route: '/service-centers/{id}/send-reminders', method: 'get' },
    UpdateReminders: { route: '/service-centers/{id}/send-reminders', method: 'patch' },
    UpdateAuth: { route: '/service-centers/{id}/auth', method: 'patch' },
    UpdateAdvisor: {
      route: '/service-centers/{id}/update-appointments-advisor',
      method: 'patch',
    },
    GetAllServiceCenterSettings: {
      route: '/service-center-settings',
      method: 'get',
    },
    UpdatePredictionParams: {
      route: '/service-center-settings/{id}/prediction-parameters',
      method: 'put',
    },
    GetPredictionParams: {
      route: '/service-center-settings/{id}/prediction-parameters',
      method: 'get',
    },
    GetLaborRate: { route: '/service-center-settings/{id}/labor-rates', method: 'get' },
    UpdateLaborRate: { route: '/service-center-settings/{id}/labor-rates', method: 'put' },
    UpdatePackageDisclaimer: {
      route: '/service-centers/{id}/set-package-disclaimer',
      method: 'patch',
    },
    GetAncillaryPriceType: {
      route: '/service-center-settings/{id}/ancillary-price-type',
      method: 'post',
    },
    UpdateAncillaryPriceType: {
      route: '/service-center-settings/{id}/ancillary-price-type',
      method: 'put',
    },
    UpdatePackagePriceDetails: {
      route: '/service-centers/{id}/maintenance-package-price-details',
      method: 'patch',
    },
    SetPackageSourceType: {
      route: '/service-centers/{id}/maintenance-package-source-type',
      method: 'patch',
    },
    UpdateDefaultOpsCode: {
      route: '/service-center-settings/{id}/default-recall',
      method: 'put',
    },
    UpdateDefaultMake: {
      route: '/service-center-settings/{id}/default-vehicle-make',
      method: 'patch',
    },
    UpdatePresentedPackageOptions: {
      route: '/service-centers/{id}/maintenance-package-option-types',
      method: 'put',
    },
    UpdateEngineTypeFieldName: {
      route: '/service-centers/{id}/engine-type-field-name',
      method: 'patch',
    },
    GetAssignedAdvisorMethod: {
      route: '/service-center-settings/{id}/advisor-assignment',
      method: 'get',
    },
    UpdateAssignedAdvisorMethod: {
      route: '/service-center-settings/{id}/advisor-assignment',
      method: 'put',
    },
    SetEmailRequired: { route: '/service-center-settings/{id}/email-required', method: 'patch' },
    GetAvailableCredits: { route: '/service-centers/{id}/available-credits', method: 'get' },
  },
  ServiceConsultants: {
    Create: { route: '/service-consultants', method: 'post' },
    Update: { route: '/service-consultants/{id}', method: 'put' },
    Remove: { route: '/service-consultants/{id}', method: 'delete' },
    Retrieve: { route: '/service-consultants/{id}', method: 'get' },
    GetByQuery: { route: '/service-consultants/by-query', method: 'post' },
    GetDmsAdvisors: { route: '/service-consultants/{id}/dms-service-advisors', method: 'get' },
    GetByRole: { route: '/service-consultants', method: 'get' },
  },
  ServiceRequests: {
    Create: { route: '/service-requests', method: 'post' },
    Remove: { route: '/service-requests/{id}', method: 'delete' },
    Update: { route: '/service-requests/{id}', method: 'put' },
    Retrieve: { route: '/service-requests/{id}', method: 'get' },
    GetFiltered: { route: '/service-requests/by-query', method: 'post' },
    GetAssignedOverridesCSV: { route: '/service-requests/overrides/csv', method: 'get' },
    UpdateStatus: { route: '/service-requests/{id}/status', method: 'patch' },
    CreateOverrides: { route: '/service-requests/{id}/overrides', method: 'post' },
    EditOverrides: { route: '/service-requests/overrides/{id}', method: 'put' },
    GetSROverrides: { route: '/service-requests/overrides/{id}', method: 'get' },
    GetAssignedOverrides: { route: '/service-requests/overrides', method: 'get' },
    RemoveOverride: { route: '/service-requests/overrides/{id}', method: 'delete' },
    AssignMultiple: { route: '/service-requests/overrides', method: 'post' },
    GetShort: { route: '/service-requests/overrides/short-by-query', method: 'get' },
    EditSkills: { route: '/service-requests/required-skills', method: 'patch' },
    Eligibility: { route: '/service-requests/eligibility', method: 'patch' },
    Prioritize: { route: '/service-requests/prioritize', method: 'patch' },
    ChangePricingDisplayType: {
      route: '/service-requests/overrides/{id}/pricing-display-type',
      method: 'patch',
    },
    DefaultLaborTypes: { route: '/labor-types', method: 'get' },
  },
  ServiceTypes: {
    Create: { route: '/service-type-options', method: 'post' },
    UpdateIcon: { route: '/service-type-options/icon', method: 'patch' },
    Update: { route: '/service-type-options/{id}', method: 'put' },
    Remove: { route: '/service-type-options', method: 'delete' },
    GetByQuery: { route: '/service-type-options/by-query', method: 'post' },
  },
  SlotScoring: {
    SetProximity: { route: '/slot-scoring/proximity', method: 'put' },
    GetProximity: { route: '/slot-scoring/proximity', method: 'get' },
    SetDesirability: { route: '/slot-scoring/desirability', method: 'put' },
    GetDesirability: { route: '/slot-scoring/desirability', method: 'get' },
    SetOptimization: { route: '/slot-scoring/optimization-settings', method: 'put' },
    GetOptimization: { route: '/slot-scoring/optimization-settings', method: 'get' },
    SetValues: { route: '/slot-scoring/optimization-settings/values', method: 'put' },
    GetRange: { route: '/slot-scoring/range', method: 'get' },
    UpdateRange: { route: '/slot-scoring/range', method: 'put' },
    GetSlotsGap: { route: '/slot-scoring/gap', method: 'get' },
  },
  ServiceValet: {
    GetZoneRouting: {
      route: '/geographical-zone-settings/routing/{id}?serviceType={serviceType}',
      method: 'get',
    },
    UpdateZoneRouting: { route: '/geographical-zone-settings/routing/{id}', method: 'put' },
    GatAllCapacity: { route: '/service-valet/{id}/capacity/get-all', method: 'get' },
    GetCapacityById: { route: '/service-valet/capacity/{id}', method: 'get' },
    CreateCapacity: { route: '/service-valet/capacity', method: 'post' },
    UpdateCapacity: { route: '/service-valet/{id}/capacity', method: 'put' },
    ChangeShowDropOffTime: { route: 'service-valet/{id}/show-drop-off-time', method: 'put' },
    ChangeServiceRequest: { route: 'service-valet/{id}/service-request', method: 'put' },
    ChangeDmsTimeStamp: { route: 'service-valet/{id}/dms-time', method: 'put' },
    GetServiceValetSettings: { route: 'service-valet/settings', method: 'get' },
    UpdateServiceValetSettings: { route: 'service-valet/settings', method: 'put' },
    UpdateZonesServiceRequests: {
      route: 'geographical-zone-settings/service-requests/{id}',
      method: 'put',
    },
    GetMobileServiceSettings: { route: 'mobile-service/{id}/settings', method: 'get' },
  },
  TransportationOptions: {
    Edit: { route: '/transportation-options', method: 'put' },
    Get: { route: '/transportation-options', method: 'get' },
    GetShort: { route: '/transportation-options/short-by-query', method: 'get' },
    GetActive: { route: '/transportation-options/active/by-query', method: 'post' },
    Rules: { route: '/transportation-options/{id}/rules', method: 'put' },
    UpdateById: { route: '/transportation-options/{id}', method: 'put' },
    UpdateIcon: { route: '/transportation-options/{id}/icon', method: 'patch' },
    Add: { route: '/transportation-option-rules', method: 'post' },
    Remove: { route: `/transportation-option-rules/{id}`, method: 'delete' },
    PatchUpdate: { route: `/transportation-option-rules/bulk-state`, method: 'patch' },
    Update: { route: `/transportation-option-rules/{id}`, method: 'put' },
  },
};
