import { FormControlLabel, RadioGroup, styled, TableCell as TC } from '@mui/material';
import { TableCell } from '../../../../components/styled/TableCell';
import { withStyles } from 'tss-react/mui';

export const Wrapper = styled('div')({
  padding: '0 16px',
});

export const SubHeaderCell = styled('span')({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  alignItems: 'center',
  // backgroundColor: "#EAEBEE",
  '& > span': {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '9px 16px',
    textTransform: 'capitalize',
    fontWeight: 700,
    fontSize: 14,
    color: '#252733',
  },
});

export const SubHeaderTitle = styled('span')({
  display: 'block',
  padding: '10px 16px',
  color: '#252733',
});

export const PricesCell = styled(TableCell)({
  padding: '0 !important',
});

export const RadioBtn = styled(FormControlLabel)({
  justifyContent: 'center',
  marginRight: 0,
});

export const RadioGroupStyled = styled(RadioGroup)({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  justifyContent: 'space-between',
});

export const StyledTableCell = withStyles(TC, {
  root: {
    border: 'none !important',
    textAlign: 'center',
  },
});
