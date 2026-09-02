import React from 'react';
import CancelIcon from '@mui/icons-material/Cancel';

type TTagDeleteIconProps = {
  onClick?: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
};

const TagDeleteIcon: React.FC<TTagDeleteIconProps> = ({ onClick }) => {
  return (
    <CancelIcon
      onClick={onClick}
      data-testid="CancelIcon"
      style={{ display: 'inline-block', cursor: 'pointer', marginLeft: 4, flexShrink: 0 }}
    />
  );
};

export default TagDeleteIcon;
