import { styled } from '@mui/material';
import { TextField } from '../../../../components/formControls/TextFieldStyled/TextField';

export const Textarea = styled(TextField)({
  '& textarea': {
    padding: '8px 11px',
  },
});

export const Warning = styled('p')({
  height: 20,
  color: '#FF0000',
  fontSize: 12,
  marginBottom: 20,
});
