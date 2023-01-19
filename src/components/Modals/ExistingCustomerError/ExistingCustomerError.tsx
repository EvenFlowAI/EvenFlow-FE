import React from 'react';
import {useDialogStyles} from "../DetailedFees/DetailedFees";
import {BaseModal, DialogContent, DialogTitle} from "../BaseModal";
import {DialogProps} from "../types";
import {useTranslation} from "react-i18next";
import {Actions} from "../../AppointmentFlow/AppointmentFrame/Actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {EServiceType} from "../../../store/reducers/appointmentFrameReducer/types";
import {makeStyles} from "@material-ui/core/styles";
import {
    setCurrentFrameScreen,
    setServiceType,
} from "../../../store/reducers/appointmentFrameReducer/actions";

type TExistingCustomerErrorProps = DialogProps & {
    onNext: () => void;
}

const useStyles = makeStyles(() => ({
    info: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: "center",
        textAlign: "center",
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    question: {
        marginTop: 20,
        textAlign: "center",
    },
    actionsWrapper: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 30
    }
}))

const ExistingCustomerError: React.FC<TExistingCustomerErrorProps> = ({open, onClose, onNext}) => {
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const dialogClasses = useDialogStyles();
    const classes = useStyles();

    const onNew = () => {
        dispatch(setServiceType(EServiceType.VisitCenter));
        dispatch(setCurrentFrameScreen("serviceNeeds"));
        onClose()
        onNext();
    }

    return (
        <BaseModal open={open} fullWidth  style={{paddingBottom: 20}} onClose={onClose} classes={{root: dialogClasses.root, paper: dialogClasses.dialogPaper}} width={700}>
            <DialogTitle onClose={onClose}/>
            <DialogContent>
                <div className={classes.info}>
                    {t("We are sorry but we can not find any vehicle associated with that phone number.")}
                    <span className={classes.question}>
                        {t("Would you like to try a different number?")}
                    </span>
                </div>
            </DialogContent>
            <div className={classes.actionsWrapper}>
                <Actions
                    onBack={onClose}
                    onNext={onNew}
                    nextLabel={t("Continue as a new customer")}
                    prevLabel={t("Try another number")}
                />
            </div>
        </BaseModal>
    );
};

export default ExistingCustomerError;
