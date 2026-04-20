import React from 'react';
import { Tooltip } from '@mui/material';
import { IAssignedServiceRequest } from '../../../../store/reducers/serviceRequests/types';

type TProps = {
  request: IAssignedServiceRequest;
};

const getServiceBookNames = (request: IAssignedServiceRequest): string[] => {
  if (!request.serviceBooks?.length) {
    return [];
  }

  return request.serviceBooks
    .map(serviceBook => serviceBook.name)
    .filter((name): name is string => Boolean(name));
};

export const ServiceRequestOpCodeCell: React.FC<TProps> = ({ request }) => {
  const serviceBookNames = getServiceBookNames(request);

  if (!serviceBookNames.length) {
    return <>{request.serviceRequest.code}</>;
  }

  return (
    <Tooltip
      title={
        <>
          <div>Service Books</div>
          <div>{serviceBookNames.join(', ')}</div>
        </>
      }
      placement="top"
    >
      <span
        style={{ cursor: 'pointer', userSelect: 'none' }}
      >{`${request.serviceRequest.code} *`}</span>
    </Tooltip>
  );
};
