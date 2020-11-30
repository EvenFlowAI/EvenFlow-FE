import React from 'react';
import {ScrollableContainer, StepContainer, StepContentContainer, TextField} from "../UI";
import {Button, FormLabel, Grid, styled} from "@material-ui/core";
import {EditButton} from "../../UI/Button";

const Section = styled("div")({
    padding: "16px 0"
});

const LabelGrid = styled(Grid)({
    display: "flex",
    justifyContent: "flex-end",
    flexDirection: "row",
    alignItems: "center",
});

const Subtitle = styled("h5")({
    margin: 0,
    fontSize: 16,
    textTransform: "uppercase"
});

const Label = styled(FormLabel)({
    fontWeight: "bold",
    textTransform: "uppercase"
});
const Message = styled("div")({
    textTransform: "uppercase",
    fontSize: 16
});
const TextButton = styled(Button)({
    textDecoration: "underline",
    padding: 0
});

const Textarea = styled(TextField)({
    "& textarea": {
        padding: "8px 11px"
    }
});


type TFormItem = {
    id: string;
    label: string;
    type?: "email";
}
const formItems: TFormItem[] = [
    {id: "fullName", label: "Full Name"},
    {id: "phoneNumber", label: "Phone Number"},
    {id: "email", label: "E-mail"},
];

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
                                    <Label htmlFor={fI.id}>
                                        {fI.label}
                                    </Label>
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
                    <LabelGrid item xs={3} />
                    <Grid item xs={9}>
                        <Section>
                            <Subtitle>Review</Subtitle>
                            <p>Honda CR-V</p>
                            <p>Engine and Oil change</p>
                            <EditButton color="primary">View Details</EditButton>
                        </Section>

                        <Section>
                            <Subtitle>Add Comment</Subtitle>
                            <Textarea
                                multiline
                                placeholder="Type here"
                                rows={2}
                            />
                        </Section>

                        <Section>
                            <Subtitle>Remainders</Subtitle>
                        </Section>

                        <Section>
                            <Message>
                                <TextButton color="primary">
                                    Create Account
                                </TextButton>
                                <span>to save time on my next visit!</span>
                            </Message>
                        </Section>
                    </Grid>
                </Grid>
            </ScrollableContainer>
        </StepContentContainer>
    </StepContainer>;
};