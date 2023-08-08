import React from 'react';
import {BaseModal, DialogTitle} from "../BaseModal";
import {LoadingButton} from "../../UI/Button";
import {DialogProps} from "../types";
import {useTranslation} from "react-i18next";
import {makeStyles} from "@material-ui/core/styles";
import {Button} from "@material-ui/core";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";

type TAskChangesCompletedProps = DialogProps & {
    onSave: () => void;
    onCancel: () => void;
    onAdditionalChanges: () => void;
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
    textButton: {
        color: "#142EA1",
        marginBottom: 12
    }
})

const AskChangesCompleted = (props: TAskChangesCompletedProps) => {
    const {t} = useTranslation();
    const classes = useStyles();
    const {isAppointmentSaving} = useSelector((state: RootState) => state.appointmentFrame);

    return (
        <BaseModal
            width={600}
            open={props.open}
            onClose={props.onClose}
        >
            <DialogTitle onClose={props.onClose}>
                {t("Are you satisfied with the appointment changes?")}
            </DialogTitle>
                <div className={classes.wrapper}>
                    <Button variant="text" className={classes.textButton} onClick={props.onAdditionalChanges}>
                        {t("I’d like to make additional changes")}
                    </Button>
                    <LoadingButton
                        fullWidth
                        loading={isAppointmentSaving}
                        onClick={props.onSave}
                        color="primary"
                        variant="contained">
                        {t("Yes, no other changes needed")}
                    </LoadingButton>
                    <LoadingButton
                        loading={isAppointmentSaving}
                        fullWidth
                        onClick={props.onCancel}
                        variant="outlined"
                        color="primary">
                        {t("Cancel")}
                    </LoadingButton>
                </div>
        </BaseModal>
    );
};

export default AskChangesCompleted;