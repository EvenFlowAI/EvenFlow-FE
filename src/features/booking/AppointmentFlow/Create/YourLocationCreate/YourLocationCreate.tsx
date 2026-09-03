import React, { Dispatch, SetStateAction, useMemo } from 'react';
import { TActionProps, TArgCallback, TView } from '../../../../../types/types';
import YourLocation from '../../Screens/YourLocation/YourLocation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../store/rootReducer';
import { EServiceType } from '../../../../../store/reducers/appointmentFrameReducer/types';
import {
  clearAppointmentData,
  goToSlotsSelection,
  setShowServiceCentersList,
  setSideBarSteps,
} from '../../../../../store/reducers/appointmentFrameReducer/actions';
import { Routes } from '../../../../../routes/constants';
import { useHistory, useParams } from 'react-router-dom';
import { useCurrentUser } from '../../../../../hooks/useCurrentUser/useCurrentUser';
import { ETransportationType } from '../../../../../store/reducers/transportationNeeds/types';

type TYourLocationProps = TActionProps & {
  setNeedToShowServiceSelection: Dispatch<SetStateAction<boolean>>;
  onGoToFirstScreen: TArgCallback<TView>;
};

const YourLocationCreate: React.FC<TYourLocationProps> = ({
  onBack,
  onNext,
  setNeedToShowServiceSelection,
  onGoToFirstScreen,
}) => {
  const { serviceTypeOption, selectedVehicle, serviceOptionChangedFromSlotPage, transportation } =
    useSelector((state: RootState) => state.appointmentFrame);
  const { customerLoadedData } = useSelector((state: RootState) => state.appointment);
  const { firstScreenOptions } = useSelector((state: RootState) => state.serviceTypes);
  const currentUser = useCurrentUser();
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const changedToPickUpFromSlots = useMemo(
    () =>
      serviceOptionChangedFromSlotPage &&
      (serviceTypeOption?.type === EServiceType.PickUpDropOff ||
        transportation?.type === ETransportationType.PickUpDelivery),
    [serviceOptionChangedFromSlotPage, serviceTypeOption, transportation]
  );

  const serviceType = useMemo(() => {
    if (serviceTypeOption) {
      return serviceTypeOption.type;
    }

    return transportation?.type === ETransportationType.PickUpDelivery
      ? EServiceType.PickUpDropOff
      : EServiceType.VisitCenter;
  }, [serviceTypeOption, transportation]);

  const handleFirstScreenForAdmin = (prevScreen: TView) => {
    dispatch(setShowServiceCentersList(false));
    onGoToFirstScreen(prevScreen);
  };

  const clearSelectedData = () => {
    dispatch(
      setSideBarSteps(serviceType === EServiceType.VisitCenter ? ['serviceNeeds'] : ['location'])
    );
    dispatch(clearAppointmentData());
  };

  const handleFirstScreenForCustomer = (
    shouldSkipServiceTypeSelect: boolean,
    prevScreen: TView
  ) => {
    setNeedToShowServiceSelection(!shouldSkipServiceTypeSelect);
    if (shouldSkipServiceTypeSelect) {
      if (customerLoadedData && selectedVehicle) {
        onBack();
      } else {
        history.push(`${Routes.EndUser.Welcome}/${id}?frame=1`);
      }
    } else {
      onGoToFirstScreen(prevScreen);
    }
  };

  const handlePrevScreen = () => {
    const onlyVisitCenterExists =
      firstScreenOptions.length === 1 && firstScreenOptions[0].type === EServiceType.VisitCenter;
    const shouldSkipServiceTypeSelect = !firstScreenOptions?.length || onlyVisitCenterExists;
    const prevScreen = shouldSkipServiceTypeSelect ? 'select' : 'serviceSelect';
    if (currentUser) {
      handleFirstScreenForAdmin(prevScreen);
    } else {
      handleFirstScreenForCustomer(shouldSkipServiceTypeSelect, prevScreen);
    }
  };

  const handleBack = () => {
    clearSelectedData();
    handlePrevScreen();
  };

  const onNextStep = () => {
    changedToPickUpFromSlots ? dispatch(goToSlotsSelection()) : onNext();
  };

  return (
    <YourLocation
      onBack={handleBack}
      onNext={onNextStep}
      setNeedToShowServiceSelection={setNeedToShowServiceSelection}
      onGoToFirstScreen={onGoToFirstScreen}
    />
  );
};

export default YourLocationCreate;
