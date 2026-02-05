import React, { useMemo, useState } from 'react';
import { FiltersWrapper, TitleWrapper, Wrapper } from './styles';
import { TCallback } from '../../../../../../types/types';
import ServiceOption from './ServiceOption/ServiceOption';
import SelectedConsultant from './SelectedConsultant/SelectedConsultant';
import { ReactComponent as Arrow } from '../../../../../../assets/img/arrow_small.svg';
import SelectedTransportation from './SelectedTransportation/SelectedTransportation';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../store/rootReducer';
import { EServiceType } from '../../../../../../store/reducers/appointmentFrameReducer/types';
import { MenuItem } from '@mui/material';
import ChangeServiceTypeModal from '../ChangeServiceTypeModal/ChangeServiceTypeModal';
import useTransportationVisibility from '../../../../../../hooks/useTransportationVisibility/useTransportationVisibility';
import SwitchFlowModal from '../../../../SwitchFlowModal/SwitchFlowModal';
import { useModal } from '../../../../../../hooks/useModal/useModal';
import { IFirstScreenOption } from '../../../../../../store/reducers/serviceTypes/types';
import { ETransportationType } from '../../../../../../store/reducers/transportationNeeds/types';

type TProps = {
  isSm: boolean;
  onChangeServiceOption: TCallback;
  isServiceOptionOpen: boolean;
  onServiceOptionClose: TCallback;
};

const AppointmentFilters: React.FC<TProps> = ({
  isSm,
  onChangeServiceOption,
  isServiceOptionOpen,
  onServiceOptionClose,
}) => {
  const { serviceTypeOption, consultants, transportation } = useSelector(
    (state: RootState) => state.appointmentFrame
  );
  const { firstScreenOptions } = useSelector((state: RootState) => state.serviceTypes);
  const { isAdvisorAvailable } = useSelector((state: RootState) => state.bookingFlowConfig);
  const { isTransportationAvailable } = useSelector((state: RootState) => state.bookingFlowConfig);

  const [selectedOption, setSelectedOption] = useState<IFirstScreenOption | null>(null);
  const [isFiltersOpen, setFiltersOpen] = useState<boolean>(!isSm);
  const { isTransportationsVisible } = useTransportationVisibility();
  const {
    isOpen: isSwitchFlowOpen,
    onClose: onSwitchFlowClose,
    onOpen: onSwitchFlowOpen,
  } = useModal();

  const serviceOptions = useMemo(() => {
    return serviceTypeOption?.type !== EServiceType.MobileService
      ? firstScreenOptions
          .filter(
            option =>
              option.type === EServiceType.PickUpDropOff || option.type === EServiceType.VisitCenter
          )
          .map(option => (
            <MenuItem value={option.id} key={option.name}>
              {option.name}
            </MenuItem>
          ))
      : firstScreenOptions
          .filter(option => option.type === EServiceType.MobileService)
          .map(option => (
            <MenuItem value={option.id} key={option.name}>
              {option.name}
            </MenuItem>
          ));
  }, [firstScreenOptions, serviceTypeOption]);

  const isServiceOptionVisible =
    serviceOptions.length > 1 &&
    Boolean(firstScreenOptions.find(el => el.id === serviceTypeOption?.id));
  const isAdvisorVisible = Boolean(isAdvisorAvailable && consultants?.length);
  const isVisible = isAdvisorVisible || isServiceOptionVisible || isTransportationsVisible;

  const onArrowClick = () => setFiltersOpen(prev => !prev);

  const onChangeServiceOptionInPopup = () => {
    onChangeServiceOption();
    onServiceOptionClose();
  };

  const isVisibleTransportation = () => {
    if (transportation?.type === ETransportationType.PickUpDelivery) {
      return !!isTransportationsVisible && !!transportation && isTransportationAvailable;
    } else {
      return !!isTransportationsVisible;
    }
  };

  return isVisible ? (
    <Wrapper>
      <TitleWrapper onClick={isSm ? onArrowClick : undefined}>
        <div>Appointment Options</div>
        {isSm ? (
          <Arrow
            style={{
              transform: !isFiltersOpen ? 'rotate(180deg) translate(0px, 3px)' : 'none',
              transition: '0.6s ease',
            }}
          />
        ) : null}
      </TitleWrapper>
      {isFiltersOpen ? (
        <FiltersWrapper>
          <ServiceOption
            onChangeServiceOption={onChangeServiceOption}
            isVisible={isServiceOptionVisible}
            options={serviceOptions}
            setSelectedOption={setSelectedOption}
            onSwitchFlowOpen={onSwitchFlowOpen}
          />
          <SelectedTransportation
            isVisible={isVisibleTransportation()}
            setSelectedOption={setSelectedOption}
            onChangeServiceOption={onChangeServiceOption}
            onSwitchFlowOpen={onSwitchFlowOpen}
          />
          <SelectedConsultant isVisible={isAdvisorVisible} />
        </FiltersWrapper>
      ) : null}
      <ChangeServiceTypeModal
        open={isServiceOptionOpen}
        onClose={onServiceOptionClose}
        options={serviceOptions}
        onSwitchFlowOpen={onSwitchFlowOpen}
        setSelectedOption={setSelectedOption}
        onChangeServiceOption={onChangeServiceOptionInPopup}
      />
      <SwitchFlowModal
        open={isSwitchFlowOpen}
        onClose={onSwitchFlowClose}
        selectedOption={selectedOption}
        onNext={onServiceOptionClose}
      />
    </Wrapper>
  ) : null;
};

export default AppointmentFilters;
