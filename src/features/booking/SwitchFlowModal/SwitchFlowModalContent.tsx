import React, { Dispatch, SetStateAction } from 'react';
import { Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { IServiceConsultant, ITransportation } from '../../../api/types';
import UserLocation from '../../../components/UserLocation/UserLocation';
import { EAppointmentTimingType } from '../../../store/reducers/appointment/types';
import { EServiceType } from '../../../store/reducers/appointmentFrameReducer/types';
import { IFirstScreenOption } from '../../../store/reducers/serviceTypes/types';
import { ETransportationType } from '../../../store/reducers/transportationNeeds/types';
import Consultant from './Consultant/Consultant';
import { TextWrapper } from './styles';
import Timing from './Timing/Timing';
import Transportation from './Transportation/Transportation';

type TProps = {
  open: boolean;
  selectedOption: IFirstScreenOption | null;
  // TODO: replace any once UserLocation address type is formalized.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userAddress: any;
  zip: string | null;
  transportation: ITransportation | null;
  consultant: IServiceConsultant | null;
  transportationOption: ITransportation | null;
  timingType: EAppointmentTimingType;
  isAddressVisible: boolean;
  isAdvisorVisible: boolean;
  isTransportationsVisible: boolean;
  isDateSelectionOn: boolean;
  isAddressValid: boolean;
  isAncillaryPriceOpen: boolean;
  isUnavailableServiceOpen: boolean;
  setZip: Dispatch<SetStateAction<string | null>>;
  setAddressValid: Dispatch<SetStateAction<boolean>>;
  // TODO: replace any once UserLocation address type is formalized.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setUserAddress: Dispatch<SetStateAction<any>>;
  setConsultant: Dispatch<SetStateAction<IServiceConsultant | null>>;
  setAdvisorVisible: Dispatch<SetStateAction<boolean>>;
  setTransportationOption: Dispatch<SetStateAction<ITransportation | null>>;
  setTimingType: Dispatch<SetStateAction<EAppointmentTimingType>>;
  // TODO: replace any once UserLocation address type is formalized.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loadAncillaryPrice: (zipCode: string | null, address: any) => void;
  onServiceIsUnavailable: () => void;
};

const SwitchFlowModalContent: React.FC<TProps> = ({
  open,
  selectedOption,
  userAddress,
  zip,
  transportation,
  consultant,
  transportationOption,
  timingType,
  isAddressVisible,
  isAdvisorVisible,
  isTransportationsVisible,
  isDateSelectionOn,
  isAddressValid,
  isAncillaryPriceOpen,
  isUnavailableServiceOpen,
  setZip,
  setAddressValid,
  setUserAddress,
  setConsultant,
  setAdvisorVisible,
  setTransportationOption,
  setTimingType,
  loadAncillaryPrice,
  onServiceIsUnavailable,
}) => {
  const { t } = useTranslation();

  const isPickupDropoffFlow = selectedOption
    ? selectedOption.type === EServiceType.PickUpDropOff
    : transportation?.type === ETransportationType.PickUpDelivery;

  const isAdvisorDisabled =
    isPickupDropoffFlow && (!isAddressValid || isUnavailableServiceOpen || isAncillaryPriceOpen);

  const isTimingDisabled =
    isPickupDropoffFlow &&
    (!userAddress || !zip || isUnavailableServiceOpen || isAncillaryPriceOpen);

  return (
    <Grid container>
      {isAddressVisible ? (
        <>
          <Grid item xs={12}>
            <TextWrapper>{t('Where do you want to be picked up?')}</TextWrapper>
          </Grid>
          <Grid item xs={12}>
            <UserLocation
              zipWidth={194}
              templateColumnsData="64% 31%"
              loadAncillaryPrice={loadAncillaryPrice}
              zip={zip}
              setZip={setZip}
              setAddressValid={setAddressValid}
              userAddress={userAddress}
              disabled={isAncillaryPriceOpen || isUnavailableServiceOpen}
              setUserAddress={setUserAddress}
            />
          </Grid>
        </>
      ) : null}

      {isAdvisorVisible ? (
        <>
          <Grid item xs={12}>
            <TextWrapper>{t('Do you have a preferred Service Advisor?')}</TextWrapper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Consultant
              open={open}
              newOption={selectedOption}
              consultant={consultant}
              setConsultant={setConsultant}
              isVisible
              setAdvisorVisible={setAdvisorVisible}
              onServiceIsUnavailable={onServiceIsUnavailable}
              address={userAddress}
              zipCode={zip}
              disabled={isAdvisorDisabled}
            />
          </Grid>
        </>
      ) : null}

      {isTransportationsVisible ? (
        <>
          <Grid item xs={12}>
            <TextWrapper>{t('Do you need assistance with transportation?')}</TextWrapper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Transportation
              isTransportationAvailable={isTransportationsVisible}
              selectedTransportation={transportationOption}
              setSelectedTransportation={setTransportationOption}
            />
          </Grid>
        </>
      ) : null}

      {isDateSelectionOn ? (
        <>
          <Grid item xs={12}>
            <TextWrapper>{t('When would you like your vehicle serviced?')}</TextWrapper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Timing
              disabled={isTimingDisabled}
              timingType={timingType}
              setTimingType={setTimingType}
            />
          </Grid>
        </>
      ) : null}
    </Grid>
  );
};

export default SwitchFlowModalContent;
