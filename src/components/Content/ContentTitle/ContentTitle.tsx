import React from 'react';
import {Theme, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const titleSt = {
    fontSize: 24,
    lineHeight: "29px",
    margin: 0
}
const useStyles = makeStyles((theme: Theme) => ({
    title: {
        ...titleSt,
        fontWeight: "bold"
    },
    subtitle: {

    },
    titleContainer: {
        display: "flex",
        flexDirection: "column"
    },
    titleLink: (normal) => ({
        ...titleSt,
        fontWeight: !normal ? "bold" : "normal",
        textDecoration: "none",
        color: theme.palette.text.primary
    })
}));

type TTitleProps = {
    title: string;
    subtitle?: string;
}
export const ContentTitle: React.FC<TTitleProps> = (props) => {
    const classes = useStyles();
    return <div className={classes.titleContainer}>
        <Typography className={classes.title} variant="h1">{props.title}</Typography>
        {props.subtitle
            ? <Typography className={classes.subtitle} variant="subtitle1">{props.subtitle}</Typography>
            : null
        }
    </div>
}

