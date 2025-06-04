import React from 'react';
import { DialogProps } from '../../../../components/modals/BaseModal/types';
import {
  BaseModal,
  DialogContent,
  DialogTitle,
} from '../../../../components/modals/BaseModal/BaseModal';
import { LoadingButton } from '../../../../components/buttons/LoadingButton/LoadingButton';
import { useStyles } from './styles';
import { useDialogStyles } from '../../../../hooks/styling/useDialogStyles';
import { formatFullDate, formatTime } from './helper';
import { AppointmentSummaryI } from '../../utils/types';
import { useTranslation } from 'react-i18next';
import { ReactComponent as Union } from '../../../../assets/img/Union.svg';
import { ICustomerWithPhones } from '../../../../store/reducers/enhancedCustomerSearch/types';
import { BfButtonsWrapper } from '../../../../components/styled/BfButtonsWrapper';

const AppointmentSelectionModal: React.FC<
  React.PropsWithChildren<
    React.PropsWithChildren<
      DialogProps & {
        appointments: AppointmentSummaryI[];
        handleCancelAppointment: (appointmentHashKey: string) => void;
        handleUpdateAppointment?: (item: ICustomerWithPhones) => void;
        isEditAppointment?: boolean;
        isEditAndCancelAppointment?: boolean;
        selectedAppointmentForCancelOrEdit?: ICustomerWithPhones | null;
      }
    >
  >
> = ({
  open,
  onClose,
  appointments,
  handleCancelAppointment,
  handleUpdateAppointment,
  isEditAppointment,
  isEditAndCancelAppointment,
  selectedAppointmentForCancelOrEdit,
}) => {
  const { classes } = useStyles();
  const { classes: dialogClasses } = useDialogStyles();
  const { t } = useTranslation();

  const handleCancel = () => {
    onClose();
  };

  const handleClick = (appointmentHashKey: string) => {
    if (isEditAppointment) {
      if (selectedAppointmentForCancelOrEdit && handleUpdateAppointment) {
        handleUpdateAppointment({
          ...selectedAppointmentForCancelOrEdit,
          appointmentHashKey: appointmentHashKey,
        });
      }
    } else {
      handleCancelAppointment(appointmentHashKey);
    }
  };

  return (
    <BaseModal
      width={700}
      open={open}
      style={{ paddingBottom: 20 }}
      onClose={onClose}
      classes={{ root: dialogClasses.root, paper: dialogClasses.dialogPaperWhite }}
    >
      <DialogTitle onClose={onClose}>
        {isEditAppointment ? (
          <p className={classes.title}>{t('Which appointment do you wish to manage?')}</p>
        ) : isEditAndCancelAppointment ? (
          <p className={classes.title}>{t('Which appointment do you wish to change or cancel')}</p>
        ) : (
          <p className={classes.title}>{t('Which appointment do you wish to cancel?')}</p>
        )}
      </DialogTitle>

      <DialogContent>
        <div className={classes.wrapper}>
          {appointments.map(appointment => (
            <button
              type="button"
              onClick={() => handleClick(appointment.appointmentHashKey)}
              className={classes.wrapperItem}
              key={appointment.appointmentHashKey}
            >
              <p className={classes.iconWrapper}>
                <Union />
              </p>
              <div className={classes.dateAndTimeWrapper}>
                <span>{formatFullDate(appointment.plannedDate)}</span>
                <span>{formatTime(appointment.plannedDate).toLowerCase()}</span>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
      <div>
        <BfButtonsWrapper style={{ padding: '10px 14px 25px' }}>
          <LoadingButton onClick={handleCancel} color="primary" variant="outlined">
            Close
          </LoadingButton>
        </BfButtonsWrapper>
      </div>
    </BaseModal>
  );
};

export default AppointmentSelectionModal;
