import React from 'react';
import { Divider, Grid } from '@mui/material';
import { Paper, Wrapper } from './styles';
import { RepairTable } from './RepairTable/RepairTable';
import { DetailedPayments } from './DetailedPayments/DetailedPayments';
import { Disclaimer } from './Disclaimer/Disclaimer';
import { VehicleData } from './VehicleData/VehicleData';
import { BillHeader } from './BillHeader/BillHeader';

const PaymentBill = () => {
  return (
    <Wrapper>
      <Paper>
        <BillHeader />
        <Divider />
        <VehicleData />
        <RepairTable />
        <Grid container spacing={3}>
          <Disclaimer />
          <DetailedPayments />
        </Grid>
      </Paper>
    </Wrapper>
  );
};

export default PaymentBill;
