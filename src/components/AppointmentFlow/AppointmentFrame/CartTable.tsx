import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {useTheme} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    wrapper: {
        display: "flex",
        flexDirection: "column",
        [theme.breakpoints.down("sm")]: {

        }
    },
    itemWrapper: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 8,
        background: "white",
        border: "1px solid grey",
    }
}))

const CartItem = () => {
    const classes = useStyles();
    return <div className={classes.itemWrapper}>

    </div>
}

const CartTable = () => {
    const theme = useTheme();
    const classes = useStyles(theme);

    return (
        <div className={classes.wrapper}>

        </div>
    );
};

export default CartTable;