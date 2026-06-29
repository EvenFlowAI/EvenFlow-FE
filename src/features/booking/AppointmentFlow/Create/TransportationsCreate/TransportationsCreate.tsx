import React from 'react';
import { TActionProps } from '../../../../../types/types';
import { TransportationNeeds } from '../../Screens/TransportationNeeds/TransportationNeeds';
import {
  setIsPickupDropoffWithoutFirstScreenOption,
  setTransportation,
} from '../../../../../store/reducers/appointmentFrameReducer/actions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../store/rootReducer';

const TransportationsCreate: React.FC<TActionProps> = ({ onBack, onNext }) => {
  const dispatch = useDispatch();
  const { isPickupDropoffWithoutFirstScreenOption, transportation } = useSelector(
    (state: RootState) => state.appointmentFrame
  );

  const handleBack = () => {
    if (!isPickupDropoffWithoutFirstScreenOption) {
      dispatch(setTransportation(null));
    }
    if (!transportation) {
      dispatch(setIsPickupDropoffWithoutFirstScreenOption(false));
    }
    onBack();
  };

  return (
    <TransportationNeeds onBack={handleBack} onNext={onNext} handleConsentsAccepted={onNext} />
  );
};

export default TransportationsCreate;
