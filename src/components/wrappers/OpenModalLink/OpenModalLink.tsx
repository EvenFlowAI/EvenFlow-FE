import React from 'react';
import {TCallback} from "../../../types/types";

const OpenModalLink: React.FC<{onClick: TCallback, text: string}> = (props) => {
    return (
        <div
            role="presentation"
            style={{ fontWeight: 'bold', textDecoration: 'underline', cursor: 'pointer', fontSize: 15 }}
            onClick={props.onClick}>
            {props.text}
        </div>
    );
};

export default OpenModalLink;