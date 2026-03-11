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
import { setLoading as setTableLoading } from '../../../../store/reducers/roleManagement/actions';
import { Roles } from '../../../../types/types';

export const AddUserAccount: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<DialogProps<TUserAccountForm | null>>>
> = ({ payload, ...props }) => {
  const [formIsChecked, setFormIsChecked] = useState<boolean>(false);
  const [userForm, setUserForm] = useState<TUserAccountForm>(initialUserAccountForm);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<File | undefined>();
  const dispatch = useDispatch();
  const { serviceCenters } = useSelector((state: RootState) => state.serviceCenters);
  const { users } = useSelector((state: RootState) => state.roleManagement);
  const [errorForDmsId, setErrorForDmsId] = useState<boolean>(false);

  useEffect(() => {
    if (payload) {
      setUserForm(payload);
    }
  }, [payload]);

  const onClose = () => {
    setUserForm(initialUserAccountForm);
    setAvatar(undefined);
    setFormIsChecked(false);
    setErrorForDmsId(false);
    setLoading(false);
    props.onClose();
  };

  const emailExists = (value: string) => {
    return users.some(user => user.email === value && user.id !== userForm?.id);
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

        console.log('sc.displayOnBookingTypes', sc.displayOnBookingTypes);

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
      dealerships: user.dealerships.map(d => getDealershipWithAccess(d, user)),
    };
  }

  function mapUser(user: TUserAccountForm): INewUserAccount | IUserAccount {
    const base = mapUserBase(user);
    return user.id ? { ...base, id: user.id, emailConfirmed: user.emailConfirmed } : base;
  }

  const handleCreateOrSave = async () => {
    setFormIsChecked(true);

    if (emailExists(userForm.email)) {
      return;
    }

    setLoading(true);

    const mappedUser = mapUser(userForm);
    if (userForm.id) {
      dispatch(
        updateRoleManagementUser(
          mappedUser as IUserAccount,
          userForm.id,
          onClose,
          (errorCode: number) => {
            if (errorCode === 4) {
              setErrorForDmsId(true);
            }
            setLoading(false);
          },
          avatar
        )
      );
    } else {
      dispatch(setTableLoading(true));

      dispatch(
        createRoleManagementUser(
          mappedUser as INewUserAccount,
          onClose,
          (errorCode: number) => {
            if (errorCode === 4) {
              setErrorForDmsId(true);
            }
            setLoading(false);
          },
          avatar
        )
      );
    }
  };

  const isDisabledSave = useMemo(() => {
    const noUserData =
      !userForm.firstName.length ||
      !userForm.lastName.length ||
      !userForm.email.length ||
      !userForm.role?.length;

    const noDealerships = !userForm.dealerships || userForm.dealerships.length === 0;

    const noServiceCenters =
      !!userForm.dealerships.length &&
      (!userForm.serviceCenters || userForm.serviceCenters.length === 0);

    const invalidServiceCenters = userForm.serviceCenters?.some(sc => {
      if (userForm.role === Roles.Technician || userForm.role === Roles.Advisor) {
        return sc.type !== 0 && sc.type !== 1;
      } else {
        return false;
      }
    });

    return (
      noUserData || noDealerships || noServiceCenters || errorForDmsId || invalidServiceCenters
    );
  }, [userForm, errorForDmsId]);

  return (
    <BaseModal {...props} width={940} onClose={onClose}>
      <DialogTitle onClose={onClose}>{payload ? 'Edit' : 'Add'} User Account</DialogTitle>
      <DialogContent>
        <AvatarWrapper onChange={f => setAvatar(f)} dataUrl={payload?.avatarPath} />
        <AddUserAccountForm
          errorForDmsId={errorForDmsId}
          formIsChecked={formIsChecked}
          form={userForm}
          setFormIsChecked={setFormIsChecked}
          setErrorForDmsId={setErrorForDmsId}
          setEmployeeForm={setUserForm}
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
