export type TActionProps = {
    onBack: () => void;
    onNext: () => void;
    nextDisabled?: boolean;
    nextLabel?: string;
};