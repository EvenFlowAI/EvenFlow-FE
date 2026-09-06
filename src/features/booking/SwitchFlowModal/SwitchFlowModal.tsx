import React from 'react';
import {
  BaseModal,
  DialogContent,
  DialogTitle,
} from '../../../components/modals/BaseModal/BaseModal';
import { useTranslation } from 'react-i18next';
import AncillaryPriceModal from './AncillaryPriceModal/AncillaryPriceModal';
import Calendar from './Calendar/Calendar';
import UnavailableServiceModal from '../../../components/modals/booking/UnavailableServiceModal/UnavailableServiceModal';
import SwitchFlowModalActions from './SwitchFlowModalActions';
import SwitchFlowModalContent from './SwitchFlowModalContent';
import { TSwitchFlowModalProps } from './types';
import useSwitchFlowModalLogic from './useSwitchFlowModalLogic';

const SwitchFlowModal: React.FC<TSwitchFlowModalProps> = props => {
  const { open, selectedOption } = props;
  const { t } = useTranslation();

  const {
    consultant,
    transportation,
    transportationOption,
    timingType,
    zip,
    userAddress,
    selectedTime,
    isCalendarOpen,
    isAddressVisible,
    isAdvisorVisible,
    isTransportationsVisible,
    isDateSelectionOn,
    isAddressValid,
    nextButtonIsDisabled,
    isUnavailableServiceOpen,
    isAncillaryPriceOpen,
    onAncillaryPriceClose,
    setConsultant,
    setTransportationOption,
    setTimingType,
    setZip,
    setUserAddress,
    setSelectedTime,
    setCalendarOpen,
    setAddressValid,
    setAdvisorVisible,
    loadAncillaryPrice,
    onServiceIsUnavailable,
    onCancel,
    onClickNext,
    handleNextStep,
    onAncillaryPriceAccepted,
    onTryAnotherLocation,
  } = useSwitchFlowModalLogic(props);

  return (
    <BaseModal open={open} onClose={onCancel} width={700}>
      <DialogTitle onClose={onCancel} style={{ fontSize: 24, padding: '16px 36px 0 36px' }}>
        {t('We need additional information to schedule your appointment', {
          serviceName: selectedOption?.name ?? '',
        })}
      </DialogTitle>

      <DialogContent style={{ padding: '0 36px' }}>
        <SwitchFlowModalContent
          open={open}
          selectedOption={selectedOption}
          userAddress={userAddress}
          zip={zip}
          transportation={transportation}
          consultant={consultant}
          transportationOption={transportationOption}
          timingType={timingType}
          isAddressVisible={isAddressVisible}
          isAdvisorVisible={isAdvisorVisible}
          isTransportationsVisible={isTransportationsVisible}
          isDateSelectionOn={isDateSelectionOn}
          isAddressValid={isAddressValid}
          isAncillaryPriceOpen={isAncillaryPriceOpen}
          isUnavailableServiceOpen={isUnavailableServiceOpen}
          setZip={setZip}
          setAddressValid={setAddressValid}
          setUserAddress={setUserAddress}
          setConsultant={setConsultant}
          setAdvisorVisible={setAdvisorVisible}
          setTransportationOption={setTransportationOption}
          setTimingType={setTimingType}
          loadAncillaryPrice={loadAncillaryPrice}
          onServiceIsUnavailable={onServiceIsUnavailable}
        />
      </DialogContent>

      <SwitchFlowModalActions
        onCancel={onCancel}
        onNext={onClickNext}
        nextButtonIsDisabled={nextButtonIsDisabled}
      />

      <Calendar
        time={selectedTime}
        setTime={setSelectedTime}
        isCalendarOpen={isCalendarOpen}
        setCalendarOpen={setCalendarOpen}
        onNext={handleNextStep}
      />

      <AncillaryPriceModal
        onNext={onAncillaryPriceAccepted}
        open={isAncillaryPriceOpen && !isUnavailableServiceOpen}
        onClose={onAncillaryPriceClose}
        serviceString={t('Pick Up / Drop Off')}
        onBack={onCancel}
      />

      <UnavailableServiceModal
        clearAnotherLocation={onTryAnotherLocation}
        setFormChecked={() => {}}
        onBackToServiceOption={() => {}}
        onBackToSelectSlotsForVisitCenter={() => {}}
        onVisitCenter={onCancel}
      />
    </BaseModal>
  );
};

export default SwitchFlowModal;
