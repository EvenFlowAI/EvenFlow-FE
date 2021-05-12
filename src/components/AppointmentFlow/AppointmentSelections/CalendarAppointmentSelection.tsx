import React, {useEffect, useMemo, useRef, useState} from 'react';
import moment from "moment";
import {Box, Divider, Grid, GridSize, IconButton, styled, useMediaQuery, useTheme} from "@material-ui/core";
import {DayPlate} from "./DayPlate";
import {ChevronLeft, ChevronRight} from "@material-ui/icons";
import {AppointmentPlate} from "./AppointmentPlate";
import {selectAppointment} from "../../../store/reducers/appointment/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {IRemappedAppointmentSlot} from "../../../store/reducers/appointment/types";
import {TPopoverProps} from "../Steps/types";
import {TGroupedAppointment, TGroupedAppointments} from "./types";
import {preCenterNeeded} from "../../../utils/utils";

const Title = styled("h5")(({theme}) => ({
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: 16,
    margin: 0,
    [theme.breakpoints.down("xs")]: {
        textAlign: "center"
    }
}));

const DaysWrapper = styled("div")(({theme}) => ({
    marginTop: theme.spacing(2),
    display: "flex",
    flexFlow: "row nowrap",
    alignItems: "center",
    justifyContent: "space-between",
}));

type TGroupedAppointmentsList = [keyof TGroupedAppointments, TGroupedAppointment];

export const CalendarAppointmentSelection: React.FC<TPopoverProps> = ({onPopoverClose, onPopoverOpen}) => {
    const theme = useTheme();
    const isXS = useMediaQuery(theme.breakpoints.down("xs"));
    const isMD = useMediaQuery(theme.breakpoints.down("md"));
    const displayItems = useMemo(() => {
        return isMD && !isXS ? 4 : 6;
    }, [isMD, isXS]);
    const sliceSet = useRef<boolean>(false);

    const [sliceIdx, setSliceIdx] = useState<number>(0);
    const [selectedIdx, setSelectedIdx] = useState<string|null>(null);
    const selectedAppointment = useSelector((state: RootState) => state.appointment.appointment);
    const [appointmentType, appointmentDate] = useSelector(
        ({appointment: {s3Data}}: RootState) => [s3Data.appointmentType, s3Data.date]
    );
    const isMount = useRef(true);

    const dispatch = useDispatch();

    useEffect(() => {
        if (selectedAppointment && isMount.current) {
            setSelectedIdx(selectedAppointment.id.split("|")[0]);
            isMount.current = false;
        }
    }, [selectedAppointment]);

    const data = useSelector((state: RootState) => state.appointment.appointmentSlots);
    const groupedAppointments: TGroupedAppointments = useMemo(() => {
        const appointments: TGroupedAppointments = {};
        for (let appointment of data) {
            const date = moment(appointment.date);
            const idx = appointment.id.split("|")[0];
            if (appointments[idx]) {
                appointments[idx].appointments.push(appointment);
                if (appointment.offer) {
                    appointments[idx].offers = appointments[idx].offers || Boolean(appointment.offer);
                }
                if ((appointment.priceWithOffer?.value || appointment.price.value) < appointments[idx].lowestPrice) {
                    appointments[idx].lowestPrice = appointment.priceWithOffer?.value || appointment.price.value;
                }
            } else {
                appointments[idx] = {
                    date,
                    idx,
                    lowestPrice: appointment.priceWithOffer?.value || appointment.price.value,
                    appointments: [appointment],
                    offers: Boolean(appointment.offer)
                };
            }
        }
        return appointments;
    }, [data]);

    const groupedAppointmentsSortedList: TGroupedAppointmentsList[] = useMemo(() => {
        const arr: TGroupedAppointmentsList[] = [];
        for (let k in groupedAppointments) {
            if (groupedAppointments.hasOwnProperty(k)) {
                arr.push([k, groupedAppointments[k]]);
            }
        }
        arr.sort((a, b) => {
            if (a > b) {
                return 1;
            } else if (a < b) {
                return -1;
            }
            return 0;
        });
        return arr;
    }, [groupedAppointments]);

    useEffect(() => {
        if (preCenterNeeded(
            sliceSet.current,
            appointmentType,
            sliceIdx,
            groupedAppointments,
            displayItems,
            appointmentDate
        )) {
            let idxToSet = Object.keys(groupedAppointments).findIndex(
                app => moment(app).isSameOrAfter(moment(appointmentDate))
            );
            idxToSet = Math.floor(idxToSet - displayItems / 2);
            if (idxToSet > 0 && idxToSet < Object.keys(groupedAppointments).length) {
                setSliceIdx(idxToSet);
            }
            sliceSet.current = true;
        }
    }, [groupedAppointments, sliceIdx, displayItems, appointmentType, appointmentDate]);

    const dateAppointments = useMemo(() => {
        return selectedIdx ? groupedAppointments[selectedIdx]?.appointments || [] : [];
    }, [selectedIdx, groupedAppointments]);
    const handleDateClick = (idx: string) => () => {
        setSelectedIdx(idx);
    }
    const handleSlide = (direction: "right"|"left") => () => {
        if (
            (sliceIdx + displayItems < Object.values(groupedAppointments).length && direction === "right")
            || (sliceIdx > 0 && direction === "left")
        ) {
            const newSliceIdx = direction === "right" ? sliceIdx + displayItems : sliceIdx - displayItems;
            setSliceIdx(newSliceIdx >= 0 ? newSliceIdx : 0);
        }
    }

    const handleSelectAppointment = (a: IRemappedAppointmentSlot) => () => {
        dispatch(selectAppointment(a));
    }

    const appointmentsLength = groupedAppointmentsSortedList.length;

    return <div>
        <DaysWrapper>
            {appointmentsLength ? <IconButton
                disabled={sliceIdx <= 0}
                onClick={handleSlide("left")}>
                <ChevronLeft/>
            </IconButton> : null}
            <Grid container style={{flexGrow: 1}} spacing={4}>
            {groupedAppointmentsSortedList
                .slice(sliceIdx, sliceIdx + displayItems)
                .map(([_, {date, lowestPrice, offers, idx}]) => {
                return <Grid item xs={Math.floor(12 / displayItems) as GridSize} key={date.date()}>
                    <DayPlate
                        isXS={isXS}
                        date={date}
                        selected={selectedIdx === idx}
                        offers={offers}
                        price={lowestPrice}
                        onClick={handleDateClick(idx)}
                    />
                </Grid>;
            })}
            </Grid>
            {appointmentsLength ? <IconButton
                disabled={sliceIdx + displayItems >= appointmentsLength}
                onClick={handleSlide("right")}>
                <ChevronRight/>
            </IconButton> : null}
        </DaysWrapper>
        {selectedIdx ? <Box>
            <Box my={2}>
                <Divider />
            </Box>
            <Box mb={1}>
                <Title>Select time</Title>
            </Box>
            <Grid container spacing={2}>
                {dateAppointments.map(appointment =>
                    <Grid key={appointment.id} item xs={6} sm={4} md={3}>
                        <AppointmentPlate
                            onHover={onPopoverOpen(appointment)}
                            onLeave={onPopoverClose}
                            selected={appointment.id === selectedAppointment?.id}
                            onClick={handleSelectAppointment(appointment)}
                            appointment={appointment}
                        />
                    </Grid>
                )}
            </Grid>
        </Box> : <Box textAlign="center" mt={2}>Please, click on date to see available times</Box>}
    </div>
};