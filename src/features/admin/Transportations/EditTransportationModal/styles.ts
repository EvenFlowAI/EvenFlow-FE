import { makeStyles } from 'tss-react/mui';

export const useMultipleACStyles = makeStyles()(() => ({
  tag: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#7898FF',
    borderRadius: 4,
    color: 'white',
    fontWeight: 'bold',
    margin: '1px 2px',
    '& > svg': {
      color: 'white',
    },
  },
  option: {
    padding: 0,
    fontSize: 15,
    height: 28,
  },
  inputRoot: {
    padding: 5,
    paddingRight: 8,
  },
}));

//
export const useStyles = makeStyles()(() => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 48px',
  },
  input: {
    marginBottom: 20,
  },
  smallWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 16,
  },
  label: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 5,
  },
  bigLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  actionsWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: 14,
  },
  buttonsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ruleHeaderWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 12px',
    cursor: 'grab',
    gap: 8,
    minWidth: 0,
  },
  leftSideHeaderWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    minWidth: 0,
  },
  rightSideHeaderWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  ruleName: {
    fontWeight: 600,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    flex: 1,
    minWidth: 0,
  },
  cancelButton: {
    color: '#7898FF',
    marginRight: 20,
    border: 'none',
    outline: 'none',
  },
  saveButton: {
    background: '#7898FF',
    color: 'white',
    border: '1px solid #7898FF',
    outline: 'none',
    '&:hover': {
      color: '#7898FF',
    },
    '&.Mui-disabled': {
      background: '#E0E0E0',
      color: '#BDBDBD',
      border: '1px solid #E0E0E0',
    },
  },
  deleteButton: {
    borderColor: 'red',
    color: 'red',
    textTransform: 'uppercase',
    flexShrink: 0,
  },
  expandedRuleWrapper: {
    padding: 12,
  },
  ruleNameInput: {
    marginBottom: 20,
  },
  capacityWrapper: {
    marginTop: 24,
  },
  dividerTop: {
    margin: '10px 0 0 0',
  },
}));
