import React, { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { Autocomplete, Grid } from '@mui/material';
import { autocompleteRender } from '../../../../utils/autocompleteRenders';
import { TFilters } from '../types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import { SearchDebounced } from '../../../../components/formControls/SearchDebounced/SearchDebounced';

type TProps = {
  isLoading: boolean;
  filters: TFilters;
  setFilters: Dispatch<SetStateAction<TFilters>>;
};

const EmployeeScheduleFilters: React.FC<TProps> = ({ isLoading, filters, setFilters }) => {
  const { scheduleByDate } = useSelector((state: RootState) => state.employeesSchedule);
  const [search, setSearch] = useState<string>('');

  const serviceBooksList = useMemo(() => {
    const list = scheduleByDate.flatMap(el => el.serviceBooks);

    const unique = new Map();

    list.forEach(book => {
      const key = book.serviceBookId ?? book.serviceBook;
      if (!unique.has(key)) {
        unique.set(key, {
          label: book.serviceBook,
          value: key,
        });
      }
    });

    return Array.from(unique.values());
  }, [scheduleByDate]);

  const rolesList = useMemo(
    () => Array.from(new Set(scheduleByDate.map(el => el.role))),
    [scheduleByDate]
  );

  const onServiceBookChange = (
    e: React.SyntheticEvent,
    value: {
      label: string | null;
      value: number | null;
    }
  ) => {
    setFilters(prev => ({
      ...prev,
      serviceBook: value.label ?? '',
      serviceBookId: value.value ?? 0,
    }));
  };

  const onRoleChange = (e: React.SyntheticEvent, value: string | null) => {
    setFilters(prev => ({ ...prev, role: value ?? '' }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const onSearch = () => setFilters(prev => ({ ...prev, name: search }));

  return (
    <Grid
      container
      spacing={2}
      justifyContent="space-between"
      alignItems="flex-start"
      marginBottom={2}
    >
      <Grid item xs={12} sm={4} key="service book">
        <Autocomplete
          renderInput={autocompleteRender({
            label: 'Service Book',
            placeholder: 'Not selected',
          })}
          fullWidth
          disabled={isLoading}
          onChange={(event, newValue) => {
            onServiceBookChange(event, newValue);
          }}
          value={filters.serviceBook}
          options={serviceBooksList}
        />
      </Grid>
      <Grid item xs={12} sm={4} key="role">
        <Autocomplete
          renderInput={autocompleteRender({
            label: 'Role',
            placeholder: 'Not selected',
          })}
          fullWidth
          disabled={isLoading}
          onChange={onRoleChange}
          value={filters.role}
          options={rolesList}
        />
      </Grid>
      <Grid item xs={12} sm={4} key="name">
        <SearchDebounced
          label="Name"
          fullWidth
          onSearch={onSearch}
          onChange={handleSearchChange}
          value={search}
          placeholder="Search..."
        />
      </Grid>
    </Grid>
  );
};

export default EmployeeScheduleFilters;
