import React, { useEffect, useMemo, useState } from 'react';
import { BaseModal, DialogActions, DialogContent, DialogTitle } from '../../BaseModal/BaseModal';
import { TUserAccountForm } from '../AddUserAccount/types';
import { Search } from '@mui/icons-material';
import { Button, Checkbox, Typography } from '@mui/material';
import { TextField } from '../../../formControls/TextFieldStyled/TextField';
import { LoadingButton } from '../../../buttons/LoadingButton/LoadingButton';
import { TOptionForUserAccountServiceCenters } from '../../../../types/types';
import { useDispatch } from 'react-redux';
import { IUserAccount } from '../../../../pages/admin/RoleManagement/types';
import { updateRoleManagementUser } from '../../../../store/reducers/users/actions';
import { useException } from '../../../../hooks/useException/useException';
import { setLoading as setTableLoading } from '../../../../store/reducers/roleManagement/actions';
import { Roles } from '../../../../types/types';
import { useStyles } from './styles';
import { ReactComponent as ShowMark } from '../../../../assets/img/ShowMark.svg';
import { ReactComponent as HideMark } from '../../../../assets/img/HideMark.svg';

enum ERROR_CODES {
  DATA_NOT_COMPLETE = 1,
}

interface RemoveAccessProps {
  isOpen: boolean;
  onClose: () => void;
  payload: TUserAccountForm | null;
}

const RemoveAccess = ({ isOpen, onClose, payload }: RemoveAccessProps) => {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const showError = useException();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedServiceCenterIds, setSelectedServiceCenterIds] = useState<number[]>([]);
  const [expandedDealershipIds, setExpandedDealershipIds] = useState<number[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setSelectedServiceCenterIds([]);
      setExpandedDealershipIds([]);
      setIsLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && payload) {
      setExpandedDealershipIds(payload.dealerships.map(dealership => dealership.value));
    }
  }, [isOpen, payload]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const groupedDealerships = useMemo(() => {
    if (!payload) return [];

    const term = searchTerm.trim().toLowerCase();

    return payload.dealerships
      .map(dealership => {
        const serviceCenters = payload.serviceCenters.filter(
          sc => sc.categoryId === dealership.value
        );

        if (!term) {
          return { dealership, serviceCenters };
        }

        const dealershipMatches = dealership.name.toLowerCase().includes(term);
        const filteredServiceCenters = dealershipMatches
          ? serviceCenters
          : serviceCenters.filter(sc => sc.name.toLowerCase().includes(term));

        return {
          dealership,
          serviceCenters: filteredServiceCenters,
        };
      })
      .filter(group => group.serviceCenters.length > 0);
  }, [payload, searchTerm]);

  const isServiceCenterSelected = (serviceCenterId: number) =>
    selectedServiceCenterIds.includes(serviceCenterId);

  const isDealershipChecked = (serviceCenters: TOptionForUserAccountServiceCenters[]) =>
    serviceCenters.length > 0 && serviceCenters.every(sc => isServiceCenterSelected(sc.value));

  const isDealershipIndeterminate = (serviceCenters: TOptionForUserAccountServiceCenters[]) => {
    const selectedCount = serviceCenters.filter(sc => isServiceCenterSelected(sc.value)).length;

    return selectedCount > 0 && selectedCount < serviceCenters.length;
  };

  const toggleServiceCenter = (serviceCenterId: number) => {
    setSelectedServiceCenterIds(prev =>
      prev.includes(serviceCenterId)
        ? prev.filter(selectedId => selectedId !== serviceCenterId)
        : [...prev, serviceCenterId]
    );
  };

  const toggleDealership = (serviceCenters: TOptionForUserAccountServiceCenters[]) => {
    const dealershipServiceCenterIds = serviceCenters.map(sc => sc.value);

    setSelectedServiceCenterIds(prev => {
      const allSelected = dealershipServiceCenterIds.every(id => prev.includes(id));

      if (allSelected) {
        return prev.filter(id => !dealershipServiceCenterIds.includes(id));
      }

      return Array.from(new Set([...prev, ...dealershipServiceCenterIds]));
    });
  };

  const isDealershipExpanded = (dealershipId: number) =>
    expandedDealershipIds.includes(dealershipId);

  const toggleDealershipExpand = (dealershipId: number) => {
    setExpandedDealershipIds(prev =>
      prev.includes(dealershipId) ? prev.filter(id => id !== dealershipId) : [...prev, dealershipId]
    );
  };

  const handleError = (errorCode: number) => {
    if (errorCode === ERROR_CODES.DATA_NOT_COMPLETE) {
      showError('Please fill in all required fields');
    }

    setIsLoading(false);
    dispatch(setTableLoading(false));
  };

  const handleSuccess = () => {
    setIsLoading(false);
    dispatch(setTableLoading(false));
    onClose();
  };

  const mapServiceCenter = (serviceCenter: TOptionForUserAccountServiceCenters) => {
    const isTechnician = payload?.role === Roles.Technician;
    const hasDetails =
      Boolean(serviceCenter.hourlyRate) || Boolean(serviceCenter.overtimeRate) || isTechnician;

    return {
      id: serviceCenter.value,
      name: serviceCenter.name,
      dmsId: serviceCenter.dmsId ?? undefined,
      type: serviceCenter.type ?? undefined,
      displayOnBookingTypes: serviceCenter.displayOnBookingTypes,
      ...(hasDetails && {
        details: {
          ...(serviceCenter.hourlyRate && { hourlyRate: serviceCenter.hourlyRate }),
          ...(serviceCenter.overtimeRate && { overtimeRate: serviceCenter.overtimeRate }),
          ...(isTechnician && {
            skillLevel: serviceCenter.technicianLevel || 1,
          }),
        },
      }),
    };
  };

  const handleRemove = () => {
    if (!payload?.id) return;

    const selectedIds = new Set(selectedServiceCenterIds);
    const remainingServiceCenters = payload.serviceCenters.filter(sc => !selectedIds.has(sc.value));

    const dealerships = payload.dealerships
      .map(dealership => {
        const serviceCenters = remainingServiceCenters
          .filter(sc => sc.categoryId === dealership.value)
          .map(mapServiceCenter);

        return {
          id: dealership.value,
          name: dealership.name,
          hasFullAccess: null,
          serviceCenters,
        };
      })
      .filter(dealership =>
        payload.role === Roles.ServiceDirector ||
        payload.role === Roles.BDCAgent ||
        payload.role === Roles.BDCManager
          ? true
          : dealership.serviceCenters.length > 0
      );

    const mappedUser: IUserAccount = {
      id: payload.id,
      status: payload.status || 0,
      firstName: payload.firstName?.trim(),
      lastName: payload.lastName?.trim(),
      fullName: `${payload.firstName?.trim()} ${payload.lastName?.trim()}`.trim(),
      userName: payload.email?.trim(),
      email: payload.email?.trim(),
      role: payload.role || Roles.EvenFlowAdmin,
      avatarPath: payload.avatarPath ?? '',
      emailConfirmed: payload.emailConfirmed || false,
      dealerships,
    };

    dispatch(setTableLoading(true));
    setIsLoading(true);
    dispatch(updateRoleManagementUser(mappedUser, handleSuccess, handleError));
  };

  if (!payload) return null;

  const isRemoveDisabled = selectedServiceCenterIds.length === 0;

  return (
    <BaseModal open={isOpen} width={640} onClose={onClose}>
      <DialogTitle onClose={onClose}>
        Remove Access For {payload.firstName + ' ' + payload.lastName}
      </DialogTitle>
      <DialogContent>
        <Typography className={classes.description}>
          Select the dealership groups and/or service centers to which the employee no longer
          requires access. Selecting a dealership group will remove access to all of its service
          centers.
        </Typography>
        <div className={classes.searchWrapper}>
          <TextField
            className={classes.searchField}
            placeholder="Search dealerships or service centers..."
            endAdornment={<Search />}
            value={searchTerm}
            onChange={e => handleSearch(e.target.value)}
          />
        </div>

        <div className={classes.listWrapper}>
          {groupedDealerships.map(({ dealership, serviceCenters }) => (
            <div key={dealership.value} className={classes.dealershipBlock}>
              <div className={classes.dealershipHeader}>
                <div className={classes.dealershipLeft}>
                  <Checkbox
                    checked={isDealershipChecked(serviceCenters)}
                    indeterminate={isDealershipIndeterminate(serviceCenters)}
                    onChange={() => toggleDealership(serviceCenters)}
                  />
                  <p className={classes.dealershipName}>
                    {dealership.name}{' '}
                    <button
                      type="button"
                      className={classes.toggleButton}
                      onClick={() => toggleDealershipExpand(dealership.value)}
                    >
                      {isDealershipExpanded(dealership.value) ? <HideMark /> : <ShowMark />}
                    </button>
                  </p>
                </div>
                <p className={classes.serviceCenterCount}>{serviceCenters.length} centers</p>
              </div>

              {isDealershipExpanded(dealership.value) ? (
                <div className={classes.serviceCentersWrapper}>
                  {serviceCenters.map(serviceCenter => (
                    <div key={serviceCenter.value} className={classes.serviceCenterRow}>
                      <Checkbox
                        checked={isServiceCenterSelected(serviceCenter.value)}
                        onChange={() => toggleServiceCenter(serviceCenter.value)}
                      />
                      <p className={classes.serviceCenterName}>{serviceCenter.name}</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ))}

          {groupedDealerships.length === 0 ? (
            <p className={classes.emptyState}>
              No dealerships or service centers match "{searchTerm}".
            </p>
          ) : null}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <LoadingButton
          disabled={isRemoveDisabled}
          loading={isLoading}
          color="primary"
          onClick={handleRemove}
          variant="contained"
        >
          Remove
        </LoadingButton>
      </DialogActions>
    </BaseModal>
  );
};

export default RemoveAccess;
