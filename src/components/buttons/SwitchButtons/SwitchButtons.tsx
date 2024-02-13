import React from "react";
import {DesirabilityButton} from "../../styled/DesirabilityButton";
import {TSwitchButtonsProps} from "../../../types/types";

const getButtonColor = <U extends string | number>(ds: U, cds: U): "primary" | "inherit" => {
    return ds === cds ? "primary" : "inherit";
}
export const SwitchButtons
    = <U extends string | number>({onClick, buttons, active}: TSwitchButtonsProps<U>):
    React.ReactElement<TSwitchButtonsProps<U>> => {
    return <>
        {buttons.map(b => {
            return <DesirabilityButton
                key={b.type}
                variant="contained"
                onClick={onClick(b.type)}
                color={getButtonColor(active, b.type)}>
                {b.label}
            </DesirabilityButton>
        })}
    </>
}