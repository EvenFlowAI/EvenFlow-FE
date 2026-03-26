import React, { FC } from 'react';
import { useCallback } from 'react';
import { Card } from '../Card/Card';
import { TDnDProps, IData } from '../types';
import { capitalizeName } from '../../../features/admin/MakesModels/helper';

export const Container: FC<TDnDProps> = ({ style, data, setData, currentMake, isEditing }) => {
  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    setData((prevCards: IData[]) => {
      const arr = [...prevCards];
      arr.splice(dragIndex, 1);
      arr.splice(hoverIndex, 0, prevCards[dragIndex]);
      return arr;
    });
  }, []);

  const onDelete = useCallback(
    (id: number) => {
      setData(prev => [...prev].filter(el => el.id !== id));
    },
    [setData]
  );

  const renderCard = useCallback(
    (card: IData, index: number) => {
      if (card.text === 'OTHER') {
        const otherText = isEditing ? `Other ${capitalizeName(currentMake?.name)}` : 'Other';
        return (
          <Card
            onDelete={() => {}}
            key={card.id}
            index={index}
            id={card.id}
            text={otherText}
            moveCard={moveCard}
          />
        );
      }

      return (
        <Card
          onDelete={onDelete}
          key={card.id}
          index={index}
          id={card.id}
          text={capitalizeName(card.text)}
          moveCard={moveCard}
        />
      );
    },
    [isEditing, currentMake, onDelete, moveCard]
  );

  return (
    <>
      <div style={style}>{data.map((card, i) => renderCard(card, i))}</div>
    </>
  );
};
