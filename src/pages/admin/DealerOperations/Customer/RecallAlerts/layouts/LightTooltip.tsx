import { styled, Tooltip, tooltipClasses, TooltipProps } from '@mui/material';
import React from 'react';

interface LightTooltipProps extends TooltipProps {
  width?: string | number;
}

export const LightTooltip = styled(({ className, ...props }: LightTooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))<LightTooltipProps>(({ theme, width }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    width: typeof width === 'number' ? `${width}px` : width || '195px',
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 12,
  },
}));
