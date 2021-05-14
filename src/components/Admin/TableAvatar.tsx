import React from "react";
import {Avatar} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {getInitials} from "../../utils/utils";

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.primary.main,
        fontSize: 12,
        width: 30,
        height: 30
    }
}));

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