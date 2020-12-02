import React, {useState} from 'react';
import {NextPrevBlock, ScrollableContainer, StepContainer, StepContentContainer, TStepProps} from "../UI";
import {Box, Button, ButtonGroup, Divider} from "@material-ui/core";
import {ListAppointmentSelection} from '../AppointmentSelections/ListAppointmentSelection';
import {CalendarAppointmentSelection} from "../AppointmentSelections/CalendarAppointmentSelection";
import {Caption} from "../../UI/Caption";
import {DirectionsCar} from "@material-ui/icons";
import {useDispatch} from "react-redux";
import {selectAppointment} from "../../../store/reducers/appointment/actions";

type TView = "calendar" | "list";
type TButton = { label: string, type: TView };
const views: TButton[] = [
    {type: "calendar", label: "Calendar View"},
    {type: "list", label: "List View"}
]

export const AppointmentSelectionS5: React.FC<TStepProps> = ({prev, next}) => {
    const [selectedView, setSelectedView] = useState<TView>("calendar");

    const dispatch = useDispatch();

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
                    {selectedView === "calendar"
                        ? <CalendarAppointmentSelection/>
                        : <ListAppointmentSelection/>
                    }
                </Box>
            </ScrollableContainer>
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
        </StepContentContainer>
        <NextPrevBlock next={next} prev={prev}/>
    </StepContainer>
};