import React from 'react';
import { ActionButtons } from '../../../ActionButtons/ActionButtons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../store/rootReducer';
import { IServiceCategory } from '../../../../../api/types';
import { useTranslation } from 'react-i18next';
import { EServiceCategoryType } from '../../../../../store/reducers/categories/types';
import {
  selectCategoriesIds,
  setAdditionalServicesChosen,
} from '../../../../../store/reducers/appointmentFrameReducer/actions';
import ReactGA from 'react-ga4';
import { TScreen } from '../../../../../types/types';
import { CarName } from '../../../../../components/styled/CarName';
import { ChangeButton } from '../../../../../components/styled/ChangeButton';
import { OfferPageWrapper } from '../../../../../components/styled/OfferPageWrapper';
import { SubTitle } from '../../../../../components/styled/SubTitle';
import { Description, PriceAndDate } from './styles';
import { getOfferString } from '../../../../../utils/utils';
import dayjs from 'dayjs';

type TOfferProductPageProps = {
  category: IServiceCategory | null;
  onChangeVehicle: () => void;
  handleSetScreen: (screen: TScreen) => void;
  lastCategory: IServiceCategory | null;
};

const OfferProductPage: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TOfferProductPageProps>>
> = ({ category, onChangeVehicle, handleSetScreen, lastCategory }) => {
  const { selectedVehicle, categoriesIds, subService, service, trackerData } = useSelector(
    (state: RootState) => state.appointmentFrame
  );
  const { scProfile } = useSelector((state: RootState) => state.appointment);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleCategoriesAndGA = () => {
    dispatch(setAdditionalServicesChosen(false));
    if (service && service.id === lastCategory?.id) {
      if (categoriesIds && service.type !== EServiceCategoryType.LinkToPage2) {
        const categories = categoriesIds?.includes(service.id)
          ? categoriesIds
          : [...categoriesIds, service.id];
        dispatch(selectCategoriesIds(categories));
      }
      const requestsString = service.serviceRequests
        .map(item => `${item.code} (${item.description})`)
        .join(', ');
      ReactGA.event(
        {
          category: 'EvenFlow User',
          action: 'Selected Service',
          label: `With Name ${service.name} And Service Requests ${requestsString}`,
        },
        trackerData.ids
      );
    } else {
      if (subService && subService?.id === lastCategory?.id) {
        if (categoriesIds && subService.type !== EServiceCategoryType.LinkToPage2) {
          const categories = categoriesIds?.includes(subService.id)
            ? categoriesIds
            : [...categoriesIds, subService.id];
          dispatch(selectCategoriesIds(categories));
        }
        const requestsString = subService.serviceRequests
          .map(item => `${item.code} (${item.description})`)
          .join(', ');
        ReactGA.event(
          {
            category: 'EvenFlow User',
            action: 'Selected Sub Service',
            label: `With Name ${subService.name} ${subService.serviceRequests?.length && `And Service Requests ${requestsString}`}`,
          },
          trackerData.ids
        );
      }
    }
  };

  const onSubmit = () => {
    handleCategoriesAndGA();
    let type: null | number = null;
    if (service && service.id === lastCategory?.id) type = service.type;
    if (subService && subService?.id === lastCategory?.id) type = subService.type;
    switch (type) {
      case 2:
      case 4:
        return handleSetScreen('opsCode');
      case 1:
        return handleSetScreen('maintenanceDetails');
      case 3:
        return handleSetScreen('serviceNeeds');
      default:
        return handleSetScreen('describeMore');
    }
  };

  const handleBack = () => {
    handleSetScreen('serviceNeeds');
  };

  return (
    <OfferPageWrapper>
      {selectedVehicle?.make ? (
        <CarName>
          {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
        </CarName>
      ) : null}
      {selectedVehicle?.make ? (
        <ChangeButton onClick={onChangeVehicle} variant="text">
          {t('Change Vehicle')}
        </ChangeButton>
      ) : null}
      <SubTitle>{category?.name ?? ''}</SubTitle>
      <PriceAndDate>
        <div className="innerWrapper">
          {category?.price ? (
            <span className="price">
              {t('Price')}: ${scProfile?.isRoundPrice ? category.price : category.price.toFixed(2)}
            </span>
          ) : null}
          {category?.offer ? (
            <div className="greenText">
              {getOfferString(category.offer, Boolean(scProfile?.isRoundPrice))}
            </div>
          ) : null}
          {category?.offer?.expiringDate ? (
            <div className="date">
              {t('Exp.date')} {dayjs(category.offer.expiringDate).format('MM/DD/YY')}
            </div>
          ) : null}
        </div>
      </PriceAndDate>
      {category?.offer?.description ? (
        <Description dangerouslySetInnerHTML={{ __html: category.offer.description }} />
      ) : null}
      <ActionButtons nextLabel={t('Next')} onBack={handleBack} onNext={onSubmit} />
    </OfferPageWrapper>
  );
};

export default OfferProductPage;
