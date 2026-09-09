import React, { useEffect, useMemo } from 'react';
import ReactGA from 'react-ga4';
import { StepWrapper } from '../../../../../components/styled/StepWrapper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../store/rootReducer';
import { TArgCallback } from '../../../../../types/types';
import { EServiceType } from '../../../../../store/reducers/appointmentFrameReducer/types';
import { useTranslation } from 'react-i18next';
import { setWelcomeScreenView } from '../../../../../store/reducers/appointmentFrameReducer/actions';
import { ILoadedVehicle } from '../../../../../api/types';
import { Loading } from '../../../../../components/wrappers/Loading/Loading';
import AddToCalendarButton from './AddToCalendarButton/AddToCalendarButton';
import ModifyButton from './ModifyButton/ModifyButton';
import MakeNewButton from './MakeNewButton/MakeNewButton';
import { ButtonsWrapper, Divider, Paper, Wrapper } from './styles';
import { TItem } from './types';
import { getServiceName } from './utils';
import { ESettingType } from '../../../../../store/reducers/generalSettings/types';
import { getMaintenanceDescription } from '../../../../../utils/getMaintenanceDescription';
import { ETransportationType } from '../../../../../store/reducers/transportationNeeds/types';
import {
  getAddressText,
  getConfirmedDate,
  getPriceContent,
  getVehicleData,
  hasNoDefinedPrice,
  resolveServiceType,
} from './helpers';
import { buildConfirmationItems, withPickUpTime } from './itemBuilders';

type TProps = {
  onUpdateAppointment: TArgCallback<ILoadedVehicle>;
  isManagingFlow: boolean;
};

export const AppointmentConfirmed: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TProps>>
> = ({ isManagingFlow, onUpdateAppointment }) => {
  const {
    appointment,
    serviceValetAppointment,
    serviceRequests,
    selectedSR,
    scProfile,
    dropOffSettings,
    waitListSettings,
  } = useSelector((state: RootState) => state.appointment);
  const {
    selectedPackage,
    packagePricingType,
    packageEMenuType,
    customer,
    selectedVehicle,
    serviceCategories,
    serviceTypeOption,
    address,
    zipCode,
    valueService,
    selectedRecalls,
    packagePriceTitles,
    isAppointmentSaving,
    appointmentByKey,
    transactionValue,
    trackerData,
    transportation,
    appointmentRequestsPrices,
  } = useSelector((state: RootState) => state.appointmentFrame);
  const { allCategories } = useSelector((state: RootState) => state.categories);
  const { engineTypes } = useSelector((state: RootState) => state.vehicleDetails);
  const { settings } = useSelector((state: RootState) => state.generalSettings);

  const companyNameIsOn = useMemo(
    () => settings.find(el => el.settingType === ESettingType.CompanyName)?.data?.isOn,
    [settings]
  );
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const serviceType = useMemo(
    () => resolveServiceType(serviceTypeOption, transportation),
    [serviceTypeOption, transportation]
  );

  const servicesList = useMemo(
    () =>
      getMaintenanceDescription(
        serviceRequests,
        selectedRecalls,
        packagePriceTitles,
        selectedSR,
        selectedPackage,
        allCategories,
        serviceCategories,
        valueService,
        packagePricingType,
        packageEMenuType,
        scProfile?.maintenancePackageOptionTypes
      ),
    [
      serviceRequests,
      selectedSR,
      selectedRecalls,
      selectedPackage,
      allCategories,
      packagePriceTitles,
      serviceCategories,
      valueService,
      packagePricingType,
      packageEMenuType,
      scProfile,
    ]
  );

  const engine = useMemo(
    () => engineTypes.find(item => item.id === Number(selectedVehicle?.engineTypeId)),
    [engineTypes, selectedVehicle]
  );
  const vehicleData = useMemo(
    () => getVehicleData({ selectedVehicle, valueService, engineName: engine?.name }),
    [selectedVehicle, valueService, engine]
  );
  const serviceName = useMemo(
    () => getServiceName(serviceTypeOption, serviceType),
    [serviceTypeOption, serviceType]
  );

  const isServiceValetApp = useMemo(
    () =>
      Boolean(serviceValetAppointment) &&
      (serviceTypeOption?.type === EServiceType.PickUpDropOff ||
        transportation?.type === ETransportationType.PickUpDelivery),
    [serviceValetAppointment, serviceTypeOption, transportation]
  );

  const isServiceValetManage = useMemo(
    () =>
      Boolean(
        !appointment && serviceTypeOption?.type === EServiceType.PickUpDropOff && appointmentByKey
      ),
    [appointment, serviceTypeOption, appointmentByKey]
  );

  const noDefinedPriceExists = useMemo(
    () =>
      hasNoDefinedPrice({
        isManagingFlow,
        appointmentRequestsPrices,
        serviceValetAppointment,
        serviceTypeOption,
        transportation,
        appointment,
      }),
    [
      isManagingFlow,
      appointmentRequestsPrices,
      serviceValetAppointment,
      serviceTypeOption,
      transportation,
      appointment,
    ]
  );

  useEffect(() => {
    ReactGA.event('asc_form_submission_service_appt', { element_text: 'Appointment Scheduled' });
    dispatch(setWelcomeScreenView('select'));
  }, [dispatch, trackerData]);

  const dateValue = useMemo(
    () =>
      getConfirmedDate({
        isServiceValetApp,
        serviceValetAppointment,
        appointment,
        appointmentByKey,
      }),
    [isServiceValetApp, serviceValetAppointment, appointment, appointmentByKey]
  );

  const addressContent = useMemo(
    () =>
      getAddressText({ serviceType, address, zipCode, serviceCenterAddress: scProfile?.address }),
    [serviceType, address, zipCode, scProfile]
  );

  const selectedPriceContent = useMemo(
    () =>
      getPriceContent({
        noDefinedPriceExists,
        transactionValue,
        isRoundPrice: scProfile?.isRoundPrice,
        isServiceValetApp,
        serviceValetAppointment,
        appointment,
        packageEMenuType,
        selectedPackage,
        t,
      }),
    [
      noDefinedPriceExists,
      transactionValue,
      scProfile,
      isServiceValetApp,
      serviceValetAppointment,
      appointment,
      packageEMenuType,
      selectedPackage,
      t,
    ]
  );

  const data: TItem[] = useMemo(() => {
    const isWaitListCreated =
      Boolean(appointment?.isOverbookingApplied) &&
      Boolean(waitListSettings?.isEnabled) &&
      serviceType === EServiceType.VisitCenter;
    const isWaitListManaged =
      Boolean(appointmentByKey?.isWaitlist) &&
      Boolean(appointmentByKey?.waitlistTextSettings?.isEnabled) &&
      serviceType === EServiceType.VisitCenter;
    const isWaitList = appointment ? isWaitListCreated : isWaitListManaged;

    const dateContent = isWaitList
      ? [
          <div key={dateValue}>{dateValue}</div>,
          <div
            key="textWaitList"
            style={{
              color: waitListSettings?.textHex ? `#${waitListSettings.textHex}` : '#CE690B',
              marginTop: 12,
            }}
          >
            {waitListSettings?.text ?? t('Waitlist only')}
          </div>,
        ]
      : dateValue;

    const list = buildConfirmationItems({
      t,
      isServiceValetApp,
      isServiceValetManage,
      dateContent,
      serviceType,
      serviceName,
      addressContent,
      servicesList,
      selectedPriceContent,
      customer,
      companyNameIsOn,
      vehicleData,
    });

    return withPickUpTime({
      list,
      isServiceValetApp,
      isServiceValetManage,
      serviceValetAppointment,
      showDropOffTime: dropOffSettings?.showDropOffTime,
      t,
    });
  }, [
    appointment,
    appointmentByKey,
    serviceType,
    dateValue,
    isServiceValetApp,
    isServiceValetManage,
    waitListSettings,
    t,
    serviceName,
    addressContent,
    servicesList,
    selectedPriceContent,
    customer,
    companyNameIsOn,
    vehicleData,
    serviceValetAppointment,
    dropOffSettings,
  ]);

  return (
    <StepWrapper>
      <Paper>
        <Wrapper>
          <h2>Appointment Confirmed!</h2>
          {isAppointmentSaving ? (
            <div className="emptyContainer">
              <Loading />
            </div>
          ) : (
            data
              .filter(el => el.content)
              .map((item, index) => {
                if (!item.label.length && item.content.length) return null;
                return (
                  <div className="item" key={item.label + index}>
                    <div className="label">{item.label}</div>
                    <div className="content">{item.content}</div>
                  </div>
                );
              })
          )}
        </Wrapper>
        <ButtonsWrapper>
          <ModifyButton onUpdateAppointment={onUpdateAppointment} />
          <AddToCalendarButton servicesList={servicesList} serviceName={serviceName} />
          <Divider />
        </ButtonsWrapper>
        <MakeNewButton />
        <h3>{t('We will see you soon!')}</h3>
      </Paper>
    </StepWrapper>
  );
};
