import React, {useState} from 'react';
import {NextPrevBlock, ScrollableContainer, StepContainer, StepContentContainer, TStepProps} from "../UI";
import {Box, Button, ButtonGroup} from "@material-ui/core";
import { ListAppointmentSelection } from '../AppointmentSelections/ListAppointmentSelection';
import {CalendarAppointmentSelection} from "../AppointmentSelections/CalendarAppointmentSelection";

type TView = "calendar"|"list";
type TButton = {label: string, type: TView};
const views: TButton[] = [
    {type: "calendar", label: "Calendar View"},
    {type: "list", label: "List View"}
]

export const AppointmentSelectionS5: React.FC<TStepProps> = ({prev, next}) => {
    const [selectedView, setSelectedView] = useState<TView>("calendar");
    const handleChangeView = (type: TView) => () => {
        setSelectedView(type);
    }

    return <StepContainer>
        <StepContentContainer>
            <h4 style={{textAlign: "center"}}>Select Appointment Date & Time</h4>
            <ScrollableContainer>
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
                <Box mt={2}>
                    {selectedView === "calendar"
                        ? <CalendarAppointmentSelection />
                        : <ListAppointmentSelection />
                    }
                </Box>
            </ScrollableContainer>
        </StepContentContainer>
        <NextPrevBlock next={next} prev={prev} />
    </StepContainer>
};