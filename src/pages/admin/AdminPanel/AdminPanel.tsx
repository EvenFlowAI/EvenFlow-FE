import React, { useEffect, useRef, useState } from 'react';
import { SideBar } from '../../../features/admin/SideBar/SideBar';
import { Redirect, Switch } from 'react-router-dom';
import { AdminRoutes } from '../../../routes/AdminRoutes/AdminRoutes';
import { NavBar } from '../../../features/admin/NavBar/NavBar';
import { Toolbar } from '@mui/material';
import { PrivateRoute } from '../../../routes/PrivateRoute/PrivateRoute';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from '../../../store/reducers/users/actions';
import { loadDealershipProfile } from '../../../store/reducers/dealershipGroups/actions';
import { loadAllSCs } from '../../../store/reducers/serviceCenters/actions';
import { getPodsShort, loadPodsShort } from '../../../store/reducers/pods/actions';
import clsx from 'clsx';
import { useStyles } from './styles';
import { useSideBar } from '../../../hooks/useSideBar/useSideBar';
import { useSCs } from '../../../hooks/useSCs/useSCs';
import { Routes } from '../../../routes/constants';
import { setGlobalLoader } from '../../../store/reducers/adminPanel/actions';
import { RootState } from '../../../store/rootReducer';

export const AdminPanel = () => {
  const [navBarHeight, setNavBarHeight] = useState<number>(0);
  const { globalLoader } = useSelector((state: RootState) => state.adminPanel);

  const { selectedSC } = useSCs();
  const { isOpened, onOpen, onClose } = useSideBar();
  const dispatch = useDispatch();
  const navBarRef = useRef<HTMLDivElement>(null);
  const { classes } = useStyles();

  useEffect(() => {
    function updateHeight() {
      setNavBarHeight(navBarRef.current?.clientHeight || 0);
    }
    window.addEventListener('resize', updateHeight);
    return () => {
      window.removeEventListener('resize', updateHeight);
    };
  });

  const onSuccess = () => {
    dispatch(setGlobalLoader(false));
  };

  useEffect(() => {
    dispatch(setGlobalLoader(true));

    dispatch(getCurrentUser());
    dispatch(loadDealershipProfile(onSuccess));
    dispatch(loadAllSCs());
  }, [dispatch]);

  useEffect(() => {
    if (selectedSC) {
      dispatch(loadPodsShort(selectedSC.id));
    } else {
      dispatch(getPodsShort([]));
    }
  }, [dispatch, selectedSC]);

  if (globalLoader) {
    return <></>;
  }

  return (
    <div className={classes.root}>
      <SideBar isOpened={isOpened} onClose={onClose} />
      <NavBar ref={navBarRef} sideBarOpened={isOpened} onOpen={onOpen} />
      <div className={clsx(classes.main, { [classes.mainOpened]: isOpened })}>
        <Toolbar id="backToTopAnchor" style={{ height: navBarHeight || undefined }} />
        <Switch>
          <PrivateRoute path={Routes.Admin.Base} component={AdminRoutes} />
          <Redirect to={Routes.Admin.Appointments} />
        </Switch>
      </div>
    </div>
  );
};
