import React, { CSSProperties, ReactElement } from 'react';
import { TCallback } from '../../../../types/types';
import { SubLabel } from './styles';

type TProps = {
  subText: string;
  icon?: ReactElement;
  onClick: TCallback;
  color: string;
  style?: CSSProperties;
};

const LabelLink: React.FC<TProps> = props => {
  const onClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    e.preventDefault();
    e.persist();
    props.onClick();
  };
  return (
    <SubLabel
      style={props.style ? props.style : undefined}
      color={props.color}
      role="presentation"
      onClick={onClick}
    >
      {props.icon ? <div>{props.icon}</div> : null}
      <div>{props.subText}</div>
    </SubLabel>
  );
};

export default LabelLink;
