import React, { useEffect, useMemo, useState } from 'react';
import { DialogProps } from '../../../../components/modals/BaseModal/types';
import { TableRowDataType, TParsableDate } from '../../../../types/types';
import {
  BaseModal,
  DialogContent,
  DialogTitle,
} from '../../../../components/modals/BaseModal/BaseModal';
import dayjs from 'dayjs';
import { useMediaQuery, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import { IScheduleByDate } from '../../../../store/reducers/schedules/types';
import { loadHoursOfOperations } from '../../../../store/reducers/appointmentFrameReducer/actions';
import { useSCs } from '../../../../hooks/useSCs/useSCs';
import { Table } from '../../../../components/tables/Table/Table';
import { useActionButtonsStyles } from '../../../../hooks/styling/useActionButtonsStyles';
import { LoadingButton } from '../../../../components/buttons/LoadingButton/LoadingButton';
import { updateScheduleByDate } from '../../../../store/reducers/schedules/actions';
import { useException } from '../../../../hooks/useException/useException';
import { Loading } from '../../../../components/wrappers/Loading/Loading';
import EmployeeScheduleFilters from '../EmployeeScheduleFilters/EmployeeScheduleFilters';
import { TFilters } from '../types';
import { compareName } from './utils';
import { initialFilters } from './constants';
import EmployeeScheduleTableMobile from '../EmployeeScheduleMobile/EmployeeScheduleTableMobile';
import { OneRowButtonsWrapper } from '../../../../components/styled/OneRowButtonsWrapper';
import {
  filterScheduleByFilters,
  prepareScheduleUpdatePayload,
  toggleScheduleByDateItem,
  updateScheduleTimeByDateItem,
  validateScheduleByDate,
} from './helpers';
import { getEmployeeScheduleRowData } from './getEmployeeScheduleRowData';

type TProps = DialogProps & {
  date: TParsableDate;
  disabledDate: boolean;
  startDate?: TParsableDate;
  endDate?: TParsableDate;
};

const EmployeeScheduleModal: React.FC<TProps> = ({
  date,
  open,
  onClose,
  disabledDate,
  startDate,
  endDate,
}) => {
  const { hoursOfOperations } = useSelector((state: RootState) => state.appointmentFrame);
  const { scheduleByDate, employeesLoading } = useSelector(
    (state: RootState) => state.employeesSchedule
  );
  const { loading } = useSelector((state: RootState) => state.employees);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [formIsChecked, setFormChecked] = useState<boolean>(false);
  const [currentSchedule, setCurrentSchedule] = useState<IScheduleByDate[]>([]);
  const [filters, setFilters] = useState<TFilters>(initialFilters);
  const { selectedSC } = useSCs();
  const dispatch = useDispatch();
  const showError = useException();
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('xl'));
  const isMobile = useMediaQuery(theme.breakpoints.down('mdl'));
  const { classes } = useActionButtonsStyles();

  const schedule = useMemo(() => {
    return hoursOfOperations.find(el => el.dayOfWeek === dayjs(date).day());
  }, [hoursOfOperations, date]);

  const sorted = useMemo(() => [...scheduleByDate].sort(compareName), [scheduleByDate]);

  useEffect(() => {
    if (selectedSC) dispatch(loadHoursOfOperations(selectedSC.id));
  }, [selectedSC]);

  useEffect(() => {
    setCurrentSchedule(sorted);
  }, [sorted]);

  useEffect(() => {
    setLoading(true);
    setCurrentSchedule(filterScheduleByFilters(sorted, filters));
    setLoading(false);
  }, [filters, sorted]);

  const onCancel = () => {
    onClose();
    setLoading(true);
    setFormChecked(false);
    setFilters(initialFilters);
    setLoading(false);
  };

  const handleSwitch =
    (el: IScheduleByDate) => (_e: React.ChangeEvent<HTMLInputElement>, value: boolean) => {
      setFormChecked(false);
      setCurrentSchedule(prev => toggleScheduleByDateItem(prev, el.id, value));
    };

  const onTimeChange = (el: IScheduleByDate, field: 'startAt' | 'finishAt', value: string) => {
    setFormChecked(false);
    setCurrentSchedule(prev => updateScheduleTimeByDateItem(prev, el.id, field, value));
  };

  const rowData: TableRowDataType<IScheduleByDate>[] = useMemo(
    () =>
      getEmployeeScheduleRowData({
        isTablet,
        disabledDate,
        schedule,
        formIsChecked,
        handleSwitch,
        onTimeChange,
      }),
    [isTablet, disabledDate, schedule, formIsChecked]
  );

  const onError = (err: string) => {
    setLoading(false);
    showError(err);
  };

  const onSave = () => {
    setFormChecked(true);
    setLoading(true);
    if (!validateScheduleByDate(currentSchedule, schedule, showError)) {
      setLoading(false);
      return;
    }

    if (!selectedSC || !startDate || !endDate) {
      setLoading(false);
      return;
    }

    const { data, start, end } = prepareScheduleUpdatePayload({
      date,
      startDate,
      endDate,
      serviceCenterId: selectedSC.id,
      currentSchedule,
      sorted,
    });

    dispatch(updateScheduleByDate(data, start, end, onCancel, onError));
  };

  return (
    <BaseModal open={open} onClose={onCancel} width={isTablet ? 987 : 1050}>
      <DialogTitle onClose={onCancel}>
        Employee Schedule: {isMobile ? <br /> : null}
        {dayjs(date).format('dddd, MMMM D, YYYY')}
      </DialogTitle>
      <DialogContent style={{ padding: isMobile ? 16 : '12px 32px' }}>
        {loading || isLoading || employeesLoading ? (
          <Loading />
        ) : (
          <>
            <EmployeeScheduleFilters
              isLoading={employeesLoading || loading || isLoading}
              filters={filters}
              setFilters={setFilters}
            />
            {isMobile ? (
              <EmployeeScheduleTableMobile
                currentSchedule={currentSchedule}
                disabledDate={disabledDate}
                handleSwitch={handleSwitch}
                onTimeChange={onTimeChange}
                schedule={schedule}
                formIsChecked={formIsChecked}
              />
            ) : (
              <Table<IScheduleByDate>
                data={currentSchedule}
                verticalAlign="top"
                index={'id'}
                isLoading={employeesLoading || loading || isLoading}
                hidePagination
                rowData={rowData}
              />
            )}
          </>
        )}
      </DialogContent>
      <OneRowButtonsWrapper>
        <LoadingButton
          loading={employeesLoading || loading}
          onClick={onCancel}
          variant="text"
          style={{ marginRight: 20 }}
          color="info"
        >
          Close
        </LoadingButton>
        <LoadingButton
          loading={employeesLoading || loading}
          onClick={onSave}
          disabled={disabledDate}
          className={classes.saveButton}
        >
          Save
        </LoadingButton>
      </OneRowButtonsWrapper>
    </BaseModal>
  );
};

export default EmployeeScheduleModal;
