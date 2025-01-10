import React, { useCallback } from "react";
import {
  BaseModal,
  DialogTitle,
} from "../../../../components/modals/BaseModal/BaseModal";
import { DialogProps } from "../../../../components/modals/BaseModal/types";
import { useTranslation } from "react-i18next";
import { useStyles } from "./styles";
import { LoadingButton } from "../../../../components/buttons/LoadingButton/LoadingButton";

type TCustomerNotFoundProps = DialogProps & {
  handleNew: () => void;
  onTryAnotherName: () => void;
};

const CustomerNotFoundModal: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TCustomerNotFoundProps>>
> = ({ open, onClose, onTryAnotherName, handleNew }) => {
  const { classes } = useStyles();
  const { t } = useTranslation();

  const onCancel = useCallback((): void => {
    onClose();
    onTryAnotherName();
  }, [onTryAnotherName]);

  const onSave = useCallback((): void => {
    onClose();
    handleNew();
  }, [handleNew]);

  return (
    <BaseModal open={open} width={700} onClose={onCancel}>
      <DialogTitle onClose={onCancel} style={{ padding: 8 }} />
      <div className={classes.modalWrapper}>
        <div className={classes.textWrapper}>
          {t(
            "We cannot find any existing customers that met the search criteria you entered.",
          )}
        </div>
        <div className={classes.textWrapper}>
          {t("Would you like to try different search criteria?")}
        </div>
        <div className={classes.wrapper}>
          <div className={classes.buttonsWrapper}>
            <LoadingButton
              color="primary"
              variant="outlined"
              onClick={onCancel}
            >
              {t("Try other search criteria")}
            </LoadingButton>
            <LoadingButton onClick={onSave} variant="contained" color="primary">
              {t("Continue as a new customer")}
            </LoadingButton>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default CustomerNotFoundModal;
