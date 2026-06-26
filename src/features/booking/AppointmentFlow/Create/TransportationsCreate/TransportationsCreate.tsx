import React from 'react';
import { TActionProps } from '../../../../../types/types';
import { TransportationNeeds } from '../../Screens/TransportationNeeds/TransportationNeeds';
import {
  setIsSVWithoutConfig,
  setTransportation,
} from '../../../../../store/reducers/appointmentFrameReducer/actions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../store/rootReducer';

const TransportationsCreate: React.FC<TActionProps> = ({ onBack, onNext }) => {
  const dispatch = useDispatch();
  const { isSVWithoutConfig, transportation } = useSelector(
    (state: RootState) => state.appointmentFrame
  );

  const handleBack = () => {
    if (!isSVWithoutConfig) {
      dispatch(setTransportation(null));
    }
    if (!transportation) {
      dispatch(setIsSVWithoutConfig(false));
    }
    onBack();
  };

  return (
    <TransportationNeeds onBack={handleBack} onNext={onNext} handleConsentsAccepted={onNext} />
  );
};

export default TransportationsCreate;
