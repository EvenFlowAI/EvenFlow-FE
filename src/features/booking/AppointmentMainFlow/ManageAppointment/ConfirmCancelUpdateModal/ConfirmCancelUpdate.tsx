import React from 'react';
import {useTranslation} from "react-i18next";
import {DialogProps} from "../../../../../components/BaseModal/types";
import {BaseModal, DialogTitle} from "../../../../../components/BaseModal/BaseModal";
import {TCallback} from "../../../../../types/types";
import {useStyles} from "./styles";
import {LoadingButton} from "../../../../../components/LoadingButton/LoadingButton";

type TConfirmCancelUpdateProps = DialogProps &  {
    onCancelChanges: TCallback;
}

const ConfirmCancelUpdate = (props: TConfirmCancelUpdateProps) => {
    const classes = useStyles();
    const {t} = useTranslation();

    const onCancelChanges = () => {
       props.onCancelChanges()
       props.onClose();
    }

    return (
        <BaseModal
            width={600}
            open={props.open}
            onClose={props.onClose}
        >
            <DialogTitle onClose={props.onClose}>
                {t("Are you sure you want to undo your appointment changes?")}
            </DialogTitle>
            <div className={classes.wrapper}>
                <LoadingButton
                    fullWidth
                    loading={false}
                    onClick={onCancelChanges}
                    color="primary"
                    variant="contained">
                    {t("Yes, I’m good with the existing appointment")}
                </LoadingButton>
                <LoadingButton
                    loading={false}
                    fullWidth
                    onClick={props.onClose}
                    variant="outlined"
                    color="primary">
                    {t("No, i still want to make changes")}
                </LoadingButton>
            </div>
        </BaseModal>
    );
};

export default ConfirmCancelUpdate;