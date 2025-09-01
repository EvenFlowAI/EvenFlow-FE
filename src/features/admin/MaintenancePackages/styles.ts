import { makeStyles } from 'tss-react/mui';

export const useMaintenancePackagesStyles = makeStyles()(() => ({
  titleWrapper: {
    marginBottom: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nonExpanded: {
    backgroundColor: '#E5E5E5',
  },
  topLineWrapper: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  select: {
    width: '100%',
    borderRadius: 0,
    '&:before': {
      display: 'none',
    },
    '& > div': {
      '&:focus': {
        backgroundColor: 'transparent',
      },
    },
  },
  selectWrapper: {
    display: 'flex',
  },
  controlsRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 24,
    marginBottom: 8,
  },
  controlColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  actionsWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    paddingBottom: 8,
  },
  actionsButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  toggleRightRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  toggleRightLabel: {
    fontSize: 14,
    fontWeight: 700,
    textTransform: 'uppercase',
    margin: 0,
    whiteSpace: 'nowrap',
  },
  optionsLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    marginBottom: 6,
  },
  pagination: {
    marginTop: 24,
  },
}));

export const usePackageAccordionStyles = makeStyles()(() => ({
  title: {
    fontSize: 20,
  },
  titleWrapper: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    borderRadius: '50%',
  },
  addOrderButton: {
    marginRight: 20,
  },
  tablesWrapper: {},
  details: {
    display: 'block',
  },
  complimentaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(37, 37, 37, 0.5)',
    color: 'white',
    fontWeight: 'bold',
    padding: '10px 16px',
  },
  greyInput: {
    width: '100%',
    background: 'rgba(37, 37, 37, 0.5)',
    color: 'white',
    fontWeight: 'bold',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    minHeight: 14,
    padding: '10px 16px',
    '& > input': {
      padding: 3,
      fontSize: 14,
    },
  },
}));
