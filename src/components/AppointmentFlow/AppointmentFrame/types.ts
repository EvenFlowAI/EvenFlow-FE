export type TActionProps = {
    onBack: () => void;
    onNext: () => void;
    nextDisabled?: boolean;
    nextLabel?: string;
    loading?: boolean;
    onAddServices?: () => void;
};

export type EMaintenanceItemType = 'category' | 'package' | 'service'

export type IMaintenanceItem = {
    id: number;
    name: string;
    type: EMaintenanceItemType;
}