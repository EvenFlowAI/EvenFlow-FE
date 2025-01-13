import { styled } from '@mui/material';

type TStyleProps = {
  pad: boolean;
};

export const StyledContainer = styled('div')<TStyleProps>(({ theme, pad }) => ({
  display: 'flex',
  flexFlow: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: `calc(100% + calc(${theme.spacing(4)} * 2))`,
  maxWidth: theme.breakpoints.values.lg,
  marginLeft: `-${theme.spacing(4)}`,
  marginRight: `-${theme.spacing(4)}`,
  marginTop: theme.spacing(3),
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
  paddingBottom: pad ? theme.spacing(3) : 0,
  [theme.breakpoints.down('mdl')]: {
    flexFlow: 'column',
    '&>*:not(:first-child)': {
      marginTop: theme.spacing(1),
    },
    alignItems: 'start',
    width: '100%',
    alignSelf: 'flex-start',
  },
}));

export const EmptyTitle = styled('div')({
  width: '50%',
});
