import { makeStyles } from 'tss-react/mui';
import { styled } from '@mui/material';
import { TextField } from '../../../../components/formControls/TextFieldStyled/TextField';

//
export const useStyles = makeStyles()(() => ({
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
  cancelButton: {
    marginRight: 20,
  },
  saveButton: {
    background: '#7898FF',
    color: 'white',
    border: '1px solid #7898FF',
    outline: 'none',
    '&:hover': {
      color: '#7898FF',
    },
  },
}));

export const Textarea = styled(TextField)({
  '& textarea': {
    padding: '8px 11px',
  },
});

export const useEditRecallStyles = makeStyles()(theme => ({
  title: {
    display: 'block',
    padding: '24px 32px 16px',
    textAlign: 'left',
    fontSize: 24,
    fontWeight: 700,
    margin: 0,
  },
  topRow: {
    padding: '0 32px 16px',
    display: 'flex',
  },
  componentField: {
    flex: 1,
  },
  opCodeField: {
    width: 194,
  },
  body: {
    display: 'flex',
    width: '100%',
    gap: theme.spacing(3),
  },
  infoPanel: {
    background: '#F2F4FB',
    padding: '24px 24px 24px 32px',
    width: 266,
    flexShrink: 0,
  },
  label: {
    color: '#252733',
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  value: {
    color: theme.palette.text.primary,
    fontSize: 16,
    fontWeight: 400,
    marginBottom: theme.spacing(2),
    wordBreak: 'break-word',
  },
  modelItem: {
    marginBottom: theme.spacing(1),
  },
  modelsWrapper: {
    marginBottom: theme.spacing(1),
  },
  link: {
    padding: 0,
    minWidth: 0,
    fontWeight: 700,
    textTransform: 'none',
  },
  details: {
    flex: 1,
    paddingRight: 32,
  },
  divider: {
    borderColor: '#EAEBEE',
  },
  bigLabel: {
    color: '#252733',
    fontSize: 18,
    fontWeight: 700,
    margin: '20px 0 12px 0',
    textTransform: 'uppercase',
  },
  text: {
    marginBottom: 20,
    whiteSpace: 'pre-line',
  },
}));
