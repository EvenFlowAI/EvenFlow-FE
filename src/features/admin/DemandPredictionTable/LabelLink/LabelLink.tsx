import React, {MouseEventHandler, ReactElement} from 'react';
import {TCallback} from "../../../../types/types";
import {SubLabel} from "./styles";

type TProps = {
    text: string;
    subText: string;
    icon: ReactElement;
    onClick: TCallback;
    color: string;
}

const LabelLink: React.FC<TProps> = (props) => {
    const onClick = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation()
        e.preventDefault()
        e.persist()
        props.onClick()
    }
    return (
        <div>
            <div>{props.text}</div>
            <SubLabel color={props.color} role="presentation" onClick={onClick}>
                <div>{props.icon}</div>
                <div>{props.subText}</div>
            </SubLabel>
        </div>
    );
};

export default LabelLink;