import React from 'react';
import {ScrollableContainer, StepContainer, StepContentContainer} from "../UI";
import {Box, Grid, styled} from "@material-ui/core";
import {SquarePaper} from "../../UI/Paper";

const Paper = styled(SquarePaper)({
    padding: 16,
    minHeight: 320,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start"
});

const Title = styled("h3")({
    margin: 0,
    fontSize: 48
});

const Option = styled(SquarePaper)(({theme}) => ({
    color: theme.palette.text.disabled,
    width: "100%",
    marginTop: theme.spacing(1),
    padding: theme.spacing(.5)
}));

export const TransportationNeedsS4 = () => {
    return <StepContainer>
        <StepContentContainer>
            <h4 style={{textAlign: "center"}}>While we are servicing your vehicle, do you need transportation?</h4>
            <ScrollableContainer>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Paper variant="outlined">
                            <Title>No,</Title>
                            <div className="grow" />
                            <Box mt={3} width="100%">
                                <Option variant="outlined">Options</Option>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper variant="outlined">
                            <Title>Yes,</Title>
                            <div className="grow" />
                            <Box mt={3} width="100%">
                                <Option variant="outlined">Options</Option>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </ScrollableContainer>
        </StepContentContainer>
    </StepContainer>
};