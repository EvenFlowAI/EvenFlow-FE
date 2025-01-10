import React from "react";
import {
  BaseModal,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "../../../components/modals/BaseModal/BaseModal";
import { DialogProps } from "../../../components/modals/BaseModal/types";
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useStyles } from "./styles";

const NoRecallsModal: React.FC<
  React.PropsWithChildren<
    React.PropsWithChildren<DialogProps & { handleNext: () => void }>
  >
> = ({ open, onClose, handleNext }) => {
  const { classes } = useStyles();
  const { t } = useTranslation();

  const onProceed = () => {
    handleNext();
    onClose();
  };
  return (
    <BaseModal open={open} onClose={onClose}>
      <DialogTitle onClose={onClose} style={{ justifyContent: "flex-start" }} />
      <DialogContent>
        <div className={classes.wrapper}>
          {t("There are no open recalls for your vehicle")}.
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onProceed} variant="contained" color="primary">
          Proceed
        </Button>
      </DialogActions>
    </BaseModal>
  );
};

export default NoRecallsModal;
