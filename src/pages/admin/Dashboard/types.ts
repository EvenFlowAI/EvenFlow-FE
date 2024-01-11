export type TItem = {
    label: string;
    icon: JSX.Element;
    action: () => void;
}
export type TCountData = {
    technicians: number;
    bays: number;
    pods: number;
    appointments: number;
}
export type TDataMap = {
    label: string;
    value: keyof TCountData;
}