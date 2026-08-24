import dayjs from 'dayjs';
import { CALENDAR_FORMAT, timeSpanString } from '../../../../utils/constants';
import { IScheduleByDate, IUpdateByDateRequest } from '../../../../store/reducers/schedules/types';
import { TFilters } from '../types';
import { compareName } from './utils';
import { IHOODataForm } from '../../../../store/reducers/serviceCenters/types';
import { TParsableDate } from '../../../../types/types';

export const filterScheduleByFilters = (
  sorted: IScheduleByDate[],
  filters: TFilters
): IScheduleByDate[] => {
  const filteredByNameAndRole = sorted.filter(el => {
    return (
      el.employeeName.toLowerCase().includes(filters.name.trim().toLowerCase()) &&
      el.role.toLowerCase().startsWith(filters.role.trim().toLowerCase())
    );
  });

  return filteredByNameAndRole.filter(el =>
    filters.serviceBook
      ? el.serviceBooks.some(book =>
          book.serviceBookId
            ? book.serviceBookId === filters.serviceBookId
            : book.serviceBook === filters.serviceBook
        )
      : true
  );
};

export const toggleScheduleByDateItem = (
  scheduleItems: IScheduleByDate[],
  id: number,
  isOnSchedule: boolean
): IScheduleByDate[] => {
  const itemToUpdate = scheduleItems.find(item => item.id === id);
  if (!itemToUpdate) {
    return scheduleItems;
  }

  const updated = { ...itemToUpdate, isOnSchedule };
  const filtered = scheduleItems.filter(item => item.id !== id);
  return [...filtered, updated].sort(compareName);
};

export const updateScheduleTimeByDateItem = (
  scheduleItems: IScheduleByDate[],
  id: number,
  field: 'startAt' | 'finishAt',
  value: string
): IScheduleByDate[] => {
  const itemToUpdate = scheduleItems.find(item => item.id === id);
  if (!itemToUpdate) {
    return scheduleItems;
  }

  const updated = { ...itemToUpdate, [field]: value };
  const filtered = scheduleItems.filter(item => item.id !== id);
  return [...filtered, updated].sort(compareName);
};

export const validateScheduleByDate = (
  currentSchedule: IScheduleByDate[],
  schedule: IHOODataForm | undefined,
  showError: (message: string) => void
): boolean => {
  const enabledRows = currentSchedule.filter(item => item.isOnSchedule);

  if (!enabledRows.every(item => item.finishAt && item.startAt)) {
    showError('Schedule for Employee that is "On Schedule" must not be empty');
    return false;
  }

  if (
    !enabledRows.every(item =>
      dayjs(item.finishAt, timeSpanString).isAfter(dayjs(item.startAt, timeSpanString), 'minute')
    )
  ) {
    showError('"End" value must be later than "Start"');
    return false;
  }

  if (
    !enabledRows.every(item =>
      dayjs(item.finishAt, timeSpanString).isSameOrBefore(
        dayjs(schedule?.to, timeSpanString),
        'minute'
      )
    ) ||
    !enabledRows.every(item =>
      dayjs(item.finishAt, timeSpanString).isSameOrAfter(
        dayjs(schedule?.from, timeSpanString),
        'minute'
      )
    )
  ) {
    showError('"End" value must be inside of the Hours Of Operations');
    return false;
  }

  if (
    !enabledRows.every(item =>
      dayjs(item.startAt, timeSpanString).isSameOrAfter(
        dayjs(schedule?.from, timeSpanString),
        'minute'
      )
    ) ||
    !enabledRows.every(item =>
      dayjs(item.startAt, timeSpanString).isSameOrBefore(
        dayjs(schedule?.to, timeSpanString),
        'minute'
      )
    )
  ) {
    showError('"Start" value must be inside of the Hours Of Operations');
    return false;
  }

  return true;
};

type TPrepareScheduleUpdatePayloadParams = {
  date: TParsableDate;
  startDate: TParsableDate;
  endDate: TParsableDate;
  serviceCenterId: number;
  currentSchedule: IScheduleByDate[];
  sorted: IScheduleByDate[];
};

type TPreparedScheduleUpdatePayload = {
  data: IUpdateByDateRequest;
  start: string;
  end: string;
};

const mapScheduleRow = ({ isOnSchedule, employeeId, startAt, finishAt }: IScheduleByDate) => ({
  isOnSchedule,
  employeeId,
  startAt,
  finishAt,
});

export const prepareScheduleUpdatePayload = ({
  date,
  startDate,
  endDate,
  serviceCenterId,
  currentSchedule,
  sorted,
}: TPrepareScheduleUpdatePayloadParams): TPreparedScheduleUpdatePayload => {
  const utcOffset = dayjs().utcOffset();
  const start = dayjs(startDate).startOf('day').add(utcOffset, 'minute').format(CALENDAR_FORMAT);
  const end = dayjs(endDate).endOf('day').subtract(utcOffset, 'minute').format(CALENDAR_FORMAT);

  const ids = currentSchedule.map(el => el.id);
  const restRows = sorted.filter(el => !ids.includes(el.id));

  const data: IUpdateByDateRequest = {
    date: dayjs(date).format(CALENDAR_FORMAT),
    serviceCenterId,
    isSetForWeek: false,
    employeeScheduledHours: [
      ...restRows.map(mapScheduleRow),
      ...currentSchedule.map(mapScheduleRow),
    ],
  };

  return { data, start, end };
};
