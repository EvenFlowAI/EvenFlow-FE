import React from 'react';
import { ConsentDivider, ConsentText, ConsentTitle, ConsentWrapper } from '../styles';
import { ICustomerConsentBooking } from '../../../../../store/reducers/appointmentFrameReducer/types';

const Consent: React.FC<{ consent: ICustomerConsentBooking }> = ({ consent }) => {
  return (
    <ConsentWrapper>
      <ConsentTitle>{consent.title}</ConsentTitle>
      <ConsentText>{consent.message}</ConsentText>
      <ConsentDivider />
    </ConsentWrapper>
  );
};

export default Consent;
