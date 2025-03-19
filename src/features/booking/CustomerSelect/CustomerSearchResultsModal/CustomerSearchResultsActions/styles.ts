import { makeStyles } from 'tss-react/mui';

//
export const useStyles = makeStyles()({
  wrapper: {
    position: 'sticky',
    left: 0,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftWrapper: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 44,
  },
  buttonsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    '& > button': {
      width: 144,
    },
    '& > button:first-child': {
      marginRight: 20,
    },
  },
  horizontalBtnsWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  createNewButton: {
    textTransform: 'none',
    textDecoration: 'underline',
    padding: '4px 8px',
  },
  newVehicleMode: {
    display: 'flex',
    alignItems: 'center',
    padding: '9px 12px',
    marginLeft: 48,
    fontSize: 13,
    fontWeight: 600,
    color: '#142EA1',
    backgroundColor: '#F7F8FB',
    borderRadius: 2,
    boxShadow: '2px 2px 2px lightgray',
    '& .text': {
      marginLeft: 8,
      textTransform: 'uppercase',
    },
  },
  selectColumnsButton: {
    fontWeight: 400,
  },
});
