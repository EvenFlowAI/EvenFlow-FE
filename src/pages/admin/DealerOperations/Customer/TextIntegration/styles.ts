import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()(() => ({
  container: {
    display: 'flex',
    width: '100%',
    border: '1px solid #DADADA',
    padding: '24px',
    background: '#fff',
  },
  inputsSection: {
    display: 'flex',
    flexDirection: 'column',
    width: '64%',
  },
  settingsWrapper: {
    display: 'flex',
    width: '36%',
    flexDirection: 'column',
  },
  line: {
    color: '#EAEBEE',
    backgroundColor: '#EAEBEE',
    width: '1px',
    height: 'auto',
    border: 'none',
    margin: '0px',
  },
  titleRegistrations: {
    fontSize: '19px',
    fontWeight: 700,
    color: '#252733',
    textTransform: 'uppercase',
    margin: '0 0 24px 0',
  },
  titleSettings: {
    fontSize: '19px',
    fontWeight: 700,
    color: '#252733',
    textTransform: 'uppercase',
    paddingLeft: '24px',
    margin: 0,
  },
  registrationForm: {
    display: 'flex',
    flexDirection: 'column',
    width: '55%',
    gap: '24px',
  },
  settingsForm: {
    display: 'flex',
    flexDirection: 'column',
    width: '45%',
    gap: '24px',
  },
  formRegistrationWrapper: {
    display: 'flex',
    gap: '24px',
    marginRight: '24px',
  },
  integrationFormWrapper: {
    display: 'flex',
    gap: '24px',
    flexDirection: 'column',
    marginBottom: '16px',
    marginTop: '24px',
    paddingLeft: '24px',
  },
  bottomLine: {
    width: '100%',
    height: '1px',
    margin: '0 0 16px 0',
    opacity: '0.3',
    backgroundColor: '#DADADA',
  },
  shortlinkWrapper: {
    paddingLeft: '24px',
  },
  extraMarginTop: {
    marginTop: '10px',
  },
  editTableWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '6px',
  },
  littleDropdowns: {
    width: '60%',
  },
}));
