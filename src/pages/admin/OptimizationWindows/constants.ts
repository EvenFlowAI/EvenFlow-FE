import {
    EOptimizationWindowType,
    IOptimizationWindow,
    TOptContent
} from "../../../store/reducers/optimizationWindows/types";

export const optContent: TOptContent = {
    [EOptimizationWindowType.FirstAvailable]: {
        helperText: "Set the optimization window for available time slots when first available date search is entered",
        label: "Days",
        title: "First Available Search",
    },
    [EOptimizationWindowType.SpecificDate]: {
        prefix: "+/- ",
        helperText: "Set the optimization window for available time slots when a specific date search is entered",
        label: "Days",
        title: "Specific Date Search",
    },
    [EOptimizationWindowType.DemandSegments]: {
        helperText: "Set the number of demand segments to group service requests of equal value",
        label: "Segments",
        title: "Demand Segments",
    },
    [EOptimizationWindowType.OverbookingFactor]: {
        helperText: "Set the percent of appointments the center is willing to overbook beyond capacity.",
        suffix: "%",
        label: "percent per day",
        title: "Overbooking factor",
    },
    [EOptimizationWindowType.AppointmentsPerSlot]: {
        helperText: "Set the number of max scheduled appointments per appointment time slot",
        label: "Appointments",
        title: "Appointments per Slot",
    },
    [EOptimizationWindowType.AppointmentCutoff]: {
        helperText: "Set the hour that the last appointment will be accepted",
        label: "pm",
        title: "Appointment Cutoff"
    },
}

export const blankWindowParam: IOptimizationWindow = {
    serviceCenterId: 0,
    type: EOptimizationWindowType.OverbookingFactor,
    value: 0
}