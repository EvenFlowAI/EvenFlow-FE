import React from 'react';
import {NextPrevBlock, ScrollableContainer, StepContainer, StepContentContainer, TStepProps} from "../UI";
import {Box, Divider, Grid, styled} from "@material-ui/core";
import {SquarePaper} from "../../UI/Paper";
import {Caption} from "../../UI/Caption";
import {ETransportation, transportations} from "../../../store/reducers/appointment/types";
import {useDispatch, useSelector} from "react-redux";
import {changeTransportation} from "../../../store/reducers/appointment/actions";
import {RootState} from "../../../store/rootReducer";
import {RadioButtonChecked, RadioButtonUnchecked} from "@material-ui/icons";

const Paper = styled(SquarePaper)(({theme}) => ({
    padding: 16,
    minHeight: 320,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    "&.selected": {
        color: theme.palette.primary.main,
        borderColor: theme.palette.primary.main
    }
}));

const Title = styled("h3")(({theme}) => ({
    margin: 0,
    color: theme.palette.text.primary,
    fontSize: 48
}));

const Option = styled(SquarePaper)(({theme}) => ({
    color: theme.palette.text.disabled,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    cursor: "pointer",
    alignItems: "center",
    fontSize: 15,
    marginTop: theme.spacing(1),
    padding: theme.spacing(.6),
    "&.selected": {
        color: theme.palette.primary.main,
        borderColor: theme.palette.primary.main
    }
}));

export const TransportationNeedsS4: React.FC<TStepProps> = ({next, prev, isCompleted}) => {
    const selectedTransportation = useSelector((state: RootState) => state.appointment.transportation);

    const dispatch = useDispatch();

    const handleChange = (type: ETransportation) => () => {
        dispatch(changeTransportation(type));
    }
    return <StepContainer>
        <StepContentContainer>
            <h4 style={{textAlign: "center"}}>While we are servicing your vehicle, do you need transportation?</h4>
            <ScrollableContainer>
                <Grid container spacing={4}>
                    {transportations.map((te, idx) =>
                        <Grid key={idx} item xs={12} md={6}>
                            <Paper
                                variant="outlined"
                                className={selectedTransportation !== null
                                    ? selectedTransportation > 2 && idx
                                        ? "selected" : selectedTransportation < 3 && !idx
                                            ? "selected" : "" : ""}>
                                <Title>{idx ? "Yes," : "No,"}</Title>
                                <div className="grow" />
                                <Box mt={3} width="100%">
                                    {te.map(t =>
                                        <Option
                                            key={t.id}
                                            onClick={handleChange(t.id)}
                                            variant="outlined"
                                            className={t.id === selectedTransportation ? "selected" : ""}>
                                            {t.id === selectedTransportation
                                                ? <RadioButtonChecked /> : <RadioButtonUnchecked />}
                                            <Box flexGrow={1} px={1} textAlign="center">{t.label}</Box>
                                        </Option>
                                    )}
                                </Box>
                            </Paper>
                        </Grid>
                    )}
                </Grid>
                <Box mt={3} mb={2}><Divider /></Box>
                <Box mb={1}>
                    <Caption title={
                        <Box ml={.5}>
                            <strong>Note: </strong>
                            Your selection may affect appointment availability
                        </Box>
                    } />
                </Box>
            </ScrollableContainer>
            <NextPrevBlock next={next} prev={prev} isCompleted={isCompleted} />
        </StepContentContainer>
    </StepContainer>
};