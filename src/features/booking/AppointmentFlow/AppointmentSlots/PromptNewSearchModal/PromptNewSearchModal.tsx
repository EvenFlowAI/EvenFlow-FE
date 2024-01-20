import React from 'react';
import {BaseModal, DialogActions, DialogTitle} from "../../../../../components/modals/BaseModal/BaseModal";
import {DialogProps} from "../../../../../components/modals/BaseModal/types";
import {useTranslation} from "react-i18next";
import {LoadingButton} from "../../../../../components/buttons/LoadingButton/LoadingButton";

type TPromptNewSearchRangeProps = DialogProps & {
    onSave: () => void
}

const PromptNewSearchModal: React.FC<React.PropsWithChildren<TPromptNewSearchRangeProps>> = (props) => {
    const {t} = useTranslation();
    return (
        <BaseModal
            width={400}
            open={props.open}
            onClose={props.onClose}
        >
            <DialogTitle onClose={props.onClose}>
                {t("To see more options")}
            </DialogTitle>
            <DialogActions>
                <LoadingButton
                    loading={false}
                    onClick={props.onSave}
                    variant="outlined"
                    color="primary">
                    {t("Yes")}
                </LoadingButton>
                <LoadingButton
                    loading={false}
                    onClick={props.onClose}
                    color="primary"
                    variant="contained">
                    {t("No")}
                </LoadingButton>
            </DialogActions>
        </BaseModal>
    );
};

export default PromptNewSearchModal;