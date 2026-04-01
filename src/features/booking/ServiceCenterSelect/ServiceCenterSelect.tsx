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
import { NavLink, useParams } from 'react-router-dom';
import { useStyles } from './styles';
import { ServiceCenterCard } from './ServiceCenterCard/ServiceCenterCard';
import { useCurrentUser } from '../../../hooks/useCurrentUser/useCurrentUser';
import { Routes } from '../../../routes/constants';
import { Roles } from '../../../types/types';
import { decodeSCID } from '../../../utils/utils';

const restrictedRoles: TRole[] = [
  Roles.ServiceManager,
  Roles.Advisor,
  Roles.Technician,
  Roles.Staff,
  Roles.Vendor,
  Roles.AIBookingAgent,
];

const ServiceCenterSelect = () => {
  const { scProfile, isProfileLoading } = useSelector((state: RootState) => state.appointment);
  const { shortSC, shortLoading } = useSelector((state: RootState) => state.serviceCenters);
  const [centersList, setCentersList] = useState<IServiceCenter[]>([]);
  const { id } = useParams<{ id: string }>();

  const { classes } = useStyles();
  const currentUser = useCurrentUser();
  const dispatch = useDispatch();

  useEffect(() => {
    if (shortSC?.length && currentUser) {
      setCentersList(() =>
        restrictedRoles.includes(currentUser?.role)
          ? shortSC.filter(item => item.id === decodeSCID(id))
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
