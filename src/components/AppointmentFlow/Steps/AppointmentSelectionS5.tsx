import React, {useEffect, useState} from 'react';
import {NextPrevBlock, ScrollableContainer, StepContainer, StepContentContainer, TStepProps} from "../UI";
import {Box, Button, ButtonGroup, Divider, Grid, Popover, styled} from "@material-ui/core";
import {ListAppointmentSelection} from '../AppointmentSelections/ListAppointmentSelection';
import {CalendarAppointmentSelection} from "../AppointmentSelections/CalendarAppointmentSelection";
import {Caption} from "../../UI/Caption";
import {DirectionsCar} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {changeS3Form, loadAppointmentSlots} from "../../../store/reducers/appointment/actions";
import {useParams} from "react-router-dom";
import {RootState} from "../../../store/rootReducer";
import moment from "moment";
import {MonthSelector} from "../AppointmentSelections/MonthSelector";
import {LoadingWrapper} from "../../UI/NoItemsLoading";
import {EAppointmentTimingType, IRemappedAppointmentSlot} from "../../../store/reducers/appointment/types";
import {makeStyles} from "@material-ui/core/styles";
import {getOfferValue} from "../AppointmentSelections/UI";

type TView = "calendar" | "list";
type TButton = { label: string, type: TView };
const views: TButton[] = [
    {type: "calendar", label: "Calendar View"},
    {type: "list", label: "List View"}
];

const DateSelectorContainer = styled("div")(({theme}) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    flexFlow: "row nowrap"
}));

const Title = styled("h5")({
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: 16,
    margin: 0
});

const useStyles = makeStyles({
    popover: {
        pointerEvents: "none",
    }
});

type TPopoverState = {
    anchor: HTMLElement|null;
    selectedAppointment: IRemappedAppointmentSlot|null;
}
const usePopoverStyles = makeStyles((theme) => ({
    wrapper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        minWidth: 180
    },
    offerType: {
        padding: theme.spacing(2),
        backgroundColor: "#56D75C",
        color: "#fff",
        fontSize: 19,
        width: "100%",
        flexGrow: 1,
        textAlign: "center",

    },
    hour: {
        textTransform: "uppercase",
        fontSize: 16,
        textAlign: "center"
    },
    day: {
        fontSize: 15,
        color: theme.palette.text.secondary,
        textAlign: "center"
    }
}));
const PopoverContent: React.FC<{appointment: TPopoverState['selectedAppointment']}> = ({appointment}) => {
    const classes = usePopoverStyles();
    if (!appointment || !appointment.offer) return null;
    const {offer} = appointment;
    return <div className={classes.wrapper}>
        <div className={classes.offerType}>
            <strong>{offer ? getOfferValue(offer, true) : null}</strong>
        </div>
        <Box py={2} px={1} fontSize={16}>
            <strong>{offer?.title}</strong>
        </Box>
        <Divider style={{width: "100%"}} />

        <Box py={2} px={1}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={7} className={classes.hour}>
                    {appointment.date.format("h:mm A")}
                </Grid>
                <Grid item xs={5} className={classes.day}>
                    {appointment.date.format("MMM D")}
                </Grid>
            </Grid>
        </Box>
    </div>;
}

export const AppointmentSelectionS5: React.FC<TStepProps> = ({prev, next}) => {
    const [selectedView, setSelectedView] = useState<TView>("calendar");
    const [isLoading, setLoading] = useState<boolean>(false);
    const [popover, setPopover] = useState<TPopoverState>({anchor: null, selectedAppointment: null});

    const dispatch = useDispatch();
    const {id} = useParams();
    const [
        selectedAppointmentType,
        selectedDate,
        selectedServiceRequest,
        appointmentsExist,
    ] = useSelector(({appointment: {s3Data, selectedSR, appointmentSlots}}: RootState) => [
        s3Data.appointmentType,
        s3Data.date,
        selectedSR,
        Boolean(appointmentSlots.length)
    ]);
    const [date, setDate] = useState<moment.Moment>(selectedDate ? moment(selectedDate) : moment());

    useEffect(() => {
        async function loadData () {
            setLoading(true);
            const sd: moment.Moment = selectedDate
                ? moment(selectedDate)
                : moment.utc().add(1, "day").startOf("day");
            try {
                await dispatch(loadAppointmentSlots({
                    appointmentTimingType: selectedAppointmentType,
                    serviceCenterId: id,
                    fromDate: sd.toISOString(),
                    serviceRequestIds: [selectedServiceRequest || 0],
                    countOfDays: Math.abs(sd.diff(moment(sd).endOf("month"), "days")) + 1
                }, updateDate));
            } finally {
                setLoading(false);
            }
        }
        loadData().finally();
    }, [id, dispatch, selectedAppointmentType, selectedDate, selectedServiceRequest]);

    const handleSetDate = (nDate: moment.Moment) => {
        if (date.month() !== nDate.month()) {
            setDate(nDate);
            dispatch(changeS3Form({date: nDate}));
        }
    }
    const handleClosePopover = () => {
        setPopover({selectedAppointment: null, anchor: null});
    }
    const handleOpenPopover = (selectedAppointment: IRemappedAppointmentSlot) => (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        if (selectedAppointment.offer) {
            setPopover({selectedAppointment, anchor: e.currentTarget});
        }
    }
    const updateDate = (d: moment.Moment) => {
        setDate(d);
    }
    const handleChangeView = (type: TView) => () => {
        setSelectedView(type);
    }

    const classes = useStyles();

    return <StepContainer>
        <StepContentContainer>
            <h4 style={{textAlign: "center"}}>Select Appointment Date & Time</h4>

            <Box textAlign="center" mb={1}>
                <ButtonGroup color="primary">
                    {views.map(view =>
                        <Button
                            key={view.type}
                            onClick={handleChangeView(view.type)}
                            variant={view.type === selectedView ? "contained" : "outlined"}>
                            {view.label}
                        </Button>
                    )}
                </ButtonGroup>
            </Box>
            <ScrollableContainer>
                {selectedAppointmentType === EAppointmentTimingType.SpecialOffers ? <Box mt={2}>
                    <DateSelectorContainer>
                        <Box mr={2}><Title>Select date</Title></Box>
                        <MonthSelector date={date} onChange={handleSetDate}/>
                    </DateSelectorContainer>
                </Box> : null}
                <Box my={2}>
                    <LoadingWrapper
                        noItemsLabel="There is no free slots on selected date"
                        isLoading={isLoading}
                        itemsExist={appointmentsExist}>
                        {selectedView === "calendar"
                            ? <CalendarAppointmentSelection onPopoverOpen={handleOpenPopover} onPopoverClose={handleClosePopover} />
                            : <ListAppointmentSelection onPopoverOpen={handleOpenPopover} onPopoverClose={handleClosePopover} />}
                    </LoadingWrapper>
                </Box>
                <Divider/>
                <Box mt={1}>
                    <Caption
                        title={<Box ml={.5}>Early drop off with self check in available</Box>}
                        icon={<DirectionsCar/>}
                    />
                </Box>
                <Box mt={1}>
                    <Caption title={
                        <Box ml={.5}>
                            <strong>
                                Disclaimer:
                            </strong>
                            <span> Special offers for appointment times do not apply for transmission and other power train related services.</span>
                        </Box>
                    }/>
                </Box>
            </ScrollableContainer>
            <NextPrevBlock next={next} prev={prev} />
            <Popover
                id="selectedAppointment"
                className={classes.popover}
                anchorEl={popover.anchor}
                open={Boolean(popover.anchor)}
                onClose={handleClosePopover}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                disableRestoreFocus
            >
                <PopoverContent appointment={popover.selectedAppointment} />
            </Popover>
        </StepContentContainer>
    </StepContainer>
};