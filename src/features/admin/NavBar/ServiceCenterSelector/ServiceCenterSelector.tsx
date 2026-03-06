import React, { useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import { ArrowDropDown } from '@mui/icons-material';
import { useHistory } from 'react-router-dom';
import { useStyles } from './styles';
import { useSCs } from '../../../../hooks/useSCs/useSCs';
import { useCurrentUser } from '../../../../hooks/useCurrentUser/useCurrentUser';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import { IServiceCenter } from '../../../../pages/admin/RoleManagement/types';

export const ServiceCenterSelector = () => {
  const { selectSC, selectedSC, scList } = useSCs();
  const currentUser = useCurrentUser();
  const history = useHistory();
  const { fullSCList } = useSelector((state: RootState) => state.serviceCenters);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null | undefined>(null);
  const { accessibleDealerships } = useSelector((state: RootState) => state.dealershipGroups);

  const handleMenuOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleChooseServiceCenter = (sc: IServiceCenter) => () => {
    handleMenuClose();
    const selectedSc = fullSCList.find(s => s.id === sc.id);
    if (selectedSc) selectSC(selectedSc);
    if (history.location.pathname.includes('reporting')) {
      setTimeout(() => window.location.reload(), 500);
    }
  };

  const { classes } = useStyles();
  if (!scList || !scList.length) return null;
  if (!currentUser || currentUser.isSuperUser) return null;

  return (
    <div>
      <Button className={classes.root} onClick={handleMenuOpen} endIcon={<ArrowDropDown />}>
        {selectedSC?.name}
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        {accessibleDealerships.map(dealership => (
          <React.Fragment key={dealership.id}>
            <MenuItem
              disabled
              sx={{
                opacity: '1 !important',
                fontWeight: 700,
                cursor: 'default',
                textTransform: 'uppercase',
                color: '#252733',
              }}
            >
              {dealership.name}
            </MenuItem>

            {dealership.serviceCenters.map(sc => (
              <MenuItem
                key={sc.id}
                onClick={handleChooseServiceCenter(sc)}
                sx={{
                  pl: 4,
                  backgroundColor: selectedSC?.id === sc.id ? '#DADADA' : 'white',
                  '&:hover': { backgroundColor: selectedSC?.id !== sc.id ? '#F0F0F0' : '#DADADA' },
                }}
              >
                {sc.name}
              </MenuItem>
            ))}
          </React.Fragment>
        ))}
      </Menu>
    </div>
  );
};
