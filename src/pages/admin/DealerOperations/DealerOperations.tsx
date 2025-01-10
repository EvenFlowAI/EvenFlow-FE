import React, { useMemo } from 'react';
import { Grid, Paper } from '@mui/material';
import { ReactComponent as RemindersIcon } from '../../../assets/img/Icon_36px_Appointment_reminders.svg';
import { ReactComponent as AdvisorIcon } from '../../../assets/img/advisor_assignment.svg';
import { ReactComponent as NotificationsIcon } from '../../../assets/img/notifications.svg';
import RemindersModal from '../../../features/admin/RemindersModal/RemindersModal';
import EmployeeAssignmentModal from '../../../features/admin/EmployeeAssignmentModal/EmployeeAssignmentModal';
import NotificationsModal from '../../../features/admin/NotificationsModal/NotificationsModal';
import { useModal } from '../../../hooks/useModal/useModal';
import { useCurrentUser } from '../../../hooks/useCurrentUser/useCurrentUser';
import { TitleContainer } from '../../../components/wrappers/TitleContainer/TitleContainer';
import { useDashboardStyles } from '../../../hooks/styling/useDashboardStyles';
import { TDashboardItem } from '../../../types/types';

export const DealerOperations: React.FC<React.PropsWithChildren<React.PropsWithChildren>> = () => {
  const currentUser = useCurrentUser();
  const { classes } = useDashboardStyles();

  const isCCRView: boolean = useMemo(() => {
    return ['Call Center Rep', 'Advisor'].includes(currentUser?.role || '');
  }, [currentUser]);

  const isManager: boolean = useMemo(() => {
    return ['Manager'].includes(currentUser?.role || '');
  }, [currentUser]);

  const {
    onClose: onCloseReminders,
    onOpen: onOpenReminders,
    isOpen: isOpenReminders,
  } = useModal();
  const {
    onClose: onCloseAdvisorAssignment,
    onOpen: onOpenAdvisorAssignment,
    isOpen: isOpenAdvisorAssignment,
  } = useModal();
  const {
    onClose: onCloseManageNotifications,
    onOpen: onOpenManageNotifications,
    isOpen: isOpenManageNotifications,
  } = useModal();

  const items: TDashboardItem[] = [
    { label: 'Employee Assignment', icon: <AdvisorIcon />, action: onOpenAdvisorAssignment },
    {
      label: 'Service Center Notifications',
      icon: <NotificationsIcon />,
      action: onOpenManageNotifications,
    },
    { label: 'Appointment Reminders', icon: <RemindersIcon />, action: onOpenReminders },
  ];

  return (
    <div style={{ width: '100%' }}>
      <TitleContainer title="Dealer Operations" pad />
      <Grid container spacing={2}>
        {items.map(item => (
          <Grid item xs={12} sm={4} md={3} key={item.label}>
            <Paper variant="outlined" className={classes.paper}>
              <div className={classes.icon}>{item.icon}</div>
              <h4 className={classes.label}>{item.label}</h4>
              <span className={classes.edit} onClick={item.action}>
                {isCCRView || (isManager && item.label === 'Holidays') ? 'View' : 'Edit'}
              </span>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <RemindersModal open={isOpenReminders} onClose={onCloseReminders} />
      <EmployeeAssignmentModal open={isOpenAdvisorAssignment} onClose={onCloseAdvisorAssignment} />
      <NotificationsModal open={isOpenManageNotifications} onClose={onCloseManageNotifications} />
    </div>
  );
};
