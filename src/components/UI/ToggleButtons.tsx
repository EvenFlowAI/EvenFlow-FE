import {ToggleButton, ToggleButtonGroup} from "@material-ui/lab";
import React from "react";

export type TButtonElement = {
    value: any, label: string, id: string;
};
type TProps = {
    buttons: TButtonElement[],
    onChange: (e: React.MouseEvent<HTMLElement>, value: any) => void,
    value: any,
    exclusive?: boolean,
}

export const ToggleButtons: React.FC<TProps> = props => {
    return <ToggleButtonGroup
                exclusive={props.exclusive}
                onChange={props.onChange}
                value={props.value}>
        {props.buttons.map(b => <ToggleButton
            key={b.id}
            value={b.value}
        >{b.label}</ToggleButton>)}
    </ToggleButtonGroup>
}