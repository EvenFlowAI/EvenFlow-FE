import React from "react";
import {useStyles} from "../styles";

type TLabelProps = {
    title: string;
    text: string;
}

export const Label: React.FC<React.PropsWithChildren<React.PropsWithChildren<TLabelProps>>> = ({title, text}) => {
    const classes = useStyles();
    return <div>
        <div className={classes.title}>{title}</div>
        <div className={classes.text}>{text}</div>
    </div>
}