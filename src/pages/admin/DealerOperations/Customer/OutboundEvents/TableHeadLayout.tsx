import React from 'react';
import { TableRow } from '../../../../../components/styled/TableRow';
import { StyledTableCell } from '../../../../../features/admin/DemandPredictionTable/styles';
import { TableHead } from '@mui/material';
import { useStyles } from './styles';

const TableHeadLayout = () => {
  const { classes } = useStyles();

  return (
    <TableHead>
      <TableRow>
        <StyledTableCell key="Event" className={classes.eventCell}>
          Event
        </StyledTableCell>
        <StyledTableCell key="Audience & Triggers" className={classes.triggersCell}>
          Audience & Triggers
        </StyledTableCell>
        <StyledTableCell key="Email" className={classes.emailCell}>
          Email
        </StyledTableCell>
        <StyledTableCell key="Text" className={classes.textCell}>
          Text
        </StyledTableCell>
        <StyledTableCell key="BDC" className={classes.BDCCell}>
          BDC
        </StyledTableCell>
        <StyledTableCell key="Remove" className={classes.removeCell}></StyledTableCell>
      </TableRow>
    </TableHead>
  );
};

export default TableHeadLayout;
