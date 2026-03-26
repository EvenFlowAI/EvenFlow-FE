import React, { useEffect, useMemo, useState } from 'react';
import { BaseModal, DialogActions, DialogContent, DialogTitle } from '../../BaseModal/BaseModal';
import { Button } from '@mui/material';
import { AvatarWrapper } from '../../../wrappers/AvatarWrapper/AvatarWrapper';
import { LoadingButton } from '../../../buttons/LoadingButton/LoadingButton';
import { AddUserAccountForm } from './Forms/AddUserAccountForm';
import { TUserAccountForm } from './types';
import { initialUserAccountForm } from './data';
import { DialogProps } from '../../BaseModal/types';
import {
  createRoleManagementUser,
  updateRoleManagementUser,
} from '../../../../store/reducers/users/actions';
import { useDispatch, useSelector } from 'react-redux';
import { INewUserAccount, IUserAccount } from '../../../../pages/admin/RoleManagement/types';
import { RootState } from '../../../../store/rootReducer';
import { TOption } from '../../../../utils/types';
import {
  setDmsIdError,
  setEmailError,
  setLoading as setTableLoading,
} from '../../../../store/reducers/roleManagement/actions';
import { Roles } from '../../../../types/types';
import { useException } from '../../../../hooks/useException/useException';

enum ERROR_CODES {
  DATA_NOT_COMPLETE = 1,
  EMAIL_ALREADY_IN_USE = 9,
  USER_WITH_DMS_ID_ALREADY_EXISTS = 5,
}

type AddUserAccountProps = React.PropsWithChildren<DialogProps<TUserAccountForm | null>> & {
  isAdminPanel: boolean;
};

export const AddUserAccount: React.FC<AddUserAccountProps> = ({
  payload,
  isAdminPanel,
  ...props
}) => {
  const [formIsChecked, setFormIsChecked] = useState<boolean>(false);
  const [userForm, setUserForm] = useState<TUserAccountForm>(initialUserAccountForm);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<File | undefined>();
  const dispatch = useDispatch();
  const { serviceCenters } = useSelector((state: RootState) => state.serviceCenters);
  const { emailError, dmsIdError } = useSelector((state: RootState) => state.roleManagement);
  const showError = useException();

  useEffect(() => {
    if (payload) {
      setUserForm(payload);
    } else {
      setUserForm(initialUserAccountForm);
    }
  }, [payload]);

  useEffect(() => {
    dispatch(setDmsIdError(false));
    dispatch(setEmailError(false));
  }, [userForm]);

  const onClose = () => {
    setUserForm(initialUserAccountForm);
    setAvatar(undefined);
    setFormIsChecked(false);
    dispatch(setDmsIdError(false));
    dispatch(setEmailError(false));
    setLoading(false);
    props.onClose();
  };

  function getDealershipWithAccess(dealership: TOption, user: TUserAccountForm) {
    // all SC from this dealership
    const allCentersForDealership = serviceCenters.filter(
      sc => sc.dealershipId === dealership.value
    );

    // selected SC from this dealership
    const selectedCentersForDealership = user.serviceCenters.filter(
      sc => sc.categoryId === dealership.value
    );

    const hasFullAccess =
      selectedCentersForDealership.length === allCentersForDealership.length &&
      allCentersForDealership.length > 0;

    return {
      id: dealership.value,
      name: dealership.name,
      hasFullAccess,
      serviceCenters: selectedCentersForDealership.map(sc => {
        const isTechnician = user.role === Roles.Technician;
        const hasDetails = Boolean(sc.hourlyRate) || Boolean(sc.overtimeRate) || isTechnician;

        return {
          id: sc.value,
          name: sc.name,
          dmsId: sc.dmsId ?? undefined,
          type: sc.type ?? undefined,
          displayOnBookingTypes: sc.displayOnBookingTypes,
          ...(hasDetails && {
            details: {
              ...(sc.hourlyRate && { hourlyRate: sc.hourlyRate }),
              ...(sc.overtimeRate && { overtimeRate: sc.overtimeRate }),
              ...(isTechnician && {
                skillLevel: sc.technicianLevel || 1,
              }),
            },
          }),
        };
      }),
    };
  }

  function mapUserBase(user: TUserAccountForm) {
    return {
      status: user.status || 0,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: `${user.firstName} ${user.lastName}`,
      userName: user.email,
      email: user.email,
      role: user.role || Roles.EvenFlowAdmin,
      avatarPath: user.avatarPath ?? '',
      dealerships: user.dealerships
        .map(d => getDealershipWithAccess(d, user))
        .filter(d =>
          user.role === Roles.ServiceDirector ||
          user.role === Roles.BDCAgent ||
          user.role === Roles.BDCManager
            ? true
            : d.serviceCenters.length > 0
        ),
    };
  }

  function mapUser(user: TUserAccountForm): INewUserAccount | IUserAccount {
    const base = mapUserBase(user);
    return user.id ? { ...base, id: user.id, emailConfirmed: user.emailConfirmed } : base;
  }

  const handleError = (errorCode: number) => {
    if (errorCode === ERROR_CODES.USER_WITH_DMS_ID_ALREADY_EXISTS) {
      dispatch(setDmsIdError(true));
    }
    if (errorCode === ERROR_CODES.EMAIL_ALREADY_IN_USE) {
      dispatch(setEmailError(true));
    }
    if (errorCode === ERROR_CODES.DATA_NOT_COMPLETE) {
      showError('Please fill in all required fields');
    }
    setLoading(false);
    dispatch(setTableLoading(false));
  };

  const handleCreateOrSave = async () => {
    setFormIsChecked(true);

    dispatch(setTableLoading(true));
    setLoading(true);

    const mappedUser = mapUser(userForm);
    if (userForm.id) {
      dispatch(updateRoleManagementUser(mappedUser as IUserAccount, onClose, handleError, avatar));
    } else {
      dispatch(
        createRoleManagementUser(mappedUser as INewUserAccount, onClose, handleError, avatar)
      );
    }
  };

  const isDisabledSave = useMemo(() => {
    return dmsIdError || emailError;
  }, [dmsIdError, emailError]);

  return (
    <BaseModal {...props} width={940} onClose={onClose}>
      <DialogTitle onClose={onClose}>
        {payload ? 'Edit' : 'Add'} {!isAdminPanel ? 'User Account' : 'Employee'}
      </DialogTitle>
      <DialogContent>
        <AvatarWrapper onChange={f => setAvatar(f)} dataUrl={payload?.avatarPath} />
        <AddUserAccountForm
          isAdminPanel={isAdminPanel}
          formIsChecked={formIsChecked}
          form={userForm}
          setFormIsChecked={setFormIsChecked}
          setEmployeeForm={setUserForm}
          isAdding={!payload}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <LoadingButton
          disabled={isDisabledSave}
          loading={isLoading}
          color="primary"
          onClick={handleCreateOrSave}
          variant="contained"
        >
          Save
        </LoadingButton>
      </DialogActions>
    </BaseModal>
  );
};
