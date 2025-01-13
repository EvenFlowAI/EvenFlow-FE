import { makeStyles } from 'tss-react/mui';
import { styled } from '@mui/material';

export const PriceValue = styled('div')<{
  selected: boolean;
  showDetails: boolean;
  roundPrice?: boolean;
}>(({ theme, selected, showDetails, roundPrice }) => ({
  position: 'relative',
  display: 'grid',
  gridTemplateColumns: showDetails ? '1fr 4fr' : '1fr',
  justifyContent: 'center',
  alignItems: 'center',
  border: selected ? '1px solid #202021' : '1px solid #BDBDBD',
  background: selected ? '#DADADA' : '#efefef',
  color: '#202021',
  fontWeight: 600,
  fontSize: 16,
  padding: '22px 16px',
  lineHeight: '20px',
  cursor: 'pointer',
  [`${theme.breakpoints.down('lg')} and (orientation: landscape)`]: {
    gridTemplateColumns: showDetails ? '1fr 2fr' : '1fr',
    padding: '11px 8px',
  },
  [`${theme.breakpoints.down('md')} and (orientation: landscape)`]: {
    gridTemplateColumns: showDetails ? '1fr 3fr' : '1fr',
    padding: '8px 6px',
  },
  '& .prices': {
    display: 'flex',
    justifyContent: showDetails ? (!roundPrice ? 'space-between' : 'space-evenly') : 'center',
    [`${theme.breakpoints.down('lg')} and (orientation: landscape)`]: {
      flexDirection: 'column',
    },
  },
  '& .currentPrice': {
    color: '#D32F2F',
  },
  '& .previousPrice': {
    textDecoration: 'line-through',
  },
  '& .centeredPrice': {
    paddingLeft: 36,
  },
  '& .positionedBtn': {
    position: 'absolute',
    top: 19,
    left: 16,
  },
}));

export const Wrapper = styled('div')<{ count: number }>(({ theme, count }) => ({
  display: 'grid',
  gap: '0 16px',
  gridTemplateColumns:
    count === 3 ? `2fr repeat(${count}, 1fr)` : count === 2 ? '1fr 1fr 1fr' : '1fr 1fr',
  width: '100%',
  alignItems: 'stretch',
  [theme.breakpoints.down('md')]: {
    overflowX: 'auto',
  },
}));

//
export const useStyles = makeStyles()({
  priceText: {
    width: '100%',
    textAlign: 'right',
    fontSize: 16,
    fontWeight: 700,
    color: '#FFFFFF',
    background: '#3E3E40',
    border: '1px solid #DADADA',
    padding: '22px 16px',
    lineHeight: '20px',
  },
  rowWrapper: {
    display: 'grid',
  },
});
