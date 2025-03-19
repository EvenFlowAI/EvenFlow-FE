import React, { FC } from 'react';
import { useCallback } from 'react';
import { Card } from '../Card/Card';
import { TDnDProps, IData } from '../types';
import { makeStyles } from 'tss-react/mui';
export const useStyles = makeStyles()(() => ({
  placeholderStyles: {
    color: '#858585',
    textAlign: 'center',
    fontFamily: 'Proxima Nova',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: 300,
    lineHeight: 'normal',
  },
}));

export const Container: FC<TDnDProps> = ({ style, data, setData, isEditing }) => {
  const { classes } = useStyles();
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

  const renderCard = useCallback((card: IData, index: number) => {
    return (
      <Card
        onDelete={onDelete}
        key={card.id}
        index={index}
        id={card.id}
        text={card.text}
        moveCard={moveCard}
      />
    );
  }, []);

  return (
    <>
      <div style={style}>
        {data.length === 0 ? (
          <div className={classes.placeholderStyles}>
            <Card onDelete={() => {}} key={0} index={0} id={0} text={'Other'} moveCard={moveCard} />
          </div>
        ) : (
          <>
            {data.map((card, i) => renderCard(card, i))}
            <Card onDelete={() => {}} key={0} index={0} id={0} text={'Other'} moveCard={moveCard} />
          </>
        )}
      </div>
    </>
  );
};
