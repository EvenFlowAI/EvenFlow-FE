/* eslint-disable max-lines */
import React, { useEffect, useState } from 'react';
import { FormControlLabel, Radio } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  BaseModal,
  DialogContent,
  DialogTitle,
} from '../../../../../../../components/modals/BaseModal/BaseModal';
import { TextField } from '../../../../../../../components/formControls/TextFieldStyled/TextField';
import { LoadingButton } from '../../../../../../../components/buttons/LoadingButton/LoadingButton';
import { ECustomerProfileType, ICustomerLoadedData } from '../../../../../../../api/types';
import { updateCustomer } from '../../../../../../../store/reducers/enhancedCustomerSearch/actions';
import { IUpdateCustomerData } from '../../../../../../../store/reducers/enhancedCustomerSearch/types';
import { RootState } from '../../../../../../../store/rootReducer';
import { useException } from '../../../../../../../hooks/useException/useException';
import { useMessage } from '../../../../../../../hooks/useMessage/useMessage';
import {
  ActionsWrapper,
  CommunicationHint,
  FieldWrapper,
  PhoneHeader,
  PhoneInput,
  PhoneLabel,
  PhoneRow,
  PhoneTable,
} from './styles';

type TPhoneType = 'cell' | 'home' | 'work' | 'other';
type TPhoneValues = Record<TPhoneType, string>;
type TProps = {
  open: boolean;
  onClose: () => void;
  customerLoadedData: ICustomerLoadedData;
  communicationPhone: string;
  isEmailRequired: boolean;
  onUpdated: (customer: IUpdateCustomerData, communicationPhone: string) => void;
};

const phoneTypes: { type: TPhoneType; label: string; placeholder: string }[] = [
  { type: 'cell', label: 'Cell', placeholder: 'Cell phone' },
  { type: 'home', label: 'Home', placeholder: 'Home phone' },
  { type: 'work', label: 'Work', placeholder: 'Work phone' },
  { type: 'other', label: 'Other', placeholder: 'Other phone' },
];

const getInitialPhones = (customerLoadedData: ICustomerLoadedData): TPhoneValues => ({
  cell: customerLoadedData.phoneNumbersByCategory?.cell ?? '',
  home: customerLoadedData.phoneNumbersByCategory?.home ?? '',
  work: customerLoadedData.phoneNumbersByCategory?.work ?? '',
  other: customerLoadedData.phoneNumbersByCategory?.other ?? '',
});

const getProfileType = (customerLoadedData: ICustomerLoadedData): ECustomerProfileType =>
  customerLoadedData.customerProfileType ?? ECustomerProfileType.Personal;

const hasCustomerChanges = (
  data: IUpdateCustomerData,
  customerLoadedData: ICustomerLoadedData,
  initialPhones: TPhoneValues
): boolean => {
  return (
    data.firstName !== (customerLoadedData.firstName ?? '').trim() ||
    data.middleName !== (customerLoadedData.middleName ?? '').trim() ||
    data.lastName !== (customerLoadedData.lastName ?? '').trim() ||
    (data.companyName ?? '') !== (customerLoadedData.companyName ?? '').trim() ||
    data.email !== (customerLoadedData.emails[0] ?? '').trim() ||
    data.cellPhone !== initialPhones.cell.trim() ||
    data.homePhone !== initialPhones.home.trim() ||
    data.workPhone !== initialPhones.work.trim() ||
    data.otherPhone !== initialPhones.other.trim()
  );
};

// eslint-disable-next-line complexity
export const EditCustomerModal: React.FC<TProps> = ({
  open,
  onClose,
  customerLoadedData,
  communicationPhone,
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

  // eslint-disable-next-line complexity
  useEffect(() => {
    if (!open) {
      return;
    }

    const nextPhones = getInitialPhones(customerLoadedData);
    if (!Object.values(nextPhones).some(Boolean) && customer.phoneNumber) {
      nextPhones.cell = customer.phoneNumber;
    }
    const currentPhoneType = phoneTypes.find(
      ({ type }) => nextPhones[type] && nextPhones[type] === communicationPhone
    )?.type;

    console.log(customerLoadedData);

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
  }, [communicationPhone, customer, customerLoadedData, open]);

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
      customerType: profileType,
      address: customerLoadedData.address,
    };

    const selectedCommunicationPhone = phones[selectedPhoneType].trim();
    if (!hasCustomerChanges(data, customerLoadedData, initialPhones)) {
      onUpdated(data, selectedCommunicationPhone);
      showMessage(t('Appointment communication number was updated'));
      onClose();
      return;
    }

    dispatch(
      updateCustomer(
        data,
        updatedCustomer => {
          onUpdated(updatedCustomer, selectedCommunicationPhone);
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
      <DialogContent>
        {isBusiness ? (
          <FieldWrapper>
            <TextField
              label={t('Company Name').toUpperCase() + ':'}
              value={companyName}
              onChange={event => {
                setCompanyName(event.target.value);
                setErrors(currentErrors => currentErrors.filter(error => error !== 'companyName'));
              }}
              error={errors.includes('companyName')}
              fullWidth
            />
          </FieldWrapper>
        ) : null}
        <FieldWrapper>
          <TextField
            label={t('First Name').toUpperCase() + ':'}
            value={firstName}
            onChange={event => setFirstName(event.target.value)}
            error={errors.includes('firstName')}
            fullWidth
          />
        </FieldWrapper>
        {!isBusiness ? (
          <FieldWrapper>
            <TextField
              label={`${t('Middle Name').toUpperCase()} (${t('Optional')})`.toUpperCase() + ':'}
              value={middleName}
              onChange={event => setMiddleName(event.target.value)}
              fullWidth
            />
          </FieldWrapper>
        ) : null}
        <FieldWrapper>
          <TextField
            label={t('Last Name').toUpperCase() + ':'}
            value={lastName}
            onChange={event => setLastName(event.target.value)}
            error={errors.includes('lastName')}
            fullWidth
          />
        </FieldWrapper>

        <PhoneHeader>
          <span>{t('Phone Numbers on File')}</span>
          <span>{t('Appointment Communication')}</span>
        </PhoneHeader>
        <PhoneTable hasError={errors.includes('phone')}>
          {phoneTypes.map(({ type, label, placeholder }) => (
            <PhoneRow key={type} selected={selectedPhoneType === type}>
              <PhoneLabel>{t(label)}</PhoneLabel>
              <PhoneInput
                value={phones[type]}
                onChange={handlePhoneChange(type)}
                placeholder={t(placeholder)}
              />
              <FormControlLabel
                value={type}
                control={
                  <Radio
                    size="small"
                    checked={selectedPhoneType === type}
                    onChange={() => setSelectedPhoneType(type)}
                    disabled={!phones[type].trim()}
                  />
                }
                label=""
              />
            </PhoneRow>
          ))}
        </PhoneTable>
        <CommunicationHint>
          <span>ⓘ</span> {t('This number will be used for appointment communication')}
        </CommunicationHint>

        <FieldWrapper>
          <TextField
            label={t('Email').toUpperCase() + ':'}
            value={email}
            onChange={event => setEmail(event.target.value)}
            error={errors.includes('email')}
            fullWidth
          />
        </FieldWrapper>
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
