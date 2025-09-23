import React, { useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import { ArrowDropDown } from '@mui/icons-material';
import { IServiceCenter } from '../../../../store/reducers/serviceCenters/types';
import { TRole } from '../../../../store/reducers/users/types';
import { useHistory } from 'react-router-dom';
import { useStyles } from './styles';
import { useSCs } from '../../../../hooks/useSCs/useSCs';
import { useCurrentUser } from '../../../../hooks/useCurrentUser/useCurrentUser';
import {Roles} from "../../../../types/types";

const restrictedRoles: TRole[] = [
    Roles.ServiceManager,
    Roles.Advisor,
    Roles.Technician,
    Roles.Staff,
    Roles.Vendor,
    Roles.AIBookingAgent
];

export const ServiceCenterSelector = () => {
  const { selectSC, selectedSC, scList } = useSCs();
  const currentUser = useCurrentUser();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null | undefined>(null);
  const handleMenuOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleChooseServiceCenter = (sc: IServiceCenter) => () => {
    handleMenuClose();
    selectSC(sc);
    if (history.location.pathname.includes('reporting')) {
      setTimeout(() => window.location.reload(), 500);
    }
  };

  const { classes } = useStyles();
  if (!scList || !scList.length) return null;
  if (!currentUser || currentUser.isSuperUser) return null;
  if (restrictedRoles.includes(currentUser.role)) return null;

  return (
    <div>
      <Button className={classes.root} onClick={handleMenuOpen} endIcon={<ArrowDropDown />}>
        {selectedSC?.name}
      </Button>
      <Menu anchorEl={anchorEl} onClose={handleMenuClose} open={Boolean(anchorEl)}>
        {scList.map(sc => {
          return (
            <MenuItem key={sc.id} onClick={handleChooseServiceCenter(sc)}>
              {sc.name}
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
};
