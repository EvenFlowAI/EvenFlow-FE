import React from 'react';
import { Tooltip } from '@mui/material';
import { IAssignedServiceRequest } from '../../../../store/reducers/serviceRequests/types';

type TProps = {
  request: IAssignedServiceRequest;
};

export const ServiceRequestOpCodeCell: React.FC<TProps> = ({ request }) => {
  const serviceBooks = request.serviceBooks ?? [];
  const sortedServiceBooks = [...serviceBooks].sort((a, b) => {
    if (a.isActive === b.isActive) return 0;
    return a.isActive ? -1 : 1;
  });

  if (!serviceBooks.length) {
    return <>{request.serviceRequest.code}</>;
  }

  return (
    <Tooltip
      title={
        <>
          <div>Service Books</div>
          <div>
            {sortedServiceBooks.map(b => (b.isActive ? b.name : `${b.name} (Inactive)`)).join(', ')}
          </div>
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
