import { styled } from '@mui/material';
import { TextField } from '../../../components/formControls/TextFieldStyled/TextField';

export const ButtonWrapper = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  marginBottom: 32,
  marginRight: 24,
}));

export const STextField = styled(TextField)({
  maxWidth: 100,
});
