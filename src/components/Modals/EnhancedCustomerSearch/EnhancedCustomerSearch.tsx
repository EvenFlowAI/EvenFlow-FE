import React, {useCallback, useEffect, useState} from 'react';
import {BaseModal, DialogContent, DialogTitle} from "../BaseModal";
import {DialogProps} from "../types";
import {TextField} from "../../UI/TextField";
import {makeStyles} from "@material-ui/core/styles";
import {useDispatch} from "react-redux";
import {useException, useMessage, useSCs} from "../../../utils/hooks";
import {useTranslation} from "react-i18next";
import {LoadingButton} from "../../UI/Button";

const useStyles = makeStyles(() => ({
    buttonsWrapper: {
        display: 'flex',
        justifyContent: "space-between",
        alignItems: 'center',
        "& > div > button": {
          width: 144,
        },
        "& > div:first-child": {
            marginRight: 20,
        }
    },
    wrapper: {
        display: 'flex',
        justifyContent: 'center',
        paddingTop: 14,
    },
    modalWrapper: {
        padding: "20px 120px 36px 120px"
    }
}))

const EnhancedCustomerSearch: React.FC<DialogProps> = ({ open, onClose}) => {
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [formIsChecked, setFormIsChecked] = useState<boolean>(false);
    const dispatch = useDispatch();
    const showError = useException();
    const showMessage = useMessage();
    const {selectedSC} = useSCs();
    const classes = useStyles();
    const {t} = useTranslation();

    useEffect(() => {

    }, [])

    const onFirstNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFormIsChecked(false);
        setFirstName(e.target.value);
    }, [])

    const onLastNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFormIsChecked(false);
        setLastName(e.target.value);
    }, [])

    const onCancel = useCallback((): void => {
        setFormIsChecked(false);
        setFirstName('');
        setLastName('');
        onClose();
    }, [])

    const onSuccess = () => {
        onCancel()
    }

    const onSave = useCallback((): void => {
        setFormIsChecked(true);
        // todo request
    }, [])

    return (
        <BaseModal open={open} width={700} onClose={onCancel}>
            <div className={classes.modalWrapper}>
            <DialogTitle onClose={onCancel}>{t("Search Customer by Name")}</DialogTitle>
            <DialogContent>
                <TextField
                    label={t("Customer First Name")}
                    placeholder={t("Enter First Name")}
                    error={!firstName && formIsChecked}
                    onChange={onFirstNameChange}
                    fullWidth
                    style={{ marginBottom: 10 }}
                    value={firstName}/>
                <TextField
                    label={t("Customer Last Name")}
                    placeholder={t("Enter Last Name")}
                    error={!firstName && formIsChecked}
                    onChange={onLastNameChange}
                    fullWidth
                    style={{ marginBottom: 10 }}
                    value={lastName}/>
            </DialogContent>
            <div className={classes.wrapper}>
                <div className={classes.buttonsWrapper}>
                    <LoadingButton
                        color="primary"
                        variant="outlined"
                        onClick={onCancel}>
                        {t("Back")}
                    </LoadingButton>
                    <LoadingButton
                        onClick={onSave}
                        variant="contained"
                        color="primary">
                        {t("Search")}
                    </LoadingButton>
                </div>
            </div>
            </div>
        </BaseModal>
    );
};

export default EnhancedCustomerSearch;