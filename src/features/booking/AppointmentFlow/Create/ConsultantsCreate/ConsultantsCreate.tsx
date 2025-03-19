import React from 'react';
import { TActionProps } from '../../../../../types/types';
import { IServiceConsultant } from '../../../../../api/types';
import {
  setAdvisor,
  setAnyAdvisorSelected,
} from '../../../../../store/reducers/appointmentFrameReducer/actions';
import {
  selectAppointment,
  selectServiceValetAppointment,
} from '../../../../../store/reducers/appointment/actions';
import { useDispatch } from 'react-redux';
import { Consultants } from '../../Screens/Consultants/Consultants';

const ConsultantsCreate: React.FC<TActionProps> = ({ onNext, onBack }) => {
  const dispatch = useDispatch();

  const handleSelectConsultant = (consultant: IServiceConsultant | null) => {
    dispatch(setAdvisor(consultant));
    dispatch(setAnyAdvisorSelected(!Boolean(consultant)));
    dispatch(selectAppointment(null));
    dispatch(selectServiceValetAppointment(null));
  };

  return (
    <Consultants
      onNext={onNext}
      handleBack={onBack}
      handleNext={onNext}
      handleSelectConsultant={handleSelectConsultant}
    />
  );
};

export default ConsultantsCreate;
