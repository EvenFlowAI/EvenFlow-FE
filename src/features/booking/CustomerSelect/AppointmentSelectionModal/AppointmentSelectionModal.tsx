import React from 'react';
import { DialogProps } from '../../../../components/modals/BaseModal/types';
import { BaseModal, DialogContent, DialogTitle } from '../../../../components/modals/BaseModal/BaseModal';
import { LoadingButton } from '../../../../components/buttons/LoadingButton/LoadingButton';
import { useStyles } from './styles';
import { useDialogStyles } from '../../../../hooks/styling/useDialogStyles';
import { formatFullDate, formatTime } from './helper';
import { AppointmentSummaryI } from '../../utils/types';
import { useTranslation } from 'react-i18next';

const AppointmentSelectionModal: React.FC<
  React.PropsWithChildren<
    React.PropsWithChildren<DialogProps & { appointments: AppointmentSummaryI[], handleCancelAppointment: (appointmentHashKey: string) => void }>
  >
> = ({ open, onClose, appointments, handleCancelAppointment }) => {
  const { classes } = useStyles();
  const { classes: dialogClasses } = useDialogStyles();
  const { t } = useTranslation();

  const handleCancel = () => {
    onClose()
  }

  return (
    <BaseModal
      width={800}
      open={open}
      style={{ paddingBottom: 20 }}
      onClose={onClose}
      classes={{ root: dialogClasses.root, paper: dialogClasses.dialogPaper }}
    >
      <DialogTitle onClose={onClose}>{t('Which appointment do you wish to cancel?')}</DialogTitle>

        <DialogContent>
          <div className={classes.wrapper}>
            {appointments.map((appointment) => (
              <button type='button' onClick={() => handleCancelAppointment(appointment.appointmentHashKey)} className={classes.wrapperItem} key={appointment.appointmentHashKey}>
                <span>{formatFullDate(appointment.plannedDate)}</span>
                <span>{formatTime(appointment.plannedDate)}</span>
              </button>
            ))}
          </div>
        </DialogContent>
      <div className={classes.footer}>
        <LoadingButton onClick={handleCancel}>
          Cancel
        </LoadingButton>
      </div>
    </BaseModal>
  )
};

export default AppointmentSelectionModal;
