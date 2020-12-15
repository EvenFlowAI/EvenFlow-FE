import React, {useEffect, useState} from 'react';
import {NextPrevBlock, ScrollableContainer, StepContainer, StepContentContainer, TStepProps} from "../UI";
import {Box, Button, ButtonGroup, Divider, styled} from "@material-ui/core";
import {ListAppointmentSelection} from '../AppointmentSelections/ListAppointmentSelection';
import {CalendarAppointmentSelection} from "../AppointmentSelections/CalendarAppointmentSelection";
import {Caption} from "../../UI/Caption";
import {DirectionsCar} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {loadAppointmentSlots, selectAppointment} from "../../../store/reducers/appointment/actions";
import {useParams} from "react-router-dom";
import {RootState} from "../../../store/rootReducer";
import moment from "moment";
import {MonthSelector} from "../AppointmentSelections/MonthSelector";

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
    const [date, setDate] = useState<moment.Moment>(moment());


    const handleSetDate = (nDate: moment.Moment) => {
        setDate(nDate);
    }

    const dispatch = useDispatch();
    const {id} = useParams();
    const [
        selectedAppointmentType,
        selectedDate,
        selectedServiceRequest,
    ] = useSelector(({appointment: {s3Data, selectedSR}}: RootState) => [
        s3Data.appointmentType,
        s3Data.date,
        selectedSR
    ])

    useEffect(() => {
        dispatch(loadAppointmentSlots({
            appointmentTimingType: selectedAppointmentType,
            serviceCenterId: id,
            fromDate: selectedDate ? moment(selectedDate).toISOString() : undefined,
            serviceRequestIds: [selectedServiceRequest || 0]
        }));
    }, [id, dispatch, selectedAppointmentType, selectedDate, selectedServiceRequest]);

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
                    {selectedView === "calendar"
                        ? <CalendarAppointmentSelection/>
                        : <ListAppointmentSelection/>
                    }
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