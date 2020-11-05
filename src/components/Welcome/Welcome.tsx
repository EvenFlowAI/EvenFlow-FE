import React from 'react';
import {Grid, Paper} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import bg from "../../assets/img/welcomeBg.jpg";

const useStyles = makeStyles(theme => ({
    container: {
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `url('${bg}') top center no-repeat`,
        backgroundSize: "cover"
    },
    title: {
        textTransform: "uppercase",
        fontWeight: "bold",
        fontSize: 32,
        margin: 0,
        textAlign: "center"
    },
    buttonsContainer: {
        marginTop: 62
    },
    paper: {
        borderRadius: 4,
        maxWidth: 990,
        padding: 48,
        backgroundColor: "rgba(255,255,255,.8)"
    },
    button: {
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: 32,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 40px",
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

export const Welcome = () => {
    const classes = useStyles();
    return (
        <div className={classes.container}>
            <Paper className={classes.paper} variant="outlined" >
                <h1 className={classes.title}>Welcome!</h1>
                <h2 className={classes.title}>Schedule Your Service:</h2>
                <Grid className={classes.buttonsContainer}
                      alignItems={"stretch"}
                      container
                      spacing={4}>
                    <Grid item xs={12} sm={6}>
                        <div className={classes.button}>
                            <span>I`m a returning customer</span>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <div className={classes.button}>
                            <span>I`m a new <br /> customer</span>
                        </div>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
};