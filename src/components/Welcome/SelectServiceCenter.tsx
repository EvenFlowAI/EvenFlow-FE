import React, {useEffect, useState} from 'react';
import {Loading} from "../UI/Loading";
import {Button} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/rootReducer";
import {useCurrentUser} from "../../utils/hooks";
import {IServiceCenter} from "../../store/reducers/serviceCenters/types";
import {makeStyles} from "@material-ui/core/styles";
import {TRole} from "../../store/reducers/users/types";
import {
    clearAppointmentData,
    setSideBarSteps,
    setVehicle,
    setWelcomeScreenView
} from "../../store/reducers/appointmentFrameReducer/actions";
import {loadSCProfile, setCustomerLoadedData} from "../../store/reducers/appointment/actions";

const useStyles = makeStyles({
    wrapper: {
        display: 'grid',
        gridTemplateColumns: "1fr 1fr 1fr",
        gridGap: 20,
        marginTop: 48,
    },
    card: {
        display: 'flex',
        flexDirection: "column",
        justifyContent: 'space-between',
        alignItems: "center",
        padding: 24,
        border: '1px solid #DADADA',
    },
    button: {
        background: "#202021",
        color: "white",
    },
    text: {
        fontSize: 24,
        fontWeight: 700,
        textAlign: 'center',
        marginBottom: 20,
    }
})

const restrictedRoles: TRole[] = ["Manager", "Advisor"];

const ServiceCenterCard: React.FC<{sc: IServiceCenter}> = ({sc}) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const onClick = () => {
        dispatch(loadSCProfile(sc.id));
        dispatch(clearAppointmentData());
        dispatch(setSideBarSteps([]));
        dispatch(setVehicle(null));
        dispatch(setCustomerLoadedData(null));
        dispatch(setWelcomeScreenView('select'))
    };

    return <div className={classes.card}>
        <div className={classes.text}>{sc.name}</div>
        <Button
            onClick={onClick}
            variant="contained"
            className={classes.button}>
            Schedule Appointment
        </Button>
    </div>
}

const SelectServiceCenter = () => {
    const {scProfile, isProfileLoading} = useSelector((state: RootState) => state.appointment);
    const {shortSC, shortLoading} = useSelector((state: RootState) => state.serviceCenters);
    const [centersList, setCentersList] = useState<IServiceCenter[]>([]);

    const classes = useStyles();
    const currentUser = useCurrentUser();

    useEffect(() => {
        if (shortSC?.length && currentUser) {
            setCentersList(() => restrictedRoles.includes(currentUser?.role)
                ? shortSC.filter(item => item.id === currentUser.serviceCenterId)
                : shortSC)
        }
    }, [currentUser, shortSC, restrictedRoles])

    return !scProfile || isProfileLoading || shortLoading
        ? <Loading/>
        : <div className={classes.wrapper}>
            {centersList.map(item => <ServiceCenterCard key={item.name} sc={item}/>)}
        </div>
};

export default SelectServiceCenter;