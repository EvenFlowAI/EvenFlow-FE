import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()(() => ({
  wrapper: {
    width: '100%',
  },
  tabPanel: {
    width: '100%',
    padding: '24px 0',
  },
  itemsContainer: {
    display: 'flex',
    width: '100%',
    justifyContent: 'flex-end',
    paddingBottom: '24px',
  },
  updateNamesContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginRight: '40px',
  },
  rightTab: {
    width: '100%',
    padding: '24px 0',
  },
  eventCell: {
    textTransform: 'capitalize',
    width: '26%',
  },
  triggersCell: {
    textTransform: 'capitalize',
    width: '18%',
  },
  emailCell: {
    textTransform: 'capitalize',
    width: '21%',
  },
  textCell: {
    textTransform: 'capitalize',
    width: '21%',
  },
  BDCCell: {
    textTransform: 'capitalize',
    width: '7%',
  },
  removeCell: {
    textTransform: 'capitalize',
  },
  textRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  disabledCell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));
