import React, { useEffect, useState } from "react";
import { DialogProps } from "../../BaseModal/types";
import {
  BaseModal,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "../../BaseModal/BaseModal";
import { Button, Divider, Switch } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store/rootReducer";
import { updateAuth } from "../../../../store/reducers/serviceCenters/actions";
import { useStyles } from "./styles";

import { useMessage } from "../../../../hooks/useMessage/useMessage";
import { useException } from "../../../../hooks/useException/useException";
import { useSCs } from "../../../../hooks/useSCs/useSCs";

const CustomerVerification: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<DialogProps>>
> = (props) => {
  const [isVerificationOn, setVerificationOn] = useState<boolean>(false);
  const { remindersLoading } = useSelector(
    (state: RootState) => state.serviceCenters,
  );
  const { selectedSC } = useSCs();
  const showError = useException();
  const showMessage = useMessage();
  const dispatch = useDispatch();
  const { classes } = useStyles();

  useEffect(() => {
    selectedSC && setVerificationOn(selectedSC.isAuthRequired);
  }, [selectedSC]);

  const handleSwitch = (e: any, value: boolean) => {
    setVerificationOn(value);
  };

  const onCancel = () => {
    if (selectedSC) {
      setVerificationOn(selectedSC.isAuthRequired);
      props.onClose();
    }
  };

  const onSuccess = () => {
    showMessage("Customer Verification updated");
  };

  const onError = (err: string) => {
    showError(err);
  };

  const onSave = () => {
    if (selectedSC) {
      dispatch(updateAuth(selectedSC.id, isVerificationOn, onError, onSuccess));
      props.onClose();
    }
  };

  return (
    <BaseModal {...props} width={400} onClose={onCancel}>
      <DialogTitle onClose={onCancel}>Customer Verification</DialogTitle>
      <DialogContent>
        <div className={classes.switchWrapper}>
          <p className={classes.text}>Require customer verification</p>
          <Switch
            disabled={remindersLoading}
            onChange={handleSwitch}
            checked={isVerificationOn}
            color="primary"
          />
        </div>
      </DialogContent>
      <Divider style={{ margin: 0 }} />
      <DialogActions>
        <div className={classes.actionsWrapper}>
          <div className={classes.buttonsWrapper}>
            <Button
              disabled={remindersLoading}
              onClick={onCancel}
              className={classes.cancelButton}
            >
              Cancel
            </Button>
            <Button
              onClick={onSave}
              disabled={remindersLoading}
              className={classes.saveButton}
            >
              Save
            </Button>
          </div>
        </div>
      </DialogActions>
    </BaseModal>
  );
};

export default CustomerVerification;
