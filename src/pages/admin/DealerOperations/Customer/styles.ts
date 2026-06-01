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
  eventInput: {
    '@media (max-width: 900px)': {
      width: '135px',
    },
  },
  recallAlertHeader: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  filtersWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  buttonsWrapper: {
    display: 'flex',
    gap: 12,
    alignItems: 'center',
  },
  recallFormSection: {
    marginBottom: '16px',
  },
  audienceTitle: {
    display: 'block',
    textTransform: 'uppercase',
    fontSize: '18px',
    fontWeight: 700,
    marginBottom: '24px',
  },
  recallFormRow: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-end',
  },
  recallFormField: {
    width: '300px',
  },
  checkVinsButton: {
    height: '42px',
  },
  uploadLabel: {
    width: '100%',
  },
  uploadButton: {
    height: '42px',
    textTransform: 'none' as const,
    display: 'flex',
    gap: '4px',
    alignItems: 'center',
    padding: 0,
  },
  uploadButtonContent: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  hiddenInput: {
    width: '100%',
    display: 'none',
  },
  uploadIconDisabled: {
    '& path': {
      fill: '#BDBDBD',
    },
  },
}));
