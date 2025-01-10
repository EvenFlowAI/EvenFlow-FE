import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../store/rootReducer';
import { useMediaQuery, useTheme } from '@mui/material';
import { Loading } from '../../../../../../components/wrappers/Loading/Loading';
import { ActionButtons } from '../../../../ActionButtons/ActionButtons';
import { useTranslation } from 'react-i18next';
import { Description, Price } from './styles';
import { CarName } from '../../../../../../components/styled/CarName';
import { ChangeButton } from '../../../../../../components/styled/ChangeButton';
import { OfferPageWrapper } from '../../../../../../components/styled/OfferPageWrapper';
import { SubTitle } from '../../../../../../components/styled/SubTitle';

type TServiceDetails = {
  onChangeVehicle: () => void;
  onBack: () => void;
  onNext: () => void;
};

const ServiceDetails: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TServiceDetails>>
> = ({ onChangeVehicle, onBack, onNext }) => {
  const { valueService } = useSelector((state: RootState) => state.appointmentFrame);
  const theme = useTheme();
  const isSM = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useTranslation();

  return valueService?.selectedService ? (
    <OfferPageWrapper>
      <CarName>
        {valueService.year?.year} {valueService.series?.name} {valueService.model?.name}
      </CarName>
      <ChangeButton onClick={onChangeVehicle} variant="text">
        {t('Change Vehicle')}
      </ChangeButton>
      <SubTitle>{valueService.selectedService?.name}</SubTitle>
      <Price>${valueService.selectedService?.price}</Price>
      <Description
        dangerouslySetInnerHTML={{ __html: valueService.selectedService?.description }}
      />
      <ActionButtons
        onBack={onBack}
        onNext={onNext}
        nextLabel={isSM ? t('Schedule') : t('Schedule Service')}
      />
    </OfferPageWrapper>
  ) : (
    <Loading />
  );
};

export default ServiceDetails;
