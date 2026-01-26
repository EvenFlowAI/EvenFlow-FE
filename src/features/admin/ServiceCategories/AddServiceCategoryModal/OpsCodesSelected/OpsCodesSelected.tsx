import React from 'react';
import { IAssignedServiceRequest } from '../../../../../store/reducers/serviceRequests/types';
import OpsCode from '../OpsCodeLabel/OpsCodeLabel';
import { Title, CodesWrapper, Wrapper } from './styles';
import { TArgCallback } from '../../../../../types/types';

type TProps = {
  selectedCodes: IAssignedServiceRequest[];
  onDelete: TArgCallback<IAssignedServiceRequest>;
};

const OpsCodesSelected: React.FC<TProps> = ({ selectedCodes, onDelete }) => {
  return (
    <Wrapper>
      <Title>Op Codes Selected: </Title>
      <CodesWrapper>
        {selectedCodes.map((el, index) => {
          return <OpsCode key={index} onDelete={onDelete} serviceRequest={el} />;
        })}
      </CodesWrapper>
    </Wrapper>
  );
};

export default OpsCodesSelected;
