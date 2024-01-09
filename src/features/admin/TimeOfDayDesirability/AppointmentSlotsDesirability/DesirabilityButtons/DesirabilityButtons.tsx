import React from "react";
import {DesirabilityButton} from "../../../../../components/styled/DesirabilityButton";
import {EDesirabilityState} from "../../../../../store/reducers/slotScoring/types";
import {TButton} from "./types";
import {getColor} from "./utils";

const buttons: TButton[] = [
    {label: "Undesirable", type: EDesirabilityState.Undesirable},
    {label: "Neutral", type: EDesirabilityState.Neutral},
    {label: "Desirable", type: EDesirabilityState.Desirable},
]

type TButtonProps = {
    onClick: (t: EDesirabilityState) => () => void;
    desirability: EDesirabilityState;
}

export const DesirabilityButtons: React.FC<TButtonProps> = ({onClick, desirability}) => {
    return <>
        {buttons.map(b => {
            return <DesirabilityButton
                key={b.type}
                variant="contained"
                onClick={onClick(b.type)}
                color={getColor(desirability, b.type)}>
                {b.label}
            </DesirabilityButton>
        })}
    </>
}