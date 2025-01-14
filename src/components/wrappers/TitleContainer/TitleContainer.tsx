import React from 'react';
import { ContentTitle } from '../ContentTitle/ContentTitle';
import { TTitle } from '../../../types/types';
import { EmptyTitle, StyledContainer } from './styles';

type TProps = {
  title?: string;
  subtitle?: string;
  pad?: boolean;
  parent?: TTitle;
  actions?: boolean | JSX.Element;
};

export const TitleContainer: React.FC<React.PropsWithChildren<React.PropsWithChildren<TProps>>> = ({
  pad,
  parent,
  title,
  subtitle,
  actions,
}) => {
  return (
    <StyledContainer pad={Boolean(pad)}>
      {title ? <ContentTitle parent={parent} title={title} subtitle={subtitle} /> : <EmptyTitle />}
      {actions}
    </StyledContainer>
  );
};
