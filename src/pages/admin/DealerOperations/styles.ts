import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()(() => ({
  backWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textTransform: 'none',
    '&> span': {
      lineHeight: 'normal',
    },
    '&: hover': {
      backgroundColor: 'transparent',
    },
  },
  iconPlus: {
    '& .MuiSvgIcon-root': {
      fill: '#7898FF',
    },
    ' .isDisabled': {
      fill: 'grey',
      color: 'grey !important',
    },
    paddingLeft: '0',
    display: 'flex',
    gap: '4px',
    fontSize: '14px',
    justifyContent: 'flex-start',
    width: 'fit-content',
    alignItems: 'center',
    cursor: 'pointer',
    '&: hover': {
      backgroundColor: 'transparent',
    },
  },
}));
