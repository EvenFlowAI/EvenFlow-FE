import { styled } from '@mui/material';
import React from 'react';

export const PriceWrapper = styled('div')<{
  isShowPriceDetails: boolean;
  isUpsellPrice?: boolean;
  isSelected: boolean;
}>(({ isShowPriceDetails, isUpsellPrice, isSelected }) => ({
  width: '100%',
  display: 'grid',
  gridTemplateColumns: '10% 50% 40%',
  border: `1px solid ${isSelected ? '#202021' : '#BDBDBD'}`,
  marginBottom: isUpsellPrice ? 0 : 10,
  marginTop: isUpsellPrice ? 0 : 10,
  '& .radio': {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: isUpsellPrice ? '#FFD966' : '#3E3E40',
    color: isUpsellPrice ? '#202021' : '#FFFFFF',
    padding: '10px 0 10px 0',
  },
  '& .text': {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'right',
    fontSize: 16,
    fontWeight: 'bold',
    color: isUpsellPrice ? '#202021' : '#FFFFFF',
    background: isUpsellPrice ? '#FFD966' : '#3E3E40',
    padding: '10px 16px',
  },
  '& .price': {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: isShowPriceDetails ? 'column' : 'row',
    background: isUpsellPrice ? 'FFF2CC' : isSelected ? '#DADADA' : '#EFEFEF',
    padding: '10px 25px',
    '& .prevPrice': {
      color: '#202021',
      textDecoration: 'line-through',
      fontWeight: 'bold',
      fontSize: 20,
    },
    '& .currentPrice': {
      color: '#D32F2F',
      fontSize: 20,
      fontWeight: 'bold',
    },
    '& .uniquePrice': {
      color: '#202021',
      fontWeight: 'bold',
      fontSize: 20,
    },
  },
}));
