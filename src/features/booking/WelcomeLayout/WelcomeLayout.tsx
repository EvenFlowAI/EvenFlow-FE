import React from 'react';
import {Paper} from "@mui/material";
import {useStyles} from "./styles";

type TProps = {
    title: string|null;
    subtitle?: string;
}

export const WelcomeLayout: React.FC<React.PropsWithChildren<React.PropsWithChildren<TProps>>> = ({children, title, subtitle}) => {
    const { classes  } = useStyles();
    return <div className={classes.container}>
        <Paper className={classes.paper} variant="outlined">
            {title
                ? <h1 className={classes.title}>{title}</h1>
                : null}
            {subtitle
                ? <h2 className={classes.title}>{subtitle}</h2>
                : null}
            {children}
        </Paper>
    </div>
};