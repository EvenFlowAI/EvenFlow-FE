import React from "react";
import {ContentTitle} from "../ContentTitle/ContentTitle";
import {TTitle} from "../../../types/types";
import {useStyles} from "./styles";

type TProps = {
    title?: string;
    subtitle?: string;
    pad?: boolean;
    parent?: TTitle;
    actions?: boolean | JSX.Element;
}

export const TitleContainer: React.FC<React.PropsWithChildren<TProps>> = ({pad, parent, title, subtitle, actions}) => {
    const classes = useStyles({pad: Boolean(pad)});
    return <div className={classes.container}>
        {title ? <ContentTitle parent={parent} title={title} subtitle={subtitle} /> : <div className={classes.emptyTitle}/>}
        {actions}
    </div>;
}
