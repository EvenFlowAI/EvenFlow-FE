import React, {useEffect, useState} from 'react';
import {NextPrevBlock, ScrollableContainer, StepContainer, StepContentContainer, TStepProps} from "../UI";
import {Box, Button, ButtonGroup, Divider, Grid, Popover} from "@material-ui/core";
import {ListAppointmentSelection} from '../AppointmentSelections/ListAppointmentSelection';
import {CalendarAppointmentSelection} from "../AppointmentSelections/CalendarAppointmentSelection";
import {useDispatch, useSelector} from "react-redux";
import {changeS3Form, loadAppointmentSlots} from "../../../store/reducers/appointment/actions";
import {useParams} from "react-router-dom";
import {RootState} from "../../../store/rootReducer";
import moment from "moment";
import {LoadingWrapper} from "../../UI/NoItemsLoading";
import {IRemappedAppointmentSlot} from "../../../store/reducers/appointment/types";
import {makeStyles} from "@material-ui/core/styles";
import {getOfferValue} from "../AppointmentSelections/UI";
import {AppointmentSelectInfo} from "../AppointmentSelectInfo";
import {AppointmentFilters} from "../AppointmentFilters";
import {decodeSCID} from "../../../utils/utils";

type TView = "calendar" | "list";
type TButton = { label: string, type: TView };
const views: TButton[] = [
    {type: "calendar", label: "Calendar View"},
    {type: "list", label: "List View"}
];

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
                    {appointment.date.format("hh:mm A")}
                </Grid>
                <Grid item xs={5} className={classes.day}>
                    {appointment.date.format("MMM D")}
                </Grid>
            </Grid>
        </Box>
    </div>;
}

export const AppointmentSelectionS5: React.FC<TStepProps> = ({prev, next, isCompleted}) => {
    const [selectedView, setSelectedView] = useState<TView>("calendar");
    const [isLoading, setLoading] = useState<boolean>(false);
    const [popover, setPopover] = useState<TPopoverState>({anchor: null, selectedAppointment: null});
    const {advisor, serviceTypeOption} = useSelector((state: RootState) => state.appointmentFrame);

    const dispatch = useDispatch();
    const {id} = useParams();
    const [
        selectedAppointmentType,
        selectedDate,
        selectedServiceRequests,
        appointmentsExist,
        filters,
        customerData,
        selectedVehicle
    ] = useSelector(({
            appointment: {
                s3Data, selectedSR, appointmentSlots, appointmentFilters,
                customerLoadedData, customerSelectedVehicle
            }
        }: RootState) => [
        s3Data.appointmentType,
        s3Data.date,
        selectedSR,
        Boolean(appointmentSlots.length),
        appointmentFilters,
        customerLoadedData,
        customerSelectedVehicle
    ]);
    const [date, setDate] = useState<moment.Moment>(selectedDate ? moment(selectedDate) : moment());

    useEffect(() => {
        async function loadData () {
            setLoading(true);
            const sd: moment.Moment = selectedDate
                ? moment(selectedDate)
                : moment.utc().startOf("day");
            try {
                await dispatch(loadAppointmentSlots({
                    appointmentTimingType: selectedAppointmentType,
                    serviceCenterId: decodeSCID(id),
                    onlyOffers: filters.offersOnly,
                    consultantId: advisor?.id ?? null,
                    shorterWaitTime: filters.waitTimeOnly,
                    fromDate: sd.toISOString(),
                    serviceRequestIds: selectedServiceRequests,
                    countOfDays: Math.abs(sd.diff(moment(sd).endOf("month"), "days")) + 1,
                    customerId: customerData?.id,
                    warrantyExpiration: selectedVehicle?.warrantyExpiration,
                    serviceTypeOptionId: serviceTypeOption?.id ?? null,
                    recalls: [],
                }, updateDate));
            } finally {
                setLoading(false);
            }
        }
        loadData().finally();
    }, [
        id, dispatch, selectedAppointmentType,
        selectedDate, selectedServiceRequests, filters,
        customerData, selectedVehicle
    ]);

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
            {selectedView === 'calendar' ? <ScrollableContainer>
                <AppointmentFilters date={date} onDateChange={handleSetDate} />
                <Box my={2}>
                    <LoadingWrapper
                        noItemsLabel="There is no free slots on selected date"
                        isLoading={isLoading}
                        itemsExist={appointmentsExist}>
                        <CalendarAppointmentSelection onPopoverOpen={handleOpenPopover}
                                                      onPopoverClose={handleClosePopover}/>
                    </LoadingWrapper>
                </Box>
                <AppointmentSelectInfo/>
            </ScrollableContainer> :
            <ListAppointmentSelection
                date={date}
                isLoading={isLoading}
                onDateChange={handleSetDate}
                onPopoverOpen={handleOpenPopover}
                onPopoverClose={handleClosePopover} />
            }
            <NextPrevBlock next={next} prev={prev} isCompleted={isCompleted} />
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