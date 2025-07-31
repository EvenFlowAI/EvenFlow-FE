import React from 'react';
import { dealerOperationsRoot } from '../../../utils/constants';
import { TitleContainer } from '../../../components/wrappers/TitleContainer/TitleContainer';

const DealerOperationsCustomer = () => {
  return (
    <div style={{ width: '100%' }}>
      <TitleContainer title="Customer" pad parent={dealerOperationsRoot} />
    </div>
  );
};

export default DealerOperationsCustomer;
