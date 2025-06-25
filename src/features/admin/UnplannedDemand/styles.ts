import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()(() => ({
  unplannedDemandWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '34px',
  },
  overBookingFactorWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '140px',
    marginLeft: '52px',
  },
  overBookingValue: {
    display: 'inline-block',
    width: '60px',
    textAlign: 'right',
  },
  editOverBooking: {
    textTransform: 'none',
    padding: 'unset',
    minWidth: 'unset',
  },
}));
