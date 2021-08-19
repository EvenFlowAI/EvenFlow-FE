import React from 'react';
import {TActionProps} from "./types";
import {Actions} from "./Actions";
import {StepWrapper} from "./StepWrapper";
import {TextField} from "../UI";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import { setFrameDescription } from '../../../store/reducers/appointmentFrameReducer/actions';

export const AddInfo: React.FC<TActionProps> = ({onNext, onBack}) => {
    const [service, subService] = useSelector(({appointmentFrame}: RootState) => [
        appointmentFrame.service,
        appointmentFrame.subService
    ]);
    const description = useSelector(({appointmentFrame}: RootState) => appointmentFrame.description);
    const dispatch = useDispatch();

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = ({target: {value}}) => {
        dispatch(setFrameDescription(value))
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
                    subService?.label ?? service?.label ?? "Type Here"
                }
            />
            <Actions onBack={onBack} onNext={onNext} nextDisabled={!description} />
        </StepWrapper>
    );
};