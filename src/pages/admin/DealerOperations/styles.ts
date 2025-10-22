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
  settingsContainer: {
    width: '100%',
  },
  backButton: {
    display: 'flex',
    marginBottom: '30px',
  },
  tableWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '6px',
  },
  editButtonsWrapper: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
  },
  settingsBlock: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    border: '1px solid #DADADA',
    padding: '24px',
    background: '#fff',
    '@media (max-width: 900px)': {
      flexDirection: 'column',
      gap: '30px',
    },
  },
  rulesWrapper: {
    display: 'flex',
    width: '54%',
    flexDirection: 'column',
    gap: '10px',
    '@media (max-width: 900px)': {
      width: '84%',
    },
  },
  line: {
    color: '#EAEBEE',
    backgroundColor: '#EAEBEE',
    width: '1px',
    height: 'auto',
    border: 'none',
    margin: '0px',
  },
  triggersWrapper: {
    display: 'flex',
    width: '42%',
    flexDirection: 'column',
    gap: '10px',
    '@media (max-width: 900px)': {
      width: '100%',
    },
  },
  audienceParagraph: {
    textTransform: 'uppercase',
    fontSize: '18px',
    fontWeight: 700,
  },
  criteriaWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  criteriaFormWrapper: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',

    '@media (max-width: 500px)': {
      flexWrap: 'wrap',
      justifyContent: 'flex-start',

      '& > *': {
        flex: '1 1 30%',
      },
    },
  },
  criteriaValue: {
    display: 'flex',
    flexDirection: 'column',
    width: '11%',
  },
  removeCriteriaIcon: {
    marginTop: '30px',
    cursor: 'pointer',
  },
  addCriteriaButton: {
    fontWeight: 700,
    color: '#7898FF',
  },
  filterRulesWrapper: {
    textTransform: 'uppercase',
    fontSize: '16px',
    fontWeight: 700,
    marginTop: '60px',
  },
  filterRuleItem: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',

    '@media (max-width: 500px)': {
      flexWrap: 'wrap',
      justifyContent: 'flex-start',

      '& > *': {
        flex: '1 1 45%',
      },
    },
  },
  triggerItemWrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: '20px 24px',
    border: '1px solid #DADADA',
    gap: '12px',
  },
  triggerItem: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  contactCounter: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#546AB3',
  },
  triggersFormWrapper: {
    display: 'flex',
    width: '100%',
    gap: '20px',
  },
  triggersForm: {
    display: 'flex',
    flexDirection: 'column',
    width: '42%',
    '@media (max-width: 900px)': {
      width: '50%',
    },
  },
  triggerClockWrapper: {
    display: 'flex',
    flexDirection: 'column',
    width: '31%',
    '@media (max-width: 900px)': {
      width: '45%',
    },
  },
}));
