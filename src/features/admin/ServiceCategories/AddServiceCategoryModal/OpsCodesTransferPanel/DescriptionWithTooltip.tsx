import React from 'react';
import { Tooltip } from '@mui/material';

type TDescriptionWithTooltipProps = {
  text: string;
  className: string;
  maxLength?: number;
};

const DEFAULT_MAX_TEXT_LENGTH = 60;

export const DescriptionWithTooltip: React.FC<TDescriptionWithTooltipProps> = ({
  text,
  className,
  maxLength = DEFAULT_MAX_TEXT_LENGTH,
}) => {
  const shouldTruncate = text.length > maxLength;
  const shortText = shouldTruncate ? `${text.slice(0, maxLength)}...` : text;

  if (!shouldTruncate) {
    return <div className={className}>{text}</div>;
  }

  return (
    <Tooltip placement="top" title={text}>
      <div className={className}>{shortText}</div>
    </Tooltip>
  );
};
