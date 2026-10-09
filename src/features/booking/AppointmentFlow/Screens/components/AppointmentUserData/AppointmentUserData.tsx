import React, { Dispatch, SetStateAction, useEffect, useMemo } from 'react';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { AppointmentConfirmationTitle } from '../../../../../../components/wrappers/AppointmentConfirmationTitle/AppointmentConfirmationTitle';
import { TextField } from '../../../../../../components/formControls/TextFieldStyled/TextField';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../../store/rootReducer';
import {
  setAppointmentPhoneNumber,
  setCommunicationPhoneType,
  setCustomer,
  setSelectedAppointmentPhoneNumber,
} from '../../../../../../store/reducers/appointmentFrameReducer/actions';
import { setCustomerLoadedData } from '../../../../../../store/reducers/appointment/actions';
import { useTranslation } from 'react-i18next';
import { ProfileTypeWrapper, TitleRow, Wrapper } from './styles';
import { EUserType } from '../../../../../../store/reducers/appointmentFrameReducer/types';
import {
  ECommunicationPhoneType,
  ECustomerProfileType,
  ICustomer,
} from '../../../../../../api/types';
import { useModal } from '../../../../../../hooks/useModal/useModal';
import { IUpdateCustomerData } from '../../../../../../store/reducers/enhancedCustomerSearch/types';
import { EditCustomerModal } from './EditCustomerModal/EditCustomerModal';
import { communicationTypeToPhoneCategory } from '../../../../../../utils/communicationPhoneType';

type TUserDataProps = {
  errors: string[];
  setErrors: Dispatch<SetStateAction<string[]>>;
  isEmailRequired: boolean;
};

export const AppointmentUserData: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TUserDataProps>>
> = ({ errors, setErrors, isEmailRequired }) => {
  const { customerLoadedData } = useSelector((state: RootState) => state.appointment);
  const { selectedAppointmentPhoneNumber, communicationPhoneType, customer, userType } =
    useSelector((state: RootState) => state.appointmentFrame);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useModal();
  const isExistingCustomer = userType === EUserType.Existing;
  const customerProfileType = useMemo(
    () =>
      customer.customerProfileType ??
      customerLoadedData?.customerProfileType ??
      (customerLoadedData?.companyName
        ? ECustomerProfileType.Business
        : ECustomerProfileType.Personal),
    [customer.customerProfileType, customerLoadedData]
  );

  useEffect(() => {
    if (isExistingCustomer && customerLoadedData) {
      const driverEmail = customerLoadedData?.emails?.length ? customerLoadedData.emails[0] : '';
      const loadedProfileType =
        customerLoadedData.customerProfileType ??
        (customerLoadedData.companyName
          ? ECustomerProfileType.Business
          : ECustomerProfileType.Personal);
      const structuredFullName = [
        customerLoadedData.firstName,
        loadedProfileType === ECustomerProfileType.Personal
          ? customerLoadedData.middleName
          : undefined,
        customerLoadedData.lastName,
      ]
        .filter(Boolean)
        .join(' ');
      const phonesByCategory = customerLoadedData.phoneNumbersByCategory;
      const phoneByType =
        communicationPhoneType !== null && communicationPhoneType !== undefined
          ? phonesByCategory?.[communicationTypeToPhoneCategory[communicationPhoneType]]
          : undefined;
      // keep the number chosen in Edit Customer modal / bound by communicationPhoneType
      const communicationPhone =
        selectedAppointmentPhoneNumber ||
        phoneByType ||
        customerLoadedData.phoneNumber ||
        phonesByCategory?.cell ||
        customerLoadedData.phoneNumbers?.[0] ||
        '';

      const data: ICustomer = {
        ...customer,
        firstName: customerLoadedData.firstName ?? '',
        middleName: customerLoadedData.middleName ?? '',
        lastName: customerLoadedData.lastName ?? '',
        fullName: structuredFullName || customerLoadedData.fullName || '',
        email: driverEmail,
        phoneNumber: communicationPhone,
        city: customerLoadedData?.address?.city,
        companyName: customerLoadedData.companyName,
        customerProfileType: loadedProfileType,
      };
      dispatch(setCustomer(data));
      dispatch(setAppointmentPhoneNumber(communicationPhone));
    }
  }, [
    customerLoadedData,
    dispatch,
    isExistingCustomer,
    selectedAppointmentPhoneNumber,
    communicationPhoneType,
  ]);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = ({
    target: { name, value },
  }) => {
    if (customer) {
      const updatedCustomer = { ...customer, [name]: value };
      if (['firstName', 'middleName', 'lastName'].includes(name)) {
        updatedCustomer.fullName = [
          updatedCustomer.firstName,
          updatedCustomer.middleName,
          updatedCustomer.lastName,
        ]
          .filter(Boolean)
          .join(' ');
      }
      dispatch(setCustomer(updatedCustomer));
      if (name === 'phoneNumber') {
        dispatch(setAppointmentPhoneNumber(value));
      }
    }
    setErrors(errors => errors.filter(err => err !== name.toLowerCase()));
  };

  const handleProfileTypeChange = (_: React.ChangeEvent<HTMLInputElement>, value: string) => {
    const profileType = value as ECustomerProfileType;
    const fullName = [customer.firstName, customer.lastName].filter(Boolean).join(' ');
    dispatch(
      setCustomer({
        ...customer,
        middleName: '',
        companyName: '',
        fullName,
        customerProfileType: profileType,
      })
    );
    setErrors(currentErrors => currentErrors.filter(error => error !== 'companyname'));
  };

  const handleCustomerUpdated = (
    updatedCustomer: IUpdateCustomerData,
    communicationPhone: string,
    selectedCommunicationPhoneType: ECommunicationPhoneType
  ) => {
    const updatedProfileType = updatedCustomer.customerProfileType;
    const fullName = [
      updatedCustomer.firstName,
      updatedProfileType === ECustomerProfileType.Personal ? updatedCustomer.middleName : undefined,
      updatedCustomer.lastName,
    ]
      .filter(Boolean)
      .join(' ');

    dispatch(
      setCustomer({
        ...customer,
        fullName,
        firstName: updatedCustomer.firstName,
        middleName: updatedCustomer.middleName,
        lastName: updatedCustomer.lastName,
        companyName: updatedCustomer.companyName,
        email: updatedCustomer.email,
        phoneNumber: communicationPhone,
        customerProfileType: updatedProfileType,
      })
    );
    dispatch(setAppointmentPhoneNumber(communicationPhone));
    dispatch(setSelectedAppointmentPhoneNumber(communicationPhone));
    dispatch(setCommunicationPhoneType(selectedCommunicationPhoneType));

    if (customerLoadedData) {
      dispatch(
        setCustomerLoadedData({
          ...customerLoadedData,
          firstName: updatedCustomer.firstName,
          middleName: updatedCustomer.middleName,
          lastName: updatedCustomer.lastName,
          fullName,
          companyName: updatedCustomer.companyName,
          customerProfileType: updatedProfileType,
          emails: updatedCustomer.email ? [updatedCustomer.email] : [],
          phoneNumber: communicationPhone,
          phoneNumbers: communicationPhone ? [communicationPhone] : [],
          phoneNumbersByCategory: {
            cell: updatedCustomer.cellPhone,
            home: updatedCustomer.homePhone,
            work: updatedCustomer.workPhone,
            other: updatedCustomer.otherPhone,
          },
        })
      );
    }
  };

  return (
    <Wrapper>
      <TitleRow>
        <AppointmentConfirmationTitle>{t('Customer Information')}</AppointmentConfirmationTitle>
        {isExistingCustomer && customerLoadedData ? (
          <button
            type="button"
            style={{
              textTransform: 'uppercase',
              color: '#142EA1',
              fontSize: '14px',
              cursor: 'pointer',
              margin: '0 0 0 24px',
              fontWeight: 'bold',
              border: 0,
              background: 'transparent',
              padding: 0,
            }}
            onClick={onEditOpen}
          >
            {t('Edit')}
          </button>
        ) : null}
      </TitleRow>
      {!isExistingCustomer ? (
        <ProfileTypeWrapper>
          <RadioGroup row value={customerProfileType} onChange={handleProfileTypeChange}>
            <FormControlLabel
              value={ECustomerProfileType.Personal}
              control={<Radio size="small" />}
              label={t('Personal').toUpperCase()}
            />
            <FormControlLabel
              value={ECustomerProfileType.Business}
              control={<Radio size="small" />}
              label={t('Business').toUpperCase()}
            />
          </RadioGroup>
        </ProfileTypeWrapper>
      ) : null}
      {isExistingCustomer ? (
        <TextField
          value={customer.fullName}
          error={errors.includes('fullname')}
          name="fullName"
          disabled
          fullWidth
          placeholder={t('Type here')}
          label={`${t('Full Name')}:`}
        />
      ) : (
        <>
          <TextField
            onChange={handleChange}
            value={customer.firstName ?? ''}
            error={errors.includes('firstname')}
            name="firstName"
            fullWidth
            placeholder={t('Type here')}
            label={`${t('First Name')}:`}
          />
          {customerProfileType === ECustomerProfileType.Personal ? (
            <TextField
              onChange={handleChange}
              value={customer.middleName ?? ''}
              name="middleName"
              fullWidth
              placeholder={t('Type here')}
              label={`${t('Middle Name')} (${t('Optional')}):`}
            />
          ) : null}
          <TextField
            onChange={handleChange}
            value={customer.lastName ?? ''}
            error={errors.includes('lastname')}
            name="lastName"
            fullWidth
            placeholder={t('Type here')}
            label={`${t('Last Name')}:`}
          />
        </>
      )}
      {customerProfileType === ECustomerProfileType.Business ? (
        <TextField
          onChange={handleChange}
          value={customer?.companyName ?? ''}
          disabled={isExistingCustomer}
          name="companyName"
          fullWidth
          error={errors.includes('companyname')}
          placeholder={t('Type here')}
          label={`${t('Company Name')}:`}
        />
      ) : null}
      <TextField
        onChange={handleChange}
        value={customer?.phoneNumber}
        disabled={isExistingCustomer}
        name="phoneNumber"
        fullWidth
        error={errors.includes('phonenumber')}
        placeholder={t('Type here')}
        label={`${t('Phone Number')}:`}
      />
      <TextField
        onChange={handleChange}
        value={customer?.email}
        error={errors.includes('email') && isEmailRequired}
        name="email"
        disabled={isExistingCustomer}
        fullWidth
        placeholder={t('Type here')}
        label={`${t('Email')}:`}
      />
      {customerLoadedData ? (
        <EditCustomerModal
          open={isEditOpen}
          onClose={onEditClose}
          customerLoadedData={customerLoadedData}
          communicationPhone={selectedAppointmentPhoneNumber || customer.phoneNumber}
          communicationPhoneType={communicationPhoneType}
          isEmailRequired={isEmailRequired}
          onUpdated={handleCustomerUpdated}
        />
      ) : null}
    </Wrapper>
  );
};
