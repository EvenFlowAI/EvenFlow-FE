import { withStyles } from 'tss-react/mui';
import { FormControlLabel, RadioGroup, styled, TableCell as TC } from '@mui/material';

export const StyledTableCell = withStyles(TC, {
  root: {
    textAlign: 'left',
    color: '#252733',
    backgroundColor: '#F2F4FB',
    lineHeight: 'normal',
  },
});

export const RadioGroupStyled = styled(RadioGroup)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  gap: 16,
});

export const RadioBtn = styled(FormControlLabel)({
  justifyContent: 'flex-start',
  marginRight: 0,
  '& > .MuiTypography-root': {
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export const BigLabelRadioBtn = styled(RadioBtn)({
  '& > .MuiTypography-root': {
    fontSize: 16,
  },
});

export const SubCellWhite = styled('div')({
  color: '#252733',
  lineHeight: 'normal',
  padding: '15px 16px',
});

export const SubCellGrey = styled(SubCellWhite)({
  backgroundColor: '#F2F4FB',
});

export const SwitchWrapperWhite = styled('div')({
  textAlign: 'center',
  verticalAlign: 'center',
  padding: 7,
  '& > .MuiSwitch-root': {
    height: 36,
  },
});

export const SwitchWrapperGrey = styled(SwitchWrapperWhite)({
  backgroundColor: '#F2F4FB',
});
