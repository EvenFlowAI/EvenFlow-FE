import React from 'react';
import { TActionProps } from '../../../../../types/types';
import { TransportationNeeds } from '../../Screens/TransportationNeeds/TransportationNeeds';
import { setTransportation } from '../../../../../store/reducers/appointmentFrameReducer/actions';
import { useDispatch } from 'react-redux';

const TransportationsCreate: React.FC<TActionProps> = ({ onBack, onNext }) => {
  const dispatch = useDispatch();

  const handleBack = () => {
    dispatch(setTransportation(null));
    onBack();
  };

  return (
    <TransportationNeeds onBack={handleBack} onNext={onNext} handleConsentsAccepted={onNext} />
  );
};

export default TransportationsCreate;
