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
});

export const CodeWrapper = styled('div')<CodeWrapperProps>(({ opened }) => ({
  border: '1px solid #DADADA',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  overflow: 'hidden',
  height: 'auto',
  // borderRadius: '4px',
  // backgroundColor: opened ? '#F7F8FB' : '#fff',
}));

export const PriceCommentWrapper = styled('div')({
  display: 'flex',
  flexDirection: 'row',
});

export const TextFieldWrapper = styled('div')<{ opened: boolean }>(({ opened }) => ({
  width: '100%',
  overflow: 'hidden',
  maxHeight: opened ? '200px' : '0',
  opacity: opened ? 1 : 0,
  transition: 'all 0.3s ease-in-out',
  padding: opened ? '0 12px 12px' : '0 12px',
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
  paddingRight: 16,
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
  '@media (max-width: 768px)': {
    // width: '250px',
    // whiteSpace: 'nowrap',
    // overflow: 'hidden',
    // textOverflow: 'ellipsis',
    '& span': {
      fontSize: 12, // Adjust font size for smaller screens
      '&:last-child': {
        padding: '6px 6px 6px 0', // Adjust padding for smaller screens
      },
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
