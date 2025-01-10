import { useStyles } from '../styles';
import { useTranslation } from 'react-i18next';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { data } from '../mockData';
import React from 'react';
import { TableContainer } from './styles';
import { getAlphabeticalIndexes } from './utils';

export const RepairTable = () => {
  const indexes = getAlphabeticalIndexes();
  const { classes } = useStyles();
  const { t } = useTranslation();

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell key="#" className={classes.headerCell} align="center">
              #
            </TableCell>
            <TableCell key="#" className={classes.headerCell}>
              {t('Description of Service And Parts')}
            </TableCell>
            <TableCell key="#" className={classes.headerCell} align="center">
              {t('Parts')}
            </TableCell>
            <TableCell key="#" className={classes.headerCell} align="center">
              {t('Labor')}
            </TableCell>
            <TableCell key="#" className={classes.headerCell} align="center">
              {t('Total')}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow className={classes.greyRow}>
            <TableCell />
            <TableCell />
            <TableCell />
            <TableCell />
            <TableCell />
          </TableRow>
          {data.servicesCompleted.map((service, i) => {
            const lastRow = i === data.servicesCompleted.length - 1;
            return (
              <TableRow key={i.toString()}>
                <TableCell
                  key="index"
                  align="center"
                  className={lastRow ? classes.lastRowCell : classes.cell}
                >
                  {indexes[i]}
                </TableCell>
                <TableCell
                  key={service.name}
                  className={lastRow ? classes.lastRowCell : classes.cell}
                >
                  {service.name}
                </TableCell>
                <TableCell
                  key="parts"
                  align="center"
                  className={lastRow ? classes.lastRowCell : classes.cell}
                >
                  ${service.parts.toFixed(2)}
                </TableCell>
                <TableCell
                  key="labor"
                  align="center"
                  className={lastRow ? classes.lastRowCell : classes.cell}
                >
                  ${service.labor.toFixed(2)}
                </TableCell>
                <TableCell
                  key="total"
                  align="center"
                  className={lastRow ? classes.lastRowCell : classes.cell}
                >
                  ${service.total.toFixed(2)}
                </TableCell>
              </TableRow>
            );
          })}
          <TableRow className={classes.totalRow}>
            <TableCell key="totalName" className={classes.totalCell}>
              Total
            </TableCell>
            <TableCell key="totalEmpty" className={classes.totalCell} />
            <TableCell key="totalParts" className={classes.totalCell} align="center">
              ${data.servicesCompleted.reduce((a, v) => a + v.parts, 0).toFixed(2)}
            </TableCell>
            <TableCell key="totalLabor" className={classes.totalCell} align="center">
              ${data.servicesCompleted.reduce((a, v) => a + v.labor, 0).toFixed(2)}
            </TableCell>
            <TableCell key="total" className={classes.totalCell} align="center">
              ${data.servicesCompleted.reduce((a, v) => a + v.total, 0).toFixed(2)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
