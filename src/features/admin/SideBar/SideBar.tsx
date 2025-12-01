import React, { useEffect, useMemo, useState } from 'react';
import { Button, Drawer, IconButton, List, useMediaQuery, useTheme } from '@mui/material';
import defaultLogo from '../../../assets/img/logoSidebar.svg';
import { LinkTypeWithSub, Roles } from '../../../types/types';
import { matchPath, useHistory, useLocation } from 'react-router-dom';
import { ArrowForwardIos, Close } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/rootReducer';
import { Loading } from '../../../components/wrappers/Loading/Loading';
import Link from './Link/Link';
import { reportingAllowedRoles } from '../../../pages/admin/Reporting/constants';
import { useStyles } from './styles';
import { MainLinksWithSub, SULinks } from './constants';
import { BookingModal } from './BookingModal/BookingModal';
import { useModal } from '../../../hooks/useModal/useModal';
import { useSCs } from '../../../hooks/useSCs/useSCs';
import { useCurrentUser } from '../../../hooks/useCurrentUser/useCurrentUser';
import { Routes } from '../../../routes/constants';
import { TRole } from '../../../store/reducers/users/types';

type TProps = {
  isOpened: boolean;
  onClose: () => void;
};

export const SideBar: React.FC<React.PropsWithChildren<React.PropsWithChildren<TProps>>> = ({
  isOpened,
  onClose,
}) => {
  const { sidebarColorHex, customLogoPath } = useSelector(
    (state: RootState) => state.dealershipGroups
  );
  const currentUser = useCurrentUser();

  const { classes } = useStyles({
    isInDealership: !currentUser?.isSuperUser,
    sidebarColor: sidebarColorHex,
  });
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('xl'));
  const isXS = useMediaQuery(theme.breakpoints.down('sm'));
  const { onClose: onModalClose, isOpen, onOpen } = useModal();

  const { loading } = useSelector((state: RootState) => state.users);
  const { pathname } = useLocation();
  const { selectedSC } = useSCs();
  const history = useHistory();
  const [logoAspect, setLogoAspect] = useState<number | null>(null);

  const links: LinkTypeWithSub[] = useMemo(() => {
    if (matchPath(pathname, Routes.Admin.Base) && currentUser?.isSuperUser) {
      return SULinks;
    }
    return MainLinksWithSub;
  }, [currentUser, pathname]);

  const baseRoles: TRole[] = [
    Roles.EvenFlowAdmin,
    Roles.EvenFlowAccountManager,
    Roles.EvenFlowSupport,
    Roles.EvenFlowAIAgent,
    Roles.DealerOwner,
    Roles.ServiceDirector,
    Roles.ServiceManager,
    Roles.BDCManager,
  ];
  const restrictedSchedulerRoles: TRole[] = [Roles.EvenFlowAIAgent, Roles.Technician, Roles.Vendor];

  const isOpenSchedulerLinkVisible =
    selectedSC && currentUser?.role && !restrictedSchedulerRoles.includes(currentUser?.role);

  useEffect(() => {
    if (
      (!window.origin.includes('apps.evenflow.ai') ||
        (currentUser && reportingAllowedRoles.includes(currentUser?.role))) &&
      !MainLinksWithSub.find(el => el.to === Routes.Admin.Reporting)
    ) {
      MainLinksWithSub.push({
        to: Routes.Admin.Reporting,
        name: 'Reporting',
        roles: baseRoles,
        subLinks: [
          {
            to: Routes.Reporting.ShopLoading,
            name: 'Shop Loading',
            exact: true,
            sub: true,
            roles: baseRoles,
          },
          {
            to: Routes.Reporting.AppointmentAssignments,
            name: 'Appointment Assignments',
            exact: true,
            sub: true,
            roles: baseRoles,
          },
          {
            to: Routes.Reporting.BDCReports,
            name: 'BDC Reports',
            exact: true,
            sub: true,
            roles: baseRoles,
          },
          {
            to: Routes.Reporting.ValetAppointments,
            name: 'Valet Appointments',
            exact: true,
            sub: true,
            roles: baseRoles,
          },
          {
            to: Routes.Reporting.OutboundOpportunities,
            name: 'Outbound Opportunities',
            exact: true,
            sub: true,
            roles: baseRoles,
          },
          {
            to: Routes.Reporting.CustomerBehavior,
            name: 'Customer Behavior',
            exact: true,
            sub: true,
            roles: baseRoles,
          },
          {
            to: Routes.Reporting.RepairOrderPerformance,
            name: 'Repair Order Performance',
            exact: true,
            sub: true,
            roles: baseRoles,
          },
        ],
      });
    }
  }, [MainLinksWithSub, window, currentUser]);

  const handleLogoClick = () => {
    history.push(Routes.Admin.Appointments);
  };

  const closeSidebar = () => {
    if (isXS) {
      onClose();
    }
  };

  const logoSrc = useMemo(() => {
    return currentUser?.isSuperUser ? defaultLogo : customLogoPath || defaultLogo;
  }, [currentUser, customLogoPath]);

  // Measure logo aspect ratio to adapt sidebar and logo sizing
  useEffect(() => {
    if (!logoSrc) return;
    const img = new Image();
    img.onload = () => {
      if (img.naturalWidth && img.naturalHeight) {
        setLogoAspect(img.naturalWidth / img.naturalHeight);
      }
    };
    img.src = logoSrc;
  }, [logoSrc]);

  const getResponsiveSidebarWidth = (aspect: number | null) => {
    if (!aspect) return undefined;
    if (aspect >= 3) return '18.75%';
    if (aspect >= 2) return '16%';
    return undefined; // fall back to theme sideBarWidth
  };

  const computedSidebarWidth = getResponsiveSidebarWidth(logoAspect);

  const getLogoStyle = (aspect: number | null) => {
    if (!aspect) return {};
    if (aspect >= 3) return { maxWidth: '90%', maxHeight: 100 };
    if (aspect >= 2) return { maxWidth: '85%', maxHeight: 80 };
    if (aspect >= 1) return { maxWidth: '80%', maxHeight: 70 };
    return { maxWidth: '75%', maxHeight: 90 };
  };
  const logoStyle = getLogoStyle(logoAspect);

  return (
    <Drawer
      className={classes.drawer}
      classes={{ paper: classes.drawerPaper }}
      variant={!isTablet ? 'permanent' : 'persistent'}
      open={isOpened}
      anchor="left"
      PaperProps={computedSidebarWidth ? { style: { width: computedSidebarWidth } } : undefined}
    >
      <div>
        {isTablet ? (
          <IconButton className={classes.closeButton} onClick={onClose} size="large">
            <Close style={{ color: '#fff' }} />
          </IconButton>
        ) : null}
        <img
          onClick={handleLogoClick}
          className={classes.logo}
          style={logoStyle}
          src={logoSrc}
          alt="EvenFlow AI"
        />
        <List disablePadding>
          {loading ? (
            <Loading />
          ) : (
            links.map(link => <Link link={link} closeSidebar={closeSidebar} key={link.name} />)
          )}
        </List>
      </div>
      {isOpenSchedulerLinkVisible ? (
        <Button endIcon={<ArrowForwardIos />} className={classes.link} onClick={onOpen}>
          Open Scheduler
        </Button>
      ) : null}
      <BookingModal open={isOpen} onClose={onModalClose} />
    </Drawer>
  );
};
