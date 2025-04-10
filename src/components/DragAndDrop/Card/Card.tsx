import type { Identifier, XYCoord } from 'dnd-core';
import React, { FC, useRef, useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { ItemTypes } from '../itemTypes';
import { CardProps, DragItem } from '../types';
import { Tooltip } from '@mui/material';
import { ReactComponent as Delete } from '../../../assets/img/delete.svg';
import { CardWrapper } from './styles';

export const Card: FC<CardProps> = ({ id, text, index, moveCard, backGroundColor, onDelete }) => {
  const ref = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        setIsOverflowing(textRef.current.scrollWidth > textRef.current.clientWidth);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [text]);

  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { id, index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  const boxShadow = isDragging ? '0px 2px 6px 0px #4D70E3' : 'none';



  drag(drop(ref));

  const textContent = (
    <span
      ref={textRef}
      style={{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        display: 'block',
        width: 150,
        fontFamily: 'Proxima Nova',
        fontWeight: 700,
        fontSize: 16,
        lineHeight: '100%',
        letterSpacing: '0.4px',
        textTransform: 'capitalize',
      }}
    >
      {text}
    </span>
  );

  return (
    <CardWrapper
      ref={ref}
      style={{
        opacity,
        boxShadow,
        backgroundColor: text.toLowerCase().includes('other')
          ? '#858585'
          : (backGroundColor ?? '#7898FF'),
      }}
      data-handler-id={handlerId}
    >
      {isOverflowing ? <Tooltip title={text}>{textContent}</Tooltip> : textContent}
      {onDelete && !text.toLowerCase().includes('other') ? (
        <Delete onClick={() => onDelete(id)} style={{ cursor: 'pointer' }} />
      ) : null}
    </CardWrapper>
  );
};
