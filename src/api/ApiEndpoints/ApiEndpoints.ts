import {IApiEndpoints, TApiEndpoint} from "./types";
import {pathReplace} from "../../utils/utils";
import {AxiosResponse} from "axios";
import {request} from "../request";

export type TOptions = {
    data?: any,
    params?: Record<string, any>,
    urlParams?: Record<string, any>
}

export class Api {
    static endpoints: IApiEndpoints = {
        Accounts: {
            Recovery: {
                route: "/accounts/password-recovery",
                method: "post"
            },
            Reset: {route: "/accounts/password-reset", method: "patch"},
            Change: {route: "/accounts/password-change", method: "patch"},
            Verification: {route: "/accounts/verification", method: "patch"},
            Profile: {route: "/accounts/profile", method: "get"},
            Dealership: {route: "/accounts/dealership", method: "get"},
            ResendEmail: {route: "/accounts/invitation-email", method: "post"}
        },
        AncillaryPricing: {
            GetZones: {route: "/ancillary-price/geographic-zone/by-query", method: "post"},
            UpdateZone: {route: "/ancillary-price/geographic-zone/{id}", method: "put"},
            GetDistances: {route: "/ancillary-price/distance/by-query", method: "post"},
            CreateDistance: {route: "/ancillary-price/distance", method: "post"},
            UpdateDistance: {route: "/ancillary-price/distance/{id}", method: "put"},
            DeleteDistance: {route: "/ancillary-price/distance/{id}", method: "delete"},
            GetByZip: {route: "/ancillary-price/get-convenience-fee", method: "post"},
        },
        Appointments: {
            Create: {route: "/appointments", method: "post"},
            Update: {route: "/appointments/{id}", method: "put"},
            UpdateByKey: {route: "/appointments/{id}/by-key", method: "put"},
            Cancel: {route: "/appointments/{id}/cancel", method: "put"},
            CancelByKey: {route: "/appointments/{id}/cancel/by-key", method: "put"},
            GetByKey: {route: "/appointments/{key}/by-key", method: "get"},
            CheckPodChanged: {route: "/appointments/{key}/check-pod-changed", method: "post"},
            GetServiceBooks: {route: "/appointments-filter/{id}/service-book-list", method: "get"},
            GetSchedulers: {route: "/appointments-filter/scheduler-list", method: "get"},
        },
        AppointmentAllocation: {
            SetTimeWindows: {route: "/appointment-allocations/time-windows", method: "put"},
            GetTimeWindows: {route: "/appointment-allocations/time-windows", method: "get"},
            GetTWEligibility: {route: "/appointment-allocations/time-windows/eligibility", method: "get"},
            SetTWEligibility: {route: "/appointment-allocations/time-windows/eligibility", method: "patch"},
            CreateDemandSegment: {route: "/appointment-allocations/demand-segments", method: "post"},
            GetDemandSegments: {route: "/appointment-allocations/demand-segments", method: "get"},
            BatchUpdateDemandSegments: {route: "/appointment-allocations/demand-segments", method: "put"},
            RemoveDemandSegment: {route: "/appointment-allocations/demand-segments/{id}", method: "delete"},
            SetUnplanned: {route: "/appointment-allocations/unplanned-demand-segments", method: "put"},
            GetUnplanned: {route: "/appointment-allocations/unplanned-demand-segments", method: "get"},
            GetUnplannedSlotsByDay: {route: "/appointment-allocations/unplanned-demand-slots", method: "get"},
            UpdateUnplannedSlots: {route: "/appointment-allocations/unplanned-demand-slots", method: "put"},
        },
        AppointmentSlots: {
            GetSlots: {route: "/appointment-slots/by-query", method: "post"},
            GetServiceValetSlots: {route: "/service-valet-appointment-slots/by-query", method: "post"},
        },
        AppointmentPricing: {
            GetPriceList: {route: '/appointment-pricing/requests-price-list', method: 'post'}
        },
        Authentications: {
            Request: {route: "/authentications", method: "post"},
            Refresh: {route: "/authentications/refresh", method: "post"},
        },
        Bays: {
            Create: {route: "/bays", method: "post"},
            Update: {route: "/bays/{id}", method: "put"},
            Remove: {route: "/bays/{id}", method: "delete"},
            Retrieve: {route: "/bays/{id}", method: "get"},
            GetAll: {route: "/bays/by-query", method: "post"},
            GetShort: {route: "/bays/short-by-query", method: "post"},
        },
        BookingFlowConfig: {
            Get: {route: "/booking-flow/{id}/settings", method: "get"},
            Update: {route: "/booking-flow/{id}/settings", method: "put"},
        },
        BookingFlowScreenSettings: {
            GetEmailRequirement: {route: "/booking-flow-screen-settings/{id}/email-requirement", method: "get"},
            UpdateEmailRequirement: {route: "/booking-flow-screen-settings/{id}/email-requirement", method: "put"},
        },
        CapacityManagement: {
            Reallocate: {route: "/capacity-management/capacity-data-reallocate", method: "put"},
        },
        CapacitySettings:{
            GetAll: {route: "/capacity-settings", method: "get"},
            GetById: {route: "/capacity-settings/{id}", method: "get"},
            Update: {route: "/capacity-settings", method: "put"},
        },
        ComplimentaryServices: {
            GetByQuery: {route: "/complimentary-services/by-query", method: "post"},
            Create: {route: "/complimentary-services", method: "post"},
            AddFromList: {route: "/complimentary-services/add-service-request", method: "post"},
            Update: {route: "/complimentary-services/{id}", method: "put"},
            Remove: {route: "/complimentary-services/{id}", method: "delete"},
        },
        Customers: {
            GetByName: {route: "/customers/vehicles/by-customer-name", method: "get"},
            Update: {route: "/customers/vehicles", method: "put"},
            GetRepairHistory: {route: "/customers/vehicles/repair-orders", method: "get"},
            GetBySearchTerm: {route: "/customers/vehicles", method: "get"},
            GetSingleCustomerVehicles: {route: "/customers/single-customer-vehicles", method: "get"},
        },
        CustomerConsent: {
            Create: {route: "/customer-consents", method: "post"},
            GetAll: {route: "/customer-consents", method: "get"},
            GetById: {route: "/customer-consents/{id}", method: "get"},
            Remove: {route: "/customer-consents", method: "delete"},
            Update: {route: "/customer-consents/{id}", method: "put"},
            Search: {route: "/customer-consents/search", method: "post"},
            Toggle: {route: "/customer-consents", method: "patch"}
        },
        Dealerships: {
            Create: {route: "/dealerships", method: "post"},
            GetShort: {route: "/dealerships", method: "get"},
            GetAll: {route: "/dealerships/by-query", method: "post"},
            Remove: {route: "/dealerships/{id}", method: "delete"},
            Retrieve: {route: "/dealerships/{id}", method: "get"},
            Update: {route: "/dealerships/{id}", method: "put"},
            UpdateAddress: {route: "/dealerships", method: "put"},
            UploadAvatar: {route: "/dealerships/{id}/avatar", method: "patch"}
        },
        DemandManagement: {
            GetSettings: {route: "/demand-management-settings", method: "get"},
            UpdateSettings: {route: "/demand-management-settings", method: "put"},
        },
        Employees: {
            Create: {route: "/employees", method: "post"},
            Update: {route: "/employees/{id}", method: "put"},
            GetAll: {route: "/employees/by-query", method: "post"},
            GetAssignmentSettings: {route: "/employees/assignment-settings/{serviceCenterId}", method: "get"},
            UpdateAssignmentSettings: {route: "/employees/assignment-settings", method: "put"},
        },
        EmployeeCapacity: {
            GetAdvisorsCapacity: {route: "/employee-capacity/advisors", method: "get"},
            UpdateAdvisorsCapacity: {route: "/employee-capacity/advisors", method: "put"},
            GetTechniciansCapacity: {route: "/employee-capacity/technicians", method: "get"},
            UpdateTechniciansCapacity: {route: "/employee-capacity/technicians", method: "put"},
            UpdateTechniciansSettings: {route: "/employee-capacity/technicians/settings", method: "put"},
        },
        EmployeeSchedule: {
            Create: {route: "/employee-schedules", method: "post"},
            Retrieve: {route: "/employee-schedules/{id}", method: "get"},
            Update: {route: "/employee-schedules", method: "put"},
            Remove: {route: "/employee-schedules/{id}", method: "delete"},
            GetAll: {route: "/employee-schedules/by-query", method: "post"},
            SetForWeek: {route: "/employee-schedules/batch-update", method: "put"},
            GetCalendarSummary: {route: "/employee-schedules/date-range-summary-per-role", method: "post"},
            GetByDate: {route: "/employee-schedules/get-by-date", method: "get"},
            UpdateByDate: {route: "/employee-schedules/set-for-date-range", method: "put"},
            GetBaseSummary: {route: "/employee-schedules/base-summary", method: "post"},
            GetSummaryByEmployee: {route: "/employee-schedules/base-summary-by-employee", method: "post"},
            GetTimeScheduleByEmployee: {route: "/employee-schedules/get-base-schedule-by-employee", method: "get"},
            SetTimeScheduleByEmployee: {route: "/employee-schedules/set-base-schedule-by-employee", method: "post"},
        },
        GeneralSettings: {
            Get: {route: "/general-settings", method: 'get'},
            Update: {route: "/general-settings", method: 'post'},
        },
        GeographicZones: {
            GetZones: {route: "/geographic-zones/by-query", method: "post"},
            Create: {route: "/geographic-zones", method: "post"},
            Update: {route: "/geographic-zones/{id}", method: "put"},
            Remove: {route: "/geographic-zones/{id}", method: "delete"},
            ReassignZipCode: {route: "/geographic-zones/re-assign-zip-code/{id}", method: "put"},
            RemoveZipCode: {route: "/geographic-zones/zip-code/{id}", method: "delete"},
            GetById: {route: "/geographic-zones/{id}", method: "get"},
            GetShort: {route: "/geographic-zones/short-by-query", method: "get"},
        },
        GlobalVehicles: {
            GetMakes: {route: "/global-vehicle-makes/by-query", method: "post"},
            GetModels: {route: "/global-vehicle-models/by-query", method: "post"},
            UpdateMakes: {route: "/global-vehicle-makes", method: "put"},
            UpdateModels: {route: "/global-vehicle-models", method: "put"},
            GetMakesStatistic: {route: "/global-vehicle-makes/statistics", method: "get"},
            GetModelsStatistic: {route: "/global-vehicle-models/statistics", method: "get"},
        },
        IntervalUpsell: {
            GetUpsellByQuery: {route: "/interval-upsells/by-query", method: "post"},
            EditUpsell: {route: "/interval-upsells/{id}", method: "put"},
            RemoveUpsell: {route: "/interval-upsells/{id}", method: "delete"},
            AddUpsell: {route: "/interval-upsells", method: "post"},
            GetUpsellById: {route: "/interval-upsells/{id}", method: "get"},
        },
        MaintenancePackages: {
            Create: {route: "/maintenance-packages", method: "post"},
            Update: {route: "/maintenance-packages/{id}", method: "put"},
            Remove: {route: "/maintenance-packages/{id}", method: "delete"},
            Retrieve: {route: "/maintenance-packages/{id}", method: "get"},
            SetPricingOptimization: {route: "/maintenance-packages/{id}/pricing-optimization", method: "patch"},
            GetByQuery: {route: "/maintenance-packages/by-query", method: "post"},
            PackageOptions: {route: "/maintenance-packages/{id}/options", method: "put"},
            ByVehicle: {route: "/maintenance-packages/by-vehicle", method: "post"},
            GetShortByQuery: {route: "/maintenance-packages/short-by-query", method: "post"},
            GetOptionsByQuery: {route: "/maintenance-packages/options-by-query", method: "post"},
            ChangePricingDisplayType: {route: "/maintenance-packages/{id}/pricing-display-type", method: "patch"},
            UpdateSRDescription: {route: "/maintenance-packages/{id}/set-service-request-description", method: "patch"},
            UpdateComplimentaryDescription: {
                route: "/maintenance-packages/{id}/set-complimentary-service-description",
                method: "patch"
            },
            UpdateComplimentaryOrder: {
                route: "/maintenance-packages/{id}/set-list-complimentary-service-order-index",
                method: "patch"
            },
            UpdateUpsellOrder: {
                route: "/maintenance-packages/{id}/set-list-interval-upsell-order-index",
                method: "patch"
            },
            UpdateSROrder: {route: "/maintenance-packages/{id}/set-list-service-request-order-index", method: "patch"},
            SetShowSuggestedPrice: {route: "/maintenance-packages/{id}/set-show-suggested-price", method: "patch"},
            SetManualOverride: {route: "/maintenance-packages/{id}/set-manual-override-price", method: "patch"},
            UpdatePriceTitles: {route: "/maintenance-packages/{id}/price-titles", method: "put"},
            UpdateSegmentTitles: {route: "/maintenance-packages/{id}/segment-titles", method: "put"}
        },
        Notifications: {
            GetAll: {route: "/appointment-notifications/{id}/configurations", method: "get"},
            UpdateForPod: {route: "/appointment-notifications/pods", method: "post"},
            UpdateByType: {route: "/appointment-notifications", method: "post"},
            UpdateForTransportation: {route: "/appointment-notifications/transportation-options", method: "post"},
        },
        OptimizationWindows: {
            GetParams: {route: "/optimization-windows", method: "get"},
            SetParams: {route: "/optimization-windows", method: "put"},
            GetOverbooking: {route: "/optimization-windows/overbooking-factor", method: "get"},
            SetOverbooking: {route: "/optimization-windows/overbooking-factor", method: "put"},
            GetAppointmentCutoff: {route: "/optimization-windows/appointment-cutoff", method: "get"},
            SetAppointmentCutoff: {route: "/optimization-windows/appointment-cutoff", method: "put"},
        },
        Offers: {
            Create: {route: "/offers", method: "post"},
            GetAll: {route: "/offers/by-query", method: "post"},
            Retrieve: {route: "/offers/{id}", method: "get"},
            Edit: {route: "/offers/{id}", method: "put"},
            ChangeStatus: {route: "/offers/{id}/status", method: "patch"},
            Remove: {route: "/offers/{id}", method: "delete"},
        },
        Qrvey: {
            GetToken: {route: "/qrvey/token", method: "post"}
        },
        Pods: {
            Create: {route: "/pods", method: "post"},
            Update: {route: "/pods/{id}", method: "put"},
            Retrieve: {route: "/pods/{id}", method: "get"},
            Remove: {route: "/pods/{id}", method: "delete"},
            GetAll: {route: "/pods/by-query", method: "post"},
            GetShort: {route: "/pods/short-by-query", method: "post"},
            // todo change to real endpoint
            GetMakes: {route: "/pods/makes", method: "get"},
            GetSummary: {route: "/pods/summary", method: 'get'},
            SetOrderIndex: {route: "/pods/order-index-assignment", method: 'patch'}
        },
        PricingSettings: {
            GetList: {route: "/pricing-settings", method: "get"},
            Edit: {route: "/pricing-settings", method: "put"},
            GetDayOfWeek: {route: "/pricing-settings/day-of-week", method: "get"},
            SetDayOfWeek: {route: "/pricing-settings/day-of-week", method: "put"},
            CreateTimeOfYear: {route: "/pricing-settings/time-of-year", method: "post"},
            GetTimeOfYear: {route: "/pricing-settings/time-of-year", method: "get"},
            UpdateTimeOfYear: {route: "/pricing-settings/time-of-year/{id}", method: "put"},
            RemoveTimeOfYear: {route: "/pricing-settings/time-of-year/{id}", method: "delete"},
            GetLevels: {route: "/pricing-settings/levels", method: "get"},
            SetLevels: {route: "/pricing-settings/levels", method: "put"},
            Calculation: {route: "/pricing-settings/calculation", method: "get"},
            GetServiceRequestsPricingLevels: {
                route: "/pricing-settings/service-requests/pricing-levels",
                method: "get"
            },
            ChangeServiceRequestPricingLevels: {
                route: "/pricing-settings/service-requests/pricing-levels/{id}",
                method: "put"
            },
            GetServiceRequestsPricingSettings: {route: "/pricing-settings/service-requests", method: "get"},
            UpdateServiceRequestPricingSettings: {route: "/pricing-settings/service-requests/{id}", method: "put"},
            DeleteServiceRequestPricingSettings: {route: "/pricing-settings/service-requests/{id}", method: "delete"},
            AddServiceRequests: {route: "/pricing-settings/service-requests", method: "post"},
            GetPackagePricingLevels: {
                route: "/pricing-settings/maintenance-package-options/pricing-levels",
                method: "get"
            },
            ChangePackagePricingLevels: {
                route: "/pricing-settings/maintenance-package-options/pricing-levels/{id}",
                method: "put"
            },
            ChangePackagePricingSettings: {route: "/pricing-settings/maintenance-package-options/{id}", method: "put"},
            GetPackagePricingSettings: {route: "/pricing-settings/maintenance-package-options", method: "get"},
            AddPackagePricingSettings: {route: "/pricing-settings/maintenance-package-options", method: "post"},
            RemovePackagePricingSettings: {
                route: "/pricing-settings/maintenance-package-options/{id}",
                method: "delete"
            },
            UpdateMaxPrice: {route: "/price/max-price/{id}", method: "put"},
        },
        Recalls: {
            GetAll: {route: "/recall/by-query", method: "post"},
            GetById: {route: "/recall/{id}", method: "get"},
            GetByVin: {route: "/recall/by-vin", method: "post"},
            Create: {route: "/recall", method: "post"},
            Update: {route: "/recall/{id}", method: "put"},
            Remove: {route: "/recall/{id}", method: "delete"},
            UpdateRecallParts: {route: "/recall", method: "put"},
        },
        ServiceCategories: {
            Create: {route: "/service-categories", method: "post"},
            UpdateIcon: {route: "/service-categories/{id}/icon", method: "patch"},
            Update: {route: "/service-categories/{id}", method: "put"},
            Remove: {route: "/service-categories/{id}", method: "delete"},
            Retrieve: {route: "/service-categories/{id}", method: "get"},
            GetByQuery: {route: "/service-categories/by-query", method: "post"},
            GetByPage: {route: "/service-categories/by-page", method: "post"},
            GetShortByQuery: {route: "/service-categories/short-by-query", method: "post"},
        },
        ServiceCenters: {
            Create: {route: "/service-centers", method: "post"},
            GetShort: {route: "/service-centers", method: "get"},
            Update: {route: "/service-centers/{id}", method: "put"},
            Remove: {route: "/service-centers/{id}", method: "delete"},
            Retrieve: {route: "/service-centers/{id}", method: "get"},
            UpdateAddress: {route: "/service-centers/{id}/address", method: "put"},
            GetAll: {route: "/service-centers/by-query", method: "post"},
            Avatar: {route: "/service-centers/{id}/avatar", method: "patch"},
            ChangePricingOpt: {route: "/service-centers/{id}/pricing-optimization", method: "patch"},
            GetSelection: {route: "/service-centers/selection", method: "get"},
            GetHOO: {route: "/service-centers/{id}/hours-of-operations", method: "get"},
            SetHOO: {route: "/service-centers/{id}/hours-of-operations", method: "put"},
            GetWS: {route: "/service-centers/{id}/weekly-schedules", method: "get"},
            SetWS: {route: "/service-centers/{id}/weekly-schedules", method: "put"},
            GetBreaks: {route: "/service-centers/{id}/breaks", method: "get"},
            SetBreaks: {route: "/service-centers/{id}/breaks", method: "put"},
            WorkingDays: {route: "/service-centers/{id}/working-days", method: "get"},
            GetRoundPrice: {route: "/service-centers/{id}/round-price", method: "get"},
            ChangeRoundPrice: {route: "/service-centers/{id}/round-price", method: "patch"},
            GetMaxPriceDateRange: {route: "/service-centers/{id}/max-price-date-range", method: "get"},
            UpdateMaxPriceDateRange: {route: "/service-centers/{id}/max-price-date-range", method: "patch"},
            GetReminders: {route: "/service-centers/{id}/send-reminders", method: "get"},
            UpdateReminders: {route: "/service-centers/{id}/send-reminders", method: "patch"},
            UpdateAuth: {route: "/service-centers/{id}/auth", method: "patch"},
            UpdateAdvisor: {route: "/service-centers/{id}/update-appointments-advisor", method: "patch"},
            UpdatePredictionParams: {route: "/service-center-settings/{id}/prediction-parameters", method: "put"},
            GetPredictionParams: {route: "/service-center-settings/{id}/prediction-parameters", method: "get"},
            GetLaborRate: {route: "/service-center-settings/{id}/labor-rates", method: "get"},
            UpdateLaborRate: {route: "/service-center-settings/{id}/labor-rates", method: "put"},
            UpdatePackageDisclaimer: {route: "/service-centers/{id}/set-package-disclaimer", method: "patch"},
            GetAncillaryPriceType: {route: "/service-center-settings/{id}/ancillary-price-type", method: "post"},
            UpdateAncillaryPriceType: {route: "/service-center-settings/{id}/ancillary-price-type", method: "put"},
            UpdatePackagePriceDetails: {
                route: "/service-centers/{id}/maintenance-package-price-details",
                method: "patch"
            },
            UpdateDefaultOpsCode: {route: "/service-center-settings/{id}/default-recall", method: "put"},
            UpdateDefaultMake: {route: "/service-center-settings/{id}/default-vehicle-make", method: "patch"},
            UpdatePresentedPackageOptions: {
                route: "/service-centers/{id}/maintenance-package-option-types",
                method: "put"
            },
            UpdateEngineTypeFieldName: {route: "/service-centers/{id}/engine-type-field-name", method: "patch"},
            GetAssignedAdvisorMethod: {route: "/service-center-settings/{id}/advisor-assignment", method: "get"},
            UpdateAssignedAdvisorMethod: {route: "/service-center-settings/{id}/advisor-assignment", method: "put"},
            SetEmailRequired: {route: "/service-center-settings/{id}/email-required", method: "patch"}
        },
        ServiceConsultants: {
            Create: {route: "/service-consultants", method: "post"},
            Update: {route: "/service-consultants/{id}", method: "put"},
            Remove: {route: "/service-consultants/{id}", method: "delete"},
            Retrieve: {route: "/service-consultants/{id}", method: "get"},
            GetByQuery: {route: "/service-consultants/by-query", method: "post"},
            GetDmsAdvisors: {route: "/service-consultants/{id}/dms-service-advisors", method: "get"},
            GetByRole: {route: "/service-consultants", method: "get"},
        },
        ServiceRequests: {
            Create: {route: "/service-requests", method: "post"},
            Remove: {route: "/service-requests/{id}", method: "delete"},
            Update: {route: "/service-requests/{id}", method: "put"},
            Retrieve: {route: "/service-requests/{id}", method: "get"},
            GetFiltered: {route: "/service-requests/by-query", method: "post"},
            UpdateStatus: {route: "/service-requests/{id}/status", method: "patch"},
            CreateOverrides: {route: "/service-requests/{id}/overrides", method: "post"},
            EditOverrides: {route: "/service-requests/overrides/{id}", method: "put"},
            GetSROverrides: {route: "/service-requests/overrides/{id}", method: "get"},
            GetAssignedOverrides: {route: "/service-requests/overrides", method: "get"},
            RemoveOverride: {route: "/service-requests/overrides/{id}", method: "delete"},
            AssignMultiple: {route: "/service-requests/overrides", method: "post"},
            GetShort: {route: "/service-requests/overrides/short-by-query", method: "get"},
            EditSkills: {route: "/service-requests/required-skills", method: "patch"},
            Eligibility: {route: "/service-requests/eligibility", method: "patch"},
            Prioritize: {route: "/service-requests/prioritize", method: "patch"},
            ChangePricingDisplayType: {route: "/service-requests/overrides/{id}/pricing-display-type", method: "patch"},
        },
        ServiceTypes: {
            Create: {route: "/service-type-options", method: "post"},
            UpdateIcon: {route: "/service-type-options/icon", method: "patch"},
            Update: {route: "/service-type-options/{id}", method: "put"},
            Remove: {route: "/service-type-options", method: "delete"},
            GetByQuery: {route: "/service-type-options/by-query", method: "post"},
        },
        SlotScoring: {
            SetProximity: {route: "/slot-scoring/proximity", method: "put"},
            GetProximity: {route: "/slot-scoring/proximity", method: "get"},
            SetDesirability: {route: "/slot-scoring/desirability", method: "put"},
            GetDesirability: {route: "/slot-scoring/desirability", method: "get"},
            SetOptimization: {route: "/slot-scoring/optimization-settings", method: "put"},
            GetOptimization: {route: "/slot-scoring/optimization-settings", method: "get"},
            SetValues: {route: "/slot-scoring/optimization-settings/values", method: "put"},
            GetRange: {route: "/slot-scoring/range", method: "get"},
            UpdateRange: {route: "/slot-scoring/range", method: "put"},
            GetSlotsGap: {route: "/slot-scoring/gap", method: "get"}
        },
        ServiceValet: {
            GetZoneRouting: {route: "/service-valet/{id}/zone-routing", method: "get"},
            UpdateZoneRouting: {route: "/service-valet/{id}/zone-routing", method: "put"},
            GatAllCapacity: {route: "/service-valet/{id}/capacity/get-all", method: "get"},
            GetCapacityById: {route: "/service-valet/capacity/{id}", method: "get"},
            CreateCapacity: {route: "/service-valet/capacity", method: "post"},
            UpdateCapacity: {route: "/service-valet/{id}/capacity", method: "put"},
            ChangeShowDropOffTime: {route: "service-valet/{id}/show-drop-off-time", method: "put"},
            ChangeServiceRequest: {route: "service-valet/{id}/service-request", method: "put"},
            ChangeDmsTimeStamp: {route: "service-valet/{id}/dms-time", method: "put"},
            GetServiceValetSettings: {route: "service-valet/{id}/settings", method: "get"},
            UpdateZonesServiceRequests: {route: "service-valet/{id}/zone-service-requests", method: "put"},
        },
        TransportationOptions: {
            Edit: {route: "/transportation-options", method: "put"},
            Get: {route: "/transportation-options", method: "get"},
            GetShort: {route: "/transportation-options/short-by-query", method: "get"},
            GetActive: {route: "/transportation-options/active/by-query", method: "post"},
            Rules: {route: "/transportation-options/{id}/rules", method: "put"},
            UpdateById: {route: "/transportation-options/{id}", method: "put"},
            UpdateIcon: {route: "/transportation-options/{id}/icon", method: "patch"}
        },
        Users: {
            GetAll: {route: "/users/by-query", method: "post"},
            Create: {route: "/users", method: "post"},
            Remove: {route: "/users/{id}", method: "delete"},
            Retrieve: {route: "/users/{id}", method: "get"},
            Update: {route: "/users/{id}", method: "put"},
            Avatar: {route: "/users/{id}/avatar", method: "patch"},
            GetShort: {route: "/users/short-by-query", method: "post"}
        },
        Holidays: {
            GetAll: {route: "/holidays/by-query", method: "post"},
            Retrieve: {route: "/holidays/{id}", method: "get"},
            Remove: {route: "/holidays/{id}", method: "delete"},
            Update: {route: "/holidays/{id}", method: "put"},
            Create: {route: "/holidays", method: "post"},
        },
        ValueSettings: {
            GetValue: {route: "/value-settings", method: "get"},
            SetValue: {route: "/value-settings", method: "put"},
            GetCL: {route: "/customer-lifetimes", method: "get"},
            SetCL: {route: "/customer-lifetimes", method: "put"},
            GetCTS: {route: "/customer-type-settings", method: "get"},
            SetCTS: {route: "/customer-type-settings", method: "put"},
            GetWS: {route: "/warranty-settings", method: "get"},
            SetWS: {route: "/warranty-settings", method: "put"},
        },
        Vehicles: {
            GetByVIN: {route: "/vehicles/by-vin", method: "get"},
            GetByQuery: {route: "/vehicles/by-query", method: "post"},
            Models: {route: "/vehicles/models", method: "get"},
            Makes: {route: "/vehicles/makes", method: "get"},
            RemoveMake: {route: "/vehicles/makes/{id}", method: "delete"},
            UpdateMake: {route: "/vehicles/makes/{id}", method: "put"},
            CreateMake: {route: "/vehicles/makes", method: "post"},
            GetMileage: {route: "/vehicles/mileage", method: "get"},
            RemoveMileage: {route: "/vehicles/mileage/{id}", method: "delete"},
            CreateMileage: {route: "/vehicles/mileage", method: "post"},
            MakesModels: {route: "/vehicles/makes-models", method: "get"},
            GetEngineType: {route: "/vehicles/engine-type/by-query", method: "get"},
            RemoveEngineType: {route: "/vehicles/engine-type/{id}", method: "delete"},
            CreateEngineType: {route: "/vehicles/engine-type", method: "post"},
        },
        ValueService: {
            GetSeriesModels: {route: "/value-service-offers/vehicle-models", method: "get"},
            GetValueServiceOffers: {route: "/value-service-offers", method: "get"},
        },
        WaitListSettings: {
            Get: {route: "/waitlist-settings", method: "get"},
            Update: {route: "/waitlist-settings", method: "put"},
            Toggle: {route: "/waitlist-settings/toggle", method: "put"},
        },
        ZipCodes: {
            GetFiltered: {route: "/zip-codes/by-query/", method: "post"}
        }

    };

    static async call<RValue = any>(r: TApiEndpoint, options?: TOptions) {
        const path = pathReplace(r.route, options?.urlParams);
        if (r.method === "post" || r.method === "put" || r.method === "patch") {
            return request[r.method]<RValue, AxiosResponse<RValue>>(path, options?.data);
        } else {
            return request[r.method]<RValue, AxiosResponse<RValue>>(path, {params: options?.params});
        }
    }
}