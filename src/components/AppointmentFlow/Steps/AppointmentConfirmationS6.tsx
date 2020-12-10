import React, {useMemo} from 'react';
import {NextPrevBlock, ScrollableContainer, StepContainer, StepContentContainer, TextField, TStepProps} from "../UI";
import {Checkbox, FormControlLabel, FormGroup, FormLabel, Grid, styled} from "@material-ui/core";
import {EditButton} from "../../UI/Button";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {changeComment, changePersonalInformation} from "../../../store/reducers/appointment/actions";
import moment from "moment";
import {useHistory, useParams} from "react-router-dom";
import {Routes} from "../../../config/routes";

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
const TextButton = styled("span")(({theme}) => ({
    textDecoration: "underline",
    padding: 0,
    color: theme.palette.primary.main,
    cursor: "pointer",
    display: "inline-block",
    fontWeight: "bold",
    marginRight: theme.spacing(1),
    userSelect: "none",
    transition: theme.transitions.create(["text-decoration", "color"]),
    "&:hover": {
        textDecoration: "none",
        color: theme.palette.primary.dark
    }
}));

const FlexGroup = styled(FormGroup)({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    "& label": {
        marginRight: 0
    }
})

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
const reminderItems: TFormItem[] = [
    {id: "email", label: "E-mail"},
    {id: "phone", label: "Phone"},
    {id: "sms", label: "SMS"},
]

export const AppointmentConfirmationS6: React.FC<TStepProps> = ({prev}) => {
    const carDetails = useSelector((state: RootState) => state.appointment.s1Data);
    const [
        srList,
        selectedSR,
        appointment
    ] = useSelector((state: RootState) => [
        state.appointment.serviceRequests,
        state.appointment.selectedSR,
        state.appointment.appointment
    ]);

    const dispatch = useDispatch();
    const history = useHistory();
    const {id} = useParams();

    const srDescription = useMemo((): string => {
        const sData = srList.find(s => s.id === selectedSR);
        return sData?.description || "-";
    }, [srList, selectedSR]);

    const handleTextChange = ({target: {name, value}}: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(changePersonalInformation({[name]: value}));
    }

    const handleCommentChange = ({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(changeComment(value));
    }
    const handleConfirm = () => {
        history.push(`${Routes.EndUser.ConfirmationBase}/${id}`);
    }

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
                                        onChange={handleTextChange}
                                    />
                                </Grid>
                            </React.Fragment>
                        )
                    }
                    <LabelGrid item xs={3} />
                    <Grid item xs={9}>
                        <Section>
                            <Grid container spacing={2}>
                                <Grid item md={6}>
                                    <Subtitle>Review</Subtitle>
                                    <p>{`${carDetails.make} ${carDetails.model}`.trim() || "-"}</p>
                                    <p>{srDescription}</p>
                                    <EditButton color="primary">View Details</EditButton>
                                </Grid>
                                {appointment ? <Grid style={{textAlign: "right"}} item md={6}>
                                    <Subtitle>Selected Price</Subtitle>
                                    <p>${appointment.price.toFixed(2)}</p>
                                </Grid> : null}
                            </Grid>
                        </Section>

                        <Section>
                            <Subtitle>Add Comment</Subtitle>
                            <Textarea
                                multiline
                                placeholder="Type here"
                                onChange={handleCommentChange}
                                rows={2}
                            />
                            <FlexGroup>
                                <FormControlLabel
                                    label="Privacy & Policy"
                                    control={<Checkbox color="primary" />}
                                />
                                <div className="grow" />
                                <FormControlLabel
                                    label="Want us to call you?"
                                    control={<Checkbox color="primary" />}
                                />
                            </FlexGroup>
                        </Section>

                        <Section>
                            <Subtitle>Remainders</Subtitle>
                            <FlexGroup>
                                {reminderItems.map((item, idx) =>
                                    <React.Fragment key={item.id}>
                                        {idx ? <div className="grow" /> : null}
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    color="primary"
                                                />
                                            }
                                            label={item.label}
                                        />
                                    </React.Fragment>
                                )}
                            </FlexGroup>
                        </Section>

                        <Section>
                            <Message>
                                <TextButton>
                                    Create Account
                                </TextButton>
                                <span>to save time on my next visit!</span>
                            </Message>
                        </Section>
                    </Grid>
                </Grid>
            </ScrollableContainer>
        </StepContentContainer>
        <NextPrevBlock
            next={handleConfirm}
            prev={prev}
            nextLabel={
                appointment?.date ?
                    `Schedule ${moment(appointment.date).format("ddd, MMM D, h:mm a")}`
                    : "-"
            }
        />
    </StepContainer>;
};