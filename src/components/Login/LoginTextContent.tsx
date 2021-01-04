import React from "react";
import {Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";


type Props = {content: React.ReactElement | string};
const useStyles = makeStyles(theme => ({
    root: {
        marginBottom: 30,
        padding: "0 60px",
        [theme.breakpoints.down("sm")]: {
            padding: "0 30px"
        },
        [theme.breakpoints.down("xs")]: {
            padding: `0 ${theme.spacing(1)}`
        }
    }
}));

export const LoginTextContent: React.FC<Props> = props => {
    const classes = useStyles();
    return <Typography align="center" variant="body1" className={classes.root}>{props.content}</Typography>;
}
