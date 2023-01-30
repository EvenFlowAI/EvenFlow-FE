import React, {useEffect} from 'react';
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
//import ReactGA from "react-ga4";
import ReactGA from "react-ga";
import {Loading} from "../UI/Loading";
import {makeStyles} from "@material-ui/core/styles";
import {IFirstScreenOption} from "../../store/reducers/serviceTypes/types";
import {useSCs} from "../../utils/hooks";
import {loadFirstScreenOptionsByQuery} from "../../store/reducers/serviceTypes/actions";

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
    const {firstScreenOptions, isLoading} = useSelector((state: RootState) => state.serviceTypes);
    const {selectedSC} = useSCs();
    const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        selectedSC && dispatch(loadFirstScreenOptionsByQuery(selectedSC.id))
    }, [selectedSC])

    const getMidSize = () => {
        switch (firstScreenOptions.length) {
            case 2:
            case 3:
                return 4;
            case 4:
                return 3;
            default:
                return 6;
        }
    }

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

    const handleSelect = (card: IFirstScreenOption) => {
        dispatch(setServiceType(card.type));
        if (card.type !== EServiceType.General) handleUser(card.type);
    }

    return isLoading || loading
        ? <Loading/>
        : <Grid className={classes.buttonsContainer}
              alignItems="stretch"
              container
              spacing={4}>
            {[...firstScreenOptions].sort((a, b) => a.orderIndex - b.orderIndex).map(card => {
                if (card.type === EServiceType.MobileService && !isMobileServiceOn) return null;
                if (card.type === EServiceType.PikUpDropOff && !isPickUpDropOffServiceOn) return null;

                return <Grid item xs={12} sm={12} md={getMidSize()}>
                    <div onClick={() => handleSelect(card)} className={classes.button}>
                        <span>{card.name}</span>
                    </div>
                </Grid>
            })}
        </Grid>
};

export default ServiceTypeSelect;