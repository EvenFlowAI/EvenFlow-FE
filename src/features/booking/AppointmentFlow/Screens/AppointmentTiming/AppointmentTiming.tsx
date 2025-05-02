import React, { useCallback, useState } from 'react';
import { StepWrapper } from '../../../../../components/styled/StepWrapper';
import { ActionButtons } from '../../../ActionButtons/ActionButtons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../store/rootReducer';
import {
  setSideBarSteps,
  setTime,
  setTiming,
  setInitialTiming,
} from '../../../../../store/reducers/appointmentFrameReducer/actions';
import { EAppointmentTimingType } from '../../../../../store/reducers/appointment/types';
import { clearAppointmentSlots } from '../../../../../store/reducers/appointment/actions';
import ReactGA from 'react-ga4';
import { EServiceType } from '../../../../../store/reducers/appointmentFrameReducer/types';
import AppointmentTimingCard from './AppointmentTimingCard/AppointmentTimingCard';
import { useTranslation } from 'react-i18next';
import { TArgCallback, TCallback, TParsableDate, TScreen } from '../../../../../types/types';
import { TimingWrapper } from './styles';
import dayjs from 'dayjs';
import { cards, timingTypes } from './constants';

type TProps = {
  handleSetScreen: TArgCallback<TScreen>;
  onBack: TCallback;
};

export const AppointmentTiming: React.FC<TProps> = ({ handleSetScreen, onBack }) => {
  const { appointment } = useSelector((state: RootState) => state.appointment);
  const { selectedInitialTiming, selectedTime, serviceTypeOption, sideBarSteps, trackerData } =
    useSelector((state: RootState) => state.appointmentFrame);
  const [isLoading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const onNext = () => {
    handleSetScreen('appointmentSelection');
  };

  const handleSelectTiming = useCallback(
    (t: EAppointmentTimingType) => () => {
      dispatch(setTiming(t));
      dispatch(setInitialTiming(t));
      if (t === EAppointmentTimingType.FirstAvailable) dispatch(setTime(null));
    },
    []
  );

  const handleChangeTime = useCallback(
    (t: unknown) => {
      const date = dayjs(t as TParsableDate);
      dispatch(setTiming(EAppointmentTimingType.PreferredDate));
      dispatch(setInitialTiming(EAppointmentTimingType.PreferredDate));
      dispatch(setTime(date));
      if (!dayjs.utc(selectedTime).isSame(t as TParsableDate, 'date')) {
        dispatch(clearAppointmentSlots());
      }
    },
    [selectedTime]
  );

  const isTimingValid = Boolean(
    selectedInitialTiming !== null &&
      (selectedInitialTiming !== EAppointmentTimingType.PreferredDate || selectedTime)
  );

  const handleSideBar = () => {
    const index = sideBarSteps.indexOf('appointmentSelection');
    if (index > -1) {
      const slicedSteps = sideBarSteps.slice(0, index + 1);
      dispatch(setSideBarSteps(slicedSteps));
    }
  };

  const handleGA = () => {
    if (selectedInitialTiming) {
      ReactGA.event(
        {
          category: 'EvenFlow User',
          action: 'Selected Timing Type',
          label: `Selected ${timingTypes[selectedInitialTiming]}`,
        },
        trackerData.ids
      );
    }
  };

  const onSubmit = useCallback((): void => {
    handleGA();
    if (appointment?.timingType !== selectedInitialTiming) {
      dispatch(clearAppointmentSlots());
    }
    handleSideBar();
    onNext();
  }, [appointment, dispatch, onNext, selectedInitialTiming, handleGA]);

  return (
    <StepWrapper>
      <TimingWrapper columns={2}>
        {cards.map((card, idx) => {
          if (!idx) {
            return null;
          }
          if (serviceTypeOption?.type === EServiceType.PickUpDropOff && idx === 1) {
            // todo delete this when Preferred Date Search will be implemented
            return null;
          }
          return (
            <AppointmentTimingCard
              onClick={handleSelectTiming(card.name)}
              card={card}
              isLoading={isLoading}
              onChangeTime={handleChangeTime}
              selectedTime={
                selectedInitialTiming === EAppointmentTimingType.PreferredDate ? selectedTime : null
              }
              active={selectedInitialTiming === card.name}
              key={card.name}
            />
          );
        })}
      </TimingWrapper>
      <ActionButtons
        onBack={onBack}
        onNext={onSubmit}
        nextDisabled={!isTimingValid}
        nextLabel={t('Next')}
      />
    </StepWrapper>
  );
};
