import React, { useEffect, useState } from 'react';
import { Loading } from '../../../components/wrappers/Loading/Loading';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/rootReducer';
import { IServiceCenter } from '../../../store/reducers/serviceCenters/types';
import { TRole } from '../../../store/reducers/users/types';
import {
  clearAppointmentData,
  setAddress,
  setServiceOptionChanged,
  setServiceTypeOption,
  setSideBarSteps,
  setTrackerCreated,
  setVehicle,
  setWelcomeScreenView,
  setZipCode,
} from '../../../store/reducers/appointmentFrameReducer/actions';
import { NavLink, useHistory, useParams } from 'react-router-dom';
import { useStyles } from './styles';
import { ServiceCenterCard } from './ServiceCenterCard/ServiceCenterCard';
import { useCurrentUser } from '../../../hooks/useCurrentUser/useCurrentUser';
import { Routes } from '../../../routes/constants';
import { Roles } from '../../../types/types';
import { decodeSCID, encodeSCID } from '../../../utils/utils';
import {
  loadSCProfile,
  setCustomerEnteredEmail,
  setCustomerLoadedData,
} from '../../../store/reducers/appointment/actions';
import { setCustomerSearchData } from '../../../store/reducers/enhancedCustomerSearch/actions';
import { initialCustomerSearch } from '../../../store/reducers/constants';
import {
  FIRST_NAME,
  LAST_NAME,
  CONTACT,
  SERVICE_CENTER_ID,
  VIN,
} from '../../../types/URLQueryType';

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
  const params = new URL(window.location.href).searchParams;
  const serviceCenterIdFromParams = params.get(SERVICE_CENTER_ID);
  const contactFromParams = params.get(CONTACT);
  const firstNameFromParams = params.get(FIRST_NAME);
  const lastNameFromParams = params.get(LAST_NAME);
  const vinCodeFromParams = params.get(VIN);
  const history = useHistory();

  const { classes } = useStyles();
  const currentUser = useCurrentUser();
  const dispatch = useDispatch();

  useEffect(() => {
    if (shortSC?.length && currentUser) {
      const scList = restrictedRoles.includes(currentUser?.role)
        ? shortSC.filter(item => item.id === decodeSCID(id))
        : shortSC;
      setCentersList(() => scList);
      if (serviceCenterIdFromParams) {
        const selectedSc = scList.find(sc => sc.id === Number(serviceCenterIdFromParams));
        if (selectedSc) {
          selectSc(selectedSc);
        } else {
          console.info("We can't find service center in serviceCenterList", scList);
        }
      } else {
        console.info('We do not have serviceCenterId from params (URL)');
      }
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

  const selectSc = (sc: IServiceCenter) => {
    dispatch(loadSCProfile(sc.id));
    dispatch(clearAppointmentData());
    dispatch(setServiceOptionChanged(false));
    dispatch(setCustomerEnteredEmail(''));
    dispatch(setCustomerSearchData(initialCustomerSearch));
    dispatch(setAddress(null));
    dispatch(setZipCode(''));
    dispatch(setSideBarSteps([]));
    dispatch(setVehicle(null));
    dispatch(setCustomerLoadedData(null));
    dispatch(setServiceTypeOption(null));
    dispatch(setWelcomeScreenView('select'));
    const encoded = encodeSCID(sc.id);
    const params = new URLSearchParams({
      frame: '1',
    });

    if (serviceCenterIdFromParams) params.set(SERVICE_CENTER_ID, serviceCenterIdFromParams);
    if (contactFromParams) params.set(CONTACT, contactFromParams);
    if (firstNameFromParams) params.set(FIRST_NAME, firstNameFromParams);
    if (lastNameFromParams) params.set(LAST_NAME, lastNameFromParams);
    if (vinCodeFromParams) params.set(VIN, vinCodeFromParams);

    history.push(`${Routes.EndUser.Welcome}/${encoded}?${params.toString()}`);
  };

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
