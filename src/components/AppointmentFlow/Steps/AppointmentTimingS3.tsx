import React from 'react';
import {ScrollableContainer, StepContainer, TStepProps} from "../UI";
import {Caption} from "../../UI/Caption";
import {Box, Button} from "@material-ui/core";

export const AppointmentTimingS3: React.FC<TStepProps> = ({next, prev}) => {
    return <StepContainer>
        <h4 style={{textAlign: "center"}}>When would you like to bring your vehicle in for servicing?</h4>
        <ScrollableContainer>
            <Box>
                <Caption title={<span><strong>Note:</strong> Your selection may affect appointment availability</span>} />
            </Box>
        </ScrollableContainer>
        <Box mt={1} textAlign="center">
            <Button variant="outlined" color="primary" onClick={prev}>Previous Step</Button>
            <Button style={{marginLeft: 16}} variant="contained" onClick={next} color="primary">Continue</Button>
        </Box>
    </StepContainer>
};