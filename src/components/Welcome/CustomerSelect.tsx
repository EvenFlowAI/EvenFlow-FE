import React, {useEffect} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Grid} from "@material-ui/core";
import {
    getBlankCustomer,
    getBlankVehicle,
    saveCustomerCache,
    setCustomerLoadedData
} from "../../store/reducers/appointment/actions";
import {useDispatch, useSelector} from "react-redux";
import {setUserType, setVehicle} from "../../store/reducers/appointmentFrameReducer/actions";
import ReactGA from "react-ga";
import {LocalTokens} from "../../types/types";
import {v4 as uuidv4} from 'uuid';
import {EServiceType, EUserType} from "../../store/reducers/appointmentFrameReducer/types";
import {TView} from "./types";
import {RootState} from "../../store/rootReducer";

export const mh400 = "@media (max-height: 400px)";
export const mh600 = "@media (max-height: 600px)";

export const useStyles = makeStyles(theme => ({
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
    // onLogin: () => void;
    // onComplete: (serviceType: EServiceType) => void;
    setView: (view: TView) => void;
};

export const CustomerSelect: React.FC<TProps> = ({setView}) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {serviceType} = useSelector((state: RootState) => state.appointmentFrame);

    useEffect(() => {
        const uid = uuidv4();
        sessionStorage.setItem(LocalTokens.sessionId, uid);
        window.addEventListener('unload', () => {
            sessionStorage.setItem(LocalTokens.sessionId, '')
        })
    }, [])

    const handleExisting = (): void => {
        setView('serviceSelect')
        dispatch(setUserType(EUserType.Existing));
        // onLogin();
    }

    const handleNew = () => {
        setView('serviceSelect')
        dispatch(setUserType(EUserType.New));
        // const c = getBlankCustomer();
        // dispatch(setCustomerLoadedData(c));
        // dispatch(setVehicle(getBlankVehicle()));
        // saveCustomerCache(c);
        // ReactGA.event({
        //     category: 'EvenFlow User',
        //     action: 'Enters Page',
        //     label: `As New User`,
        // });
        // onComplete(serviceType);
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