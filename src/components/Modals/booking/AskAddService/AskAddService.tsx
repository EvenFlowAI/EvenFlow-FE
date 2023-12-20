import React from 'react';
import {BaseModal, DialogActions, DialogTitle} from "../../../BaseModal/BaseModal";
import {DialogProps} from "../../../BaseModal/types";
import {useTranslation} from "react-i18next";
import {LoadingButton} from "../../../LoadingButton/LoadingButton";

type TAskAddServiceProps = DialogProps & {
    onSave: () => void;
}

const AskAddService = (props: TAskAddServiceProps) => {
    const {t} = useTranslation();

    return (
        <BaseModal
            width={400}
            open={props.open}
            onClose={props.onClose}
        >
            <DialogTitle onClose={props.onClose}>
                {t("Would you like to add another service?")}
            </DialogTitle>
            <DialogActions>
                <LoadingButton
                    loading={false}
                    onClick={props.onSave}
                    color="primary"
                    variant="outlined">
                    {t("Yes")}
                </LoadingButton>
                <LoadingButton
                    loading={false}
                    onClick={props.onClose}
                    variant="contained"
                    color="primary">
                    {t("No")}
                </LoadingButton>
            </DialogActions>
        </BaseModal>
    );
};

export default AskAddService;