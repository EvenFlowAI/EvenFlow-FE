import React, {useEffect, useMemo} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Button, Grid} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {setUserType, setVehicle, setWelcomeScreenView} from "../../store/reducers/appointmentFrameReducer/actions";
import {LocalTokens} from "../../types/types";
import {v4 as uuidv4} from 'uuid';
import {EServiceType, EUserType} from "../../store/reducers/appointmentFrameReducer/types";
import {RootState} from "../../store/rootReducer";
import {
    getBlankCustomer,
    getBlankVehicle,
    saveCustomerCache, setCustomerEnteredEmail,
    setCustomerLoadedData,
} from "../../store/reducers/appointment/actions";
import ReactGA from "react-ga";
import {TextField} from "../UI/EndUserInputs";
import {EServiceCenterName} from "../../api/types";
import {LoadingButton} from "../UI/Button";
import {useTranslation} from "react-i18next";

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
    existing: {
        fontWeight: "bold",
        fontSize: 32,
        padding: "7%",
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
    },
    button: {
        fontWeight: "bold",
        fontSize: 32,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "7%",
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
    },
    loadingButton: {
        minWidth: 144,
        [theme.breakpoints.down("xs")]: {
            width: "100%",
            "&:last-child": {
                order: -1,
                marginBottom: theme.spacing(2)
            }
        }
    },
}))
type TProps = {
    onComplete: (serviceType: EServiceType, userType?: EUserType) => void;
    loading: boolean;
};

export const CustomerSelect: React.FC<TProps> = ({onComplete, loading}) => {
    const {isMobileServiceOn, serviceType, isPickUpDropOffServiceOn} = useSelector((state: RootState) => state.appointmentFrame);
    const {customerEnteredEmail, scProfile} = useSelector((state: RootState) => state.appointment);
    const isRiverviewFord = useMemo(() => scProfile?.serviceCenterFlag === EServiceCenterName.RiverviewFord, [scProfile]);
    const isDominion = useMemo(() => scProfile?.serviceCenterFlag === EServiceCenterName.Dominion, [scProfile]);
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    useEffect(() => {
        const uid = uuidv4();
        sessionStorage.setItem(LocalTokens.sessionId, uid);
        window.addEventListener('unload', () => {
            sessionStorage.setItem(LocalTokens.sessionId, '')
        })
    }, [])

    const createBlankCar = () => {
        const c = getBlankCustomer();
        dispatch(setCustomerLoadedData(c));
        dispatch(setVehicle(getBlankVehicle()));
        saveCustomerCache(c);
    }

    const handleReactGA = (userType: string) => {
        ReactGA.event({
            category: 'EvenFlow User',
            action: 'Enters Page',
            label: `As ${userType} Customer`,
        });
    }

    const handleNew = () => {
        dispatch(setUserType(EUserType.New));
        handleReactGA('A New');
        dispatch(setCustomerEnteredEmail(''));
        if (isMobileServiceOn || isPickUpDropOffServiceOn) {
            dispatch(setWelcomeScreenView('serviceSelect'))
        } else {
            createBlankCar()
            onComplete(serviceType, EUserType.New);
        }
    }
    const handleChange: React.ChangeEventHandler<HTMLInputElement> = ({target: {value}}) => {
        dispatch(setCustomerEnteredEmail(value));
    }

    const handleComplete = async () => {
        dispatch(setUserType(EUserType.Existing));
        onComplete(serviceType, EUserType.Existing);
    }

    return <Grid className={classes.buttonsContainer}
                 alignItems="stretch"
                 container
                 spacing={4}>
        <Grid item xs={12} sm={12} md={6}>
            <div className={classes.existing}>
                <span>{t("I`m a returning customer")}</span>
                <TextField
                    style={{ marginTop: 20, marginBottom: 20 }}
                    placeholder={`${t("Enter your")} ${!isRiverviewFord && !isDominion ? t("Email or ") : ''}${t("Phone")}`}
                    InputProps={{disableUnderline: true}}
                    variant="standard"
                    onChange={handleChange}
                    value={customerEnteredEmail}
                    fullWidth/>
                <LoadingButton
                    loading={loading}
                    variant="contained"
                    color="primary"
                    className={classes.loadingButton}
                    disabled={loading || !customerEnteredEmail}
                    onClick={handleComplete}>
                    {t("Search")}
                </LoadingButton>
            </div>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
            <div className={classes.button}>
                <span>{t("I`m a new customer")}</span>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.loadingButton}
                    onClick={handleNew}
                >
                    {t("Submit")}
                </Button>
            </div>
        </Grid>
    </Grid>
};