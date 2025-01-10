import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/rootReducer";
import { DataCalendar } from "../../../components/DataCalendar/DataCalendar";
import { ReactComponent as Hand } from "../../../assets/img/wrench_with_hand.svg";
import { ReactComponent as User } from "../../../assets/img/persons.svg";
import {
  ICalendarItem,
  TTimePeriod,
} from "../../../store/reducers/schedules/types";
import { TParsableDate } from "../../../types/types";
import dayjs from "dayjs";
import { useSCs } from "../../../hooks/useSCs/useSCs";
import {
  loadScheduleByDate,
  loadScheduleCalendar,
} from "../../../store/reducers/schedules/actions";
import { useModal } from "../../../hooks/useModal/useModal";
import EmployeeScheduleModal from "./EmployeeScheduleModal/EmployeeScheduleModal";
import { CALENDAR_FORMAT, employeesRoot } from "../../../utils/constants";
import { TitleContainer } from "../../../components/wrappers/TitleContainer/TitleContainer";
import { EDay } from "../../../store/reducers/demandSegments/types";
import { loadWorkingDays } from "../../../store/reducers/serviceCenters/actions";
import { loadAllHolidays } from "../../../store/reducers/holidays/actions";

const EmployeesScheduleManagement = () => {
  const { calendarData, employeesLoading } = useSelector(
    (state: RootState) => state.employeesSchedule,
  );
  const { workingDays } = useSelector(
    ({ serviceCenters }: RootState) => serviceCenters,
  );
  const { holidaysList } = useSelector(({ holidays }: RootState) => holidays);
  const [date, setDate] = useState<TParsableDate>(dayjs());
  const [timePeriod, setTimePeriod] = useState<TTimePeriod | null>(null);
  const { selectedSC } = useSCs();
  const dispatch = useDispatch();
  const { onOpen, isOpen, onClose } = useModal();

  useEffect(() => {
    if (selectedSC && timePeriod) {
      const utcOffset = dayjs().utcOffset();
      const start = dayjs(timePeriod.startDate)
        .startOf("day")
        .add(utcOffset, "minute")
        .format(CALENDAR_FORMAT);
      const end = dayjs(timePeriod.endDate)
        .endOf("day")
        .subtract(utcOffset, "minute")
        .format(CALENDAR_FORMAT);
      dispatch(loadScheduleCalendar(selectedSC.id, start, end));
    }
  }, [selectedSC, timePeriod]);

  useEffect(() => {
    if (selectedSC) {
      dispatch(loadWorkingDays(selectedSC.id));
      dispatch(loadAllHolidays(selectedSC.id));
    }
  }, [selectedSC]);

  const onDayClick = (el: ICalendarItem | undefined, date: TParsableDate) => {
    if (selectedSC && el) {
      const formattedDate = dayjs(date).format(CALENDAR_FORMAT);
      setDate(dayjs(formattedDate, CALENDAR_FORMAT));
      dispatch(
        loadScheduleByDate(selectedSC.id, dayjs(date).format(CALENDAR_FORMAT)),
      );
      onOpen();
    }
  };

  const checkIsWorkingDay = useCallback(
    (date: TParsableDate): boolean => {
      const holiday = holidaysList.find((holiday) => {
        const originalDate = dayjs.utc(holiday.date);
        const d = dayjs
          .utc(holiday.date)
          .year(dayjs(date).year())
          .startOf("day");
        return (
          (d.isSame(dayjs.utc(dayjs(date).toDate()), "date") &&
            holiday.isRecurring) ||
          originalDate.isSame(dayjs.utc(date).toDate(), "date")
        );
      });
      return !holiday && workingDays.includes(dayjs.utc(date).day() as EDay);
    },
    [workingDays, holidaysList],
  );

  const disabledDates = calendarData
    .filter((el) => !checkIsWorkingDay(el.date))
    .map((el) => el.date);

  const getDisabledDate = () => {
    return Boolean(
      disabledDates.find((el) => {
        const formattedEl = dayjs(el).format(CALENDAR_FORMAT);
        const formattedDate = dayjs(date).format(CALENDAR_FORMAT);
        return dayjs(formattedEl, CALENDAR_FORMAT).isSame(
          dayjs.utc(formattedDate, CALENDAR_FORMAT),
          "date",
        );
      }),
    );
  };

  return (
    <>
      <TitleContainer
        title={"Schedule Management"}
        pad
        parent={employeesRoot}
      />
      <DataCalendar
        loading={employeesLoading}
        data={calendarData}
        firstIcon={<User />}
        secondIcon={<Hand />}
        firstIconFieldName={"advisorsCount"}
        secondIconFieldName={"techniciansCount"}
        date={date}
        disabledDates={disabledDates}
        firstIconText={"The number of advisors scheduled for the day"}
        secondIconText={"The number of technicians scheduled for the day"}
        dateFieldName={"date"}
        setDate={setDate}
        timePeriod={timePeriod}
        setTimePeriod={setTimePeriod}
        onDayClick={onDayClick}
      />
      <EmployeeScheduleModal
        open={isOpen}
        onClose={onClose}
        startDate={timePeriod?.startDate}
        endDate={timePeriod?.endDate}
        date={date}
        disabledDate={getDisabledDate()}
      />
    </>
  );
};

export default EmployeesScheduleManagement;
