import React from 'react';
import {ScrollableContainer, StepContainer, StepContentContainer, TextField} from "../UI";
import {FormLabel, Grid, styled} from "@material-ui/core";

const LabelGrid = styled(Grid)({
    textAlign: "right"
});

const Subtitle = styled("h5")({
    margin: 0
});

type TFormItem = {
    id: string;
    label: string;
    type?: "email";
}
const formItems: TFormItem[] = [
    {id: "fullName", label: "Full Name"}
]

export const AppointmentConfirmationS6 = () => {
    return <StepContainer>
        <StepContentContainer>
            <h4 style={{textAlign: "center"}}>Appointment Confirmation</h4>
            <ScrollableContainer>
                <Grid container spacing={2}>
                    <Grid item xs={3} />
                    <Grid item xs={9}>
                        <Subtitle>Driver Info</Subtitle>
                    </Grid>
                    {
                        formItems.map(fI =>
                            <React.Fragment key={fI.id}>
                                <LabelGrid item xs={3}>
                                    <FormLabel htmlFor={fI.id}>
                                        {fI.label}
                                    </FormLabel>
                                </LabelGrid>
                                <Grid item xs={9}>
                                    <TextField
                                        type={fI.type}
                                        id={fI.id}
                                        name={fI.id}
                                    />
                                </Grid>
                            </React.Fragment>
                        )
                    }
                </Grid>
            </ScrollableContainer>
        </StepContentContainer>
    </StepContainer>;
};