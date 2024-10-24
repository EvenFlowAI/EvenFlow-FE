import React from 'react';
import {BaseModal, DialogTitle} from "../../../../../../components/modals/BaseModal/BaseModal";
import {DialogProps} from "../../../../../../components/modals/BaseModal/types";
import {useTranslation} from "react-i18next";
import {LoadingButton} from "../../../../../../components/buttons/LoadingButton/LoadingButton";
import {BfButtonsWrapper} from "../../../../../../components/styled/BfButtonsWrapper";
import {useMediaQuery, useTheme} from "@mui/material";

type TConfirmProps = DialogProps & {
    onSave: () => void;
}

const ConfirmChangeOption: React.FC<React.PropsWithChildren<React.PropsWithChildren<TConfirmProps>>> = (props) => {
    const {t} = useTranslation();
    const theme = useTheme()
    const isSm = useMediaQuery(theme.breakpoints.down("sm"))
    return (
        <BaseModal
            width={400}
            open={props.open}
            onClose={props.onClose}
        >
            <DialogTitle onClose={props.onClose}>
                {t("Do you want to change the selected Package Option?")}
            </DialogTitle>
            <BfButtonsWrapper>
                    <LoadingButton
                        loading={false}
                        onClick={props.onClose}
                        style={isSm ? {marginBottom: 0} : {}}
                        variant="outlined"
                        color="primary">
                        {t("No")}
                    </LoadingButton>
                    <LoadingButton
                        loading={false}
                        onClick={props.onSave}
                        style={isSm ? {order: -1, marginBottom: 12} : {}}
                        color="primary"
                        variant="contained">
                        {t("Yes")}
                    </LoadingButton>
            </BfButtonsWrapper>
        </BaseModal>
    );
};

export default ConfirmChangeOption;