import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Grid} from "@material-ui/core";
import {
    getBlankCustomer,
    getBlankVehicle,
    saveCustomerCache,
    setCustomerLoadedData
} from "../../store/reducers/appointment/actions";
import {useDispatch} from "react-redux";
import {setVehicle} from "../../store/reducers/appointmentFrameReducer/actions";
import ReactGA from "react-ga";

const mh400 = "@media (max-height: 400px)";
const mh600 = "@media (max-height: 600px)";

const useStyles = makeStyles(theme => ({
    buttonsContainer: {
        marginTop: "5%",
        [mh600]: {
            marginTop: "2%"
        },
        [theme.breakpoints.down("sm")]: {
            marginTop: theme.spacing(5)
        }
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
        },
        [mh600]: {
            fontSize: 22,
            padding: "7%"
        },
        [mh400]: {
            fontSize: 18,
            padding: "2%"
        },
        [theme.breakpoints.down("xs")]: {
            fontSize: 18,
            padding: "5%"
        }
    }
}))
type TProps = {
    onLogin: () => void;
    onComplete: () => void;
};

export const CustomerSelect: React.FC<TProps> = ({onLogin, onComplete}) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const handleExisting = (): void => {
        ReactGA.event({
            category: 'User',
            action: 'Enters Page',
            label: `As Returning Customer`
        });
        onLogin();
    }

    const handleNew = () => {
        const c = getBlankCustomer();
        dispatch(setCustomerLoadedData(c));
        dispatch(setVehicle(getBlankVehicle()));
        saveCustomerCache(c);
        ReactGA.event({
            category: 'User',
            action: 'Enters Page',
            label: `As New User`
        });
        onComplete();
    }

    return <Grid className={classes.buttonsContainer}
          alignItems="stretch"
          container
          spacing={4}>
        <Grid item xs={12} sm={12} md={6}>
            <div onClick={handleExisting} className={classes.button}>
                <span>I`m a returning customer</span>
            </div>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
            <div onClick={handleNew} className={classes.button}>
                <span>I`m a new customer</span>
            </div>
        </Grid>
    </Grid>
};