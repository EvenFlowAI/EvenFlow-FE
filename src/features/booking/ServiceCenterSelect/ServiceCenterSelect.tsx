import React, { useEffect, useState } from 'react';
import { Loading } from '../../../components/wrappers/Loading/Loading';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/rootReducer';
import { IServiceCenter } from '../../../store/reducers/serviceCenters/types';
import { TRole } from '../../../store/reducers/users/types';
import {
  setTrackerCreated,
  setWelcomeScreenView,
} from '../../../store/reducers/appointmentFrameReducer/actions';
import { NavLink } from 'react-router-dom';
import { useStyles } from './styles';
import { ServiceCenterCard } from './ServiceCenterCard/ServiceCenterCard';
import { useCurrentUser } from '../../../hooks/useCurrentUser/useCurrentUser';
import { Routes } from '../../../routes/constants';
import {Roles} from "../../../types/types";

const restrictedRoles: TRole[] = [
    Roles.ServiceManager,
    Roles.Advisor,
    Roles.Technician,
    Roles.Staff,
    Roles.Vendor,
    Roles.AIBookingAgent
];

const ServiceCenterSelect = () => {
  const { scProfile, isProfileLoading } = useSelector((state: RootState) => state.appointment);
  const { shortSC, shortLoading } = useSelector((state: RootState) => state.serviceCenters);
  const [centersList, setCentersList] = useState<IServiceCenter[]>([]);

  const { classes } = useStyles();
  const currentUser = useCurrentUser();
  const dispatch = useDispatch();

  useEffect(() => {
    if (shortSC?.length && currentUser) {
      setCentersList(() =>
        restrictedRoles.includes(currentUser?.role)
          ? shortSC.filter(item => item.id === currentUser.serviceCenterId)
          : shortSC
      );
    }
  }, [currentUser, shortSC, restrictedRoles]);

  useEffect(() => {
    if (currentUser && scProfile && scProfile?.dealershipId !== currentUser?.dealershipId) {
      dispatch(setWelcomeScreenView('select'));
    }
  }, [currentUser, scProfile]);

  useEffect(() => {
    dispatch(setTrackerCreated({ isCreated: false, ids: [] }));
  }, []);

  return !scProfile || isProfileLoading || shortLoading ? (
    <Loading />
  ) : (
    <div className={classes.mainWrapper}>
      <div className={classes.btnWrapper}>
        <NavLink to={Routes.Admin.Appointments} className={classes.linkBtn} target="_blank">
          View Appointments
        </NavLink>
      </div>
      <div className={classes.wrapper}>
        {centersList.map(item => (
          <ServiceCenterCard key={item.name} sc={item} />
        ))}
      </div>
    </div>
  );
};

export default ServiceCenterSelect;
