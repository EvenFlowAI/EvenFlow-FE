import React from 'react';
import { HtmlTooltip } from '../../../../../../../components/styled/HtmlTooltip';
import { InfoOutlined } from '@mui/icons-material';

type TProps = {
  description?: string;
  active?: boolean;
  isSM?: boolean;
};

const CardDescription: React.FC<TProps> = ({ description, active, isSM }) => {
  return description ? (
    <HtmlTooltip
      enterTouchDelay={0}
      placement="top-end"
      title={
        <div>
          {description.split('\n').map(line => (
            <p key={line}>{line}</p>
          ))}
        </div>
      }
    >
      <div className="infoIcon">
        <InfoOutlined style={{ color: '#828282', filter: active ? 'invert(100%)' : 'unset' }} />
      </div>
    </HtmlTooltip>
  ) : isSM ? null : (
    <div />
  );
};

export default CardDescription;
