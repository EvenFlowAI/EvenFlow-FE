import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {useTranslation} from "react-i18next";
import {DialogProps} from "../types";
import {BaseModal, DialogTitle} from "../BaseModal";
import {LoadingButton} from "../../UI/Button";
import {TCallback} from "../../../types/types";

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
    textButton: {
        color: "#142EA1",
        marginBottom: 12
    }
})

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