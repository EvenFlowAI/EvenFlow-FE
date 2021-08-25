import React from 'react';
import {TActionProps} from "./types";
import {StepWrapper} from "./StepWrapper";
import {Actions} from "./Actions";
import {UserData} from "./confirmationSections/UserData";
import {styled} from "@material-ui/core";
import {SelectedDate} from "./confirmationSections/SelectedDate";
import {Review} from "./confirmationSections/Review";
import {SelectedPrice} from "./confirmationSections/SelectedPrice";
import {Reminders} from "./confirmationSections/Reminders";
import {TCallback} from "../../../types/types";

const Wrapper = styled('div')({
    width: "100%",
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
    "&>div": {
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        justifyContent: "flex-start",
        alignItems: "stretch"
    }
});

const Info = styled('div')({
    fontSize: 12
});

type TProps = {
    onChangeSlot: TCallback;
} & TActionProps;
export const AppointmentConfirmationFrame: React.FC<TProps> = ({onBack, onChangeSlot, onNext}) => {
    return <StepWrapper>
        <Wrapper>
            <div>
                <UserData />
                <SelectedDate onChangeSlot={onChangeSlot} />
            </div>
            <div>
                <Review />
                <SelectedPrice />
                <Reminders />
                <Info>By using this service you accept the terms of our Visitor Agreement.</Info>
            </div>

        </Wrapper>
        <Actions onBack={onBack} onNext={onNext} />
    </StepWrapper>
};