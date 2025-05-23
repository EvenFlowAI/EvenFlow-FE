import React, { useEffect, useState } from 'react';
import { DialogProps } from '../../../../components/modals/BaseModal/types';
import { BaseModal, DialogContent, DialogTitle } from '../../../../components/modals/BaseModal/BaseModal';
import { Loading } from '../../../../components/wrappers/Loading/Loading';
import { NoData } from '../../../../components/wrappers/NoData/NoData';
import { LoadingButton } from '../../../../components/buttons/LoadingButton/LoadingButton';
import { useStyles } from './styles';
import { useDialogStyles } from '../../../../hooks/styling/useDialogStyles';

const AppointmentSelectionModal: React.FC<
  React.PropsWithChildren<
    React.PropsWithChildren<DialogProps & { appointments: {
        appointmentHashKey: string,
        plannedDate: string
      }[] }>
  >
> = ({ open, onClose, appointments }) => {
  const { classes } = useStyles();
  const { classes: dialogClasses } = useDialogStyles();
  const [loading, setLoading] = useState<boolean>(false);

  const handleCancel = () => {
    onClose()
  }

  useEffect(() => {
    if (open && appointments) {
      console.log('first useEffect', appointments);
    }
  }, [open]);

  return (
    <BaseModal
      width={800}
      open={open}
      style={{ paddingBottom: 20 }}
      onClose={onClose}
      classes={{ root: dialogClasses.root, paper: dialogClasses.dialogPaper }}
    >
      <DialogTitle onClose={onClose} />
      {loading ? (
        <Loading />
      ) : appointments ? (
        <DialogContent>
          <div>TEST</div>
        </DialogContent>
      ) : (
        <NoData />
      )}
      <div className={classes.actionsWrapper}>
        <LoadingButton onClick={handleCancel} loading={loading}>
          Cancel
        </LoadingButton>
      </div>
    </BaseModal>
  )
};

export default AppointmentSelectionModal;
