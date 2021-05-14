import React from 'react';
import {Theme, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {Link} from "react-router-dom";

const titleSt = {
    fontSize: 24,
    lineHeight: "29px",
    margin: 0
}
const useStyles = makeStyles((theme: Theme) => ({
    title: {
        ...titleSt,
        fontWeight: "bold",
        [theme.breakpoints.down("xs")]: {
            textAlign: "center"
        }
    },
    subtitle: {

    },
    titleContainer: {
        display: "flex",
        flexDirection: "column",
        [theme.breakpoints.down("xs")]: {
            marginBottom: theme.spacing(2)
        }
    },
    rootTitle: {
        ...titleSt,
        "&>a": {
            fontWeight: "normal",
            textDecoration: "none",
            color: theme.palette.text.primary,
            "&:hover": {
                textDecoration: "underline"
            }
        },
        [theme.breakpoints.down("xs")]: {
            display: "block"
        }
    }
}));
export type TTitle = {
    title: string;
    to: string;
    parent?: TTitle;
}
type TTitleProps = {
    title: string;
    parent?: TTitle;
    subtitle?: string;
}

const collectParents = (title: TTitle): JSX.Element => {
    const link = <Link to={title.to}>{title.title}</Link>;
    if (title.parent) {
        return <>{collectParents(title.parent)} / {link}</>;
    }
    return link;
}

export const ContentTitle: React.FC<TTitleProps> = (props) => {
    const classes = useStyles();
    return <div className={classes.titleContainer}>
        <Typography className={classes.title} variant="h1">
            {props.parent
                ? <span className={classes.rootTitle}>{collectParents(props.parent)} / </span>
                : null
            }
            {props.title}
        </Typography>
        {props.subtitle
            ? <Typography className={classes.subtitle} variant="subtitle1">{props.subtitle}</Typography>
            : null
        }
    </div>
}

