import React from 'react';
import {TActionProps} from "./types";
import {Actions} from "./Actions";
import {StepWrapper} from "./StepWrapper";
import {TextField} from "../UI";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import { setFrameDescription } from '../../../store/reducers/appointmentFrameReducer/actions';
import {TCallback} from "../../../types/types";
import {VIN_LENGTH} from "../../../config/constants";


type TProps = {
    onFillCar: TCallback;
} & TActionProps;
export const AddInfo: React.FC<TProps> = ({onNext, onBack, onFillCar}) => {
    const [service, subService, vehicle] = useSelector(({appointmentFrame}: RootState) => [
        appointmentFrame.service,
        appointmentFrame.subService,
        appointmentFrame.selectedVehicle
    ]);
    const description = useSelector(({appointmentFrame}: RootState) => appointmentFrame.description);
    const dispatch = useDispatch();

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = ({target: {value}}) => {
        dispatch(setFrameDescription(value))
    }

    const handleNext = () => {
        if (!vehicle?.vin || vehicle.vin.length !== VIN_LENGTH) {
            onFillCar();
        } else {
            onNext();
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
            <Actions onBack={onBack} onNext={handleNext} />
        </StepWrapper>
    );
};