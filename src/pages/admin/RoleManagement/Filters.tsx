import React, { useEffect, useState } from 'react';
import { Autocomplete } from '@mui/material';
import { TextField } from '../../../components/formControls/TextFieldStyled/TextField';
import { IUserAccount, statusLabels, UserStatus } from './types';
import { useLabelStyles } from '../../../hooks/styling/useLabelStyles';
import { CleanestRoles, Roles } from '../../../types/types';
import { Search } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/rootReducer';
import { useStyles } from './styles';
import { AddUserButtonWrapper } from '../EmployeesAddDelete/AddUserButtonWrapper';
import { autocompleteRender } from '../../../utils/autocompleteRenders';

interface FiltersProps {
  setData: React.Dispatch<React.SetStateAction<IUserAccount[]>>;
  isAdminPanel?: boolean;
  handleAddUserAccount?: (isEdit: boolean) => void;
  setPageData: React.Dispatch<React.SetStateAction<{ pageIndex: number; pageSize: number }>>;
}

export interface IUserFilters {
  role?: CleanestRoles;
  dealershipId?: string;
  serviceCenterId?: string;
  status?: UserStatus | null;
  searchTerm?: string;
}

const Filters = ({ setData, isAdminPanel, handleAddUserAccount, setPageData }: FiltersProps) => {
  const { dealershipList } = useSelector((state: RootState) => state.dealershipGroups);
  const { serviceCenters } = useSelector(({ serviceCenters }: RootState) => serviceCenters);
  const [filters, setFilters] = useState<IUserFilters>({});
  const { classes } = useLabelStyles();
  const { classes: componentClasses } = useStyles();
  const { users } = useSelector((state: RootState) => state.roleManagement);

  useEffect(() => {
    if (users && Array.isArray(users)) {
      applyFilters(filters);
    }
  }, [users]);

  const applyFilters = (newFilters: IUserFilters) => {
    let filtered = [...users];

    if (newFilters.dealershipId) {
      filtered = filtered.filter(user =>
        user.dealerships.some(d => String(d.id) === newFilters.dealershipId)
      );
    }

    if (newFilters.serviceCenterId) {
      filtered = filtered.filter(user =>
        user.dealerships.some(d =>
          d.serviceCenters?.some(sc => String(sc.id) === newFilters.serviceCenterId)
        )
      );
    }

    if (newFilters.role) {
      filtered = filtered.filter(user => user.role === newFilters.role);
    }

    if (newFilters.status !== undefined && newFilters.status !== null) {
      filtered = filtered.filter(user => user.status === newFilters.status);
    }

    if (newFilters.searchTerm && newFilters.searchTerm.trim() !== '') {
      const term = newFilters.searchTerm.toLowerCase();
      filtered = filtered.filter(u => u.fullName.toLowerCase().includes(term.toLowerCase()));
    }

    filtered = filtered.filter(u => u.role !== Roles.DealerOwner);

    setData(filtered);
    setPageData({ pageIndex: 0, pageSize: 25 });
  };

  const handleSelectDealership = (e: React.SyntheticEvent, value: string) => {
    const selectedId = value;
    const newFilters = {
      ...filters,
      dealershipId: selectedId === '' ? undefined : selectedId,
    };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const handleSelectServiceCenter = (e: React.SyntheticEvent, value: string) => {
    const selectedId = value;
    const newFilters = {
      ...filters,
      serviceCenterId: selectedId === '' ? undefined : selectedId,
    };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const handleSelectRole = (e: React.SyntheticEvent, value: string) => {
    const selectedValue = value;
    const newFilters = {
      ...filters,
      role: selectedValue === '' ? undefined : (selectedValue as CleanestRoles),
    };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const handleSelectStatus = (e: React.SyntheticEvent, newValue: UserStatus | null) => {
    const selectedStatus = newValue ?? null;
    const newFilters = { ...filters, status: selectedStatus };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = {
      ...filters,
      searchTerm: e.target.value,
    };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  return (
    <div className={componentClasses.filtersWrapper}>
      {!isAdminPanel && (
        <div className={componentClasses.filter} style={{ width: 240 }}>
          <div className={classes.label}>Dealership Group</div>
          <Autocomplete
            options={dealershipList}
            getOptionLabel={option => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={dealershipList.find(d => String(d.id) === filters.dealershipId) ?? null}
            onChange={(event, newValue) => {
              handleSelectDealership(event, newValue ? String(newValue.id) : '');
            }}
            renderInput={autocompleteRender({
              label: '',
              fullWidth: true,
              placeholder: 'Not selected',
            })}
          />
        </div>
      )}

      <div className={componentClasses.filter} style={{ width: 240 }}>
        <div className={classes.label}>Service Center</div>
        <Autocomplete
          options={serviceCenters}
          getOptionLabel={option => option.name}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          value={serviceCenters.find(sc => String(sc.id) === filters.serviceCenterId) ?? null}
          onChange={(event, newValue) => {
            handleSelectServiceCenter(event, newValue ? String(newValue.id) : '');
          }}
          renderInput={autocompleteRender({
            label: '',
            fullWidth: true,
            placeholder: 'Not selected',
          })}
        />
      </div>

      <div style={{ width: isAdminPanel ? 220 : 180 }}>
        <div className={classes.label}>Role</div>
        <Autocomplete
          options={Object.values(CleanestRoles)}
          getOptionLabel={option => option}
          isOptionEqualToValue={(option, value) => option === value}
          value={filters.role}
          onChange={(event, newValue) => {
            handleSelectRole(event, newValue ? newValue : '');
          }}
          renderInput={autocompleteRender({
            label: '',
            fullWidth: true,
            placeholder: 'Not selected',
          })}
        />
      </div>

      {!isAdminPanel && (
        <div className={componentClasses.filter} style={{ width: 180 }}>
          <div className={classes.label}>Status</div>
          <Autocomplete
            options={Object.values(UserStatus).filter(v => typeof v === 'number') as UserStatus[]}
            getOptionLabel={option => statusLabels[option]}
            isOptionEqualToValue={(option, value) => option === value}
            value={filters.status ?? null}
            onChange={(event, newValue) => handleSelectStatus(event, newValue)}
            renderInput={autocompleteRender({
              label: '',
              fullWidth: true,
              placeholder: 'Not selected',
            })}
          />
        </div>
      )}

      <TextField
        style={{ height: 43, flexGrow: 1 }}
        placeholder="Search..."
        endAdornment={<Search />}
        value={filters.searchTerm}
        onChange={handleSearchChange}
      />

      {handleAddUserAccount && (
        <AddUserButtonWrapper isAdminPanel handleAddUserAccount={handleAddUserAccount} />
      )}
    </div>
  );
};

export default Filters;
