import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  BaseModal,
  DialogContent,
  DialogTitle,
} from '../../../../../../../components/modals/BaseModal/BaseModal';
import { TextField } from '../../../../../../../components/formControls/TextFieldStyled/TextField';
import { LoadingButton } from '../../../../../../../components/buttons/LoadingButton/LoadingButton';
import { ECustomerProfileType } from '../../../../../../../api/types';
import { updateCustomer } from '../../../../../../../store/reducers/enhancedCustomerSearch/actions';
import { IUpdateCustomerData } from '../../../../../../../store/reducers/enhancedCustomerSearch/types';
import { RootState } from '../../../../../../../store/rootReducer';
import { useException } from '../../../../../../../hooks/useException/useException';
import { useMessage } from '../../../../../../../hooks/useMessage/useMessage';
import { ActionsWrapper } from './styles';
import { getInitialPhones, getProfileType, hasCustomerChanges, phoneTypes } from './helpers';
import { TEditCustomerModalProps, TPhoneType, TPhoneValues } from './types';
import { CustomerPhoneFields } from './CustomerPhoneFields';
import {
  communicationTypeToPhoneCategory,
  phoneCategoryToCommunicationType,
} from '../../../../../../../utils/communicationPhoneType';

export const EditCustomerModal: React.FC<TEditCustomerModalProps> = ({
  open,
  onClose,
  customerLoadedData,
  communicationPhone,
  communicationPhoneType,
  isEmailRequired,
  onUpdated,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const showError = useException();
  const showMessage = useMessage();
  const { customer } = useSelector((state: RootState) => state.appointmentFrame);
  const { isLoading } = useSelector((state: RootState) => state.customers);
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phones, setPhones] = useState<TPhoneValues>(getInitialPhones(customerLoadedData));
  const [initialPhones, setInitialPhones] = useState<TPhoneValues>(
    getInitialPhones(customerLoadedData)
  );
  const [selectedPhoneType, setSelectedPhoneType] = useState<TPhoneType>('cell');
  const [errors, setErrors] = useState<string[]>([]);

  const profileType = getProfileType(customerLoadedData);
  const isBusiness = profileType === ECustomerProfileType.Business;

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    const nextPhones = getInitialPhones(customerLoadedData);
    if (!Object.values(nextPhones).some(Boolean) && customer.phoneNumber) {
      nextPhones.cell = customer.phoneNumber;
    }
    const typeFromAppointment =
      communicationPhoneType !== null && communicationPhoneType !== undefined
        ? communicationTypeToPhoneCategory[communicationPhoneType]
        : undefined;
    const currentPhoneType =
      (typeFromAppointment && nextPhones[typeFromAppointment] ? typeFromAppointment : undefined) ??
      phoneTypes.find(({ type }) => nextPhones[type] && nextPhones[type] === communicationPhone)
        ?.type;

    setFirstName(customerLoadedData.firstName ?? customer.firstName ?? '');
    setMiddleName(customerLoadedData.middleName ?? customer.middleName ?? '');
    setLastName(customerLoadedData.lastName ?? customer.lastName ?? '');
    setCompanyName(customerLoadedData.companyName ?? customer.companyName ?? '');
    setEmail(customerLoadedData.emails[0] ?? customer.email ?? '');
    setPhones(nextPhones);
    setInitialPhones(nextPhones);
    setSelectedPhoneType(
      currentPhoneType ?? phoneTypes.find(({ type }) => nextPhones[type])?.type ?? 'cell'
    );
    setErrors([]);
    // initialize form only when the modal is opened, so user selection is not reset while editing
  }, [open]);

  const handlePhoneChange =
    (type: TPhoneType): React.ChangeEventHandler<HTMLInputElement> =>
    ({ target: { value } }) => {
      setPhones(currentPhones => ({ ...currentPhones, [type]: value }));
      setErrors(currentErrors => currentErrors.filter(error => error !== 'phone'));
    };

  const validate = (): boolean => {
    const nextErrors: string[] = [];
    if (isBusiness && !companyName.trim()) nextErrors.push('companyName');
    if (!firstName.trim()) nextErrors.push('firstName');
    if (!lastName.trim()) nextErrors.push('lastName');
    if (isEmailRequired && !email.trim()) nextErrors.push('email');
    if (!phones[selectedPhoneType]?.trim()) nextErrors.push('phone');
    setErrors(nextErrors);

    if (nextErrors.length) {
      showError(t('Please fill in all required customer fields'));
      return false;
    }
    return true;
  };

  const handleUpdate = () => {
    if (!validate()) {
      return;
    }

    const customerId = Number(customerLoadedData.id);
    if (!Number.isFinite(customerId)) {
      showError(t('Customer identifier is invalid'));
      return;
    }

    const data: IUpdateCustomerData = {
      customerId,
      firstName: firstName.trim(),
      middleName: middleName.trim(),
      lastName: lastName.trim(),
      companyName: isBusiness ? companyName.trim() : undefined,
      cellPhone: phones.cell.trim(),
      homePhone: phones.home.trim(),
      workPhone: phones.work.trim(),
      otherPhone: phones.other.trim(),
      email: email.trim(),
      customerProfileType: profileType,
      address: customerLoadedData.address,
    };

    const selectedCommunicationPhone = phones[selectedPhoneType].trim();
    const selectedCommunicationPhoneType = phoneCategoryToCommunicationType[selectedPhoneType];
    if (!hasCustomerChanges(data, customerLoadedData, initialPhones)) {
      onUpdated(data, selectedCommunicationPhone, selectedCommunicationPhoneType);
      showMessage(t('Appointment communication number was updated'));
      onClose();
      return;
    }

    dispatch(
      updateCustomer(
        data,
        updatedCustomer => {
          onUpdated(updatedCustomer, selectedCommunicationPhone, selectedCommunicationPhoneType);
          showMessage(t('Customer information was updated'));
          onClose();
        },
        showError
      )
    );
  };

  return (
    <BaseModal open={open} onClose={handleClose} width={600} maxWidth="sm">
      <DialogTitle onClose={handleClose} style={{ textAlign: 'left' }}>
        {t('Edit Customer Information')}
      </DialogTitle>
      <hr style={{ width: '100%', height: '1px', color: '#DADADA', opacity: 0.4, margin: 0 }} />
      <DialogContent>
        <div style={{ display: 'grid', gap: 14 }}>
          {isBusiness ? (
            <div style={{ marginTop: 6 }}>
              <TextField
                label={t('Company Name').toUpperCase() + ':'}
                value={companyName}
                onChange={event => {
                  setCompanyName(event.target.value);
                  setErrors(currentErrors =>
                    currentErrors.filter(error => error !== 'companyName')
                  );
                }}
                error={errors.includes('companyName')}
                fullWidth
              />
            </div>
          ) : null}
          <div>
            <TextField
              label={t('First Name').toUpperCase() + ':'}
              value={firstName}
              onChange={event => setFirstName(event.target.value)}
              error={errors.includes('firstName')}
              fullWidth
            />
          </div>
          {!isBusiness ? (
            <div>
              <TextField
                label={`${t('Middle Name').toUpperCase()} (${t('Optional')})`.toUpperCase() + ':'}
                value={middleName}
                onChange={event => setMiddleName(event.target.value)}
                fullWidth
              />
            </div>
          ) : null}
          <div>
            <TextField
              label={t('Last Name').toUpperCase() + ':'}
              value={lastName}
              onChange={event => setLastName(event.target.value)}
              error={errors.includes('lastName')}
              fullWidth
            />
          </div>
        </div>
        <CustomerPhoneFields
          hasError={errors.includes('phone')}
          phones={phones}
          selectedPhoneType={selectedPhoneType}
          onPhoneChange={handlePhoneChange}
          onPhoneTypeChange={setSelectedPhoneType}
        />

        <div>
          <TextField
            label={t('Email').toUpperCase() + ':'}
            value={email}
            onChange={event => setEmail(event.target.value)}
            error={errors.includes('email')}
            fullWidth
          />
        </div>
      </DialogContent>
      <ActionsWrapper>
        <LoadingButton
          loading={false}
          disabled={isLoading}
          onClick={handleClose}
          variant="outlined"
        >
          {t('Cancel').toUpperCase()}
        </LoadingButton>
        <LoadingButton loading={isLoading} onClick={handleUpdate} variant="contained">
          {t('Update').toUpperCase()}
        </LoadingButton>
      </ActionsWrapper>
    </BaseModal>
  );
};
