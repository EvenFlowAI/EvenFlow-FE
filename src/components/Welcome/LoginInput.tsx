import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Button, Paper, useMediaQuery, useTheme} from "@material-ui/core";
import {TextField} from "../UI/EndUserInputs";

const mh600 = "@media (max-height: 600px)";

const useStyles = makeStyles((theme) => ({
    paper: {
        borderRadius: 2,
        marginTop: "5%",
        padding: "42px 20%",
        [mh600]: {
            padding: "20px 20%",
            marginTop: "2%",
        },
        [theme.breakpoints.down("xs")]: {
            minHeight: "calc(90% - 26px)",
            display: "flex",
            flexFlow: "column nowrap"
        }
    },
    button: {
        minWidth: 144,
        [theme.breakpoints.down("xs")]: {
            width: "100%",
            "&:last-child": {
                order: -1,
                marginBottom: theme.spacing(2)
            }
        }
    },
    title: {
        fontSize: 32,
        margin: "0 0 10px",
        fontWeight: "bold",
        textAlign: "center",
        [mh600]: {
            fontSize: 22
        },
        [theme.breakpoints.down("xs")]: {
            fontSize: 18
        }
    },
    buttonsRow: {
        marginTop: "8%",
        display: "flex",
        justifyContent: "space-around",
        flexFlow: "row nowrap",
        [mh600]: {
            marginTop: "4%"
        },
        [theme.breakpoints.down("xs")]: {
            flexWrap: "wrap"
        }
    }
}));

type TProps = {
    onSelect: (b?: boolean) => void,
    onComplete: () => void
}
export const LoginInput: React.FC<TProps> = ({onSelect, onComplete}) => {
    const theme = useTheme();
    const isXS = useMediaQuery(theme.breakpoints.down("sm"));
    const classes = useStyles();
    return <Paper variant="outlined" className={classes.paper}>
        <h3 className={classes.title}>Enter your Email or Phone</h3>
        <TextField
            placeholder="Type Here"
            InputProps={{disableUnderline: true}}
            variant="standard"
            fullWidth />
        {isXS ? <div className="grow" /> : null}
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