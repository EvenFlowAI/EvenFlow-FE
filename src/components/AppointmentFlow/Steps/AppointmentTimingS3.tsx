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

const Paper = styled(SquarePaper)(({theme}) => ({
    display: "flex",
    padding: 16,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 260,
    cursor: "pointer",
    "&.selected": {
        borderColor: theme.palette.primary.main
    }
}));
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


type TPlate = {
    id: TAppointmentType;
    description: string;
    classActive: string;
    classNonActive: string;
    input: boolean;
    iconActive: JSX.Element;
    iconNonActive: JSX.Element;
}

const plates: TPlate[] = [
    {
        id: 1,
        description: "See appointments with special offer and shorter wait times",
        iconActive: <GreenIcon />,
        input: false,
        iconNonActive: <GreenIcon />,
        classActive: "green active",
        classNonActive: "active",
    },
    {
        id: 2,
        description: "Choose a preferred date",
        iconActive: <MiddleActiveIcon />,
        iconNonActive: <MiddleIcon/>,
        input: true,
        classActive: "active",
        classNonActive: "active",
    },
    {
        id: 3,
        description: "Choose first available date",
        iconActive: <RightIconActive />,
        iconNonActive: <RightIcon />,
        input: false,
        classActive: "active",
        classNonActive: ""
    }
]

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
                    {plates.map(plate => {
                        const active = s3Form.appointmentType === plate.id;
                        return <Grid item xs={12} sm={12} md={4} key={plate.id}>
                            <Paper
                                className={active ? plate.classActive : plate.classNonActive}
                                variant="outlined"
                                onClick={handleSelect(plate.id)}>
                                {getRadio(active)}
                                <LogoWrapper>{active ? plate.iconActive : plate.iconNonActive}</LogoWrapper>
                                {plate.input
                                    ? <Input
                                        value={selectedDate}
                                        onChange={handleDateChange}
                                        disabled={!active}
                                        InputProps={{
                                            disableUnderline: true,
                                        }}
                                    />
                                    : <div className="grow" />}
                                <Description>{plate.description}</Description>
                            </Paper>
                        </Grid>;
                    })}
                </Grid>
                <Box my={2}>
                    <Divider />
                </Box>
                <Caption
                    title={<Box ml={.5}><strong> Note:</strong> Your selection may affect appointment availability</Box>}
                />
            </ScrollableContainer>
            <Box mt={1} textAlign="center">
                <Button variant="outlined" color="primary" onClick={prev}>Previous Step</Button>
                <Button style={{marginLeft: 16}} variant="contained" onClick={next} color="primary">Continue</Button>
            </Box>
        </Box>
    </StepContainer>
};