import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Grid} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    buttonsContainer: {
        marginTop: "5%"
    },
    button: {
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: 32,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "10%",
        height: "100%",
        textAlign: "center",
        border: "1px solid #DADADA",
        background: "#FFFFFF",
        transition: theme.transitions.create(["box-shadow"]),
        "&:hover": {
            boxShadow: "0 2px 8px rgba(0,0,0,.1)"
        }
    }
}))
type TProps = {
    onSelect: (b?: boolean) => void,
    onComplete: () => void
};

export const CustomerSelect: React.FC<TProps> = ({onSelect, onComplete}) => {
    const classes = useStyles();

    return <Grid className={classes.buttonsContainer}
          alignItems="stretch"
          container
          spacing={4}>
        <Grid item xs={12} sm={6}>
            <div onClick={() => onSelect()} className={classes.button}>
                <span>I`m a returning customer</span>
            </div>
        </Grid>
        <Grid item xs={12} sm={6}>
            <div onClick={onComplete} className={classes.button}>
                <span>I`m a new <br /> customer</span>
            </div>
        </Grid>
    </Grid>
};