import React, { useMemo } from 'react';
import {Actions} from "./Actions";
import {StepWrapper} from "./StepWrapper";
import {TextField} from "../UI";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import { setFrameDescription } from '../../../store/reducers/appointmentFrameReducer/actions';
import {TArgCallback, TCallback} from "../../../types/types";
import {checkSelectedCar} from "./utils";
import {TScreen} from "../../../components/Layout/types";
import {useConfirm} from "../../../utils/hooks";

type TProps = {
    onFillCar: TCallback;
    onBack: TArgCallback<TScreen>;
    onNext: () => void;
    nextDisabled?: boolean;
    nextLabel?: string;
    loading?: boolean;
    onAddServices: () => void;
};
export const AddInfo: React.FC<TProps> = ({onNext, onBack, onFillCar, onAddServices}) => {
    const [service, subService, vehicle, vehicles, selectedPackage, selectedSR] = useSelector(({appointmentFrame, appointment}: RootState) => [
        appointmentFrame.service,
        appointmentFrame.subService,
        appointmentFrame.selectedVehicle,
        appointment.customerLoadedData?.vehicles,
        appointmentFrame.selectedPackage,
        appointment.selectedSR,
    ]);
    const {description} = useSelector(({appointmentFrame}: RootState) => appointmentFrame);
    const dispatch = useDispatch();
    const {askConfirm} = useConfirm();
    const screenToReturn = useMemo(() => subService ? 'serviceSelection' : 'serviceNeeds', [subService])

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = ({target: {value}}) => {
        dispatch(setFrameDescription(value))
    }

    const handleNext = () => {
        if (!checkSelectedCar(vehicle, vehicles)) {
            onFillCar();
        } else {
            onNext();
        }
    }

    const onSubmit = () => {
        if (!selectedPackage || !selectedSR.length) {
            askConfirm({
                title: "Would you like additional services?",
                confirmContent: "Yes",
                cancelContent: "No",
                onConfirm: onAddServices,
                onCancel: handleNext,
            })
        }
    }

    return (
        <StepWrapper>
            <TextField
                fullWidth
                multiline
                onChange={handleChange}
                value={description}
                rows={4}
                placeholder={
                    subService?.name ?? service?.name ?? "Type Here"
                }
            />
            <Actions onBack={() => onBack(screenToReturn)} onNext={onSubmit} />
        </StepWrapper>
    );
};