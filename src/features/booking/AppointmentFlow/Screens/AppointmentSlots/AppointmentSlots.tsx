import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StepWrapper } from '../../../../../components/styled/StepWrapper';
import { ActionButtons } from '../../../ActionButtons/ActionButtons';
import { SelectedAppointment } from './SelectedAppointment/SelectedAppointment';
import { AppointmentDateSelector } from '../../../../../components/bookingDateTime/AppointmentDateSelector/AppointmentDateSelector';
import { AppointmentTimeSelector } from '../../../../../components/bookingDateTime/AppointmentTimeSelector/AppointmentTimeSelector';
import { useHistory, useParams } from 'react-router-dom';
import { decodeSCID, getCategories, mapRecallsForRequest } from '../../../../../utils/utils';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../store/rootReducer';
import {
  EAppointmentTimingType,
  IAppointmentSlotsRequest,
  MPOptionShort,
} from '../../../../../store/reducers/appointment/types';
import {
  loadAppointmentSlots,
  loadServiceValetSlots,
  selectAppointment,
  selectServiceValetAppointment,
} from '../../../../../store/reducers/appointment/actions';
import { TGroupedAppointments } from '../../../../../utils/types';
import ReactGA from 'react-ga4';
import { EServiceCategoryType } from '../../../../../store/reducers/categories/types';
import {
  EServiceType,
  EUserType,
} from '../../../../../store/reducers/appointmentFrameReducer/types';
import { TArgCallback, TCallback, TParsableDate } from '../../../../../types/types';
import { TScreen } from '../../../../../types/screens';
import { SVAppointmentDateSelector } from '../../../../../components/bookingDateTime/SVAppointmentDateSelector/SVAppointmentDateSelector';
import { SVAppointmentTimeSelector } from '../../../../../components/bookingDateTime/SVAppointmentTimeSelector/SVAppointmentTimeSelector';
import {
  clearAppointmentSteps,
  loadActiveTransportations,
  setServiceTypeOption,
  setTime,
  setWelcomeScreenView,
} from '../../../../../store/reducers/appointmentFrameReducer/actions';
import { useTranslation } from 'react-i18next';
import { SlotsScreenWrapper } from './styles';
import { groupAppointments } from './utils';
import { Routes } from '../../../../../routes/constants';
import dayjs from 'dayjs';
import CustomerConsents from '../../../../../components/modals/booking/CustomerConsents/CustomerConsents';
import { useModal } from '../../../../../hooks/useModal/useModal';
import MileageModal from '../../../../../components/modals/booking/MileageModal/MileageModal';
import { IFirstScreenOption } from '../../../../../store/reducers/serviceTypes/types';
import utc from 'dayjs/plugin/utc';
import { useException } from '../../../../../hooks/useException/useException';
import AppointmentFilters from './AppointmentFilters/AppointmentFilters';
import { useMediaQuery, useTheme } from '@mui/material';
import {
  getClearDate,
  getClearSVDate,
  sortAppointments,
  sortSVAppointments,
} from '../../../../../utils/svAppointments';
import { collectServiceRequestIds } from '../../../../../utils/collectServiceRequestIds';

dayjs.extend(utc);

type TAppointmentSelectionProps = {
  handleSetScreen: TArgCallback<TScreen>;
  onNext: TCallback;
  prevLogicalScreen: TScreen;
  fromServiceValetToVisitCenter?: boolean;
  isManaging?: boolean;
};

export const AppointmentSlots: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TAppointmentSelectionProps>>
> = ({ handleSetScreen, onNext, prevLogicalScreen, fromServiceValetToVisitCenter, isManaging }) => {
  const {
    appointmentSlots,
    serviceValetSlots,
    customerLoadedData,
    selectedSR,
    appointment,
    serviceValetAppointment,
    customerEnteredEmail,
    slotsServiceTypeOptionId,
    slotsTransportationId,
    slotsSearchedDate,
    selectedSRComments,
  } = useSelector((state: RootState) => state.appointment);

  const {
    selectedTiming,
    selectedTime,
    selectedVehicle,
    service,
    subService,
    selectedPackage,
    advisor,
    serviceCategories,
    valueService,
    userType,
    hashKey,
    zipCode,
    address,
    selectedRecalls,
    serviceTypeOption,
    packagePricingType,
    packageEMenuType,
    consultants,
    appointmentByKey,
    isConsultantsLoading,
    isConsentsLoading,
    trackerData,
    transportation,
    editingPosition,
    serviceOptionChangedFromSlotPage,
  } = useSelector((state: RootState) => state.appointmentFrame);

  const { currentConfig, isAppointmentTimingAvailable, isTransportationAvailable } = useSelector(
    (state: RootState) => state.bookingFlowConfig
  );

  const { allCategories } = useSelector((state: RootState) => state.categories);
  const { mileage } = useSelector((state: RootState) => state.vehicleDetails);
  const { firstScreenOptions } = useSelector((state: RootState) => state.serviceTypes);

  const [date, setDate] = useState<TParsableDate>(dayjs.utc().startOf('day'));
  const [month, setMonth] = useState<TParsableDate>(dayjs.utc());
  const [loading, setLoading] = useState<boolean>(false);
  const dateSlotsRef = useRef<HTMLDivElement | null>(null);
  const [currentApiStartDate, setCurrentApiStartDate] = useState<string | null>(null);
  const [currentApiEndDate, setCurrentApiEndDate] = useState<string | null>(null);
  const apiDatesSetRef = useRef<boolean>(false);
  // const serviceType = useMemo(
  //   () => (serviceTypeOption ? serviceTypeOption.type : EServiceType.VisitCenter),
  //   [serviceTypeOption]
  // );
  const { id } = useParams<{ id: string }>();
  const initRef = useRef<boolean>(false);
  const isMount = useRef(true);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const history = useHistory();
  const showError = useException();
  const { isOpen: isMileageOpen, onClose: onMileageClose, onOpen: onMileageOpen } = useModal();
  const {
    isOpen: isServiceOptionOpen,
    onClose: onServiceOptionClose,
    onOpen: onServiceOptionOpen,
  } = useModal();
  const theme = useTheme();
  const nextDisabled = useMemo(
    () =>
      serviceTypeOption?.type === EServiceType.PickUpDropOff
        ? !serviceValetAppointment
        : !appointment,
    [appointment, serviceValetAppointment]
  );

  const isMd = useMediaQuery(theme.breakpoints.down('md'));
  const isXs = useMediaQuery(theme.breakpoints.down('xsm'));
  const isMds = useMediaQuery(theme.breakpoints.down('mds'));
  const daysPerScreen: number = useMemo(() => {
    return isXs ? 3 : isMd ? 4 : isMds ? 5 : 6;
  }, [isMd, isMds, isXs]);

  const groupedAppointments: TGroupedAppointments = useMemo(() => {
    return groupAppointments(appointmentSlots);
  }, [appointmentSlots]);

  const currentSlots = useMemo(
    () =>
      serviceTypeOption?.type === EServiceType.PickUpDropOff ? serviceValetSlots : appointmentSlots,
    [serviceTypeOption, serviceValetSlots, appointmentSlots]
  );

  const currentAppointment = useMemo(() => {
    return serviceTypeOption?.type === EServiceType.PickUpDropOff
      ? serviceValetAppointment
      : appointment;
  }, [serviceTypeOption, serviceValetAppointment, appointment]);

  const handleGALandingOnPage = useCallback(() => {
    if (consultants?.length && currentConfig?.advisorSelection) {
      ReactGA.event('asc_form_engagement', {
        element_text: 'Advisor Selected',
        advisor_name: advisor ? advisor.name : 'Any available',
      });
    }
    if (appointment) {
      ReactGA.event('asc_form_engagement', {
        element_text: 'Services Selected',
        request_codes: appointment?.serviceRequestPrices?.map(item => item.requestName).join(', '),
        total_price: !isNaN(appointment?.price?.value) ? `$${+appointment.price.value}` : undefined,
      });
    }
  }, [advisor, appointment, consultants, currentConfig, trackerData]);

  useEffect(() => {
    handleGALandingOnPage();
  }, [selectedPackage, advisor, appointment]);

  useEffect(() => {
    if (selectedTime) setMonth(dayjs.utc(selectedTime));
  }, [selectedTime]);

  const selectFirstSlot = useCallback(
    (
      date?: TParsableDate,
      newServiceOption?: IFirstScreenOption,
      haveToOffsetConverter?: boolean
    ) => {
      const serviceOption = newServiceOption ?? serviceTypeOption;
      const currentSlots =
        serviceOption?.type === EServiceType.PickUpDropOff ? serviceValetSlots : appointmentSlots;
      if (currentSlots?.length) {
        const utcOffset = dayjs().utcOffset();
        const newDate = date ?? dayjs();

        // added a hook with Math.abs, and a flag that we only give in "Choose a preferred date" when the time zones differ by more than eight hours
        const dateWithOffset = dayjs(newDate).isSame(dayjs(), 'date')
          ? dayjs()
          : (haveToOffsetConverter ? Math.abs(utcOffset) : utcOffset) > 0
            ? dayjs(newDate)
            : getClearDate(newDate);

        let firstAvailableSlot = null;
        if (serviceOption?.type === EServiceType.PickUpDropOff) {
          const sorted = [...serviceValetSlots].sort(sortSVAppointments);
          firstAvailableSlot = sorted.find(slot => {
            const formatted = getClearSVDate(slot?.date);
            return (
              dayjs(formatted).isSame(dayjs.utc(dateWithOffset), 'date') ||
              dayjs(formatted).isAfter(dayjs.utc(dateWithOffset))
            );
          });
          if (!firstAvailableSlot) {
            console.info('Can not assign first available slot for pickUpDropOff');
          } else {
            dispatch(selectServiceValetAppointment(firstAvailableSlot));
            setDate(firstAvailableSlot.date);
          }
        } else {
          const sorted = [...appointmentSlots].sort(sortAppointments);
          firstAvailableSlot = sorted.find(slot => {
            const formatted = getClearDate(slot?.date);
            return dayjs(formatted).isAfter(dateWithOffset);
          });
          if (!firstAvailableSlot) {
            console.info('Can not assign first available slot for general');
          } else {
            dispatch(selectAppointment(firstAvailableSlot));
            setDate(firstAvailableSlot.date);
          }
        }
      }
    },
    [serviceValetSlots, appointmentSlots, currentSlots]
  );

  useEffect(() => {
    if (currentSlots.length) {
      const utcOffset = dayjs().utcOffset();
      const dateWithOffset = dayjs(slotsSearchedDate as TParsableDate).isSame(dayjs(), 'date')
        ? dayjs()
        : utcOffset > 0
          ? dayjs(slotsSearchedDate as TParsableDate)
          : getClearDate(slotsSearchedDate as TParsableDate);
      if (currentAppointment?.date) {
        const sameSearchDate = getClearDate(currentAppointment.searchDate).isSame(
          dateWithOffset,
          'date'
        );
        const slotTimeIsValid = dayjs(getClearDate(currentAppointment.date)).isAfter(
          dateWithOffset
        );
        const theSameServiceOption = slotsServiceTypeOptionId === serviceTypeOption?.id;
        const theSameTransportation = slotsTransportationId === transportation?.id;
        if (theSameServiceOption && sameSearchDate && slotTimeIsValid) {
          if (theSameTransportation) {
            selectedTime
              ? selectFirstSlot(
                  dayjs(selectedTime).isSame(dayjs(), 'date') ? dayjs() : selectedTime
                )
              : selectFirstSlot();
          } else {
            setDate(dayjs.utc(currentAppointment.date).startOf('day'));
          }
        } else {
          selectedTime
            ? selectFirstSlot(
                dayjs(selectedTime).isSame(dayjs(), 'date') ? dayjs() : selectedTime,
                undefined,
                true
              )
            : selectFirstSlot();
        }
      } else {
        selectedTime
          ? selectFirstSlot(
              dayjs(selectedTime).isSame(dayjs(), 'date') ? dayjs() : selectedTime,
              undefined,
              true
            )
          : selectFirstSlot();
      }
      isMount.current = false;
    }
  }, [
    selectedTime,
    selectFirstSlot,
    currentSlots,
    serviceTypeOption,
    slotsServiceTypeOptionId,
    slotsSearchedDate,
    slotsTransportationId,
    transportation,
  ]);

  useEffect(() => {
    let timeoutId: any = null;
    const isTodaySlot = dayjs(appointment?.date).isSame(dayjs.utc(), 'day');
    const differenceInMSeconds = dayjs(dayjs(appointment?.date).format('YYYY-MM-DDTHH:mm:ss')).diff(
      dayjs.utc()
    );
    if (isTodaySlot && differenceInMSeconds > 0) {
      timeoutId = setTimeout(() => {
        selectFirstSlot(date);
      }, differenceInMSeconds);
    } else {
      clearTimeout(timeoutId);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [appointment, date]);

  const clearData = () => {
    dispatch(selectAppointment(null));
    dispatch(selectServiceValetAppointment(null));
    dispatch(
      clearAppointmentSteps(
        isTransportationAvailable ? 'transportationNeeds' : 'appointmentSelection'
      )
    );
  };

  const updateDate = useCallback(
    (d: TParsableDate, keepSlot?: boolean) => {
      if (!keepSlot) {
        clearData();
      }

      const newDate = dayjs.utc(d);
      const minDate = newDate.isSame(dayjs.utc(), 'date') ? dayjs.utc() : newDate;
      setDate(newDate);

      if (!keepSlot) {
        selectFirstSlot(minDate);
      }

      if (!newDate.isSame(dayjs.utc(month), 'month')) {
        setMonth(newDate);
      }
    },
    [month, selectedTiming, selectFirstSlot]
  );

  const onChangeServiceOption = () => {
    updateDate(dayjs(), true);
  };

  const setDateCallback = useCallback(
    (d: TParsableDate) => {
      if (selectedTiming !== EAppointmentTimingType.FirstAvailable) {
        setDate(dayjs(d).startOf('day'));
      }
    },
    [selectedTiming]
  );

  const handleDateRangeSet = useCallback((v: boolean) => {
    initRef.current = v;
  }, []);

  const handleError = (e: any) => {
    const internalServerError = e.response?.data?.message
      ?.toLowerCase()
      .includes('internal server');
    if (internalServerError) {
      const errorMessage = `We are sorry but there is a capacity configuration error. 
            No appointment dates and times are available for the specific appointment request. 
            Error identifier: ${e.response?.data?.id ?? ''}`;
      showError(errorMessage);
    } else {
      showError(e);
    }
  };

  const onLoadSlots = (isEmptyList: boolean) => {
    // const isPossibleToChangeType =
    //   firstScreenOptions.filter(item => item.type !== EServiceType.MobileService)?.length > 1;
    // const isMobileServiceType = serviceTypeOption?.type === EServiceType.MobileService;
    // if (isEmptyList && isPossibleToChangeType && !isMobileServiceType) {
    //   onServiceOptionOpen();
    // }
  };

  const getApiDates = () => {
    const utcOffset = dayjs().utcOffset();
    const anchorTime = selectedTime ? dayjs(selectedTime) : dayjs().startOf('day');
    const idealStartDay = anchorTime.subtract(Math.floor(daysPerScreen / 3), 'day').startOf('day');
    const desiredStartDate = dayjs.max(dayjs().startOf('day'), idealStartDay);
    const desiredEndDate = desiredStartDate.add(daysPerScreen - 1, 'day');
    const apiStartDate = desiredStartDate.add(utcOffset, 'minute').toISOString();
    const apiEndDate = desiredEndDate.add(utcOffset, 'minute').toISOString();
    return { apiStartDate, apiEndDate };
  };

  const setApiDates = (newStartDate: string) => {
    // Only run once per session/component mount
    if (apiDatesSetRef.current) {
      return;
    }

    apiDatesSetRef.current = true;

    const utcOffset = dayjs().utcOffset();
    const anchorTime = dayjs(newStartDate);
    const idealStartDay = anchorTime.subtract(Math.floor(daysPerScreen / 3), 'day').startOf('day');
    const desiredStartDate = dayjs.max(dayjs().startOf('day'), idealStartDay);
    const desiredEndDate = desiredStartDate.add(daysPerScreen - 1, 'day');
    const apiStartDate = desiredStartDate.add(utcOffset, 'minute').toISOString();
    const apiEndDate = desiredEndDate.add(utcOffset, 'minute').toISOString();
    setCurrentApiStartDate(apiStartDate);
    setCurrentApiEndDate(apiEndDate);
  };

  const loadData = async ({
    requestedStartDate,
    requestedEndDate,
  }: {
    requestedStartDate?: string;
    requestedEndDate?: string;
  }) => {
    if (id) {
      setCurrentApiStartDate(requestedStartDate ?? null);
      setCurrentApiEndDate(requestedEndDate ?? null);
      setLoading(true);
      const utcOffset = dayjs().utcOffset();
      const fromDate = selectedTime
        ? dayjs(selectedTime).add(utcOffset, 'minute').toISOString()
        : dayjs().startOf('day').add(utcOffset, 'minute').toISOString();
      try {
        const maintenancePackageOption: MPOptionShort | null = selectedPackage
          ? { id: selectedPackage?.id, priceType: packagePricingType }
          : packageEMenuType !== null
            ? { optionType: packageEMenuType }
            : null;

        const transportationOptionId: number | null =
          (serviceTypeOption?.type === EServiceType.VisitCenter || !serviceTypeOption) &&
          !serviceTypeOption?.transportationOption &&
          transportation
            ? transportation.id
            : null;

        const data: IAppointmentSlotsRequest = {
          appointmentTimingType:
            serviceTypeOption?.type === EServiceType.PickUpDropOff || !selectedTiming
              ? EAppointmentTimingType.FirstAvailable
              : selectedTiming,
          serviceCenterId: decodeSCID(id),
          advisorId: advisor?.id ?? null,
          fromDate: serviceTypeOption?.type === EServiceType.PickUpDropOff ? fromDate : undefined,
          startDate:
            serviceTypeOption?.type !== EServiceType.PickUpDropOff ? requestedStartDate : undefined,
          endDate:
            serviceTypeOption?.type !== EServiceType.PickUpDropOff ? requestedEndDate : undefined,
          maintenancePackageOption,
          serviceRequests: collectServiceRequestIds(
            service,
            subService,
            selectedPackage,
            selectedSR,
            undefined,
            selectedSRComments
          ),
          serviceCategories: getCategories(allCategories, serviceCategories),
          customerId: customerLoadedData?.id,
          warrantyExpiration: selectedVehicle?.warrantyExpiration,
          serviceTypeOptionId: serviceTypeOption?.id ?? null,
          recalls: mapRecallsForRequest(selectedRecalls),
          transportationOptionId,
        };
        if (valueService?.selectedService) {
          data.valueServiceOfferIds = [valueService.selectedService.id];
        }
        if (zipCode?.length) data.zipCode = zipCode;
        if (address) {
          if (address?.label) {
            data.address = address.label;
          } else if (typeof address === 'string') {
            data.address = address;
          }
        }
        if (selectedVehicle) {
          data.vehicle = {
            vin: selectedVehicle.vin,
            year: selectedVehicle.year,
            make: selectedVehicle.make,
            model: selectedVehicle.model,
            mileage: selectedVehicle.mileage,
            engineTypeId: selectedVehicle.engineTypeId,
          };
        }
        if (hashKey) data.appointmentHashKey = hashKey;
        if (userType === EUserType.Existing && customerEnteredEmail)
          data.searchTerm = customerEnteredEmail;
        if (serviceTypeOption?.type === EServiceType.PickUpDropOff) {
          if (data.address && data.zipCode)
            await dispatch(loadServiceValetSlots(data, undefined, onLoadSlots, handleError));
        } else {
          await dispatch(
            loadAppointmentSlots(
              data,
              currentAppointment ? () => {} : setDateCallback,
              () => handleDateRangeSet(false),
              onLoadSlots,
              handleError,
              setApiDates
            )
          );
        }
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const mileageIsValid =
      selectedVehicle?.mileage &&
      mileage.find(item => item.value.toString() === selectedVehicle?.mileage?.toString());
    if (!mileageIsValid) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        onMileageOpen();
      }, 1000);
    } else {
      const { apiStartDate, apiEndDate } = getApiDates();
      loadData({ requestedStartDate: apiStartDate, requestedEndDate: apiEndDate }).finally();
    }
  }, [
    dispatch,
    selectedVehicle,
    customerLoadedData,
    service,
    packagePricingType,
    packageEMenuType,
    serviceTypeOption,
    subService,
    selectedPackage,
    selectedSR,
    advisor,
    valueService,
    zipCode,
    address,
    mileage,
    transportation,
    selectedSRComments,
  ]);

  useEffect(() => {
    if (
      ![EServiceType.PickUpDropOff, EServiceType.MobileService].includes(
        serviceTypeOption?.type as EServiceType
      )
    ) {
      dispatch(loadActiveTransportations(decodeSCID(id)));
    }
  }, [id]);

  const handleGANext = useCallback(() => {
    if (appointment) {
      ReactGA.event('asc_form_engagement', {
        element_text:
          serviceTypeOption?.type === EServiceType.PickUpDropOff
            ? 'Valet Date & Time Selected'
            : 'Date & Time Selected',
        appointment_datetime: dayjs.utc(appointment.date).format('MM-DD-YYYY hh:mm A'),
      });
    }
  }, [appointment, serviceTypeOption, trackerData]);

  const handleGABack = useCallback(() => {
    ReactGA.event('asc_form_engagement', {
      element_text: 'Went Backwards',
      page_context: 'Selection Date & Time Page',
    });
  }, [trackerData]);

  const handleConsents = () => {
    handleSetScreen('appointmentConfirmation');
  };

  const handleNext = useCallback((): void => {
    handleGANext();
    onNext();
  }, [onNext, handleGANext]);

  const handleBack = useCallback((): void => {
    handleGABack();
    dispatch(setTime(null));
    if (!isManaging) {
      dispatch(selectAppointment(null));
      dispatch(selectServiceValetAppointment(null));
    }
    if (
      prevLogicalScreen === 'appointmentSelection' ||
      (fromServiceValetToVisitCenter && !isAppointmentTimingAvailable)
    ) {
      dispatch(setServiceTypeOption(appointmentByKey?.serviceTypeOption ?? null));
      dispatch(setWelcomeScreenView('serviceSelect'));
      history.push(Routes.EndUser.Welcome + '/' + id + '?frame=1');
    } else {
      if (editingPosition === 'slot' && serviceOptionChangedFromSlotPage) {
        dispatch(setServiceTypeOption(appointmentByKey?.serviceTypeOption ?? null));
      }
      handleSetScreen(prevLogicalScreen);
    }
  }, [currentConfig, history, fromServiceValetToVisitCenter, prevLogicalScreen, isManaging]);

  const loadDataForMileage = () => {
    onMileageClose();

    loadData({}).finally();
  };

  useEffect(() => {
    if (dateSlotsRef.current) {
      const selectedDateElement = dateSlotsRef.current.querySelector(`[data-date="${date}"]`);
      if (selectedDateElement) {
        selectedDateElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [date]);

  const loadNextSlots = async () => {
    if (!currentApiStartDate || !currentApiEndDate) {
      const { apiStartDate, apiEndDate } = getApiDates();
      await loadData({ requestedStartDate: apiStartDate, requestedEndDate: apiEndDate }).finally();
      return;
    }

    const nextStartDate = dayjs(currentApiStartDate).add(daysPerScreen, 'day');
    const nextEndDate = dayjs(currentApiEndDate).add(daysPerScreen, 'day');

    setDate(nextStartDate.startOf('month').toISOString());
    await loadData({
      requestedStartDate: nextStartDate.toISOString(),
      requestedEndDate: nextEndDate.toISOString(),
    }).finally();
  };

  const loadPreviousSlots = () => {
    if (!currentApiStartDate || !currentApiEndDate) {
      return;
    }

    const todayStart = dayjs().utc().startOf('day');

    let previousStartDate = dayjs(currentApiStartDate).subtract(daysPerScreen, 'day');

    if (previousStartDate.isBefore(todayStart)) {
      previousStartDate = todayStart;
    }

    const utcOffset = dayjs().utcOffset();
    const previousEndDate = previousStartDate.add(daysPerScreen - 1, 'day');

    // Added clearDate converter for user with other time zones
    setDate(
      utcOffset < 0
        ? dayjs(getClearDate(previousStartDate)).toISOString()
        : previousStartDate.toISOString()
    );

    // Added setTime for right set selectedSlot using backward button
    dispatch(
      setTime(utcOffset < 0 ? getClearDate(previousStartDate) : previousStartDate.toISOString())
    );

    loadData({
      requestedStartDate: previousStartDate.toISOString(),
      requestedEndDate: previousEndDate.toISOString(),
    }).finally();

    const currentMonth = dayjs(currentApiStartDate).month();
    const previousMonth = previousStartDate.month();

    if (currentMonth !== previousMonth) {
      if (dayjs(currentApiStartDate).date() <= daysPerScreen) {
        setDate(previousStartDate.endOf('month').toISOString());
      } else {
        setDate(previousStartDate.startOf('month').toISOString());
      }
    }
  };

  return (
    <StepWrapper>
      <SlotsScreenWrapper>
        <SelectedAppointment />
        <ActionButtons
          removeTopMargin
          onBack={handleBack}
          onNext={handleNext}
          nextDisabled={nextDisabled}
          nextLabel={t('Next')}
          loading={isConsultantsLoading || isConsentsLoading}
        />
        <AppointmentFilters
          onChangeServiceOption={onChangeServiceOption}
          isSm={isMd}
          isServiceOptionOpen={isServiceOptionOpen}
          onServiceOptionClose={onServiceOptionClose}
        />
        {serviceTypeOption?.type === EServiceType.PickUpDropOff ? (
          <SVAppointmentDateSelector
            onDateRangeSet={handleDateRangeSet}
            dateChangeDisabled={selectedTiming !== EAppointmentTimingType.SpecialOffers}
            date={date}
            loading={loading || isConsentsLoading}
            onDateChange={updateDate}
            dateRangeUpdated={initRef.current}
          />
        ) : (
          <AppointmentDateSelector
            dateChangeDisabled={selectedTiming !== EAppointmentTimingType.SpecialOffers}
            appointments={groupedAppointments}
            date={date}
            loading={loading || isConsentsLoading}
            onDateChange={updateDate}
            daysPerScreen={daysPerScreen}
            onLoadNext={loadNextSlots}
            onLoadPrevious={loadPreviousSlots}
            apiStartDate={currentApiStartDate || undefined}
            apiEndDate={currentApiEndDate || undefined}
          />
        )}
        {serviceTypeOption?.type === EServiceType.PickUpDropOff ? (
          <SVAppointmentTimeSelector date={date} loading={loading || isConsentsLoading} />
        ) : (
          <AppointmentTimeSelector
            appointments={
              groupedAppointments[dayjs.utc(date).startOf('day').toISOString().replace('.000', '')]
            }
            selectFirstSlot={selectFirstSlot}
            date={date}
            loading={loading || isConsentsLoading}
          />
        )}
      </SlotsScreenWrapper>
      <CustomerConsents onNext={handleConsents} />
      <MileageModal open={isMileageOpen} onClose={onMileageClose} onSave={loadDataForMileage} />
    </StepWrapper>
  );
};
