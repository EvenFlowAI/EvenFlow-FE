import React from "react";
import {Avatar} from "@material-ui/core";
import {getInitials} from "../../../utils/utils";
import {useStyles} from "./styles";

type Props = {
    name: string;
    src?: string;
}

export const TableAvatar: React.FC<Props> = props => {
    const classes = useStyles();

    return <Avatar src={props.src} className={classes.root}>
        {getInitials(props.name)}
    </Avatar>;
}