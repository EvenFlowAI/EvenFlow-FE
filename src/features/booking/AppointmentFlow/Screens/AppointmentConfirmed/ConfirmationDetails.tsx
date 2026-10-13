import React from 'react';
import { Loading } from '../../../../../components/wrappers/Loading/Loading';
import { TItem } from './types';

type TProps = {
  isLoading: boolean;
  items: TItem[];
};

export const ConfirmationDetails: React.FC<TProps> = ({ isLoading, items }) => {
  if (isLoading) {
    return (
      <div className="emptyContainer">
        <Loading />
      </div>
    );
  }

  return (
    <>
      {items
        .filter(item => item.content)
        .map((item, index) => {
          if (!item.label.length && item.content.length) return null;

          return (
            <div className="item" key={item.label + index}>
              <div className="label">{item.label}</div>
              <div className="content">{item.content}</div>
            </div>
          );
        })}
    </>
  );
};
