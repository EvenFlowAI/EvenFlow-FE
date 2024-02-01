import {TCountData, TDataMap} from "./types";

export const overallData: TDataMap[] = [
    {label: "Technicians", value: "technicians"},
    {label: "Bays", value: "bays"},
    {label: "Pods", value: "pods"},
    {label: "Appointments Today", value: "appointments"},
];

export const blankCountData: TCountData = {
    technicians: 0,
    bays: 0,
    appointments: 0,
    pods: 0
}