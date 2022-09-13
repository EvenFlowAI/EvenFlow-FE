import React from 'react';
import {BaseModal, DialogTitle, DialogActions} from "../BaseModal";
import {LoadingButton} from "../../UI/Button";
import {DialogProps} from "../types";
import {useTranslation} from "react-i18next";

type TConfirmProps = DialogProps & {
    onSave: () => void;
}

const ConfirmChangeOption: React.FC<TConfirmProps> = (props) => {
    const {t} = useTranslation();
    return (
        <BaseModal
            width={400}
            open={props.open}
            onClose={props.onClose}
        >
            <DialogTitle onClose={props.onClose}>
                {t("Do you want to change the selected Package Option?")}
            </DialogTitle>
            <DialogActions>
                    <LoadingButton
                        loading={false}
                        onClick={props.onClose}
                        variant="outlined"
                        color="primary">
                        {t("No")}
                    </LoadingButton>
                    <LoadingButton
                        loading={false}
                        onClick={props.onSave}
                        color="primary"
                        variant="contained">
                        {t("Yes")}
                    </LoadingButton>
            </DialogActions>
        </BaseModal>
    );
};

export default ConfirmChangeOption;