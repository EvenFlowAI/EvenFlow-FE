import React, {useEffect, useMemo, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Button, Paper, useMediaQuery, useTheme} from "@material-ui/core";
import {TextField} from "../UI/EndUserInputs";
import {useDispatch, useSelector} from "react-redux";
import {
    getBlankCustomer,
    saveAppointmentReducer, saveCustomerCache,
    setCustomerEnteredEmail, setCustomerLoadedData,
    setSessionId
} from "../../store/reducers/appointment/actions";
import {RootState} from "../../store/rootReducer";
import {API} from "../../api/api";
import {LoadingButton} from "../UI/Button";
import {useException} from "../../utils/hooks";
import {TView} from "./types";
import ReactGA from "react-ga";
import {LocalTokens} from "../../types/types";
import {v4 as uuidv4} from "uuid";
import {EServiceCenterName} from "../../api/types";
import {EServiceType} from "../../store/reducers/appointmentFrameReducer/types";
import {useTranslation} from "react-i18next";

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
        [theme.breakpoints.down('sm')]: {
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
        gap: '12px',
        flexFlow: "row nowrap",
        [mh600]: {
            marginTop: "4%"
        },
        [theme.breakpoints.down("xs")]: {
            flexWrap: "wrap",
            "&> div": {
                width: '100%'
            }
        }
    }
}));

type TProps = {
    onReturn: () => void;
    onConfirm: () => void;
    onComplete: (serviceType: EServiceType) => void;
    view: TView;
}
export const LoginInput: React.FC<TProps> = ({onReturn, onComplete, view, onConfirm}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [securityCode, setSecurityCode] = useState<string>("");
    const theme = useTheme();
    const isXS = useMediaQuery(theme.breakpoints.down("sm"));
    const classes = useStyles();
    const showError = useException();
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const customerEnteredEmail = useSelector((state: RootState) => state.appointment.customerEnteredEmail);
    const sessionId = useSelector((state: RootState) => state.appointment.sessionId);
    const serviceCenter = useSelector((state: RootState) => state.appointment.scProfile)
    const {serviceType} = useSelector((state: RootState) => state.appointmentFrame);
    const isRiverviewFord = useMemo(() => serviceCenter?.serviceCenterFlag === EServiceCenterName.RiverviewFord, [serviceCenter])
    const isDominion = useMemo(() => serviceCenter?.serviceCenterFlag === EServiceCenterName.Dominion, [serviceCenter])

    useEffect(() => {
        if (typeof sessionStorage !== 'undefined') {
            if (!sessionStorage.getItem(LocalTokens.sessionId)) {
                const uid = uuidv4();
                sessionStorage.setItem(LocalTokens.sessionId, uid);
            }
            window.addEventListener('unload', () => {
                sessionStorage.setItem(LocalTokens.sessionId, '')
            })
        }
    }, [sessionStorage])

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = ({target: {value}}) => {
        dispatch(setCustomerEnteredEmail(value));
    }
    const handleComplete = async () => {
        setLoading(true);
        try {
            const {data} = await API.appointment.searchCustomer({
                searchTerm: customerEnteredEmail,
                serviceCenterId: serviceCenter?.id ?? 0
            });
            dispatch(setCustomerLoadedData(data));
            dispatch(saveAppointmentReducer());
            // dispatch(setSessionId(data));
            // dispatch(saveAppointmentReducer());
            // showMessage("We've send a code with an email for confirmation.");
            onComplete(serviceType);
            ReactGA.event({
                category: 'EvenFlow User',
                action: 'Enters Page',
                label: `As Returning Customer`,
            });
        } catch (err) {
            dispatch(setSessionId(""));
            if (err.message) {
                showError(err)
            } else {
                showError(t("We are sorry but we could not find your vehicle in our system. Please schedule appointment as a new customer"));
            }
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
                dispatch(setCustomerLoadedData({...data, sessionId}));
                dispatch(saveAppointmentReducer());
            } catch {
                const c = getBlankCustomer(sessionId);
                dispatch(setCustomerLoadedData(c));
                saveCustomerCache(c);
            } finally {
                onComplete(serviceType);
            }
        } catch {
            showError(t("Invalid code"));
        } finally {
            setLoading(false);
        }

    }

    const getDataName = (): string => {
        return !isRiverviewFord && !isDominion ? `${t("Email")} ${t("or")} ` : ''
    }

    return <Paper variant="outlined" className={classes.paper}>
        {view === "search" ? <>
            <h3 className={classes.title}>{t("Enter your")} {getDataName()}{t("Phone")}</h3>
            <TextField
                placeholder={t("Type Here")}
                InputProps={{disableUnderline: true}}
                variant="standard"
                onChange={handleChange}
                value={customerEnteredEmail}
                fullWidth/>
        </> : <>
            <h3 className={classes.title}>{t("Enter security code")}</h3>
            <TextField
                placeholder={t("Please enter a code from an email")}
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
                {t("Back")}
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
                {view === "search" ? t("Search") : t("Confirm")}
            </LoadingButton>
        </div>
    </Paper>
};