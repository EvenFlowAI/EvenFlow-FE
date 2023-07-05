import React, {useEffect, useMemo, useState} from 'react';
import moment from "moment";
import {ChevronLeft, ChevronRight} from "@material-ui/icons";
import {DaySelectCard} from "./DaySelectCard";
import {TArgCallback} from "../../../types/types";
import {styled, Theme, useMediaQuery, useTheme} from "@material-ui/core";
import {TGroupedAppointments} from "../../../utils/types";
import {getAppointmentDate} from "./utils";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {EAppointmentTimingType} from "../../../store/reducers/appointment/types";
import {useModal} from "../../../utils/hooks";
import PromptNewSearchRange from "../../Modals/PromptNewSearchRange/PromptNewSearchRange";
import {setCurrentFrameScreen} from "../../../store/reducers/appointmentFrameReducer/actions";
import {selectAppointment, selectServiceValetAppointment} from "../../../store/reducers/appointment/actions";
import {EServiceType} from "../../../store/reducers/appointmentFrameReducer/types";

export const DaySelectorWrapper = styled('div')(({ theme }) => ({
    marginTop: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    gap: "12px",
    width: "100%",
    [theme.breakpoints.down('sm')]: {
        marginTop: 0,
        gap: "10px",
    }
}));
export const Arrow = styled('div')<Theme, {disabled?: boolean}>({
    border: "1px solid #DADADA",
    width: 30,
    height: 30,
    flexShrink: 0,
    opacity: ({disabled}) => disabled ? .5 : 1,
    display: "flex",
    marginTop: 35,
    alignItems: "center",
    justifyContent: "center",
    cursor: ({disabled}) => disabled ? "default" : "pointer",
});

export const WHILE_LIMIT = 40;
type TProps = {
    date: moment.Moment,
    dateRangeUpdated: boolean;
    onDateRangeSet: TArgCallback<boolean>;
    onDateChange: TArgCallback<moment.Moment>;
    loading: boolean;
    appointments: TGroupedAppointments;
}

export const DaySelector: React.FC<TProps> = ({date, onDateChange, loading, appointments, dateRangeUpdated, onDateRangeSet}) => {
    const {config} = useSelector((state: RootState) => state.bookingFlowConfig);
    const {serviceTypeOption} = useSelector((state: RootState) => state.appointmentFrame);
    const [sliceIdx, setSliceIdx] = useState<number>(0);
    const theme = useTheme();
    const dispatch = useDispatch();
    const {onOpen, isOpen, onClose} = useModal();
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));
    const isXs = useMediaQuery(theme.breakpoints.down("xs"));
    const isMds = useMediaQuery(theme.breakpoints.down("mds"));
    const daysPerScreen: number = useMemo(() => {
        return isSm ? 4 : isMds ? 5 : 6;
    }, [isSm, isMds]);
    const serviceType = serviceTypeOption?.type ?? EServiceType.VisitCenter;
    const currentConfig = config.find(item => item.serviceType?.toString() === serviceType.toString());
    
    const {selectedTiming} = useSelector((state: RootState) => state.appointmentFrame);
    const {searchedDateRange, appointment} = useSelector((state: RootState) => state.appointment);

    const [daysInMonth, days]: [number, string[]] = useMemo(() => {
        let daysInMonth: number = date.daysInMonth();
        let generatedDays: string[] = [];
        if (searchedDateRange) {
            daysInMonth = Math.abs(moment.utc(searchedDateRange.from).diff(moment.utc(moment(searchedDateRange.to).add(1, 'day')), "days"));
            let currentDate = moment.utc(searchedDateRange.from);
            let endDate = moment.utc(searchedDateRange.to).endOf('day');
            let i = 0;
            const maxAvailableDaysAmount = daysInMonth < WHILE_LIMIT ? WHILE_LIMIT : daysInMonth;
            while (currentDate.isSameOrBefore(endDate, "date") && i < maxAvailableDaysAmount) {
                generatedDays.push(
                    currentDate.startOf('day').toISOString().replace('.000', '')
                );
                currentDate = moment.utc(currentDate).add(1, "day");
                i++;
            }
        } else {
            generatedDays = Array(daysInMonth).fill(0)
                .map((e, idx) => getAppointmentDate(date, idx+1));
        }
        return [
            daysInMonth,
            generatedDays
        ];
    }, [date, searchedDateRange]);

    useEffect(() => {
        if (!dateRangeUpdated) {
            const selectedDate = appointment?.date ? appointment.date : date;
            const formattedDate = moment(selectedDate).startOf('day').toISOString().replace('.000', '');
            let dateIdx = days.findIndex(el => el === formattedDate);
            if (dateIdx === -1 || daysInMonth <= daysPerScreen) {
                setSliceIdx(0);
            } else {
                // to get center of the displayed dates
                const idXOfCenterElement = dateIdx - Math.floor(daysPerScreen / 2);
                if (idXOfCenterElement + daysPerScreen > daysInMonth) {
                    // Handle right date edge
                    if (dateIdx === days.length - 1) {
                        setSliceIdx(daysInMonth - daysPerScreen + 1);
                    } else {
                        setSliceIdx(daysInMonth - daysPerScreen);
                    }
                } else {
                    // Handle left date edge
                    setSliceIdx(idXOfCenterElement >= 0 ? idXOfCenterElement : 0);
                }

                onDateRangeSet(true);
            }
        }
    }, [date, days, daysPerScreen, daysInMonth, dateRangeUpdated, onDateRangeSet, appointment]);

    const handleChangeDay = (date: string) => () => {
        onDateChange(moment.utc(date));
    }

    const nextAvailable = (): boolean => {
        return sliceIdx < (daysInMonth - daysPerScreen);
    }
    const prevAvailable = (): boolean => {
        return sliceIdx > 0;
    }
    const handleNext = () => {
        if (nextAvailable()) {
            setSliceIdx(prevIndex => {
                const nS = prevIndex + (daysPerScreen * 2);
                return nS <= daysInMonth ? prevIndex + daysPerScreen : daysInMonth - daysPerScreen;
            });
        } else {
           if (currentConfig?.appointmentSelection) onOpen();
        }
    }
    const handlePrev = () => {
        if (prevAvailable()) {
            setSliceIdx(s => {
                const pS = s - daysPerScreen;
                return pS >= 0 ? pS : 0
            })
        } else {
            if (selectedTiming === EAppointmentTimingType.PreferredDate) {
                onOpen();
            }
        }
    }

    const handleYes = () => {
        dispatch(setCurrentFrameScreen('appointmentTiming'));
        dispatch(selectAppointment(null));
        dispatch(selectServiceValetAppointment(null));
    }

    return <DaySelectorWrapper>
        <Arrow onClick={handlePrev} disabled={!prevAvailable()}>
            <ChevronLeft  />
        </Arrow>
        {days
            .slice(sliceIdx, sliceIdx + daysPerScreen)
            .map(day =>
                <DaySelectCard
                    key={day}
                    isXs={isXs}
                    isCurrent={date.isSame(moment.utc(day), 'date')}
                    appointment={appointments[day]}
                    appointments={appointments}
                    onClick={handleChangeDay(day)}
                    day={day}
                />
        )}
        <Arrow onClick={handleNext} disabled={!nextAvailable()}>
            <ChevronRight />
        </Arrow>
        <PromptNewSearchRange onClose={onClose} open={isOpen} onSave={handleYes}/>
    </DaySelectorWrapper>
}