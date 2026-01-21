import { darken, lighten, styled, Theme, Tooltip } from '@mui/material';
import { withStyles } from 'tss-react/mui';

export const HtmlTooltip = withStyles(Tooltip, {
  tooltip: {
    fontSize: 12,
    color: '#202021',
    background: '#F7F8FB',
    boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.25)',
    padding: 8,
  },
  popper: {
    borderRadius: 2,
  },
});

type TSlotsWrapperProps = {
  available?: boolean;
  selected?: boolean;
  offPeak?: boolean;
  isWaitList?: boolean;
  waitListTextColor?: string;
  waitListBackground?: string;
};

// ---- helpers ----
const getTextColor = (
  theme: Theme,
  { selected, isWaitList, waitListTextColor }: TSlotsWrapperProps
) => {
  if (selected) {
    return isWaitList && waitListTextColor ? lighten(`#${waitListTextColor}`, 1) : '#FFFFFF';
  }
  return isWaitList && waitListTextColor ? `#${waitListTextColor}` : theme.palette.text.primary;
};

const getBorderColor = ({
  selected,
  offPeak,
  isWaitList,
  waitListBackground,
}: TSlotsWrapperProps) => {
  if (selected) {
    if (isWaitList) return waitListBackground ? `#${waitListBackground}` : '#CE690B';
    return offPeak ? '#237243' : '#000000';
  }
  if (isWaitList) return waitListBackground ? darken(`#${waitListBackground}`, 0.5) : '#CE690B';
  return offPeak ? '#89E5AB' : '#DADADA';
};

const getBackground = ({
  selected,
  offPeak,
  isWaitList,
  waitListBackground,
}: TSlotsWrapperProps) => {
  if (selected) {
    if (isWaitList) return waitListBackground ? darken(`#${waitListBackground}`, 0.5) : '#CE690B';
    return '#000000';
  }
  if (isWaitList) return waitListBackground ? `#${waitListBackground}` : '#FFE6CF';
  return offPeak ? '#E6FCEC' : 'transparent';
};

// ---- styled ----
export const Wrapper = styled('div', {
  shouldForwardProp: prop =>
    ![
      'available',
      'selected',
      'offPeak',
      'isWaitList',
      'waitListTextColor',
      'waitListBackground',
    ].includes(prop as string),
})<TSlotsWrapperProps>(({ theme, ...props }) => ({
  display: 'flex',
  alignItems: 'center',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  flexDirection: 'column',
  gap: '6px',
  opacity: props.available || props.isWaitList ? 1 : 0.3,
  cursor: 'pointer',
  userSelect: 'none',

  '& .availability': {
    minHeight: 80,
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    textAlign: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center',
    color: getTextColor(theme, props),
    padding: '9px 20px',
    borderRadius: 2,
    border: `1px solid ${getBorderColor(props)}`,
    background: getBackground(props),

    '& > svg': {
      marginBottom: 4,
      fill: getTextColor(theme, props),
    },
  },
}));
