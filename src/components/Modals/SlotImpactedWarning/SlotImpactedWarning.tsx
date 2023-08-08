import React from 'react';
import {BaseModal, DialogTitle} from "../BaseModal";
import {LoadingButton} from "../../UI/Button";
import {DialogProps} from "../types";
import {useTranslation} from "react-i18next";
import {makeStyles} from "@material-ui/core/styles";

type TSlotImpactedWarning = DialogProps & {
    onClick: () => void;
}

const useStyles = makeStyles({
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: "center",
        padding: '16px 80px',
        gap: 12,
        "& > div:not(:last-child)": {
            marginBottom: 12
        }
    },
})

const SlotImpactedWarning = (props: TSlotImpactedWarning) => {
    const {t} = useTranslation();
    const classes = useStyles();
    return (
        <BaseModal
            width={450}
            open={props.open}
            onClose={props.onClose}
        >
            <DialogTitle onClose={props.onClose}>
                <div>{t("Date and time of available appointments depends on the service requested.")}</div>
                <div>{t("Please continue to see available dates and times for you requested change")}</div>
            </DialogTitle>
                <div className={classes.wrapper}>
                    <LoadingButton
                        loading={false}
                        fullWidth
                        onClick={props.onClick}
                        variant="outlined"
                        color="primary">
                        {t("Close")}
                    </LoadingButton>
                </div>
        </BaseModal>
    );
};

export default SlotImpactedWarning;