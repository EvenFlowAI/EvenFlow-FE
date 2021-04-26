import React, {useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Button, Paper, useMediaQuery, useTheme} from "@material-ui/core";
import {TextField} from "../UI/EndUserInputs";
import {useDispatch, useSelector} from "react-redux";
import {
    setCustomerEnteredEmail, setCustomerLoadedData,
    setSessionId
} from "../../store/reducers/appointment/actions";
import {RootState} from "../../store/rootReducer";
import {API} from "../../api/api";
import {LoadingButton} from "../UI/Button";
import {useException, useMessage} from "../../utils/hooks";
import {TView} from "./types";
import {useHistory} from "react-router-dom";

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
    onReturn: () => void;
    onConfirm: () => void;
    onComplete: () => void;
    view: TView;
}
export const LoginInput: React.FC<TProps> = ({onReturn, onComplete, view, onConfirm}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [securityCode, setSecurityCode] = useState<string>("");
    const theme = useTheme();
    const isXS = useMediaQuery(theme.breakpoints.down("sm"));
    const classes = useStyles();
    const showError = useException();
    const showMessage = useMessage();
    const dispatch = useDispatch();
    const customerEnteredEmail = useSelector((state: RootState) => state.appointment.customerEnteredEmail);
    const sessionId = useSelector((state: RootState) => state.appointment.sessionId);
    const serviceCenter = useSelector((state: RootState) => state.appointment.scProfile)
    const handleChange: React.ChangeEventHandler<HTMLInputElement> = ({target: {value}}) => {
        dispatch(setCustomerEnteredEmail(value));
    }
    const handleComplete = async () => {
        setLoading(true);
        try {
            const {data} = await API.appointment.sendConfirmation({
                searchTerm: customerEnteredEmail
            });
            dispatch(setSessionId(data));
            showMessage("We've send a code with an email for confirmation.");
            onConfirm();
        } catch {
            dispatch(setSessionId(""));
            showError("We can't find your vehicle data, you can proceed as a new customer");
            onReturn();
        } finally {
            setLoading(false);
        }
    }

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await API.appointment.confirm(
                {"session-id": sessionId}, {securityCode}
            );
            try {
                const {data} = await API.appointment.searchCustomerByKey(
                    {"session-id": sessionId},
                    {serviceCenterId: serviceCenter?.id || 0, searchTerm: ""}
                );
                dispatch(setCustomerLoadedData(data));
            } catch {
            } finally {
                onComplete();
            }
        } catch {
            showError("Invalid code");
        } finally {
            setLoading(false);
        }

    }

    return <Paper variant="outlined" className={classes.paper}>
        {view === "search" ? <>
            <h3 className={classes.title}>Enter your Email or Phone</h3>
            <TextField
                placeholder="Type Here"
                InputProps={{disableUnderline: true}}
                variant="standard"
                onChange={handleChange}
                value={customerEnteredEmail}
                fullWidth/>
        </> : <>
            <h3 className={classes.title}>Enter security code</h3>
            <TextField
                placeholder="Please enter a code from an email"
                InputProps={{disableUnderline: true}}
                variant="standard"
                onChange={({target: {value}}) => setSecurityCode(value)}
                value={securityCode}
                fullWidth />
        </>}
        {isXS ? <div className="grow" /> : null}
        <div className={classes.buttonsRow}>
            <Button
                variant="outlined"
                color="primary"
                className={classes.button}
                onClick={onReturn}>
                Back
            </Button>
            <LoadingButton
                loading={loading}
                variant="contained"
                color="primary"
                className={classes.button}
                disabled={
                    loading
                    || (!securityCode && view === "confirm")
                    || (!customerEnteredEmail && view === "search")
                }
                onClick={view === "search" ? handleComplete : handleConfirm}>
                {view === "search" ? "Search" : "Confirm"}
            </LoadingButton>
        </div>
    </Paper>
};