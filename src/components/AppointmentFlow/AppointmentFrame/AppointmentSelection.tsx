import React, {useState} from 'react';
import {TActionProps} from "./types";
import { StepWrapper } from './StepWrapper';
import { Actions } from './Actions';
import {SelectedAppointment} from "./SelectedAppointment";
import {AppointmentDateSelector} from "./AppointmentDateSelector";
import {AppointmentTimeSelector} from "./AppointmentTimeSelector";
import {styled} from "@material-ui/core";
import moment from "moment";


const Wrapper = styled('div')({
    display: "flex",
    flexDirection: "column",
    width: "100%",
    alignItems: "stretch",
    justifyContent: "flex-start",
    gap: "20px",
    "&>div": {
        border: "1px solid #DADADA",
        padding: "18px 44px",
        "&>h4": {
            fontSize: 16,
            margin: "0 0 16px",
            padding: 0,
            fontWeight: "bold",
            textTransform: "uppercase"
        }
    }
})

export const AppointmentSelection: React.FC<TActionProps> = ({onBack, onNext}) => {
    const [date, setDate] = useState<moment.Moment>(moment().utc());
    const handleChangeMonth = (m: moment.Moment) => {
        setDate(m);
    }
    return (
        <StepWrapper>
            <Wrapper>
                <SelectedAppointment />
                <AppointmentDateSelector date={date} onDateChange={handleChangeMonth} />
                <AppointmentTimeSelector date={date} slot={null} />
            </Wrapper>
            <Actions onBack={onBack} onNext={onNext} />
        </StepWrapper>
    );
};