import React from 'react';
import {BaseModal, DialogActions, DialogTitle} from "../../../../../../components/modals/BaseModal/BaseModal";
import {DialogProps} from "../../../../../../components/modals/BaseModal/types";
import {useTranslation} from "react-i18next";
import {LoadingButton} from "../../../../../../components/buttons/LoadingButton/LoadingButton";

type TAskAddServiceProps = DialogProps & {
    onClose: () => void;
}

const AddCommentPrompt = (props: TAskAddServiceProps) => {
    const {t} = useTranslation();

    return (
        <BaseModal
            width={400}
            open={props.open}
            onClose={props.onClose}
        >
            <DialogTitle onClose={props.onClose}>
                {t("In order for us to be better prepared for your appointment, please leave a brief description of your concern.")}
            </DialogTitle>
            <DialogActions>
                <LoadingButton
                    loading={false}
                    onClick={props.onClose}
                    color="primary"
                    variant="outlined">
                    {t("Close")}
                </LoadingButton>
            </DialogActions>
        </BaseModal>
    );
};

export default AddCommentPrompt;