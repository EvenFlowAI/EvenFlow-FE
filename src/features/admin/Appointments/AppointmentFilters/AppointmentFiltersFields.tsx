import React from 'react';
import { Autocomplete, Grid, IconButton } from '@mui/material';
import { Clear, DateRange } from '@mui/icons-material';
import dayjs from 'dayjs';
import { CustomDatePicker } from '../../../../components/pickers/CustomDatePicker/CustomDatePicker';
import {
  TScheduler,
  TServiceBook,
  TServiceConsultant,
} from '../../../../store/reducers/appointments/types';
import { TOption, TParsableDate } from '../../../../types/types';
import { autocompleteRender } from '../../../../utils/autocompleteRenders';
import { statusOptions } from './constants';
import { useAutocompleteClasses } from './styles';

type TProps = {
  isLoading: boolean;
  dateFrom: TParsableDate;
  dateTo: TParsableDate;
  isOpenFrom: boolean;
  isOpenTo: boolean;
  rangeIsWrong: boolean;
  selectedStatus: TOption[];
  advisor: TServiceConsultant | null;
  technician: TServiceConsultant | null;
  scheduler: TScheduler | null;
  serviceBook: TServiceBook | null;
  serviceAdvisors: TServiceConsultant[];
  technicians: TServiceConsultant[];
  schedulerList: TScheduler[];
  serviceBookList: TServiceBook[];
  onOpenFrom: () => void;
  onCloseFrom: () => void;
  onOpenTo: () => void;
  onCloseTo: () => void;
  onClear: (e: React.MouseEvent<HTMLElement>, field: 'dateFrom' | 'dateTo') => void;
  onDateFromChange: (date: TParsableDate) => void;
  onDateToChange: (date: TParsableDate) => void;
  onAdvisorChange: (e: React.SyntheticEvent, value: TServiceConsultant | null) => void;
  onTechnicianChange: (e: React.SyntheticEvent, value: TServiceConsultant | null) => void;
  onSchedulerChange: (e: React.SyntheticEvent, value: TScheduler | null) => void;
  onServiceBookChange: (e: React.SyntheticEvent, value: TServiceBook | null) => void;
  onStatusChange: (e: React.SyntheticEvent, value: TOption[]) => void;
};

export const AppointmentFiltersFields: React.FC<TProps> = ({
  isLoading,
  dateFrom,
  dateTo,
  isOpenFrom,
  isOpenTo,
  rangeIsWrong,
  selectedStatus,
  advisor,
  technician,
  scheduler,
  serviceBook,
  serviceAdvisors,
  technicians,
  schedulerList,
  serviceBookList,
  onOpenFrom,
  onCloseFrom,
  onOpenTo,
  onCloseTo,
  onClear,
  onDateFromChange,
  onDateToChange,
  onAdvisorChange,
  onTechnicianChange,
  onSchedulerChange,
  onServiceBookChange,
  onStatusChange,
}) => {
  const { classes: autocompleteClasses } = useAutocompleteClasses();

  return (
    <Grid container spacing={2} justifyContent="space-between" alignItems="flex-start">
      <Grid item xs={12} sm={3} key="datepickerFrom">
        <CustomDatePicker
          onOpen={onOpenFrom}
          onClose={onCloseFrom}
          open={isOpenFrom}
          format="MMMM Do"
          fullWidth
          maxDate={dateTo}
          required
          label="Date From"
          InputProps={{
            placeholder: 'Not selected',
            disabled: isLoading,
            fullWidth: true,
            error: !dateFrom || rangeIsWrong,
            endAdornment: dateFrom ? (
              <IconButton onClick={e => onClear(e, 'dateFrom')} size="large">
                <Clear />
              </IconButton>
            ) : (
              <DateRange
                cursor="pointer"
                htmlColor={!dateFrom || rangeIsWrong ? '#FF0000' : 'rgba(0, 0, 0, 0.54)'}
              />
            ),
          }}
          value={dateFrom}
          onAccept={onDateFromChange}
        />
      </Grid>
      <Grid item xs={12} sm={3} key="datepickerTo">
        <CustomDatePicker
          onOpen={onOpenTo}
          onClose={onCloseTo}
          open={isOpenTo}
          minDate={dateFrom}
          required
          format="MMMM Do"
          fullWidth
          shouldDisableDate={day => dayjs(day).isBefore(dateFrom)}
          label="Date To"
          InputProps={{
            placeholder: 'Not selected',
            disabled: isLoading,
            fullWidth: true,
            error: !dateTo || rangeIsWrong,
            endAdornment: dateTo ? (
              <IconButton onClick={e => onClear(e, 'dateTo')} size="large">
                <Clear />
              </IconButton>
            ) : (
              <DateRange
                cursor="pointer"
                htmlColor={!dateTo || rangeIsWrong ? '#FF0000' : 'rgba(0, 0, 0, 0.54)'}
              />
            ),
          }}
          value={dateTo}
          onAccept={onDateToChange}
        />
      </Grid>
      <Grid item xs={12} sm={3} key="service advisor">
        <Autocomplete
          renderInput={autocompleteRender({
            label: 'Service Advisor',
            placeholder: 'Not selected',
          })}
          disabled={isLoading}
          onChange={onAdvisorChange}
          value={advisor}
          getOptionLabel={o => (o.fullName ? `${o.fullName} - ${o.dmsId}` : o.dmsId)}
          isOptionEqualToValue={(o, v) => o.id === v.id}
          options={serviceAdvisors}
        />
      </Grid>
      <Grid item xs={12} sm={3} key="technician">
        <Autocomplete
          renderInput={autocompleteRender({
            label: 'Technician',
            placeholder: 'Not selected',
          })}
          disabled={isLoading}
          onChange={onTechnicianChange}
          value={technician}
          getOptionLabel={o => (o.fullName ? `${o.fullName} - ${o.dmsId}` : o.dmsId)}
          isOptionEqualToValue={(o, v) => o.id === v.id}
          options={technicians}
        />
      </Grid>
      <Grid item xs={12} sm={3} key="scheduler">
        <Autocomplete
          renderInput={autocompleteRender({
            label: 'Scheduler',
            placeholder: 'Not selected',
          })}
          disabled={isLoading}
          onChange={onSchedulerChange}
          value={scheduler}
          getOptionKey={o => (o.id ? o.id : o.fullName + new Date())}
          getOptionLabel={o => o.fullName}
          isOptionEqualToValue={(o, v) =>
            o.id && v.id ? o.id === v.id : o.fullName === v.fullName
          }
          options={[...schedulerList].sort((a, b) => a.fullName.localeCompare(b.fullName))}
        />
      </Grid>
      <Grid item xs={12} sm={3} key="serviceBook">
        <Autocomplete
          renderInput={autocompleteRender({
            label: 'Service Book',
            placeholder: 'Not selected',
          })}
          disabled={isLoading}
          fullWidth
          onChange={onServiceBookChange}
          value={serviceBook}
          getOptionLabel={o => o.name}
          isOptionEqualToValue={(o, v) => (o.id && v.id ? o.id === v.id : o.name === v.name)}
          options={[...serviceBookList].sort((a, b) => a.name.localeCompare(b.name))}
        />
      </Grid>
      <Grid item xs={12} sm={6} key="status">
        <Autocomplete
          renderInput={autocompleteRender({
            label: 'Appointment Status',
            placeholder: 'Not selected',
          })}
          multiple
          disableCloseOnSelect
          classes={autocompleteClasses}
          disabled={isLoading}
          onChange={onStatusChange}
          value={selectedStatus}
          getOptionLabel={o => o.name}
          isOptionEqualToValue={(o, v) => o.value === v.value}
          options={statusOptions}
        />
      </Grid>
    </Grid>
  );
};
