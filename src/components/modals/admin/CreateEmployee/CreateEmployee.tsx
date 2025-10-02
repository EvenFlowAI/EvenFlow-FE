import React, { useEffect, useState } from 'react';
import { BaseModal, DialogActions, DialogContent, DialogTitle } from '../../BaseModal/BaseModal';
import { DialogProps } from '../../BaseModal/types';
import { Button } from '@mui/material';
import { Roles, TTechnicianLevel } from '../../../../types/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import { loadShortSC } from '../../../../store/reducers/serviceCenters/actions';
import { TEmployeeForm } from './types';
import { IEmployee, IEmployeeForm } from '../../../../store/reducers/employees/types';
import { loadDMSAdvisors } from '../../../../store/reducers/employees/actions';
import { IUserForm, TRole } from '../../../../store/reducers/users/types';
import { createUser, updateUser } from '../../../../store/reducers/users/actions';
import { checkEmail } from '../../../../utils/utils';
import { initialEmployeeForm } from './constants';
import { AvatarWrapper } from '../../../wrappers/AvatarWrapper/AvatarWrapper';
import { LoadingButton } from '../../../buttons/LoadingButton/LoadingButton';

import { useMessage } from '../../../../hooks/useMessage/useMessage';
import { useException } from '../../../../hooks/useException/useException';
import { useSCs } from '../../../../hooks/useSCs/useSCs';
import { CreateEmployeeForm } from './CreateEmployeeForm/CreateEmployeeForm';
import {dealerShipAccessRoles} from "../../../../utils/constants";

export const CreateEmployee: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<DialogProps<IEmployee>>>
> = ({ payload, onAction, ...props }) => {
  const { shortSC } = useSelector((state: RootState) => state.serviceCenters);
  const { saving: savingE } = useSelector((state: RootState) => state.employees);
  const { saving: savingU } = useSelector((state: RootState) => state.users);
  
  const [avatar, setAvatar] = useState<File | undefined>();
  const [employeeForm, setEmployeeForm] = useState<TEmployeeForm>(initialEmployeeForm);
  const [initialEditEmployeeForm, setInitialEditEmployeeForm] = useState<TEmployeeForm>(initialEmployeeForm);
  
  const [formIsChecked, setFormIsChecked] = useState<boolean>(false);

  const { selectedSC } = useSCs();
  const dispatch = useDispatch();
  const showError = useException();
  const showMessage = useMessage();

  const isEdit = Boolean(payload?.id);
  const saving = savingU || savingE;

  useEffect(() => {
    if (props.open && !shortSC.length) dispatch(loadShortSC(true));
  }, [props.open, shortSC]);

  useEffect(() => {
    if (selectedSC && props.open) {
      const centerId = payload && isEdit ? payload.serviceCenterId : selectedSC.id;
      dispatch(loadDMSAdvisors(centerId));
    }
  }, [selectedSC, props.open, payload, isEdit]);

  useEffect(() => {
    if (payload) {
      const selectedServiceCenter = shortSC.find(el => el.id === payload.serviceCenterId);
      let data: TEmployeeForm = {
        firstName: payload.firstName,
        lastName: payload.lastName,
        serviceCenter: selectedServiceCenter ?? null,
        email: payload.email,
        role: payload.role as TRole,
        position: payload.position ?? '',
        dmsId: payload.dmsId ? payload.dmsId.toString() : null,
      };
      if (payload.role === Roles.Technician) {
        data = {
          ...data,
          hourlyRate: payload.employeeInfo?.hourlyRate || '',
          overtimeRate: payload.employeeInfo?.overtimeRate || '',
          technicianLevel:
            (payload.employeeInfo?.skillLevel as TTechnicianLevel) || (1 as TTechnicianLevel),
          type: payload.type,
        };
      } else {
        data.type = payload.type;
        data.displayOnBookingTypes = payload.displayOnBookingTypes;
      }
      setEmployeeForm(data);
      setInitialEditEmployeeForm(data);
    } else {
      setEmployeeForm(initialEmployeeForm);
    }
  }, [props.open, payload, shortSC]);

  const rolesWhenServiceCenterIsRequired: TRole[] = [
      Roles.ServiceManager,
      Roles.Advisor, Roles.Technician, Roles.Staff, Roles.Vendor, Roles.AIBookingAgent];
  const checkIsValid = (): boolean => {
    let err: string[] = [];
    if (!employeeForm.firstName.length) err = [...err, '"First Name" must not be empty'];
    if (!employeeForm.lastName.length) err = [...err, '"Last Name" must not be empty'];
    if (employeeForm.role && rolesWhenServiceCenterIsRequired.includes(employeeForm.role) && !employeeForm.serviceCenter)
      err = [...err, '"Service Center" must not be empty'];
    if (!employeeForm.email?.length) {
      err = [...err, '"Email" must not be empty'];
    } else {
      if (!checkEmail(employeeForm.email)) err = [...err, '"Email" is not valid'];
    }
    if (!employeeForm.role) err = [...err, '"Role" must not be empty'];
    err.map(e => showError(e));
    return !Boolean(err.length);
  };

  const onClose = () => {
    setAvatar(undefined);
    setEmployeeForm(initialEmployeeForm);
    setFormIsChecked(false);
    props.onClose();
  };

  const onSuccess = () => {
    showMessage(`Employee ${isEdit ? 'updated' : 'created'}`);
    onClose();
  };

  const handleCreate = async () => {
    setFormIsChecked(true);
    const isValid = checkIsValid();
    if (isValid) {
      let data: IEmployeeForm | IUserForm;
      const employeeData: TEmployeeForm = { ...employeeForm };

      delete employeeData.serviceCenter;

      if (employeeForm.role !== Roles.Technician) {
        data = {
          ...employeeData,
          dmsId: employeeForm?.dmsId ?? null,
          serviceCenterId: employeeForm.serviceCenter?.id || null,
        } as IUserForm;
        if (employeeData.role && dealerShipAccessRoles.includes(employeeData.role)) {
          delete data.serviceCenterId;
        }
      } else {
        data = {
          firstName: employeeForm.firstName,
          lastName: employeeForm.lastName,
          email: employeeForm.email || undefined,
          serviceCenterId: employeeForm.serviceCenter?.id || null,
          dmsId: employeeForm?.dmsId ?? null,
          role: employeeForm.role,
          employeeInfo: {
            hourlyRate: employeeForm.hourlyRate || 0,
            overtimeRate: employeeForm.overtimeRate || 0,
            skillLevel: employeeForm.technicianLevel,
          },
        } as IEmployeeForm;
      }
      if ([Roles.Technician, Roles.Advisor].includes(employeeForm.role as Roles)) {
        data.type = employeeForm.type;
        data.displayOnBookingTypes = employeeForm.displayOnBookingTypes;
      }
      try {
        if (payload?.id) {
          await dispatch(updateUser(data as IUserForm, payload.id, onSuccess, showError, avatar));
        } else {
          await dispatch(createUser(data as IUserForm, onSuccess, showError, avatar));
        }
        if (onAction) {
          onAction();
        }
      } catch (e) {
        showError(e);
      }
    }
  };

  return (
    <BaseModal {...props} width={940} onClose={onClose}>
      <DialogTitle onClose={onClose}>
        {isEdit ? `Edit ${payload?.role}` : 'Add Employee'}
      </DialogTitle>
      <DialogContent>
        <AvatarWrapper onChange={f => setAvatar(f)} dataUrl={payload?.avatarPath} />
        <CreateEmployeeForm
          formIsChecked={formIsChecked}
          form={employeeForm}
          initialForm={initialEditEmployeeForm}
          isEdit={isEdit}
          setFormIsChecked={setFormIsChecked}
          setEmployeeForm={setEmployeeForm}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <LoadingButton loading={saving} color="primary" onClick={handleCreate} variant="contained">
          Save
        </LoadingButton>
      </DialogActions>
    </BaseModal>
  );
};
