import React, {FC} from 'react'
import { useCallback } from 'react'
import { Card } from '../Card/Card'
import {TDnDProps, TItem} from "../types";

export const Container: FC<TDnDProps> = ({
                                             style,
                                             data,
                                             setData}) => {

    const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
        setData((prevCards: TItem[]) => {
                const arr = [...prevCards];
                arr.splice(dragIndex, 1)
                arr.splice(hoverIndex, 0, prevCards[dragIndex] as TItem)
                return arr
            }
        )
    }, [])

    const onDelete = useCallback((id: number) => {
        setData(prev => [...prev].filter(el => el.id !== id))
    }, [setData])

    const renderCard = useCallback(
        (card: { id: number; text: string }, index: number) => {
            return (
                <Card
                    onDelete={onDelete}
                    key={card.id}
                    index={index}
                    id={card.id}
                    text={card.text}
                    moveCard={moveCard}
                />
            )
        },
        [],
    )

    return (
        <>
            <div style={style}>
                {data.map((card, i) => renderCard(card, i))}
            </div>
        </>
    )
}
