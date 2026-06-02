import { makeStyles } from 'tss-react/mui';

export const useRecallAlertSettingsStyles = makeStyles()(() => ({
  divider: {
    color: '#EAEBEE',
    height: '1px',
    width: '100%',
    opacity: '0.3',
    margin: 0,
  },
  audienceForm: {
    marginRight: '25px',
  },
  triggers: {
    width: '100%',
    marginLeft: '25px',
  },
}));
