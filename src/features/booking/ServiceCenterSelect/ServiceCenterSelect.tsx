import React, {useEffect, useState} from 'react';
import {Loading} from "../../../components/UI/Loading";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {useCurrentUser} from "../../../utils/hooks";
import {IServiceCenter} from "../../../store/reducers/serviceCenters/types";
import {TRole} from "../../../store/reducers/users/types";
import {setTrackerCreated, setWelcomeScreenView} from "../../../store/reducers/appointmentFrameReducer/actions";
import {Routes} from "../../../config/routes";
import {NavLink} from "react-router-dom";
import {useStyles} from "./styles";
import {ServiceCenterCard} from "./ServiceCenterCard/ServiceCenterCard";

const restrictedRoles: TRole[] = ["Manager", "Advisor"];

const ServiceCenterSelect = () => {
    const {scProfile, isProfileLoading} = useSelector((state: RootState) => state.appointment);
    const {shortSC, shortLoading} = useSelector((state: RootState) => state.serviceCenters);
    const [centersList, setCentersList] = useState<IServiceCenter[]>([]);

    const classes = useStyles();
    const currentUser = useCurrentUser();
    const dispatch = useDispatch();

    useEffect(() => {
        if (shortSC?.length && currentUser) {
            setCentersList(() => restrictedRoles.includes(currentUser?.role)
                ? shortSC.filter(item => item.id === currentUser.serviceCenterId)
                : shortSC)
        }
    }, [currentUser, shortSC, restrictedRoles])

    useEffect(() => {
        if (currentUser && scProfile && scProfile?.dealershipId !== currentUser?.dealershipId) {
            dispatch(setWelcomeScreenView('select'))
        }
    }, [currentUser, scProfile])

    useEffect(() => {
        dispatch(setTrackerCreated(false))
    }, [])

    return !scProfile || isProfileLoading || shortLoading
        ? <Loading/>
        : <div className={classes.mainWrapper}>
            <div className={classes.btnWrapper}>
                <NavLink to={Routes.Admin.Appointments} className={classes.linkBtn} target="_blank">View Appointments</NavLink>
            </div>
            <div className={classes.wrapper}>
                {centersList.map(item => <ServiceCenterCard key={item.name} sc={item}/>)}
            </div>
        </div>
};

export default ServiceCenterSelect;