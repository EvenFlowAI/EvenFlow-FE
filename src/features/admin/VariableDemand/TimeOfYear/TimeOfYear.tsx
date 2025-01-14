import { useSelector } from 'react-redux';
import { mappedPricingDemandsSelectorDYear } from '../../../../store/reducers/pricingSettings/selectors';
import { Button } from '@mui/material';
import { SliderTable } from '../SliderTable/SliderTable';
import { EDemandType } from '../../../../store/reducers/pricingSettings/types';
import React from 'react';
import { TimeOfYearModal } from '../TimeOfYearModal/TimeOfYearModal';

import { useModal } from '../../../../hooks/useModal/useModal';
import { TableTitle } from '../../../../components/wrappers/TableTitle/TableTitle';

export const TimeOfYear = () => {
  const { onOpen, isOpen, onClose } = useModal();
  const demand = useSelector(mappedPricingDemandsSelectorDYear);

  return (
    <div>
      <TableTitle
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          textTransform: 'none',
        }}
      >
        <div>Configuration Settings for All Services</div>
        <Button color="primary" onClick={onOpen} variant="contained">
          Set up a calendar
        </Button>
      </TableTitle>
      <SliderTable demand={demand} type={EDemandType.TimeOfYear} />
      <TimeOfYearModal open={isOpen} onClose={onClose} />
    </div>
  );
};
