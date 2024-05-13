import React, {useEffect, useMemo, useState} from 'react';
import {ChevronLeft, ChevronRight} from "@mui/icons-material";
import {TArgCallback, TParsableDate} from "../../../types/types";
import {useMediaQuery, useTheme} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {EAppointmentTimingType, IServiceValetAppointment} from "../../../store/reducers/appointment/types";
import PromptNewSearchModal from "../../../features/booking/AppointmentFlow/AppointmentSlots/PromptNewSearchModal/PromptNewSearchModal";
import {setCurrentFrameScreen} from "../../../store/reducers/appointmentFrameReducer/actions";
import {selectServiceValetAppointment} from "../../../store/reducers/appointment/actions";
import {SVDaySelectCard} from "../SVDaySelectCard/SVDaySelectCard";
import {EServiceType} from "../../../store/reducers/appointmentFrameReducer/types";
import {WHILE_LIMIT} from "../../../features/booking/AppointmentFlow/AppointmentSlots/constants";
import {DaySelectorWrapper} from "../../styled/DaySelectorWrapper";
import {DateSelectArrow} from "../../styled/DateSelectArrow";
import {getAppointmentDate} from "../../../features/booking/AppointmentFlow/AppointmentSlots/utils";
import {useModal} from "../../../hooks/useModal/useModal";
import dayjs from "dayjs";
import {useHistory} from "react-router-dom";

type TProps = {
    date: TParsableDate,
    dateRangeUpdated: boolean;
    onDateRangeSet: TArgCallback<boolean>;
    onDateChange: TArgCallback<TParsableDate>;
    loading: boolean;
    appointments: IServiceValetAppointment[];
}

export const SVDaySelector: React.FC<React.PropsWithChildren<React.PropsWithChildren<TProps>>> = ({date, onDateChange, loading, appointments, dateRangeUpdated, onDateRangeSet}) => {
    const {config} = useSelector((state: RootState) => state.bookingFlowConfig);
    const {selectedTiming, serviceTypeOption} = useSelector((state: RootState) => state.appointmentFrame);
    const {searchedDateRange, serviceValetAppointment} = useSelector((state: RootState) => state.appointment);

    const [sliceIdx, setSliceIdx] = useState<number>(0);
    const theme = useTheme();
    const dispatch = useDispatch();
    const {onOpen, isOpen, onClose} = useModal();
    const isSm = useMediaQuery(theme.breakpoints.down('md'));
    const isXs = useMediaQuery(theme.breakpoints.down('sm'));
    const isMds = useMediaQuery(theme.breakpoints.down("mds"));
    const history = useHistory();
    const isAdminPanel = history.location.pathname.includes('admin');
    const daysPerScreen: number = useMemo(() => {
        return isSm ? 4 : isMds ? 5 : 6;
    }, [isSm, isMds]);

    const serviceType = serviceTypeOption?.type ?? EServiceType.VisitCenter;
    const currentConfig = config.find(item => item.serviceType?.toString() === serviceType.toString());

    const [daysInMonth, days]: [number, string[]] = useMemo(() => {
        let daysInMonth: number = dayjs(date).daysInMonth();
        let generatedDays: string[] = [];
        if (searchedDateRange) {
            daysInMonth = Math.abs(dayjs.utc(searchedDateRange.from).diff(dayjs.utc(dayjs(searchedDateRange.to).add(1, 'day')), "days"));
            let currentDate = dayjs.utc(searchedDateRange.from);
            let endDate = dayjs.utc(searchedDateRange.to).endOf('day');
            let i = 0;
            const maxAvailableDaysAmount = daysInMonth < WHILE_LIMIT ? WHILE_LIMIT : daysInMonth;
            while (currentDate.isSameOrBefore(endDate, "date") && i < maxAvailableDaysAmount) {
                generatedDays.push(
                    currentDate.startOf('day').toISOString().replace('.000', '')
                );
                currentDate = dayjs.utc(currentDate).add(1, "day");
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
    }, [date, searchedDateRange, getAppointmentDate]);

    useEffect(() => {
        if (!dateRangeUpdated && searchedDateRange) {
            const selectedDate = serviceValetAppointment?.date ?? date;
            const formattedDate = dayjs.utc(selectedDate).startOf('day').toISOString().replace('.000', '');
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
            }
            onDateRangeSet(true);
        }
    }, [date, days, daysPerScreen, daysInMonth, dateRangeUpdated, onDateRangeSet, serviceValetAppointment, searchedDateRange]);

    const handleChangeDay = (date: string) => () => {
        onDateChange(dayjs.utc(date));
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
            if (currentConfig?.appointmentSelection && !isAdminPanel) onOpen();
        }
    }
    const handlePrev = () => {
        if (prevAvailable()) {
            setSliceIdx(s => {
                const pS = s - daysPerScreen;
                return pS >= 0 ? pS : 0
            })
        } else {
            if (selectedTiming === EAppointmentTimingType.PreferredDate && !isAdminPanel) {
                onOpen();
            }
        }
    }

    const handleYes = () => {
        dispatch(setCurrentFrameScreen('appointmentTiming'));
        dispatch(selectServiceValetAppointment(null));
    }

    return <DaySelectorWrapper>
        <DateSelectArrow onClick={handlePrev} disabled={!prevAvailable()}>
            <ChevronLeft  />
        </DateSelectArrow>
        {days
            .slice(sliceIdx, sliceIdx + daysPerScreen)
            .map(day =>
                <SVDaySelectCard
                    key={day}
                    isXs={isXs}
                    isCurrent={dayjs.utc(date).isSame(dayjs.utc(day), 'date')}
                    appointment={appointments.find(item => dayjs(item.date).isSame(dayjs.utc(day), 'date'))}
                    onClick={handleChangeDay(day)}
                    day={day}
                />
            )}
        <DateSelectArrow onClick={handleNext} disabled={!nextAvailable()}>
            <ChevronRight />
        </DateSelectArrow>
        <PromptNewSearchModal onClose={onClose} open={isOpen} onSave={handleYes}/>
    </DaySelectorWrapper>
}