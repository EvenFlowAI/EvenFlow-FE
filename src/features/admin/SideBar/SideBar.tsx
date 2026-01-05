import React, { useMemo } from 'react';
import { Button, Drawer, IconButton, List, useMediaQuery, useTheme } from '@mui/material';
import defaultLogo from '../../../assets/img/logoSidebar.svg';
import { LinkTypeWithSub, Roles } from '../../../types/types';
import { matchPath, useHistory, useLocation } from 'react-router-dom';
import { ArrowForwardIos, Close } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/rootReducer';
import { Loading } from '../../../components/wrappers/Loading/Loading';
import Link from './Link/Link';
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
  const isInDealership = !currentUser?.isSuperUser;

  const { classes } = useStyles({
    sidebarColor: isInDealership ? sidebarColorHex : undefined,
  });
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('xl'));
  const isXS = useMediaQuery(theme.breakpoints.down('sm'));
  const { onClose: onModalClose, isOpen, onOpen } = useModal();

  const { loading } = useSelector((state: RootState) => state.users);
  const { pathname } = useLocation();
  const { selectedSC } = useSCs();
  const history = useHistory();

  const links: LinkTypeWithSub[] = useMemo(() => {
    if (matchPath(pathname, Routes.Admin.Base) && currentUser?.isSuperUser) {
      return SULinks;
    }

    const isDealerOwnerSuperAdmin =
      Boolean(currentUser?.adminDealership) && currentUser?.role === Roles.DealerOwner;

    // AI agents link visible only for dealer owner super admins
    return MainLinksWithSub.filter(link => {
      if (link.to === '/admin/ai-agents') {
        return isDealerOwnerSuperAdmin;
      }
      return true;
    });
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

  return (
    <Drawer
      className={classes.drawer}
      classes={{ paper: classes.drawerPaper }}
      variant={!isTablet ? 'permanent' : 'persistent'}
      open={isOpened}
      anchor="left"
    >
      <div>
        {isTablet ? (
          <IconButton className={classes.closeButton} onClick={onClose} size="large">
            <Close style={{ color: '#fff' }} />
          </IconButton>
        ) : null}
        {!loading && (
          <div className={classes.logoWrapper}>
            <img
              onClick={handleLogoClick}
              className={classes.logo}
              src={logoSrc}
              alt="EvenFlow AI"
            />
          </div>
        )}
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
