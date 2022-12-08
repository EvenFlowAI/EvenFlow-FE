import React from 'react';
import {Grid} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {mh400, mh600} from "./CustomerSelect";
import {RootState} from "../../store/rootReducer";
import {EServiceType, EUserType} from "../../store/reducers/appointmentFrameReducer/types";
import {
    getBlankCustomer,
    getBlankVehicle,
    saveCustomerCache,
    setCustomerLoadedData
} from "../../store/reducers/appointment/actions";
import {setServiceType, setVehicle} from "../../store/reducers/appointmentFrameReducer/actions";
import ReactGA from "react-ga";
import {Loading} from "../UI/Loading";
import {makeStyles} from "@material-ui/core/styles";
import {useTranslation} from "react-i18next";

type TProps = {
    onComplete: (serviceType: EServiceType, userType?: EUserType) => void;
    loading: boolean;
};

const useStyles = makeStyles((theme) => ({
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
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        fontSize: 32,
        textAlign: "center",
        cursor: "pointer",
        padding: "10%",
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
}))

const ServiceTypeSelect: React.FC<TProps> = ({onComplete, loading }) => {
    const {userType, isMobileServiceOn, isPickUpDropOffServiceOn} = useSelector((state: RootState) => state.appointmentFrame);
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const handleUser = (serviceType: EServiceType) => {
        if (userType === EUserType.New) {
            const c = getBlankCustomer();
            dispatch(setCustomerLoadedData(c));
            dispatch(setVehicle(getBlankVehicle()));
            saveCustomerCache(c);
            ReactGA.event({
                category: 'EvenFlow User',
                action: 'Enters Page',
                label: `As New User`,
            });
        }
        onComplete(serviceType);
    }

    const handleSelect = (service: EServiceType) => {
        dispatch(setServiceType(service));
        handleUser(service);
    }

    return loading
        ? <Loading/>
        : <Grid className={classes.buttonsContainer}
              alignItems="stretch"
              container
              spacing={4}>
            <Grid item xs={12} sm={12} md={isMobileServiceOn && isPickUpDropOffServiceOn ? 4 : 6}>
                <div onClick={() => handleSelect(EServiceType.VisitCenter)} className={classes.button}>
                    <span>{t("Visit Center")}</span>
                </div>
            </Grid>
            {isMobileServiceOn
                ? <Grid item xs={12} sm={12} md={isPickUpDropOffServiceOn ? 4 : 6}>
                <div onClick={() => handleSelect(EServiceType.MobileService)} className={classes.button}>
                    <span>{t("Mobile")}</span>
                </div>
            </Grid>
                : null}
            {isPickUpDropOffServiceOn
                ? <Grid item xs={12} sm={12} md={isMobileServiceOn ? 4 : 6}>
                <div onClick={() => handleSelect(EServiceType.PikUpDropOff)} className={classes.button}>
                    <span>{t("Pick Up / Drop Off Service")}</span>
                </div>
            </Grid>
                : null}
        </Grid>
};

export default ServiceTypeSelect;