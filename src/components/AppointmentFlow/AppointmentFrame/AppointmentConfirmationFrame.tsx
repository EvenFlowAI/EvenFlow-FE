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


export const AppointmentConfirmationFrame: React.FC<TActionProps> = ({onBack, onNext}) => {
    return <StepWrapper>
        <Wrapper>
            <div>
                <UserData />
                <SelectedDate />
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