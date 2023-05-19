import React, {useCallback, useState} from 'react';
import {BaseModal, DialogContent, DialogTitle} from "../BaseModal";
import {DialogProps} from "../types";
import {TextField} from "../../UI/TextField";
import {makeStyles} from "@material-ui/core/styles";
import {useDispatch, useSelector} from "react-redux";
import {useException, useModal} from "../../../utils/hooks";
import {useTranslation} from "react-i18next";
import {LoadingButton} from "../../UI/Button";
import {TCallback} from "../../../types/types";
import CustomerSearchResults from "./CustomerSearchResults";
import {loadCustomersByName} from "../../../store/reducers/enhancedCustomerSearch/actions";
import {RootState} from "../../../store/rootReducer";

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

type TEnhancedCustomerSearchProps = DialogProps & {onOpenNotFound: TCallback, handleNew: TCallback};

const EnhancedCustomerSearch: React.FC<TEnhancedCustomerSearchProps> = ({ open, onClose, onOpenNotFound, handleNew}) => {
    const {scProfile} = useSelector((state: RootState) => state.appointment);
    const {isLoading} = useSelector((state: RootState) => state.customers);
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [formIsChecked, setFormIsChecked] = useState<boolean>(false);
    const {onOpen: onOpenSearchResults, onClose: onCloseSearchResults, isOpen: isOpenSearchResults} = useModal();
    const dispatch = useDispatch();
    const showError = useException();
    const classes = useStyles();
    const {t} = useTranslation();

    const onFirstNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFormIsChecked(false);
        setFirstName(e.target.value);
    }, [])

    const onLastNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFormIsChecked(false);
        setLastName(e.target.value);
    }, [])

    const clearForm = () => {
        setFormIsChecked(false);
        setFirstName('');
        setLastName('');
    }

    const onCancel = useCallback((): void => {
        clearForm()
        onClose();
    }, [clearForm])

    const onSuccess = (count: number) => {
        count > 0 ? onOpenSearchResults() : onOpenNotFound()
    }

    const loadData = () => {
        scProfile && dispatch(loadCustomersByName(scProfile.id, firstName, lastName, onSuccess, showError))
    }

    const checkIsValid = () => {
        const searchString = firstName.length > 1  ? firstName : lastName;
        return searchString.length > 1;
    }

    const onSave = (): void => {
        setFormIsChecked(true);
        if (checkIsValid()) {
            loadData()
        } else {
            showError('First Name or Last Name must consist from 2 or more characters')
        }
    };

    return (
        <BaseModal open={open} width={700} onClose={onCancel}>
            <div className={classes.modalWrapper}>
            <DialogTitle onClose={onCancel}>{t("Search Customer by Name")}</DialogTitle>
            <DialogContent>
                <TextField
                    label={t("Customer First Name")}
                    placeholder={t("Enter First Name")}
                    error={formIsChecked && (firstName.length < 2 && lastName.length < 2)}
                    onChange={onFirstNameChange}
                    fullWidth
                    style={{ marginBottom: 10 }}
                    value={firstName}/>
                <TextField
                    label={t("Customer Last Name")}
                    placeholder={t("Enter Last Name")}
                    error={formIsChecked && (lastName.length < 2 && firstName.length < 2)}
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
                        loading={isLoading}
                        variant="contained"
                        color="primary">
                        {t("Search")}
                    </LoadingButton>
                </div>
            </div>
            </div>
            <CustomerSearchResults
                handleNew={handleNew}
                loadData={loadData}
                onClose={onCloseSearchResults}
                open={isOpenSearchResults}
                onClearSearchForm={clearForm}
            />
        </BaseModal>
    );
};

export default EnhancedCustomerSearch;