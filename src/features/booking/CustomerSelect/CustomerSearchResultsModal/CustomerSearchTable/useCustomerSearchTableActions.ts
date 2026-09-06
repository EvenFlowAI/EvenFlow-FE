import { Dispatch, SetStateAction } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { Api } from '../../../../../api/ApiEndpoints/ApiEndpoints';
import { IAddressData } from '../../../../../api/types';
import {
  getBlankVehicle,
  setCustomerLoadedData,
} from '../../../../../store/reducers/appointment/actions';
import {
  clearAppointmentData,
  setAddress,
  setCurrentFrameScreen,
  setServiceOptionChanged,
  setServiceTypeOption,
  setSideBarSteps,
  setUserType,
  setVehicle,
  setWelcomeScreenView,
  setZipCode,
} from '../../../../../store/reducers/appointmentFrameReducer/actions';
import {
  EServiceType,
  EUserType,
} from '../../../../../store/reducers/appointmentFrameReducer/types';
import { IFirstScreenOption } from '../../../../../store/reducers/serviceTypes/types';
import { loadRecallsByVin } from '../../../../../store/reducers/recall/actions';
import { ICustomerWithPhones } from '../../../../../store/reducers/enhancedCustomerSearch/types';
import { decodeSCID, encodeSCID } from '../../../../../utils/utils';
import { AppointmentSummaryI } from '../../../utils/types';
import {
  EXISTING_USER_TYPE,
  buildCustomerLoadedData,
  buildVehicle,
  customerIdentityMatches,
  resolveAddress,
  shouldLoadRecalls,
} from './helpers';

type TProps = {
  customers: ICustomerWithPhones[];
  firstScreenOptions?: IFirstScreenOption[];
  shouldCheckRecalls: boolean;
  serviceTypeOptionId?: number;
  transportationOptionId?: number;
  scProfileId?: number;
  onClose: () => Promise<void> | void;
  redirect: () => void;
  setHashIdForSelectedAppointment: Dispatch<SetStateAction<string | null>>;
  setEditingElement: Dispatch<SetStateAction<ICustomerWithPhones | null>>;
  setLoadedAppointmentsByCar: Dispatch<SetStateAction<AppointmentSummaryI[]>>;
  setSelectedAppointmentForCancelOrEdit: Dispatch<SetStateAction<ICustomerWithPhones | null>>;
  setIsEditAppointment: Dispatch<SetStateAction<boolean>>;
  onOpenConfirm: () => void;
  onOpenAppointmentSelection: () => void;
};

const useCustomerSearchTableActions = ({
  customers,
  firstScreenOptions,
  shouldCheckRecalls,
  serviceTypeOptionId,
  transportationOptionId,
  scProfileId,
  onClose,
  redirect,
  setHashIdForSelectedAppointment,
  setEditingElement,
  setLoadedAppointmentsByCar,
  setSelectedAppointmentForCancelOrEdit,
  setIsEditAppointment,
  onOpenConfirm,
  onOpenAppointmentSelection,
}: TProps) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams<{ id: string }>();

  const setAddressFromCustomer = async (address: IAddressData | null) => {
    if (address?.fullAddress) {
      await dispatch(setAddress(address.fullAddress));
    }
    if (address?.zipCode) {
      await dispatch(setZipCode(address.zipCode.slice(0, 5)));
    }
  };

  const onRedirect = async () => {
    await onClose();
    redirect();
  };

  const handleFlowAfterSelection = async () => {
    if (!firstScreenOptions?.length) {
      await dispatch(setCurrentFrameScreen('serviceNeeds'));
      await onRedirect();
      return;
    }

    if (firstScreenOptions.length > 1) {
      await dispatch(setWelcomeScreenView('serviceSelect'));
      await onClose();
      return;
    }

    if (firstScreenOptions[0].type === EServiceType.VisitCenter) {
      await dispatch(setServiceTypeOption(firstScreenOptions[0]));
      await dispatch(setCurrentFrameScreen('serviceNeeds'));
      await onRedirect();
      return;
    }

    await dispatch(setWelcomeScreenView('serviceSelect'));
    await onClose();
  };

  const setCustomerData = async (customer: ICustomerWithPhones, isUpdating: boolean) => {
    const selectedCustomer = customers.find(item => customerIdentityMatches(customer, item));
    const loadedData = buildCustomerLoadedData({
      customer,
      selectedCustomer,
      isUpdating,
      includeVehicles: true,
    });

    loadedData.address = resolveAddress(selectedCustomer, isUpdating);
    await setAddressFromCustomer(loadedData.address ?? null);
    await dispatch(setCustomerLoadedData(loadedData));
    await dispatch(setUserType(EXISTING_USER_TYPE));
    await dispatch(setVehicle(buildVehicle(customer)));
  };

  const onCreateNewForCar = async (customer: ICustomerWithPhones) => {
    await dispatch(clearAppointmentData());
    dispatch(setServiceOptionChanged(false));
    await dispatch(setSideBarSteps([]));
    await setCustomerData(customer, false);
    await dispatch(setUserType(EUserType.Existing));

    if (shouldLoadRecalls(customer, shouldCheckRecalls)) {
      dispatch(
        loadRecallsByVin(
          decodeSCID(id),
          customer.vin,
          customer.make,
          customer.model,
          customer.year,
          serviceTypeOptionId,
          transportationOptionId,
          customer.customerId,
          true
        )
      );
    }

    await handleFlowAfterSelection();
  };

  const onSelectCustomerForNewVehicle = (customer: ICustomerWithPhones) => async () => {
    const loadedData = buildCustomerLoadedData({ customer, includeVehicles: false });
    loadedData.address = customer.address ?? null;

    await setAddressFromCustomer(customer.address ?? null);
    await dispatch(setCustomerLoadedData(loadedData));
    await dispatch(setUserType(EXISTING_USER_TYPE));
    await dispatch(setVehicle(getBlankVehicle()));
    await onClose();
    await handleFlowAfterSelection();
  };

  const handleUpdateAppointment = (customer: ICustomerWithPhones) => {
    if (!scProfileId) {
      return;
    }

    dispatch(setUserType(EUserType.Existing));
    const encodedServiceCenterId = encodeSCID(scProfileId);

    setCustomerData(customer, true).then(() => {
      history.push(`/f/appointment-manage/${encodedServiceCenterId}`);
      onClose();
    });
  };

  const fetchAppointmentsByCustomer = async (
    customer: ICustomerWithPhones
  ): Promise<AppointmentSummaryI[]> => {
    try {
      const result = await Api.call(Api.endpoints.Appointments.GetShortByQuery, {
        params: {
          vehicleId: customer.vehicleId,
          customerId: customer.customerId,
          serviceCenterId: scProfileId,
        },
      });

      return result?.data?.result ?? [];
    } catch (error) {
      console.error('Error while fetching appointment list:', error);
      return [];
    }
  };

  const onUpdateAppForCar = (customer: ICustomerWithPhones) => {
    setIsEditAppointment(false);
    fetchAppointmentsByCustomer(customer).then(appointments => {
      if (!appointments.length) {
        return;
      }

      if (appointments.length === 1) {
        handleUpdateAppointment({
          ...customer,
          appointmentHashKey: appointments[0].appointmentHashKey,
        });
        return;
      }

      setIsEditAppointment(true);
      setSelectedAppointmentForCancelOrEdit(customer);
      setLoadedAppointmentsByCar(appointments);
      onOpenAppointmentSelection();
    });
  };

  const onCancelAppointment = async (customer: ICustomerWithPhones) => {
    setIsEditAppointment(false);
    const appointments = await fetchAppointmentsByCustomer(customer);

    if (!appointments.length) {
      return;
    }

    if (appointments.length === 1) {
      setHashIdForSelectedAppointment(appointments[0].appointmentHashKey);
      setEditingElement(customer);
      onOpenConfirm();
      return;
    }

    setSelectedAppointmentForCancelOrEdit(customer);
    setLoadedAppointmentsByCar(appointments);
    onOpenAppointmentSelection();
  };

  return {
    onSelectCustomerForNewVehicle,
    onCreateNewForCar,
    onUpdateAppForCar,
    onCancelAppointment,
    handleUpdateAppointment,
  };
};

export default useCustomerSearchTableActions;
