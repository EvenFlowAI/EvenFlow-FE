import React, { useEffect, useState } from 'react';
import { TableBody, TableHead, Switch } from '@mui/material';
import { EligibleSegmentTable, HeaderTableCell, TableCell } from './styles';
import { ECustomerSegmentMobileService, TSegmentType } from './types';
import { TableRow } from '../../../../components/styled/TableRow';

const data = [
  {
    type: ECustomerSegmentMobileService.New,
    name: 'New Customer',
    enabled: false,
    order: 0,
  },
  {
    type: ECustomerSegmentMobileService.Lost,
    name: 'Lost Customer',
    enabled: true,
    order: 1,
  },
  {
    type: ECustomerSegmentMobileService.Existing,
    name: 'Existing',
    enabled: true,
    order: 2,
  },
  {
    type: ECustomerSegmentMobileService.HighValue,
    name: 'High Value',
    enabled: true,
    order: 3,
  },
  {
    type: ECustomerSegmentMobileService.MediumValue,
    name: 'Medium Value',
    enabled: true,
    order: 4,
  },
  {
    type: ECustomerSegmentMobileService.LowValue,
    name: 'Low Value',
    enabled: true,
    order: 5,
  },
  {
    type: ECustomerSegmentMobileService.EndOfWarranty,
    name: 'End Of Warranty',
    enabled: true,
    order: 6,
  },
  {
    type: ECustomerSegmentMobileService.LowValue,
    name: 'Post Warranty',
    enabled: true,
    order: 7,
  },
];

const EligibleCustomerSegment = () => {
  const [segmentsData, setSegmentsData] = useState<TSegmentType[]>([]);

  useEffect(() => {
    // todo request to get data for mobile service
    setSegmentsData(data.sort((a, b) => a.order - b.order));
  }, [data]);

  const onChange =
    (type: ECustomerSegmentMobileService) =>
    (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      setSegmentsData(prev => {
        const itemToUpdate = prev.find(item => item.type === type);
        if (itemToUpdate) {
          const updated = { ...itemToUpdate, enabled: checked };
          const filtered = prev.filter(item => item.type !== type);
          return [...filtered, updated].sort((a, b) => a.order - b.order);
        }
        return prev;
      });
    };

  return (
    <EligibleSegmentTable>
      <TableHead>
        <TableRow>
          <HeaderTableCell align="left">CUSTOMER (SEGMENT)</HeaderTableCell>
          <HeaderTableCell align="center">OFF/ON</HeaderTableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {segmentsData.map(item => {
          return (
            <TableRow key={item.name}>
              <TableCell key={item.type + 'name'} align="left">
                {item.name}
              </TableCell>
              <TableCell key={item.type + 'switch'}>
                <Switch onChange={onChange(item.type)} checked={item.enabled} color="primary" />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </EligibleSegmentTable>
  );
};

export default EligibleCustomerSegment;
