import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Button, Paper} from "@material-ui/core";
import {TextField} from "../UI/EndUserInputs";


const useStyles = makeStyles({
    paper: {
        borderRadius: 2,
        marginTop: "5%",
        padding: "42px 20%"
    },
    button: {
        minWidth: 144
    },
    title: {
        fontSize: 32,
        margin: "0 0 10px",
        fontWeight: "bold",
        textAlign: "center"
    },
    buttonsRow: {
        marginTop: "8%",
        display: "flex",
        justifyContent: "space-around",
        flexFlow: "row nowrap"
    }
});

type TProps = {
    onSelect: (b?: boolean) => void,
    onComplete: () => void
}
export const LoginInput: React.FC<TProps> = ({onSelect, onComplete}) => {
    const classes = useStyles();
    return <Paper variant="outlined" className={classes.paper}>
        <h3 className={classes.title}>Enter your Email or Phone</h3>
        <TextField
            placeholder="Type Here"
            InputProps={{disableUnderline: true}}
            variant="standard"
            fullWidth />
        <div className={classes.buttonsRow}>
            <Button
                variant="outlined"
                color="primary"
                className={classes.button}
                onClick={() => onSelect(false)}>
                Back
            </Button>
            <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={onComplete}>
                Search
            </Button>
        </div>
    </Paper>
};