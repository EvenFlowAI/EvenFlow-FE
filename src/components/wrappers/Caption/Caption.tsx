import React from "react";
import {InfoOutlined} from "@material-ui/icons";
import {useStyles} from "./styles";

export const Caption: React.FC<{title: string|JSX.Element, icon?: JSX.Element}> = ({title, icon}) => {
    const classes = useStyles();
    return <div className={classes.caption}>
        {icon ? icon : <InfoOutlined color="primary" style={{ marginRight: 8 }}/>}
        <span>{title}</span>
    </div>
}