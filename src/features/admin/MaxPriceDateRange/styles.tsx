import { styled } from '@mui/material';
import { TextField } from '../../../components/formControls/TextFieldStyled/TextField';

export const Wrapper = styled('div')({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  marginBottom: 24,
});

export const Title = styled('div')({
  fontSize: 16,
  fontWeight: 700,
  textTransform: 'uppercase',
  marginRight: 8,
});

export const Value = styled('div')({
  width: 85,
  border: '1px solid #DADADA',
  borderRadius: 2,
  padding: '11px 10px',
  marginRight: 16,
});

export const StyledInput = styled(TextField)({
  width: 85,
  marginRight: 16,
  border: '1px solid #7898FF',
  borderRadius: 2,
  '&.MuiInputBase-root, &.Mui-focused': {
    border: '1px solid #7898FF',
  },
});
