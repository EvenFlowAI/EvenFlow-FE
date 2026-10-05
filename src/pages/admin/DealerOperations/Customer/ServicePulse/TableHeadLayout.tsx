import React from 'react';
import { TableHead } from '@mui/material';
import { useStyles } from './styles';
import { TableRow } from '../../../../../components/styled/TableRow';
import { StyledTableCell } from '../../../../../features/admin/DemandPredictionTable/styles';

const TableHeadLayout = () => {
  const { classes } = useStyles();

  return (
    <TableHead>
      <TableRow>
        <StyledTableCell key="Event" className={classes.SERVICE_BOOK}>
          SERVICE BOOK
        </StyledTableCell>
        <StyledTableCell key="Audience & Triggers" className={classes.PLAY_NAME}>
          PLAY NAME
        </StyledTableCell>
        <StyledTableCell key="Email" className={classes.PLAY}>
          PLAY
        </StyledTableCell>
        <StyledTableCell key="Text" className={classes.AUDIENCE}>
          AUDIENCE
        </StyledTableCell>
        <StyledTableCell key="BDC" className={classes.TEXT}>
          Text
        </StyledTableCell>
        <StyledTableCell key="Active" className={classes.ACTIVE}>
          Active
        </StyledTableCell>
        <StyledTableCell key="Remove" className={classes.REMOVE}></StyledTableCell>
      </TableRow>
    </TableHead>
  );
};

export default TableHeadLayout;
