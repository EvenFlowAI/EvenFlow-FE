import { FormControlLabel, styled, FormControlLabelProps } from '@mui/material';
import { TextField } from '../../../../../components/styled/EndUserInputs';

interface CodeWrapperProps {
  opened: boolean;
}

export const Wrapper = styled('div')({
  width: '100%',
});

export const SearchInput = styled(TextField)({
  '& button': {
    marginLeft: 6,
  },
});

export const CodesWrapper = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  marginTop: 20,
});

export const DescriptionWrapper = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  whiteSpace: 'nowrap',
});

export const CodeWrapper = styled('div')<CodeWrapperProps>(({ opened }) => ({
  border: '1px solid #DADADA',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  overflow: 'hidden',
  maxHeight: opened ? '200px' : '40px',
  height: 'auto',
  transition: 'max-height 0.3s ease-in-out',
}));

export const PriceCommentWrapper = styled('div')({
  display: 'flex',
  flexDirection: 'row',
});

export const TextFieldWrapper = styled('div')<CodeWrapperProps>(({ opened }) => ({
  display: opened ? 'block' : 'none',
  width: '98%',
  marginBottom: '8px',
  marginLeft: '16px',
  marginRight: '16px',
}));

export const Price = styled('span')({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  fontSize: 18,
  fontWeight: 'bold',
});

export const PricesWrapper = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingRight: 8,
});

const OfferPrice = styled('div')({
  display: 'flex',
  flexWrap: 'nowrap',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginRight: 28,
  fontSize: 14,
  color: '#008331',
});

export const Code = styled(FormControlLabel)<FormControlLabelProps>({
  width: '80%',
  padding: 0,
  margin: 0,
  textTransform: 'uppercase',
  display: 'flex',
  '& span': {
    fontSize: 14,
    '&:last-child': {
      padding: '8px 8px 8px 0',
    },
  },
});

export const MessageIconWrapper = styled('div')<CodeWrapperProps>(({ opened }) => ({
  marginRight: '10px',
  display: 'flex',
  visibility: opened ? 'visible' : 'hidden',
  alignItems: 'center',
  '&:hover': {
    cursor: 'pointer',
  },
}));

export const RemainingCharactersWrapper = styled('div')<CodeWrapperProps>(({ opened }) => ({
  color: '#202021',
  fontFamily: 'Proxima Nova',
  fontSize: '14px',
  fontStyle: 'normal',
  fontWeight: 400,
}));

