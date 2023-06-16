import React, {Dispatch, SetStateAction, useCallback} from 'react';
import {BaseModal, DialogContent, DialogTitle} from "../BaseModal";
import {DialogProps} from "../types";
import {TextField} from "../../UI/TextField";
import {makeStyles} from "@material-ui/core/styles";
import {useDispatch, useSelector} from "react-redux";
import {useException} from "../../../utils/hooks";
import {useTranslation} from "react-i18next";
import {LoadingButton} from "../../UI/Button";
import {TArgCallback} from "../../../types/types";
import { setPageData, setPaging} from "../../../store/reducers/enhancedCustomerSearch/actions";
import {RootState} from "../../../store/rootReducer";
import {defaultPageData} from "../../../store/reducers/defaultInitials";

const useStyles = makeStyles(theme => ({
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
        padding: "20px 120px 36px 120px",
        [theme.breakpoints.down("sm")]: {
            padding: 0,
            paddingBottom: 16,
        }
    }
}))

type TEnhancedCustomerSearchProps = DialogProps & {
    loadData: TArgCallback<boolean>,
    formIsChecked: boolean,
    setFormIsChecked: Dispatch<SetStateAction<boolean>>;
    firstName: string;
    lastName: string;
    setFirstName: Dispatch<SetStateAction<string>>;
    setLastName: Dispatch<SetStateAction<string>>;
};

const EnhancedCustomerSearch: React.FC<TEnhancedCustomerSearchProps> = ({
                                                                            open,
                                                                            onClose,
                                                                            loadData,
                                                                            formIsChecked,
                                                                            setFormIsChecked,
                                                                            firstName,
                                                                            lastName,
                                                                            setFirstName,
                                                                            setLastName,
                                                                        }) => {
    const {isLoading} = useSelector((state: RootState) => state.customers);
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

    const onCancel = useCallback(async () => {
        clearForm()
        await dispatch(setPaging({numberOfPages: 0, numberOfRecords: 0}));
        await dispatch(setPageData(defaultPageData))
        await onClose();
    }, [clearForm])

    const checkIsValid = () => {
        const searchString = firstName.length > 1  ? firstName : lastName;
        return searchString.length > 1;
    }

    const onSave = (): void => {
        setFormIsChecked(true);
        if (checkIsValid()) {
            loadData(true)
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
        </BaseModal>
    );
};

export default EnhancedCustomerSearch;