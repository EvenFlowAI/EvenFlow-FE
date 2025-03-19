import { darken, lighten, styled, Tooltip } from '@mui/material';
import { withStyles } from 'tss-react/mui';
import React from 'react';

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

export const Wrapper = styled('div', {
  shouldForwardProp: prop =>
    prop !== 'available' &&
    prop !== 'selected' &&
    prop !== 'offPeak' &&
    prop !== 'isWaitList' &&
    prop !== 'waitListTextColor' &&
    prop !== 'waitListBackground',
})<TSlotsWrapperProps>(({
  theme,
  available,
  offPeak,
  selected,
  isWaitList,
  waitListTextColor,
  waitListBackground,
}) => {
  return {
    display: 'flex',
    alignItems: 'center',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    flexDirection: 'column',
    gap: '6px',
    opacity: available || isWaitList ? 1 : 0.3,
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
      color: selected
        ? isWaitList && waitListTextColor
          ? lighten(`#${waitListTextColor}`, 1)
          : '#FFFFFF'
        : isWaitList && waitListTextColor
          ? `#${waitListTextColor}`
          : theme.palette.text.primary,
      padding: '9px 20px',
      borderRadius: 2,
      border: `1px solid ${
        selected
          ? isWaitList
            ? waitListBackground
              ? `#${waitListBackground}`
              : '#CE690B'
            : offPeak
              ? '#237243'
              : '#000000'
          : isWaitList
            ? waitListBackground
              ? darken(`#${waitListBackground}`, 0.5)
              : '#CE690B'
            : offPeak
              ? '#89E5AB'
              : '#DADADA'
      }`,
      background: selected
        ? isWaitList
          ? waitListBackground
            ? darken(`#${waitListBackground}`, 0.5)
            : '#CE690B'
          : '#000000'
        : isWaitList
          ? waitListBackground
            ? `#${waitListBackground}`
            : '#FFE6CF'
          : offPeak
            ? '#E6FCEC'
            : 'transparent',
      '& > svg': {
        marginBottom: 4,
        fill: selected
          ? isWaitList && waitListTextColor
            ? lighten(`#${waitListTextColor}`, 1)
            : '#FFFFFF'
          : isWaitList && waitListTextColor
            ? `#${waitListTextColor}`
            : theme.palette.text.primary,
      },
    },
  };
});
