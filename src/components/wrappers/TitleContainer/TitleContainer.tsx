import React from 'react';
import { ContentTitle, ContentTitleForDealerOperation } from '../ContentTitle/ContentTitle';
import { TTitle } from '../../../types/types';
import { EmptyTitle, StyledContainer } from './styles';

type TProps = {
  title?: string;
  subtitle?: string;
  pad?: boolean;
  parent?: TTitle;
  actions?: boolean | JSX.Element;
};

type TForDealerOperationsProps = {
  title?: string;
  subtitle?: string;
  pad?: boolean;
  parent: TTitle;
  secondParent: TTitle;
  actions?: () => void;
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

export const TitleContainerForDealerOperation: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TForDealerOperationsProps>>
> = ({ pad, parent, secondParent, title, subtitle, actions }) => {
  return (
    <StyledContainer pad={Boolean(pad)}>
      {title ? (
        <ContentTitleForDealerOperation
          parent={parent}
          secondParent={secondParent}
          title={title}
          subtitle={subtitle}
          actions={actions}
        />
      ) : (
        <EmptyTitle />
      )}
    </StyledContainer>
  );
};
