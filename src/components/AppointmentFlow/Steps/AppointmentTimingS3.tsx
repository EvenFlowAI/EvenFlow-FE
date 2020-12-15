import React from 'react';
import {NextPrevBlock, ScrollableContainer, StepContainer, StepContentContainer, TStepProps} from "../UI";
import {Caption} from "../../UI/Caption";
import {Box, Divider, Grid, styled} from "@material-ui/core";
import {SquarePaper} from "../../UI/Paper";
import {ReactComponent as MiddleActiveIcon} from "../../../assets/img/calendarIconMiddleActive.svg";
import {ReactComponent as MiddleIcon} from "../../../assets/img/calendarMiddle.svg";
import {ReactComponent as RightIconActive} from "../../../assets/img/calendarRightActive.svg";
import {ReactComponent as RightIcon} from "../../../assets/img/calendarRightGray.svg";
import {ReactComponent as GreenIcon} from "../../../assets/img/calendarGreen.svg";
import {RadioButtonChecked, RadioButtonUnchecked} from "@material-ui/icons";
import {DatePicker} from "@material-ui/pickers";
import {MaterialUiPickersDate} from "@material-ui/pickers/typings/date";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {EAppointmentTimingType} from "../../../store/reducers/appointment/types";
import {changeS3Form} from "../../../store/reducers/appointment/actions";
import {DateRangeIcon} from "@material-ui/pickers/_shared/icons/DateRangeIcon";

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
    color: theme.palette.text.disabled,
    transition: theme.transitions.create(["background"]),
    "&.active": {
        borderColor: theme.palette.primary.main,
        color: theme.palette.primary.main,
        background: "rgba(217,223,253,.3)",
        "&>.cIconWrapper": {
            backgroundColor: "#fff",
        },
        "& .description": {
            fontWeight: "bold"
        }
    },
    "&>.cIconWrapper": {
        backgroundColor: "rgba(218,218,218,.4)",
    },
    "&.green": {
        borderColor: "#76CD7A",
        color: "#76CD7A",
        "&.active": {
            borderColor: "#76CD7A",
            background: "rgba(118,205,122, .2)",
        }
    }
}));
const Description = styled("span")({
    fontSize: 15,
    marginTop: 16,
    textAlign: "center"
});
const Input = styled(DatePicker)(({theme}) => ({
    marginTop: 16,
    cursor: "pointer",
    "&>div:not(.Mui-disabled)": {
        borderColor: theme.palette.primary.main,
        cursor: "pointer",
        "&>input": {
            color: theme.palette.primary.main,
            cursor: "pointer"
        }
    },
    "&>div": {
        paddingRight: 4,
        backgroundColor: "#fff"
    }
}));


type TPlate = {
    id: EAppointmentTimingType;
    description: string;
    classActive: string;
    classNonActive: string;
    input: boolean;
    iconActive: JSX.Element;
    iconNonActive: JSX.Element;
}

const plates: TPlate[] = [
    {
        id: EAppointmentTimingType.SpecialOffers,
        description: "See appointments with special offer and shorter wait times",
        iconActive: <GreenIcon />,
        input: false,
        iconNonActive: <GreenIcon />,
        classActive: "green active",
        classNonActive: "green",
    },
    {
        id: EAppointmentTimingType.PreferredDate,
        description: "Choose a preferred date",
        iconActive: <MiddleActiveIcon />,
        iconNonActive: <MiddleIcon/>,
        input: true,
        classActive: "active",
        classNonActive: "",
    },
    {
        id: EAppointmentTimingType.FirstAvailable,
        description: "Choose first available date",
        iconActive: <RightIconActive />,
        iconNonActive: <RightIcon />,
        input: false,
        classActive: "active",
        classNonActive: ""
    }
]

export const AppointmentTimingS3: React.FC<TStepProps> = ({next, prev}) => {
    const s3Form = useSelector((state: RootState) => state.appointment.s3Data);

    const dispatch = useDispatch();

    const handleDateChange = (date: MaterialUiPickersDate) => {
        dispatch(changeS3Form({date}));
    }
    const handleSelect = (val: EAppointmentTimingType) => () => {
        if (val !== s3Form.appointmentType) {
            dispatch(changeS3Form({appointmentType: val}));
        }
    }
    const getRadio = (b: boolean) => {
        return b ? <RadioButtonChecked /> : <RadioButtonUnchecked />
    }

    return <StepContainer>
        <StepContentContainer>
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

                                <LogoWrapper className="cIconWrapper">
                                    {active ? plate.iconActive : plate.iconNonActive}
                                </LogoWrapper>
                                {plate.input
                                    ? <Input
                                        value={s3Form.date ?? null}
                                        onChange={handleDateChange}
                                        disabled={!active}
                                        placeholder={"Choose here"}
                                        disablePast
                                        InputProps={{
                                            disableUnderline: true,
                                            endAdornment: <DateRangeIcon color={active ? "primary" : "disabled"} />
                                        }}
                                    />
                                    : <div className="grow" />}
                                <Description className="description">{plate.description}</Description>
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
            <NextPrevBlock next={next} prev={prev} />
        </StepContentContainer>
    </StepContainer>
};