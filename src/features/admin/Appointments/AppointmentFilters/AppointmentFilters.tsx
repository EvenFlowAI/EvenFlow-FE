import React, { useEffect, useMemo, useState } from 'react';
import { Paper } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  loadSchedulerList,
  loadServiceBookList,
  loadServiceConsultants,
  setAppointmentsLoading,
} from '../../../../store/reducers/appointments/actions';
import { RootState } from '../../../../store/rootReducer';
import {
  TScheduler,
  TServiceBook,
  TServiceConsultant,
} from '../../../../store/reducers/appointments/types';
import { useSCs } from '../../../../hooks/useSCs/useSCs';
import { EReportingStatus } from '../../../../api/types';
import { TOption, TParsableDate } from '../../../../types/types';
import dayjs from 'dayjs';
import { statusOptions } from './constants';
import { TAppointmentFilterProps } from './types';
import { useCurrentUser } from '../../../../hooks/useCurrentUser/useCurrentUser';
import { EDate } from '../types';
import { DateRangeTypeSelector } from './DateRangeTypeSelector';
import { AppointmentFiltersFields } from './AppointmentFiltersFields';

export const AppointmentFilters: React.FC<TAppointmentFilterProps> = ({
  status,
  dateFrom,
  dateTo,
  setFilters,
  scheduler,
  serviceBook,
  advisor,
  technician,
  dateRangeType,
}) => {
  const { schedulerList, serviceBookList, isLoading, serviceAdvisors, technicians } = useSelector(
    (state: RootState) => state.appointments
  );
  const [isOpenFrom, setOpenFrom] = useState<boolean>(false);
  const [isOpenTo, setOpenTo] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<TOption[]>([]);
  const { selectedSC } = useSCs();
  const currentUser = useCurrentUser();
  const dispatch = useDispatch();
  const rangeIsWrong = useMemo(() => {
    return (
      dateTo && dateFrom && Math.round(dayjs(dateTo).diff(dateFrom) / (1000 * 60 * 60 * 24)) > 90
    );
  }, [dateTo, dateFrom]);

  useEffect(() => {
    if (selectedSC) {
      dispatch(loadServiceBookList(selectedSC.id));
      dispatch(loadSchedulerList());
      dispatch(loadServiceConsultants(selectedSC.id));
    }
  }, [selectedSC]);

  useEffect(() => {
    if (currentUser) {
      if (currentUser?.role === 'Advisor' && serviceAdvisors.length) {
        const currentAdvisor = serviceAdvisors.find(
          el => el.dmsId.toString() === currentUser.dmsId
        );
        if (currentAdvisor) {
          dispatch(setAppointmentsLoading(true));
          setFilters(prev => ({ ...prev, advisor: currentAdvisor, initialFiltersSet: true }));
        } else {
          dispatch(setAppointmentsLoading(true));
          setFilters(prev => ({ ...prev, initialFiltersSet: true }));
        }
      } else if (currentUser?.role === 'Technician' && technicians.length) {
        const currentTechnician = technicians.find(el => el.dmsId.toString() === currentUser.dmsId);
        if (currentTechnician) {
          dispatch(setAppointmentsLoading(true));
          setFilters(prev => ({
            ...prev,
            technician: currentTechnician,
            initialFiltersSet: true,
          }));
        } else {
          dispatch(setAppointmentsLoading(true));
          setFilters(prev => ({ ...prev, initialFiltersSet: true }));
        }
      } else {
        setFilters(prev => ({ ...prev, initialFiltersSet: true }));
      }
    }
  }, [currentUser, serviceAdvisors, technicians]);

  useEffect(() => {
    setSelectedStatus(statusOptions.filter(el => status.includes(+el.value)));
  }, [status]);

  const handleOpenFrom = (s: boolean) => () => {
    setOpenFrom(s);
  };

  const handleOpenTo = (s: boolean) => () => {
    setOpenTo(s);
  };

  const handleDateChange = (field: 'dateFrom' | 'dateTo') => (date: TParsableDate) => {
    setFilters(prev => {
      if (field === 'dateFrom' && (dayjs(date).isAfter(prev.dateTo) || !prev.dateTo)) {
        return {
          ...prev,
          [field]: dayjs(date),
          dateTo: dayjs(date).add(1, 'month'),
          pageData: { ...prev.pageData, pageIndex: 0 },
        };
      } else if (field === 'dateTo' && (dayjs(date).isBefore(prev.dateFrom) || !prev.dateFrom)) {
        return {
          ...prev,
          [field]: dayjs(date),
          dateFrom: dayjs(date).subtract(1, 'month'),
          pageData: { ...prev.pageData, pageIndex: 0 },
        };
      } else {
        return { ...prev, [field]: dayjs(date), pageData: { ...prev.pageData, pageIndex: 0 } };
      }
    });
  };

  const handleClear = (e: React.MouseEvent<HTMLElement>, field: 'dateFrom' | 'dateTo') => {
    e.stopPropagation();
    setFilters(prev => {
      return { ...prev, [field]: null, pageData: { ...prev.pageData, pageIndex: 0 } };
    });
  };

  const onSchedulerChange = (e: React.SyntheticEvent, value: TScheduler | null) => {
    setFilters(prev => ({
      ...prev,
      scheduler: value,
      pageData: { ...prev.pageData, pageIndex: 0 },
    }));
  };

  const onServiceBookChange = (e: React.SyntheticEvent, value: TServiceBook | null) => {
    setFilters(prev => ({
      ...prev,
      serviceBook: value,
      pageData: { ...prev.pageData, pageIndex: 0 },
    }));
  };

  const onStatusChange = (e: React.SyntheticEvent, value: TOption[]) => {
    setFilters(prev => ({
      ...prev,
      reportingStatus: value.map(el => +el.value as EReportingStatus),
      pageData: { ...prev.pageData, pageIndex: 0 },
    }));
  };

  const onAdvisorChange = (e: React.SyntheticEvent, value: TServiceConsultant | null) => {
    setFilters(prev => ({ ...prev, advisor: value, pageData: { ...prev.pageData, pageIndex: 0 } }));
  };

  const onTechnicianChange = (e: React.SyntheticEvent, value: TServiceConsultant | null) => {
    setFilters(prev => ({
      ...prev,
      technician: value,
      pageData: { ...prev.pageData, pageIndex: 0 },
    }));
  };

  const handleType = (e: React.ChangeEvent<HTMLInputElement>, value: string) => {
    setFilters(prev => ({
      ...prev,
      dateRangeFilterBy: value === 'AppointmentDate' ? EDate.AppointmentDate : EDate.CreatedDate,
      pageData: { ...prev.pageData, pageIndex: 0 },
    }));
  };

  return (
    <Paper
      variant="outlined"
      style={{
        borderRadius: 0,
        marginBottom: 18,
        padding: 18,
        width: '100%',
      }}
    >
      <DateRangeTypeSelector dateRangeType={dateRangeType} onChange={handleType} />
      <AppointmentFiltersFields
        isLoading={isLoading}
        dateFrom={dateFrom}
        dateTo={dateTo}
        isOpenFrom={isOpenFrom}
        isOpenTo={isOpenTo}
        rangeIsWrong={!!rangeIsWrong}
        selectedStatus={selectedStatus}
        advisor={advisor}
        technician={technician}
        scheduler={scheduler}
        serviceBook={serviceBook}
        serviceAdvisors={serviceAdvisors}
        technicians={technicians}
        schedulerList={schedulerList}
        serviceBookList={serviceBookList}
        onOpenFrom={handleOpenFrom(true)}
        onCloseFrom={handleOpenFrom(false)}
        onOpenTo={handleOpenTo(true)}
        onCloseTo={handleOpenTo(false)}
        onClear={handleClear}
        onDateFromChange={handleDateChange('dateFrom')}
        onDateToChange={handleDateChange('dateTo')}
        onAdvisorChange={onAdvisorChange}
        onTechnicianChange={onTechnicianChange}
        onSchedulerChange={onSchedulerChange}
        onServiceBookChange={onServiceBookChange}
        onStatusChange={onStatusChange}
      />
    </Paper>
  );
};
