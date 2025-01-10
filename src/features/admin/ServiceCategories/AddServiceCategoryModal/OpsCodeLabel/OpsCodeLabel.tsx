import React from 'react';
import { CloseOutlined } from '@mui/icons-material';
import { useStyles } from './styles';
import { IAssignedServiceRequest } from '../../../../../store/reducers/serviceRequests/types';

type TOpsCodeProps = {
  onDelete: (serviceRequest: IAssignedServiceRequest) => void;
  serviceRequest: IAssignedServiceRequest;
};

const OpsCode: React.FC<React.PropsWithChildren<React.PropsWithChildren<TOpsCodeProps>>> = ({
  onDelete,
  serviceRequest,
}) => {
  const { classes } = useStyles();
  return (
    <div className={classes.wrapper}>
      {serviceRequest.serviceRequest?.code}
      <CloseOutlined onClick={() => onDelete(serviceRequest)} className={classes.icon} />
    </div>
  );
};

export default OpsCode;
