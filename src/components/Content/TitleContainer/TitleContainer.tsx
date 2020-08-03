import React from "react";
import {makeStyles} from "@material-ui/core/styles";


const useStyles = makeStyles({
    container: {
        display: "flex",
        flexFlow: "row",
        marginTop: 32,
        padding: "0 32px",
        justifyContent: "space-between"
    }
});

export const TitleContainer: React.FC = props => {
    const classes = useStyles();
    return <div className={classes.container}>{props.children}</div>
}
