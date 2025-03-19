import React from 'react';
import { Grid } from '@mui/material';
import { StyledGrid } from './styles';
import ServiceBookRowMobile from './ServiceBookRowMobile/ServiceBookRowMobile';
import { TEmployeeAssignmentMobileProps } from '../types';

const EmployeeAssignmentMobile: React.FC<TEmployeeAssignmentMobileProps> = ({
  data,
  onMethodChange,
  expandedItem,
  setExpandedItem,
}) => {
  return (
    <Grid container>
      <StyledGrid item xs={12}>
        Service Book
      </StyledGrid>
      {data.map((item, idx) => {
        return (
          <ServiceBookRowMobile
            key={idx}
            data={data}
            expandedItem={expandedItem}
            setExpandedItem={setExpandedItem}
            onMethodChange={onMethodChange}
            item={item}
            idx={idx}
          />
        );
      })}
    </Grid>
  );
};

export default EmployeeAssignmentMobile;
