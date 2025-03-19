import React, { Dispatch, SetStateAction, useMemo } from 'react';
import { TArgCallback, TScreen } from '../../../../../types/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../store/rootReducer';
import {
  checkCarIsValid,
  setCurrentFrameScreen,
} from '../../../../../store/reducers/appointmentFrameReducer/actions';
import { getMaintenanceList } from '../../../../../utils/utils';
import { EServiceCategoryPage, IServiceCategory } from '../../../../../api/types';
import { useTranslation } from 'react-i18next';
import { checkPodChanged } from '../../../../../store/reducers/appointments/actions';
import { useException } from '../../../../../hooks/useException/useException';
import { ServiceNeedsCards } from '../../Screens/ServiceNeedsCards/ServiceNeedsCards';

type TProps = {
  onSelect: TArgCallback<TScreen>;
  setLastSelectedCategory: Dispatch<SetStateAction<IServiceCategory | null>>;
  page: EServiceCategoryPage;
  setPage: Dispatch<SetStateAction<EServiceCategoryPage>>;
};
export const ServiceNeedsManage: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TProps>>
> = ({ onSelect, setLastSelectedCategory, page, setPage }) => {
  const { categoriesIds, selectedPackage, valueService, packageEMenuType, selectedRecalls } =
    useSelector((state: RootState) => state.appointmentFrame);
  const { selectedSR, serviceRequests, scProfile } = useSelector(
    (state: RootState) => state.appointment
  );
  const { allCategories } = useSelector((state: RootState) => state.categories);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const showError = useException();

  const selectedServices = useMemo(() => {
    return getMaintenanceList(
      serviceRequests,
      selectedRecalls,
      selectedSR,
      selectedPackage,
      allCategories,
      categoriesIds,
      valueService,
      packageEMenuType,
      scProfile?.maintenancePackageOptionTypes
    );
  }, [
    serviceRequests,
    selectedSR,
    selectedPackage,
    allCategories,
    categoriesIds,
    valueService,
    selectedRecalls,
    packageEMenuType,
    scProfile,
  ]);

  const handleBack = () => {
    dispatch(setCurrentFrameScreen('manageAppointment'));
  };

  const goNext = () => onSelect('maintenanceDetails');

  const onCarIsValid = () => scProfile && dispatch(checkPodChanged(scProfile.id, showError));

  const handleNext = () => {
    if (!selectedServices.length) {
      showError(
        t(
          'You do not have any services selected in your appointment. Please add items you wish to have serviced'
        )
      );
    } else {
      dispatch(checkCarIsValid(onCarIsValid, goNext));
    }
  };

  return (
    <ServiceNeedsCards
      onSelect={onSelect}
      setLastSelectedCategory={setLastSelectedCategory}
      page={page}
      setPage={setPage}
      goNext={handleNext}
      goBack={handleBack}
      isManagingAppointment={true}
    />
  );
};
