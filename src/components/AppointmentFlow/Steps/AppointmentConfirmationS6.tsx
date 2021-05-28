import React, {useMemo, useState} from 'react';
import {NextPrevBlock, ScrollableContainer, StepContainer, StepContentContainer, TextField, TStepProps} from "../UI";
import {
    Box,
    Checkbox,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Grid,
    styled,
    useMediaQuery,
    useTheme
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {
    changeComment,
    changePersonalInformation,
    setAppointmentId,
    changePrivacy, changeReminders, saveAppointmentReducer
} from "../../../store/reducers/appointment/actions";
import moment from "moment";
import {useHistory, useParams} from "react-router-dom";
import {Routes} from "../../../config/routes";
import {API} from "../../../api/api";
import {
    EReminderType,
    flatTransportations,
    IPersonalInformation,
    IPrivacy, IReminders
} from "../../../store/reducers/appointment/types";
import {useException} from "../../../utils/hooks";
import {ICreateAppointment, ICreateAppointmentResp} from "../../../api/types";
import {decodeSCID, validatePhoneNumber} from "../../../utils/utils";

const Section = styled("div")({
    padding: "16px 0"
});

const LabelGrid = styled(Grid)(({theme}) => ({
    display: "flex",
    justifyContent: "flex-end",
    flexDirection: "row",
    alignItems: "center",
    [theme.breakpoints.down("xs")]: {
        justifyContent: "flex-start"
    }
}));

const Subtitle = styled("h5")({
    margin: 0,
    fontSize: 16,
    textTransform: "uppercase"
});

const Label = styled(FormLabel)({
    fontWeight: "bold",
    textTransform: "uppercase"
});
// const Message = styled("div")({
//     textTransform: "uppercase",
//     fontSize: 16
// });
// const TextButton = styled("span")(({theme}) => ({
//     textDecoration: "underline",
//     padding: 0,
//     color: theme.palette.primary.main,
//     cursor: "pointer",
//     display: "inline-block",
//     fontWeight: "bold",
//     marginRight: theme.spacing(1),
//     userSelect: "none",
//     transition: theme.transitions.create(["text-decoration", "color"]),
//     "&:hover": {
//         textDecoration: "none",
//         color: theme.palette.primary.dark
//     }
// }));

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

export const AppointmentConfirmationS6: React.FC<TStepProps> = ({prev, isCompleted}) => {
    const [isLoading, setLoading] = useState(false);
    const carDetails = useSelector((state: RootState) => state.appointment.s1Data);
    const [
        srList,
        selectedSR,
        appointment,
        personalInformation,
        comment,
        privacy,
        reminders,
        appointmentId,
        forms
    ] = useSelector((state: RootState) => [
        state.appointment.serviceRequests,
        state.appointment.selectedSR,
        state.appointment.appointment,
        state.appointment.personalInformation,
        state.appointment.comment,
        state.appointment.privacy,
        state.appointment.reminders,
        state.appointment.appointmentId,
        state.appointment,
    ]);

    const dispatch = useDispatch();
    const history = useHistory();
    const {id} = useParams();
    const theme = useTheme()
    const isXS = useMediaQuery(theme.breakpoints.down("xs"));
    const showError = useException();

    const srDescription = useMemo((): string => {
        return selectedSR.map(sId => srList.find(s => sId === s.id)?.description || "-").join(", ");
    }, [srList, selectedSR]);

    const handleTextChange = ({target: {name, value}}: React.ChangeEvent<HTMLInputElement>) => {
        if (name === "phoneNumber") {
            value = validatePhoneNumber(value);
        }
        dispatch(changePersonalInformation({[name]: value}));
    }

    const handleCommentChange = ({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(changeComment(value));
    }
    const handlePrivacyCheck = (name: keyof IPrivacy) => (e: any, checked: boolean) => {
        dispatch(changePrivacy({[name]: checked}));
    }
    const handleCheckReminders = (name: keyof IReminders) => (e: any, checked: boolean) => {
        dispatch(changeReminders({[name]: checked}));
    }

    const handleConfirm = async () => {
        const {email, phone, sms} = forms.reminders;
        const reminderTypes: EReminderType[] = [
            email ? EReminderType.Email : undefined,
            phone ? EReminderType.Phone : undefined,
            sms ? EReminderType.Sms : undefined
        ].filter(v => v !== undefined) as EReminderType[];

        let formData: ICreateAppointment = {
            appointmentTimingType: forms.s3Data.appointmentType,
            customerId: forms.customerLoadedData?.id,
            comment: forms.comment,
            driver: forms.personalInformation,
            gmt: moment().utcOffset(),
            isNeedCall: forms.privacy.callback,
            offerId: forms?.appointment?.offer?.id ?? null,
            reminderTypes,
            serviceCenterId: decodeSCID(id),
            vehicle: {
                ...forms.s1Data,
                dmsId: forms.customerSelectedVehicle
                    ? forms.customerSelectedVehicle.dmsId
                    : (forms.customerLoadedData
                        && forms.customerLoadedData.vehicles.length === 1
                        && forms.s1Data.vin === forms.customerLoadedData.vehicles[0].vin)
                        ? forms.customerLoadedData.vehicles[0].dmsId
                        : null
            },
            transportationNeeds: {
                isNeed: Number(forms.transportation) > 2,
                description: flatTransportations.find(t => t.id === forms.transportation)?.label || ""
            },
            slot: forms.appointment?.id.split("|")[1] || "",
            serviceRequestIds: forms.selectedSR,
            date: forms.appointment?.id.split("|")[0] || ""
        };
        setLoading(true);
        try {
            let resp: ICreateAppointmentResp;
            if (appointmentId?.id) {
                const {data} = await API.appointment.updateByKey({...formData, id: appointmentId.id, hashKey: appointmentId.hashKey});
                resp = data;
            } else {
                const {data} = await API.appointment.create(formData);
                resp = data;
            }

            dispatch(setAppointmentId({...resp, updated: Boolean(appointmentId?.id)}));
            dispatch(saveAppointmentReducer());
            setLoading(false);
            history.push(`${Routes.EndUser.ConfirmationBase}/${id}`);
        } catch (e) {
            setLoading(false);
            showError(e);
        }
    }

    return <StepContainer>
        <StepContentContainer>
            <h4 style={{textAlign: "center"}}>Appointment Confirmation</h4>
            <ScrollableContainer>
                <Grid container spacing={2}>
                    {!isXS ? <Grid item xs={3}/> : null}
                    <Grid item xs={12} sm={9}>
                        <Subtitle>Driver Info</Subtitle>
                    </Grid>
                    {
                        formItems.map(fI =>
                            <React.Fragment key={fI.id}>
                                <LabelGrid item xs={12} sm={3}>
                                    <Label htmlFor={fI.id}>
                                        {fI.label}
                                    </Label>
                                </LabelGrid>
                                <Grid item xs={12} sm={9}>
                                    <TextField
                                        type={fI.type}
                                        id={fI.id}
                                        name={fI.id}
                                        value={personalInformation[fI.id as keyof IPersonalInformation]}
                                        onChange={handleTextChange}
                                    />
                                </Grid>
                            </React.Fragment>
                        )
                    }
                    {!isXS ? <LabelGrid item xs={3}/> : null}
                    <Grid item xs={12} sm={9}>
                        <Section>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Subtitle>Review</Subtitle>
                                    <p>{`${carDetails.make} ${carDetails.model}`.trim() || "-"}</p>
                                    <p>{srDescription}</p>
                                    {/*<EditButton color="primary">View Details</EditButton>*/}
                                </Grid>
                                {appointment ? <Grid style={{textAlign: isXS ? "left" : "right"}} item xs={12} sm={6}>
                                    <Subtitle>Selected Price</Subtitle>
                                    <p>${
                                        appointment.priceWithOffer?.value.toFixed(2) ||
                                        appointment.price.value.toFixed(2)
                                    }</p>
                                </Grid> : null}
                            </Grid>
                        </Section>

                        <Section>
                            <Box mb={1}>
                                <Subtitle>Add Comment</Subtitle>
                            </Box>
                            <Textarea
                                multiline
                                placeholder="Type here"
                                onChange={handleCommentChange}
                                value={comment}
                                rows={2}
                            />
                            <FlexGroup>
                                <FormControlLabel
                                    label="Privacy & Policy"
                                    control={<Checkbox
                                        checked={privacy.privacy}
                                        onChange={handlePrivacyCheck("privacy")}
                                        color="primary" />}
                                />
                                <div className="grow" />
                                <FormControlLabel
                                    label="Want us to call you?"
                                    control={<Checkbox
                                        checked={privacy.callback}
                                        onChange={handlePrivacyCheck("callback")}
                                        color="primary" />}
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
                                                    checked={reminders[item.id as keyof IReminders]}
                                                    onChange={handleCheckReminders(item.id as keyof IReminders)}
                                                    color="primary"
                                                />
                                            }
                                            label={item.label}
                                        />
                                    </React.Fragment>
                                )}
                            </FlexGroup>
                        </Section>
                    </Grid>
                </Grid>
            </ScrollableContainer>
            <NextPrevBlock
                isLoading={isLoading}
                next={handleConfirm}
                prev={prev}
                nextLabel={
                    appointment?.date ?
                        `Schedule ${moment(appointment.date).format("ddd, MMM D, h:mm a")}`
                        : "-"
                }
                isCompleted={isCompleted}
            />
        </StepContentContainer>
    </StepContainer>;
};