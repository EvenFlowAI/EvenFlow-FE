export type TApiEndpoint = {
    route: string;
    method:
        | "get"
        | "delete"
        | "options"
        | "post"
        | "put"
        | "patch";
}

export interface IApiEndpoints {
    Accounts: Record<"Recovery" | "Reset" | "Change" | "Verification" | "Profile" | "Dealership", TApiEndpoint>,
    AncillaryPricing: Record<"GetZones" | "UpdateZone" | "GetDistances" | "UpdateDistance" | "CreateDistance" | "DeleteDistance" | "GetByZip", TApiEndpoint>,
    Appointments: Record<"Create" | "Update" | "UpdateByKey" | "Cancel" | "CancelByKey" | "GetByKey" | "CheckPodChanged"
        | "GetServiceBooks" | "GetSchedulers", TApiEndpoint>,
    AppointmentAllocation: Record<"SetTimeWindows" | "GetTimeWindows"
        | "CreateDemandSegment" | "GetDemandSegments"
        | "GetTWEligibility" | "SetTWEligibility"
        | "BatchUpdateDemandSegments" | "RemoveDemandSegment"
        | "SetUnplanned" | "GetUnplanned" | "GetUnplannedSlotsByDay"
        | "UpdateUnplannedSlots", TApiEndpoint>,
    AppointmentPricing: Record<"GetPriceList", TApiEndpoint>,
    AppointmentSlots: Record<"GetSlots" | "GetServiceValetSlots", TApiEndpoint>,
    Authentications: Record<"Request" | "Refresh", TApiEndpoint>,
    Bays: Record<"Create" | "Update" | "Remove" | "Retrieve" | "GetAll" | "GetShort", TApiEndpoint>,
    BookingFlowConfig: Record<"Get" | "Update", TApiEndpoint>,
    BookingFlowScreenSettings: Record<"GetEmailRequirement" | "UpdateEmailRequirement", TApiEndpoint>,
    CapacityManagement: Record<"Reallocate", TApiEndpoint>,
    ComplimentaryServices: Record<"GetByQuery" | "Remove" | "Update" | "AddFromList" | "Create", TApiEndpoint>,
    Customers: Record<"GetByName" | "Update" | "GetRepairHistory" | "GetBySearchTerm" | "GetSingleCustomerVehicles", TApiEndpoint>,
    Dealerships: Record<"Create" | "GetShort" | "Retrieve" | "Remove" | "Update" | "GetAll"
        | "UpdateAddress" | "UploadAvatar", TApiEndpoint>,
    Employees: Record<"Create" | "Update" | "GetAll", TApiEndpoint>,
    EmployeeSchedule: Record<"Create" | "Update" | "GetAll" | "Retrieve" | "Remove" | "SetForWeek", TApiEndpoint>,
    GeographicZones: Record<"Create" | "Update" | "GetZones" | "ReassignZipCode"
        | "RemoveZipCode" | "Remove" | "GetById", TApiEndpoint>,
    Holidays: Record<"Create" | "Update" | "Remove" | "Retrieve" | "GetAll", TApiEndpoint>,
    IntervalUpsell: Record<"GetUpsellByQuery" | "EditUpsell" | "RemoveUpsell" | "AddUpsell" | "GetUpsellById", TApiEndpoint>,
    MaintenancePackages: Record<"Create" | "Update" | "Remove" | "Retrieve" | "SetPricingOptimization"
        | "GetByQuery" | "PackageOptions" | "ByVehicle" | "GetShortByQuery" | "GetOptionsByQuery" | "ChangePricingDisplayType"
        | "UpdateSRDescription" | "UpdateComplimentaryDescription" | "UpdateSROrder" | "UpdateComplimentaryOrder"
        | "SetShowSuggestedPrice" | "SetManualOverride" | "UpdatePriceTitles" | "UpdateUpsellOrder" | "UpdateSegmentTitles", TApiEndpoint>,
    Notifications: Record<"GetAll" | "UpdateForPod" | "UpdateByType" | "UpdateForTransportation", TApiEndpoint>,
    OptimizationWindows: Record<"GetParams" | "SetParams" | "GetOverbooking" | "SetOverbooking"
        | "GetAppointmentCutoff" | "SetAppointmentCutoff", TApiEndpoint>,
    Offers: Record<"Create" | "GetAll" | "Retrieve" | "Edit" | "ChangeStatus" | "Remove", TApiEndpoint>,
    Pods: Record<"Create" | "Update" | "Retrieve" | "GetAll" | "Remove" | "GetShort" | "GetMakes", TApiEndpoint>,
    PricingSettings: Record<"GetList" | "Edit" | "GetDayOfWeek" | "SetDayOfWeek"
        | "CreateTimeOfYear" | "GetTimeOfYear" | "UpdateTimeOfYear" | "RemoveTimeOfYear"
        | "GetLevels" | "SetLevels" | "Calculation" | "GetServiceRequestsPricingLevels"
        | "ChangeServiceRequestPricingLevels" | "GetServiceRequestsPricingSettings" | "UpdateServiceRequestPricingSettings"
        | "DeleteServiceRequestPricingSettings" | "AddServiceRequests" | "GetPackagePricingSettings" | "ChangePackagePricingSettings"
        | "GetPackagePricingLevels" | "ChangePackagePricingLevels" | "AddPackagePricingSettings"
        | "RemovePackagePricingSettings" | "UpdateMaxPrice", TApiEndpoint>,
    Qrvey: Record<"GetToken", TApiEndpoint>,
    Recalls: Record<"GetAll" | "GetById" | "GetByVin" | "Create" | "Update" | "Remove", TApiEndpoint>,
    ServiceCategories: Record<"Create" | "UpdateIcon" | "Update" | "Remove" | "Retrieve"
        | "GetByQuery" | "GetByPage" | "GetShortByQuery", TApiEndpoint>,
    ServiceCenters: Record<"Create" | "GetShort" | "Update" | "Remove" | "Retrieve" | "UpdateAddress"
        | "GetAll" | "Avatar" | "GetSelection" | "GetHOO" | "SetHOO" | "GetWS" | "SetWS" | "WorkingDays"
        | "GetBreaks" | "SetBreaks" | "Analytics" | "ChangePricingOpt" | "GetRoundPrice" | "ChangeRoundPrice"
        | "GetMaxPriceDateRange" | "UpdateMaxPriceDateRange" | "GetReminders" | "UpdateReminders" | "UpdateAuth"
        | "UpdateAdvisor" | "UpdatePredictionParams" | "GetPredictionParams" | "GetLaborRate" | "UpdateLaborRate"
        | "UpdatePackageDisclaimer" | "GetAncillaryPriceType" | "UpdateAncillaryPriceType" | "UpdatePackagePriceDetails"
        | "UpdateDefaultOpsCode" | "UpdateDefaultMake" | "UpdatePresentedPackageOptions" | "UpdateEngineTypeFieldName"
        | "GetAssignedAdvisorMethod" | "UpdateAssignedAdvisorMethod" | "SetEmailRequired", TApiEndpoint>,
    ServiceConsultants: Record<"Create" | "Update" | "Remove" | "Retrieve"
        | "GetByQuery" | "GetDmsAdvisors", TApiEndpoint>,
    ServiceRequests: Record<"Create" | "Remove" | "Update" | "Retrieve" | "GetFiltered"
        | "UpdateStatus" | "CreateOverrides" | "EditOverrides" | "GetSROverrides"
        | "GetAssignedOverrides" | "AssignMultiple" | "RemoveOverride" | "GetShort"
        | "Eligibility" | "ChangePricingDisplayType"
        | "EditSkills" | "Prioritize", TApiEndpoint>,
    ServiceTypes: Record<"Create" | "UpdateIcon" | "Update" | "Remove" | "Retrieve"
        | "GetByQuery", TApiEndpoint>,
    SlotScoring: Record<"SetProximity" | "GetProximity" | "SetDesirability" | "GetDesirability"
        | "SetOptimization" | "GetOptimization" | "SetValues" | "GetRange" | "UpdateRange" | "GetSlotsGap", TApiEndpoint>,
    ServiceValet: Record<"GetZoneRouting" | "UpdateZoneRouting" | "GatAllCapacity" | "GetCapacityById" | "CreateCapacity" | "UpdateCapacity"
        | "ChangeShowDropOffTime" | "ChangeServiceRequest" | "ChangeDmsTimeStamp" | "GetServiceValetSettings", TApiEndpoint>,
    TransportationOptions: Record<"Edit" | "Get" | "GetActive" | "Rules" | "UpdateById", TApiEndpoint>,
    Users: Record<"GetAll" | "Create" | "Update" | "Remove" | "Retrieve" | "Avatar" | "GetShort", TApiEndpoint>,
    ValueSettings: Record<"GetValue" | "SetValue" | "GetCL" | "SetCL" | "GetCTS" | "SetCTS"
        | "GetWS" | "SetWS", TApiEndpoint>,
    Vehicles: Record<"GetByVIN" | "GetByQuery" | "Models" | "Makes" | "RemoveMake" | "UpdateMake" | "CreateMake"
        | "GetMileage" | "RemoveMileage" | "CreateMileage" | "MakesModels" | "GetEngineType" | "RemoveEngineType"
        | "CreateEngineType", TApiEndpoint>,
    ValueService: Record<"GetSeriesModels" | "GetValueServiceOffers", TApiEndpoint>,
    WaitListSettings: Record<"Get" | "Update" | "Toggle", TApiEndpoint>,
    ZipCodes: Record<"GetFiltered", TApiEndpoint>
}