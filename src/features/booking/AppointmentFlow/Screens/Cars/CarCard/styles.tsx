import { Button, styled } from '@mui/material';

export const Wrapper = styled(
  'div',
  {}
)(({ theme }) => ({
  width: 352,
  height: 116,
  display: 'flex',
  padding: '8px 16px',
  alignItems: 'stretch',
  flexDirection: 'column',
  gap: '8px',
  justifyContent: 'center',
  transition: 'all .2s',
  border: '1px solid #DADADA',
  backgroundColor: '#FFFFFF',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    height: 160,
  },
}));

export const NewVehicleCard = styled(Wrapper)({
  alignItems: 'center',
  padding: '18px 16px',
  cursor: 'pointer',
});

export const BookNewVehicle = styled('div')({
  margin: 'auto',
  fontSize: 20,
  fontWeight: 'bold',
  textTransform: 'uppercase',
});

export const CarDataWithBtn = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
});

export const CardBtnWrapper = styled(
  'div',
  {}
)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 'auto',
  '& > button': {
    width: 150,
  },
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: 8,
    '& > button': {
      width: '100%',
    },
  },
}));

export const StyledButton = styled(Button)({
  backgroundColor: '#E6FCEC',
  border: '1px solid #008331',
  '&.Mui-disabled': {
    backgroundColor: '#FFFFFF',
    border: '1px solid #DADADA',
    color: '#DADADA',
  },
});

export const CarInfo = styled('div')({
  minHeight: 40,
  fontSize: 20,
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  textTransform: 'uppercase',
  lineHeight: 'normal',
  '&>li span': {
    color: '#BDBDBD',
    fontWeight: 'normal',
  },
});
