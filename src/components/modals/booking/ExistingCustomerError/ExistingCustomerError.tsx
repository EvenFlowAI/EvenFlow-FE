import React from 'react';
import {useDialogStyles} from "../../../../hooks/styling/useDialogStyles";
import {BaseModal, DialogContent, DialogTitle} from "../../BaseModal/BaseModal";
import {DialogProps} from "../../BaseModal/types";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import {setCurrentFrameScreen,} from "../../../../store/reducers/appointmentFrameReducer/actions";
import {Button} from "@material-ui/core";
import {ButtonsRow, useStyles} from "./styles";

type TExistingCustomerErrorProps = DialogProps & {
    onNext: () => void;
}

const ExistingCustomerError: React.FC<TExistingCustomerErrorProps> = ({open, onClose, onNext}) => {
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const dialogClasses = useDialogStyles();
    const classes = useStyles();

    const onNew = () => {
        dispatch(setCurrentFrameScreen("serviceNeeds"));
        onClose()
        onNext();
    }

    return (
        <BaseModal open={open} fullWidth  style={{paddingBottom: 20}} onClose={onClose} classes={{root: dialogClasses.root, paper: dialogClasses.dialogPaper}} width={700}>
            <DialogTitle onClose={onClose}/>
            <DialogContent>
                <div className={classes.info}>
                    {t("We are sorry but we can not find any vehicle associated with that email/phone number.")}
                    <span className={classes.question}>
                        {t("Would you like to try a different number or email?")}
                    </span>
                </div>
            </DialogContent>
            <div className={classes.actionsWrapper}>
                <ButtonsRow>
                    <Button
                        onClick={onClose}
                        color={'primary'}
                        variant='outlined'
                        style={{backgroundColor: '#F7F8FB'}}>
                        {t("Try another number")}
                    </Button>
                    <Button
                        onClick={onNew}
                        color={'primary'}
                        variant='contained'>
                        {t("Continue as a new customer")}
                    </Button>
                </ButtonsRow>
            </div>
        </BaseModal>
    );
};

export default ExistingCustomerError;
