import React, {useEffect, useState} from 'react';
import {NextPrevBlock, ScrollableContainer, StepContainer, StepContentContainer, TStepProps} from "../UI";
import {Box, Button, ButtonGroup, Divider, styled} from "@material-ui/core";
import {ListAppointmentSelection} from '../AppointmentSelections/ListAppointmentSelection';
import {CalendarAppointmentSelection} from "../AppointmentSelections/CalendarAppointmentSelection";
import {Caption} from "../../UI/Caption";
import {DirectionsCar} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {changeS3Form, loadAppointmentSlots, selectAppointment} from "../../../store/reducers/appointment/actions";
import {useParams} from "react-router-dom";
import {RootState} from "../../../store/rootReducer";
import moment from "moment";
import {MonthSelector} from "../AppointmentSelections/MonthSelector";
import {LoadingWrapper} from "../../UI/NoItemsLoading";

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

export const AppointmentSelectionS5: React.FC<TStepProps> = ({prev, next}) => {
    const [selectedView, setSelectedView] = useState<TView>("calendar");
    const [isLoading, setLoading] = useState<boolean>(false);

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
            const sd: moment.Moment|null = selectedDate ? moment(selectedDate) : null;
            try {
                await dispatch(loadAppointmentSlots({
                    appointmentTimingType: selectedAppointmentType,
                    serviceCenterId: id,
                    fromDate: sd ? sd.toISOString() : undefined,
                    serviceRequestIds: [selectedServiceRequest || 0],
                    countOfDays: sd ? Math.abs(sd.diff(moment(sd).endOf("month"), "days")) + 1 : undefined
                }));
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
    const handleChangeView = (type: TView) => () => {
        setSelectedView(type);
        dispatch(selectAppointment(null));
    }

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
                <Box mt={2}>
                    <DateSelectorContainer>
                        <Box mr={2}><Title>Select date</Title></Box>
                        <MonthSelector date={date} onChange={handleSetDate} />
                    </DateSelectorContainer>
                </Box>
                <Box my={2}>
                    <LoadingWrapper
                        noItemsLabel="There is no free slots on selected date"
                        isLoading={isLoading}
                        itemsExist={appointmentsExist}>
                        {selectedView === "calendar"
                            ? <CalendarAppointmentSelection/>
                            : <ListAppointmentSelection/>}
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
        </StepContentContainer>
        <NextPrevBlock next={next} prev={prev}/>
    </StepContainer>
};