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
  statisticDataContainer: {
    marginRight: '25px',
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
    backgroundColor: '#EAEBEE',
    borderRadius: '16px',
    padding: '8px',
  },
  statisticCard: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F7F8FB',
    borderRadius: '10px',
    padding: '16px 14px',
  },
  statisticLabel: {
    textTransform: 'uppercase',
    fontSize: '14px',
    fontWeight: 700,
    color: '#5E5F66',
    marginBottom: '3px',
  },
  statisticValue: {
    fontSize: '24px',
    lineHeight: 1,
    color: '#252733',
    fontWeight: 600,
  },
  statisticIconBox: {
    width: '80px',
    minWidth: '80px',
    height: '80px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statisticVehicleIcon: {
    backgroundColor: '#6F86E8',
  },
  statisticRecipientsIcon: {
    backgroundColor: '#F3A300',
  },
  statisticIcon: {
    color: '#FFFFFF',
    fontSize: '44px',
  },
  recallFormRow: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-end',
    marginBottom: '24px',
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
