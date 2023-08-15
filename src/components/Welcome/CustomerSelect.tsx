import React, {useEffect, useMemo} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Grid} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {
    clearAppointmentData,
    setWelcomeScreenView
} from "../../store/reducers/appointmentFrameReducer/actions";
import {LocalTokens, TCallback} from "../../types/types";
import {v4 as uuidv4} from 'uuid';
import {EServiceType, EUserType} from "../../store/reducers/appointmentFrameReducer/types";
import {RootState} from "../../store/rootReducer";
import {useCurrentUser} from "../../utils/hooks";
import {Actions} from "../AppointmentFlow/AppointmentFrame/Actions";
import ReturningSelfCustomer from "./ReturningSelfCustomer";
import NewSelfCustomer from "./NewSelfCustomer";
import ReturningCustomerForAdmin from "./ReturningCustomerForAdmin";
import NewCustomerForAdmin from "./NewCustomerForAdmin";

export const mh400 = "@media (max-height: 400px)";
export const mh600 = "@media (max-height: 600px)";

export const useStyles = makeStyles(theme => ({
    buttonsContainer: {
        marginTop: "5%",
        marginBottom: 20,
        justifyContent: "center",
        [mh600]: {
            marginTop: "2%"
        },
        [theme.breakpoints.down("sm")]: {
            marginTop: theme.spacing(5),
        }
    },
    existing: {
        position: "relative",
        fontWeight: "bold",
        fontSize: 32,
        padding: "32px 28px",
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
        },
    },
    button: {
        height: "100%",
        maxHeight: 400,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        fontWeight: "bold",
        fontSize: 32,
        textAlign: "center",
        padding: "7% 7% 9% 7%",
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
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }
}))

export const useLoadingStyles = makeStyles(theme => ({
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
    redirect: TCallback;
};

export const CustomerSelect: React.FC<TProps> = ({
                                                     onComplete,
                                                     loading,
                                                     handleNew,
    redirect,
                                                 }) => {
    const {scProfile} = useSelector((state: RootState) => state.appointment);
    const {shortSC} = useSelector((state: RootState) => state.serviceCenters);

    const classes = useStyles();
    const dispatch = useDispatch();
    const currentUser = useCurrentUser();
    const isAuthorized = useMemo(() =>  currentUser && currentUser.dealershipId === scProfile?.dealershipId,
        [currentUser, scProfile])

    useEffect(() => {
        const uid = uuidv4();
        sessionStorage.setItem(LocalTokens.sessionId, uid);
        window.addEventListener('unload', () => {
            sessionStorage.setItem(LocalTokens.sessionId, '')
        })
    }, [sessionStorage])

    useEffect(() => {
        dispatch(clearAppointmentData())
    }, [])

    const handleBack = () => dispatch(setWelcomeScreenView("serviceCenterSelect"))

    return <div className={classes.wrapper}>
        <Grid className={classes.buttonsContainer}
              alignItems="stretch"
              container
              spacing={4}>
            {isAuthorized
                ? <ReturningCustomerForAdmin handleNew={handleNew} redirect={redirect}/>
                : <ReturningSelfCustomer onComplete={onComplete} loading={loading} />}
            {isAuthorized
                ? <NewCustomerForAdmin handleNew={handleNew}/>
                : <NewSelfCustomer handleNew={handleNew}/>}
        </Grid>
        {isAuthorized && !!shortSC?.length && <Actions onBack={handleBack} onNext={() => {}} hideNext prevLabel="Change Service Center"/>}
    </div>
};