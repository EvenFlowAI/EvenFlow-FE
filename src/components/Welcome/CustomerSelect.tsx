import React, {useEffect, useMemo} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Button, Grid, useMediaQuery} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {setUserType} from "../../store/reducers/appointmentFrameReducer/actions";
import {LocalTokens} from "../../types/types";
import {v4 as uuidv4} from 'uuid';
import {EServiceType, EUserType} from "../../store/reducers/appointmentFrameReducer/types";
import {RootState} from "../../store/rootReducer";
import {setCustomerEnteredEmail} from "../../store/reducers/appointment/actions";
import {TextField} from "../UI/EndUserInputs";
import {EServiceCenterName} from "../../api/types";
import {LoadingButton} from "../UI/Button";
import {useTranslation} from "react-i18next";
import {getCurrentUser} from "../../store/reducers/users/actions";
import {useCurrentUser, useModal} from "../../utils/hooks";
import EnhancedCustomerSearch from "../Modals/EnhancedCustomerSearch/EnhancedCustomerSearch";
import CustomerNotFound from "../Modals/CustomerNotFound/CustomerNotFound";

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
        position: "relative",
        fontWeight: "bold",
        fontSize: 32,
        padding: "7% 7% 9% 7%",
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
        padding: "7% 7% 9% 7%",
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
    submitButton: {
        minWidth: 144,
        [theme.breakpoints.down("xs")]: {
            width: "100%",
            "&:last-child": {
                marginBottom: theme.spacing(2),
                marginTop: theme.spacing(2),
            }
        }
    },
    searchButton: {
        textTransform: 'none',
        textDecoration: 'underline',
        fontSize: 14,
        fontWeight: 600,
        color: "#202021",
        textDecorationColor: "#DADADA",
    },
    searchLinkWrapper: {
        position: "absolute",
        right: '31%',
        bottom: 0,
        [theme.breakpoints.down("xs")]: {
            right: '22%',
        }
    },
}))

const useLoadingStyles = makeStyles(theme => ({
    wrapper: {
        [theme.breakpoints.down("xs")]: {
            width: "100%",
        }
    }
}))

type TProps = {
    onComplete: (serviceType: EServiceType, userType?: EUserType) => void;
    loading: boolean;
    handleNew: () => void;
};

export const CustomerSelect: React.FC<TProps> = ({onComplete, loading, handleNew}) => {
    const {serviceType} = useSelector((state: RootState) => state.appointmentFrame);
    const {customerEnteredEmail, scProfile} = useSelector((state: RootState) => state.appointment);
    const {onOpen, onClose, isOpen} = useModal();
    const {onOpen: onOpenNotFound, onClose: onCloseNotFound, isOpen: isOpenNotFound} = useModal();
    const isRiverviewFord = useMemo(() => scProfile?.serviceCenterFlag === EServiceCenterName.RiverviewFord, [scProfile]);
    const isDominion = useMemo(() => scProfile?.serviceCenterFlag === EServiceCenterName.Dominion, [scProfile]);
    const isLakePowell = useMemo(() => scProfile?.serviceCenterFlag === EServiceCenterName.LakePowellFord, [scProfile]);
    const isDealerBuilt = useMemo(() => scProfile?.serviceCenterFlag === EServiceCenterName.DealerBuilt, [scProfile]);
    const notShowEmail = isRiverviewFord || isDominion || isLakePowell || isDealerBuilt;
    const classes = useStyles();
    const loadingClasses = useLoadingStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const isXs = useMediaQuery("xs");
    const currentUser = useCurrentUser();

    useEffect(() => {
        const uid = uuidv4();
        sessionStorage.setItem(LocalTokens.sessionId, uid);
        window.addEventListener('unload', () => {
            sessionStorage.setItem(LocalTokens.sessionId, '')
        })
        dispatch(getCurrentUser())
    }, [sessionStorage, dispatch])

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
                    placeholder={`${t("Enter your")} ${notShowEmail ? "" : t("Email or ")}${t("Phone")}`}
                    InputProps={{disableUnderline: true}}
                    variant="standard"
                    onChange={handleChange}
                    value={customerEnteredEmail}
                    fullWidth/>
                <LoadingButton
                    fullWidth={isXs}
                    loading={loading}
                    variant="contained"
                    color="primary"
                    classes={loadingClasses}
                    className={classes.loadingButton}
                    disabled={loading || !customerEnteredEmail}
                    onClick={handleComplete}>
                    {t("Search")}
                </LoadingButton>
                {currentUser
                    ? <div className={classes.searchLinkWrapper}>
                    <Button variant="text" onClick={onOpen}
                            className={classes.searchButton}>{t("Search Customer by Name")}</Button>
                </div>
                    : null}
            </div>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
            <div className={classes.button}>
                <span>{t("I`m a new customer")}</span>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.submitButton}
                    onClick={handleNew}
                >
                    {t("Next")}
                </Button>
            </div>
        </Grid>
        <EnhancedCustomerSearch open={isOpen} onClose={onClose} onOpenNotFound={onOpenNotFound} handleNew={handleNew}/>
        <CustomerNotFound open={isOpenNotFound} onClose={onCloseNotFound} handleNew={handleNew} onTryAnotherName={onOpen}/>
    </Grid>
};