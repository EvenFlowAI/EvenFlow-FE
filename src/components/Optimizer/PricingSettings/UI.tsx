import React from "react";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
    title: {
        fontSize: 16,
        fontWeight: "bold",
        textTransform: "uppercase",
        margin: "16px 32px"
    }
});

export const PaperTitle: React.FC = ({children}) => {
    const classes = useStyles();
    return <h4 className={classes.title}>{children}</h4>;
}

export const TableContainer: React.FC = ({children}) => {
    return <div style={{padding: 16}}>{children}</div>;
}