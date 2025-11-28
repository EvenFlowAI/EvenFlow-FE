import { EDate, TFilters } from './types';
import { IAppointment, reportingStatuses } from '../../../api/types';
import { TableRowDataType } from '../../../types/types';
import dayjs from 'dayjs';
import { time12HourFormat } from '../../../utils/constants';

export const initialOrder = {
  orderBy: 'date',
  isAscending: true,
};

export const initialPaging = { pageIndex: 0, pageSize: 10 };

export const initialFilters: TFilters = {
  searchTerm: '',
  serviceBook: null,
  scheduler: null,
  reportingStatus: [],
  dateFrom: dayjs().startOf('day'),
  dateTo: dayjs().add(1, 'month').endOf('day'),
  scId: null,
  pageData: initialPaging,
  advisor: null,
  technician: null,
  initialFiltersSet: false,
  dateRangeFilterBy: EDate.AppointmentDate,
};

export const AppointmentsColumns: TableRowDataType<IAppointment>[] = [
  {
    header: 'Date',
    required: true,
    val: el => (el.dateTime ? dayjs.utc(el.dateTime).format('MMMM D, YYYY') : ''),
    orderId: 'date',
    width: 150,
  },
  {
    header: 'Day',
    required: true,
    val: el => (el.dateTime ? dayjs.utc(el.dateTime).format('ddd') : ''),
  },
  {
    header: 'Time',
    required: true,
    val: el => (el.dateTime ? dayjs.utc(el.dateTime).format(time12HourFormat) : ''),
    width: 100,
  },
  {
    header: 'Customer Name',
    required: true,
    val: el => el.customerInformation?.fullName ?? 'DMS missing customer information',
    orderId: 'fullName',
  },
  {
    header: 'Vehicle',
    required: true,
    val: el => {
      const vehicleData = `${el.vehicle?.make ?? ''} ${el.vehicle?.model ?? ''} ${Boolean(el.vehicle?.year) ? el.vehicle?.year : ''}`;
      return el.vehicle?.make || el.vehicle?.model || Boolean(el.vehicle?.year)
        ? vehicleData
        : 'DMS missing vehicle data';
    },
  },
  { header: 'Service Advisor', val: el => el.advisor ?? '' },
  { header: 'Technician', val: el => el.technician ?? '' },
  { header: 'Service Book', val: el => el.serviceBook?.name ?? '' },
  { header: 'Scheduler', val: el => `${el.scheduler?.fullName ?? ''}` },
  {
    header: 'Appointment Status',
    required: true,
    val: el =>
      typeof el.reportingStatus !== 'undefined' && Number.isInteger(el.reportingStatus)
        ? reportingStatuses[el.reportingStatus]
        : '',
    orderId: 'reportingStatus',
  },
  {
    header: 'Created Date',
    val: el =>
      el.createdDateTime ? dayjs.utc(el.createdDateTime).format('ddd, MMMM D, YYYY') : '',
    orderId: 'requestDate',
  },
];
export const allColumns = AppointmentsColumns.map(el => el.header.toString());
export const requiredColumns = AppointmentsColumns.filter(el => el.required).map(el =>
  el.header.toString()
);
export const localStorageItemName = 'appointmentsColumns';
