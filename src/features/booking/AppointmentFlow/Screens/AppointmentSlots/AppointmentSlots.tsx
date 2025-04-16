import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StepWrapper } from '../../../../../components/styled/StepWrapper';
import { ActionButtons } from '../../../ActionButtons/ActionButtons';
import { SelectedAppointment } from './SelectedAppointment/SelectedAppointment';
import { AppointmentDateSelector } from '../../../../../components/bookingDateTime/AppointmentDateSelector/AppointmentDateSelector';
import { AppointmentTimeSelector } from '../../../../../components/bookingDateTime/AppointmentTimeSelector/AppointmentTimeSelector';
import { useHistory, useParams } from 'react-router-dom';
import {
  collectServiceRequestIds,
  decodeSCID,
  getClearDate,
  getClearSVDate,
  mapRecallsForRequest,
  sortAppointments,
  sortSVAppointments,
} from '../../../../../utils/utils';
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
import { TArgCallback, TCallback, TParsableDate, TScreen } from '../../../../../types/types';
import { SVAppointmentDateSelector } from '../../../../../components/bookingDateTime/SVAppointmentDateSelector/SVAppointmentDateSelector';
import { SVAppointmentTimeSelector } from '../../../../../components/bookingDateTime/SVAppointmentTimeSelector/SVAppointmentTimeSelector';
import {
  clearAppointmentSteps,
  loadActiveTransportations,
  setServiceTypeOption,
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
    categoriesIds,
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

  const serviceType = useMemo(
    () => (serviceTypeOption ? serviceTypeOption.type : EServiceType.VisitCenter),
    [serviceTypeOption]
  );
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
      ReactGA.event(
        {
          category: 'EvenFlow User',
          action: 'Selected advisor',
          label: advisor ? advisor.name : 'Any available',
          nonInteraction: true,
        },
        trackerData.ids
      );
    }
    if (appointment) {
      ReactGA.event(
        {
          category: 'EvenFlow User',
          action: 'Selected Service Requests',
          label: `Requests Codes: 
                ${appointment?.serviceRequestPrices?.map(item => item.requestName).join(', ')}
                ${
                  !isNaN(appointment?.price?.value)
                    ? `with Total Price $${+appointment.price.value}`
                    : ''
                }`,
        },
        trackerData.ids
      );
    }
  }, [advisor, appointment, consultants, currentConfig, trackerData]);

  useEffect(() => {
    handleGALandingOnPage();
  }, [selectedPackage, advisor, appointment]);

  useEffect(() => {
    if (selectedTime) setMonth(dayjs.utc(selectedTime));
  }, [selectedTime]);

  const selectFirstSlot = useCallback(
    (date?: TParsableDate, newServiceOption?: IFirstScreenOption) => {
      const serviceOption = newServiceOption ?? serviceTypeOption;
      const currentSlots =
        serviceOption?.type === EServiceType.PickUpDropOff ? serviceValetSlots : appointmentSlots;
      if (currentSlots?.length) {
        const utcOffset = dayjs().utcOffset();
        const newDate = date ?? dayjs();
        const dateWithOffset = dayjs(newDate).isSame(dayjs(), 'date')
          ? dayjs()
          : utcOffset > 0
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
          if (firstAvailableSlot) {
            dispatch(selectServiceValetAppointment(firstAvailableSlot));
            setDate(firstAvailableSlot.date);
          }
        } else {
          const sorted = [...appointmentSlots].sort(sortAppointments);
          firstAvailableSlot = sorted.find(slot => {
            const formatted = getClearDate(slot?.date);
            return dayjs(formatted).isAfter(dateWithOffset);
          });
          if (firstAvailableSlot) {
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
            ? selectFirstSlot(dayjs(selectedTime).isSame(dayjs(), 'date') ? dayjs() : selectedTime)
            : selectFirstSlot();
        }
      } else {
        selectedTime
          ? selectFirstSlot(dayjs(selectedTime).isSame(dayjs(), 'date') ? dayjs() : selectedTime)
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
      // Only clear data if we're not keeping the slot
      if (!keepSlot) {
        clearData();
      }

      // Convert the incoming date to UTC
      const newDate = dayjs.utc(d);
      const minDate = newDate.isSame(dayjs.utc(), 'date') ? dayjs.utc() : newDate;

      // Set the date in UTC
      setDate(newDate);

      // Select the first slot if keepSlot is false
      if (!keepSlot) {
        selectFirstSlot(minDate);
      }

      // Check if the month needs to be updated
      // Only update the month if it's a different month and we're not keeping the slot
      if (!newDate.isSame(dayjs.utc(month), 'month') && !keepSlot) {
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

  const getCategories = useCallback((): number[] => {
    return allCategories
      .filter(category => {
        return (
          category.type === EServiceCategoryType.GeneralCategory &&
          categoriesIds.includes(category.id)
        );
      })
      .map(item => item.id);
  }, [allCategories, EServiceCategoryType, categoriesIds]);

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
    const isPossibleToChangeType =
      firstScreenOptions.filter(item => item.type !== EServiceType.MobileService)?.length > 1;
    const isMobileServiceType = serviceTypeOption?.type === EServiceType.MobileService;
    if (isEmptyList && isPossibleToChangeType && !isMobileServiceType) {
      onServiceOptionOpen();
    }
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

  const loadData = async ({
    requestedStartDate,
    requestedEndDate,
  }: {
    requestedStartDate: string;
    requestedEndDate: string;
  }) => {
    if (id) {
      // Set the current range *before* loading starts
      setCurrentApiStartDate(requestedStartDate);
      setCurrentApiEndDate(requestedEndDate);
      console.log('requested date range', requestedStartDate, requestedEndDate);
      setLoading(true);
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
          startDate: requestedStartDate,
          endDate: requestedEndDate,
          maintenancePackageOption,
          serviceRequests: collectServiceRequestIds(
            service,
            subService,
            selectedPackage,
            selectedSR,
            undefined,
            selectedSRComments
          ),
          serviceCategoryIds: getCategories(),
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
            await dispatch(
              loadServiceValetSlots(data, undefined, undefined, onLoadSlots, handleError)
            );
        } else {
          await dispatch(
            loadAppointmentSlots(
              data,
              currentAppointment ? () => {} : setDateCallback,
              () => handleDateRangeSet(false),
              onLoadSlots,
              handleError
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
      // Initial load: calculate dates and pass them to loadData
      const { apiStartDate, apiEndDate } = getApiDates();
      loadData({ requestedStartDate: apiStartDate, requestedEndDate: apiEndDate }).finally();
    }
  }, [
    dispatch,
    id,
    selectedTiming,
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
    selectedTime,
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
      ReactGA.event(
        {
          category: 'EvenFlow User',
          action:
            serviceTypeOption?.type === EServiceType.PickUpDropOff
              ? 'Selected Service Valet Appointment Slot'
              : 'Selected Appointment Slot',
          label: `On ${dayjs.utc(appointment.date).format('MM-DD-YYYY')} at ${dayjs
            .utc(appointment.date)
            .format('hh:mm A')}`,
        },
        trackerData.ids
      );
    }
  }, [appointment, serviceTypeOption, trackerData]);

  const handleGABack = useCallback(() => {
    ReactGA.event(
      {
        category: 'EvenFlow User',
        action: 'Went back',
        label: 'From Selection Date & Time Page',
      },
      trackerData.ids
    );
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
    const { apiStartDate, apiEndDate } = getApiDates();
    loadData({ requestedStartDate: apiStartDate, requestedEndDate: apiEndDate }).finally();
  };

  useEffect(() => {
    if (dateSlotsRef.current) {
      const selectedDateElement = dateSlotsRef.current.querySelector(`[data-date="${date}"]`);
      if (selectedDateElement) {
        selectedDateElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [date]);

  const loadNextSlots = () => {
    // Ensure we have a current range to base the next one on
    if (!currentApiStartDate || !currentApiEndDate) {
      console.error('Cannot load next slots without a current API date range.');
      // Optionally, trigger an initial load here if needed
      const { apiStartDate, apiEndDate } = getApiDates();
      loadData({ requestedStartDate: apiStartDate, requestedEndDate: apiEndDate }).finally();
      return;
    }

    // Calculate next range based on the *current* API range state
    const nextStartDate = dayjs(currentApiStartDate).add(daysPerScreen, 'day');
    const nextEndDate = dayjs(currentApiEndDate).add(daysPerScreen, 'day');

    // Check if we're crossing a month boundary
    const currentMonth = dayjs(currentApiStartDate).month();
    const nextMonth = nextStartDate.month();

    // If we're crossing to a new month, update the date state to match the new month
    if (currentMonth !== nextMonth) {
      // Update the date to the first day of the new month
      setDate(nextStartDate.startOf('month').toISOString());
    }

    loadData({
      requestedStartDate: nextStartDate.toISOString(),
      requestedEndDate: nextEndDate.toISOString(),
    }).finally();
  };

  const loadPreviousSlots = () => {
    // Ensure we have a current range
    if (!currentApiStartDate || !currentApiEndDate) {
      console.error('Cannot load previous slots without a current API date range.');
      return;
    }

    // Calculate previous range based on the *current* API range state
    const previousStartDate = dayjs(currentApiStartDate).subtract(daysPerScreen, 'day');
    const previousEndDate = dayjs(currentApiEndDate).subtract(daysPerScreen, 'day');

    // --- Prevent navigating before today ---
    const todayStart = dayjs().startOf('day');

    // Special case: If the current range doesn't include today but we can go back to include today
    if (
      !dayjs(currentApiStartDate).isSame(todayStart, 'day') &&
      previousStartDate.isBefore(todayStart)
    ) {
      // Set the start date to today and calculate the end date
      const adjustedStartDate = todayStart;
      const adjustedEndDate = todayStart.add(daysPerScreen - 1, 'day');

      // Update the date to show today
      setDate(adjustedStartDate.toISOString());

      // Load data with the adjusted range
      loadData({
        requestedStartDate: adjustedStartDate.toISOString(),
        requestedEndDate: adjustedEndDate.toISOString(),
      }).finally();

      return;
    }

    // Check against the *start* of the day for the previous range
    if (previousStartDate.startOf('day').isBefore(todayStart)) {
      console.log('Cannot load slots before today.');
      // Optionally disable the previous button based on this logic
      return;
    }
    // --- End Prevention Check ---

    // Check if we're crossing a month boundary
    const currentMonth = dayjs(currentApiStartDate).month();
    const previousMonth = previousStartDate.month();

    // If we're crossing to a new month, update the date state to match the new month
    if (currentMonth !== previousMonth) {
      // If we're going from the first days of a month to the previous month,
      // we want to show the last days of the previous month
      if (dayjs(currentApiStartDate).date() <= daysPerScreen) {
        // Set the date to the last day of the previous month
        setDate(previousStartDate.endOf('month').toISOString());
      } else {
        // Otherwise, set to the first day of the new month
        setDate(previousStartDate.startOf('month').toISOString());
      }
    }

    loadData({
      requestedStartDate: previousStartDate.toISOString(),
      requestedEndDate: previousEndDate.toISOString(),
    }).finally();
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
            onDateRangeSet={handleDateRangeSet}
            dateRangeUpdated={initRef.current}
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
              groupedAppointments[dayjs(date).startOf('day').toISOString().replace('.000', '')]
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
