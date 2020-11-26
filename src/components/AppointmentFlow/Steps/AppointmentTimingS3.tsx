import React, {useState} from 'react';
import {ScrollableContainer, StepContainer, TStepProps} from "../UI";
import {Caption} from "../../UI/Caption";
import {Box, Button, Divider, Grid, styled} from "@material-ui/core";
import {SquarePaper} from "../../UI/Paper";
import {ReactComponent as MiddleActiveIcon} from "../../../assets/img/calendarIconMiddleActive.svg";
import {ReactComponent as MiddleIcon} from "../../../assets/img/calendarMiddle.svg";
import {ReactComponent as RightIconActive} from "../../../assets/img/calendarRightActive.svg";
import {ReactComponent as RightIcon} from "../../../assets/img/calendarRightGray.svg";
import {ReactComponent as GreenIcon} from "../../../assets/img/calendarGreen.svg";
import {RadioButtonChecked, RadioButtonUnchecked} from "@material-ui/icons";
import {DatePicker} from "@material-ui/pickers";
import moment from "moment";
import {MaterialUiPickersDate} from "@material-ui/pickers/typings/date";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {TAppointmentType} from "../../../store/reducers/appointment/types";
import {changeS3Form} from "../../../store/reducers/appointment/actions";

const LogoWrapper = styled("div")({
    borderRadius: "50%",
    width: 70,
    height: 70,
    backgroundColor: "#ffffff",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
});

const Paper = styled(SquarePaper)({
    display: "flex",
    padding: 16,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 260,
    cursor: "pointer"
});
const Description = styled("span")({
    fontSize: 15,
    marginTop: 16,
    textAlign: "center"
});
const Input = styled(DatePicker)(({theme}) => ({
    marginTop: 16,
    "&>div": {
        borderColor: theme.palette.primary.main
    }
}));

export const AppointmentTimingS3: React.FC<TStepProps> = ({next, prev}) => {
    const [selectedDate, setSelectedDate] = useState<moment.Moment>(moment.utc().add(3, "days"));
    const s3Form = useSelector((state: RootState) => state.appointment.s3Data);

    const dispatch = useDispatch();

    const handleDateChange = (date: MaterialUiPickersDate) => {
        setSelectedDate(moment.utc(date));
    }
    const handleSelect = (val: TAppointmentType) => () => {
        dispatch(changeS3Form({appointmentType: val}));
    }
    const getRadio = (b: boolean) => {
        return b ? <RadioButtonChecked color="primary" /> : <RadioButtonUnchecked color="disabled" />
    }

    return <StepContainer>
        <Box width={"80%"} height={"100%"} display="flex" flexDirection="column" flexWrap="nowrap" minWidth={0}>
            <h4 style={{textAlign: "center"}}>When would you like to bring your vehicle in for servicing?</h4>
            <ScrollableContainer>
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={12} md={4}>
                        <Paper variant="outlined" onClick={handleSelect(1)}>
                            {getRadio(s3Form.appointmentType === 1)}
                            <LogoWrapper><GreenIcon /></LogoWrapper>
                            <div className="grow" />
                            <Description>See appointments with special offer and shorter wait times</Description>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                        <Paper variant="outlined" onClick={handleSelect(2)}>
                            {getRadio(s3Form.appointmentType === 2)}
                            <LogoWrapper>
                                {s3Form.appointmentType === 2 ? <MiddleActiveIcon/> : <MiddleIcon />}
                            </LogoWrapper>
                            <Input
                                value={selectedDate}
                                onChange={handleDateChange}
                                disabled={s3Form.appointmentType !== 2}
                                InputProps={{
                                    disableUnderline: true,
                                }}
                            />
                            <Description>Choose a preferred date</Description>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                        <Paper variant="outlined" onClick={handleSelect(3)}>
                            {getRadio(s3Form.appointmentType === 3)}
                            <LogoWrapper>
                                {s3Form.appointmentType === 3 ? <RightIconActive /> : <RightIcon/>}
                            </LogoWrapper>
                            <div className="grow" />
                            <Description>Choose first available date</Description>
                        </Paper>
                    </Grid>
                </Grid>
                <Box my={2}>
                    <Divider />
                </Box>
                <Caption
                    title={<span><strong>Note:</strong> Your selection may affect appointment availability</span>}
                />
            </ScrollableContainer>
            <Box mt={1} textAlign="center">
                <Button variant="outlined" color="primary" onClick={prev}>Previous Step</Button>
                <Button style={{marginLeft: 16}} variant="contained" onClick={next} color="primary">Continue</Button>
            </Box>
        </Box>
    </StepContainer>
};