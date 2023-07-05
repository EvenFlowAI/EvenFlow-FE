import React from 'react';
import {useDialogStyles} from "../DetailedFees/DetailedFees";
import {BaseModal, DialogContent, DialogTitle} from "../BaseModal";
import {DialogProps} from "../types";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import {makeStyles} from "@material-ui/core/styles";
import {
    setCurrentFrameScreen,
} from "../../../store/reducers/appointmentFrameReducer/actions";
import {Button, styled} from "@material-ui/core";

type TExistingCustomerErrorProps = DialogProps & {
    onNext: () => void;
}

const useStyles = makeStyles((theme) => ({
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
        marginBottom: 30,
        [theme.breakpoints.down('sm')]: {
            padding: '0 20px'
        }
    }
}))

export const ButtonsRow = styled('div')(({theme}) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "22px",
    marginTop: 20,
    "& button": {
        minWidth: 144
    },
    [theme.breakpoints.down('sm')]: {
        flexDirection: "column",
        width: "100%",
        gap: "12px",
        "& button": {
            width: "100%"
        }
    }
}));

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
