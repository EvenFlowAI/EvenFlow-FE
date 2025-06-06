import React, { Dispatch, SetStateAction, useEffect, useMemo } from 'react';
import { AppointmentConfirmationTitle } from '../../../../../../components/wrappers/AppointmentConfirmationTitle/AppointmentConfirmationTitle';
import { TextField } from '../../../../../../components/formControls/TextFieldStyled/TextField';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../../store/rootReducer';
import { setCustomer } from '../../../../../../store/reducers/appointmentFrameReducer/actions';
import { useTranslation } from 'react-i18next';
import { Wrapper } from './styles';
import { EUserType } from '../../../../../../store/reducers/appointmentFrameReducer/types';
import { ESettingType } from '../../../../../../store/reducers/generalSettings/types';
import { ICustomer } from '../../../../../../api/types';

type TUserDataProps = {
  errors: string[];
  setErrors: Dispatch<SetStateAction<string[]>>;
  isEmailRequired: boolean;
};

export const AppointmentUserData: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TUserDataProps>>
> = ({ errors, setErrors, isEmailRequired }) => {
  const { customerLoadedData } = useSelector((state: RootState) => state.appointment);
  const { settings } = useSelector((state: RootState) => state.generalSettings);
  const { customer, userType } = useSelector((state: RootState) => state.appointmentFrame);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const companyNameIsOn = useMemo(() => {
    return settings.find(el => el.settingType === ESettingType.CompanyName)?.data?.isOn;
  }, [settings]);

  useEffect(() => {
    if (customerLoadedData) {
      // const driverEmail =
      //   customer.email || (customerLoadedData?.emails?.length ? customerLoadedData.emails[0] : '');
      const driverEmail = customerLoadedData?.emails?.length ? customerLoadedData.emails[0] : '';

      const data: ICustomer = {
        ...customer,
        fullName:
          customerLoadedData?.fullName ??
          `${customerLoadedData.firstName} ${customerLoadedData.lastName}`,
        email: driverEmail,
        phoneNumber: customerLoadedData?.phoneNumbers?.length
          ? customerLoadedData.phoneNumbers[0]
          : '',
        city: customerLoadedData?.address?.city,
        companyName: customerLoadedData.companyName,
      };
      dispatch(setCustomer(data));
    }
  }, [customerLoadedData, dispatch]);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = ({
    target: { name, value },
  }) => {
    if (customer) {
      dispatch(setCustomer({ ...customer, [name]: value }));
    }
    setErrors(errors => errors.filter(err => err !== name.toLowerCase()));
  };
  return (
    <Wrapper>
      <AppointmentConfirmationTitle>{t('Customer Information')}</AppointmentConfirmationTitle>
      <TextField
        onChange={handleChange}
        value={customer?.fullName}
        error={errors.includes('fullname')}
        name="fullName"
        disabled={userType === EUserType.Existing}
        fullWidth
        placeholder={t('Type here')}
        label={`${t('Full Name')}:`}
      />
      {companyNameIsOn ? (
        <TextField
          onChange={handleChange}
          value={customer?.companyName ?? ''}
          disabled={
            customerLoadedData?.isUpdating && Boolean(customerLoadedData?.companyName?.length)
          }
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
        disabled={userType === EUserType.Existing && !!customerLoadedData?.phoneNumbers.length}
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
        fullWidth
        placeholder={t('Type here')}
        label={`${t('Email')}:`}
      />
    </Wrapper>
  );
};
