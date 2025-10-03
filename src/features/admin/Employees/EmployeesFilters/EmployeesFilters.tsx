import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import { TextField } from '../../../../components/formControls/TextFieldStyled/TextField';
import {
  setEmployeeFilters,
  changePageData,
  setEmplSearch,
} from '../../../../store/reducers/employees/actions';
import { FiltersWrapper } from './styles';
import { usePagination } from '../../../../hooks/usePaginations/usePaginations';
import { useCurrentUser } from '../../../../hooks/useCurrentUser/useCurrentUser';
import { SearchDB } from '../../../../components/formControls/SearchDebounced/SearchDB';
import { CreateEmployee } from '../../../../components/modals/admin/CreateEmployee/CreateEmployee';
import { useModal } from '../../../../hooks/useModal/useModal';
import { useLabelStyles } from '../../../../hooks/styling/useLabelStyles';
import { EmptyMenuItem } from '../../Appointments/AppointmentFilters/styles';
import { availableUserRoles } from '../../../../utils/constants';
import { superRoles } from '../../../../components/modals/admin/CreateEmployee/constants';
import { Roles } from '../../../../types/types';
import { TRole } from '../../../../store/reducers/users/types';

const roles = availableUserRoles.exceptOf(superRoles);
const widerRoles: TRole[] = [Roles.Advisor, Roles.DealerOwner];

const EmployeesFilters = () => {
  const { fullSCList } = useSelector((state: RootState) => state.serviceCenters);
  const { filters, searchTerm } = useSelector((state: RootState) => state.employees);

  const [selectedRole, setSelectedRole] = useState<string>('');
  const currentUser = useCurrentUser();
  const dispatch = useDispatch();
  const { classes } = useLabelStyles();
  const { isOpen, onClose, onOpen } = useModal();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('mdl'));

  const { changePage } = usePagination((s: RootState) => s.employees.pageData, changePageData);

  useEffect(() => {
    setSelectedRole(filters.role ?? '');
  }, [filters]);

  const handleSelectRole = (e: SelectChangeEvent<string>) => {
    dispatch(setEmployeeFilters({ role: e.target.value }));
    changePage(null, 0);
  };

  const handleSelectCenter = (e: SelectChangeEvent<number>) => {
    const center = fullSCList.find(el => el.id === e.target.value);
    if (center) {
      dispatch(setEmployeeFilters({ serviceCenterId: center.id }));
    } else {
      dispatch(setEmployeeFilters({ serviceCenterId: null }));
    }
    changePage(null, 0);
  };

  const handleSearch = useCallback(
    (s: string) => {
      dispatch(setEmplSearch(s));
    },
    [dispatch]
  );

  return (
    <FiltersWrapper>
      {currentUser && widerRoles.includes(currentUser.role) ? (
        <div>
          <div className={classes.label}>Service Center</div>
          <Select
            fullWidth
            displayEmpty
            style={{ color: filters.serviceCenterId ? 'inherit' : '#858585' }}
            onChange={handleSelectCenter}
            value={filters.serviceCenterId ?? ''}
            input={<TextField />}
          >
            <EmptyMenuItem value="">Not selected</EmptyMenuItem>
            {fullSCList.map(serviceCenter => {
              return (
                <MenuItem key={serviceCenter.name} value={serviceCenter.id}>
                  {serviceCenter.name}
                </MenuItem>
              );
            })}
          </Select>
        </div>
      ) : (
        <div />
      )}

      <div style={currentUser && !widerRoles.includes(currentUser?.role) ? { width: '45%' } : {}}>
        <div className={classes.label}>Role</div>
        <Select
          fullWidth
          displayEmpty
          onChange={handleSelectRole}
          style={{ color: selectedRole ? 'inherit' : '#858585' }}
          value={selectedRole}
          input={<TextField placeholder={'Not selected'} />}
        >
          <EmptyMenuItem value="">Not selected</EmptyMenuItem>
          {roles.map(role => {
            return (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            );
          })}
        </Select>
      </div>

      {currentUser && !currentUser.isSuperUser ? (
        <>
          <SearchDB
            onSearch={handleSearch}
            search={searchTerm}
            style={{
              marginRight: isMobile ? 0 : 20,
              marginTop: isMobile ? 14 : 0,
              marginBottom: isMobile ? 16 : 0,
            }}
          />
          <Button onClick={onOpen} variant="contained" color="primary">
            Add Employee
          </Button>
        </>
      ) : null}
      <CreateEmployee open={isOpen} onClose={onClose} />
    </FiltersWrapper>
  );
};

export default EmployeesFilters;
