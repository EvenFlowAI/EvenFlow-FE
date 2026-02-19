import React, { useEffect, useState } from 'react';
import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { TextField } from '../../../components/formControls/TextFieldStyled/TextField';
import { EmptyMenuItem } from '../../../features/admin/Appointments/AppointmentFilters/styles';
import { IDealership, IServiceCenter, IUserAccount, UserStatus } from './types';
import { useLabelStyles } from '../../../hooks/styling/useLabelStyles';
import { Roles } from '../../../types/types';
import { Search } from '@mui/icons-material';

interface FiltersProps {
  originalData: IUserAccount[];
  setData: React.Dispatch<React.SetStateAction<IUserAccount[]>>;
}

export interface IUserFilters {
  role?: Roles;
  dealershipId?: string;
  serviceCenterId?: string;
  status?: UserStatus | null;
  searchTerm?: string;
}

const Filters = ({ setData, originalData }: FiltersProps) => {
  const [dealerships, setDealerships] = useState<IDealership[]>([]);
  const [serviceCenters, setServiceCenters] = useState<IServiceCenter[]>([]);
  const [filters, setFilters] = useState<IUserFilters>({});
  const { classes } = useLabelStyles();

  useEffect(() => {
    if (originalData && Array.isArray(originalData)) {
      const allDealerships = originalData.flatMap(user => user.dealerships);
      setDealerships(allDealerships);

      const allServiceCenters = originalData.flatMap(user =>
        user.dealerships.flatMap(d => d.serviceCenters ?? [])
      );
      setServiceCenters(allServiceCenters);
    }
  }, [originalData]);

  const applyFilters = (newFilters: IUserFilters) => {
    let filtered = [...originalData];

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
      filtered = filtered.filter(user => user.fullName.toLowerCase().includes(term));
    }

    setData(filtered);
  };

  const handleSelectDealership = (event: SelectChangeEvent) => {
    const selectedId = event.target.value;
    const newFilters = {
      ...filters,
      dealershipId: selectedId === '' ? undefined : selectedId,
    };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const handleSelectServiceCenter = (event: SelectChangeEvent) => {
    const selectedId = event.target.value;
    const newFilters = {
      ...filters,
      serviceCenterId: selectedId === '' ? undefined : selectedId,
    };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const handleSelectRole = (event: SelectChangeEvent) => {
    const selectedValue = event.target.value; // завжди string
    const newFilters = {
      ...filters,
      role: selectedValue === '' ? undefined : (selectedValue as Roles),
    };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const handleSelectStatus = (event: SelectChangeEvent) => {
    const selectedStatus =
      event.target.value === '' ? null : (Number(event.target.value) as UserStatus);
    const newFilters = {
      ...filters,
      status: selectedStatus,
    };
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
    <div
      style={{
        display: 'flex',
        gap: 12,
        marginBottom: 24,
        flexWrap: 'wrap',
        alignItems: 'flex-end',
      }}
    >
      <div style={{ width: 180 }}>
        <div className={classes.label}>Dealership Group</div>
        <Select
          fullWidth
          displayEmpty
          style={{ color: filters.dealershipId ? 'inherit' : '#858585' }}
          onChange={handleSelectDealership}
          value={filters.dealershipId ?? ''}
          input={<TextField />}
        >
          <EmptyMenuItem value="">Not selected</EmptyMenuItem>
          {dealerships.map(el => (
            <MenuItem key={el.id} value={String(el.id)}>
              {el.name}
            </MenuItem>
          ))}
        </Select>
      </div>

      <div style={{ width: 180 }}>
        <div className={classes.label}>Service Center</div>
        <Select
          fullWidth
          displayEmpty
          style={{ color: filters.serviceCenterId ? 'inherit' : '#858585' }}
          onChange={handleSelectServiceCenter}
          value={filters.serviceCenterId ?? ''}
          input={<TextField />}
        >
          <EmptyMenuItem value="">Not selected</EmptyMenuItem>
          {serviceCenters.map(sc => (
            <MenuItem key={sc.id} value={String(sc.id)}>
              {sc.name}
            </MenuItem>
          ))}
        </Select>
      </div>

      <div style={{ width: 220 }}>
        <div className={classes.label}>Role</div>
        <Select
          fullWidth
          displayEmpty
          style={{ color: filters.role ? 'inherit' : '#858585' }}
          onChange={handleSelectRole}
          value={filters.role ?? ''}
          input={<TextField />}
        >
          <EmptyMenuItem value="">Not selected</EmptyMenuItem>
          {Object.values(Roles).map(role => (
            <MenuItem key={role} value={role}>
              {role}
            </MenuItem>
          ))}
        </Select>
      </div>

      <div style={{ width: 180 }}>
        <div className={classes.label}>Status</div>
        <Select
          fullWidth
          displayEmpty
          style={{
            color: filters.status !== undefined && filters.status !== null ? 'inherit' : '#858585',
          }}
          onChange={handleSelectStatus}
          value={
            filters.status !== undefined && filters.status !== null ? String(filters.status) : ''
          }
          input={<TextField />}
        >
          <EmptyMenuItem value="">Not selected</EmptyMenuItem>
          <MenuItem value={UserStatus.Active}>Active</MenuItem>
          <MenuItem value={UserStatus.Inactive}>Inactive</MenuItem>
          <MenuItem value={UserStatus.Removed}>Removed</MenuItem>
        </Select>
      </div>

      <TextField
        style={{ height: 43, flexGrow: 1 }}
        placeholder="Search..."
        endAdornment={<Search />}
        value={filters.searchTerm}
        onChange={handleSearchChange}
      />
    </div>
  );
};

export default Filters;
