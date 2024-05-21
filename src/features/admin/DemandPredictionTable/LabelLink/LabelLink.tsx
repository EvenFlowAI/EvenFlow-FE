import React, {ReactElement} from 'react';
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
    return (
        <div>
            <div>{props.text}</div>
            <SubLabel color={props.color} role="presentation" onClick={props.onClick}>
                <div>{props.icon}</div>
                <div>{props.subText}</div>
            </SubLabel>
        </div>
    );
};

export default LabelLink;