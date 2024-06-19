import React, {useMemo, useState} from 'react';
import {TextField} from "../../../../components/styled/EndUserInputs";
import {Button, Divider, Grid, useMediaQuery, useTheme} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {setCustomerEnteredEmail} from "../../../../store/reducers/appointment/actions";
import {EUserType} from "../../../../store/reducers/appointmentFrameReducer/types";
import {setUserType} from "../../../../store/reducers/appointmentFrameReducer/actions";
import {
    loadCustomersBySearchTerm,
    setCustomerSearchData,
    setPageData,
    setPaging
} from "../../../../store/reducers/enhancedCustomerSearch/actions";
import CustomerSearchResults from "../CustomerSearchResultsModal/CustomerSearchResultsModal";
import CustomerNotFoundModal from "../CustomerNotFoundModal/CustomerNotFoundModal";
import {TCallback} from "../../../../types/types";
import {defaultPageData} from "../../../../store/reducers/constants";
import {TCustomerSearchData} from "../../../../store/reducers/enhancedCustomerSearch/types";
import {KeyboardArrowDown, KeyboardArrowUp} from "@mui/icons-material";
import {useStyles} from "../styles";
import {useCustomerSelectStyles} from "../../../../hooks/styling/useCustomerSelectStyles";
import {TError} from "./types";
import {InputLabel} from "../InputLabel/InputLabel";
import {LoadingProcess} from "../LoadingProcess/LoadingProcess";
import {useModal} from "../../../../hooks/useModal/useModal";
import {useException} from "../../../../hooks/useException/useException";

type TProps = {
    handleNew: () => void;
    redirect: TCallback;
};

const ReturningCustomerForAdmin: React.FC<React.PropsWithChildren<React.PropsWithChildren<TProps>>> = ({
                                                         handleNew,
                                                         redirect
}) => {
    const {customerEnteredEmail, scProfile} = useSelector((state: RootState) => state.appointment);
    const {customerSearchData, isLoading} = useSelector((state: RootState) => state.customers);
    const [formIsChecked, setFormIsChecked] = useState<boolean>(false);
    const [isExpanded, setExpanded] = useState<boolean>(false);
    const [errors, setErrors] = useState<string[]>([])

    const {onOpen: onOpenSearchResults, onClose: onCloseSearchResults, isOpen: isOpenSearchResults} = useModal();
    const {onOpen: onOpenNotFound, onClose: onCloseNotFound, isOpen: isOpenNotFound} = useModal();
    const { t } = useTranslation();
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down('md'));
    const dispatch = useDispatch();
    const showError = useException();

    const { classes  } = useStyles();
    const { classes: returningClasses } = useCustomerSelectStyles();
    const formIsValid = useMemo(() => {
             return !!customerEnteredEmail.length
             || Object.values(customerSearchData).find(item => item.length)
                || customerSearchData.lastVINCharacters.length === 8
        },
        [customerEnteredEmail, customerSearchData])

    const onSuccess = (count: number) => {
        count > 0 ? onOpenSearchResults() : onOpenNotFound()
    }

    const onError = (e: any) => {
        showError(e)
        if (e.response?.data?.errors) {
            const data = [...e.response.data.errors]
            setErrors(() => data.map((err: TError): string => err.field).filter(el => el !== null))
        }
    }

    const loadData = () => {
        scProfile && dispatch(loadCustomersBySearchTerm(
            scProfile.id,
            onSuccess,
            onError,
            customerSearchData.firstName,
            customerSearchData.lastName,
            customerEnteredEmail,
            customerSearchData.address,
            customerSearchData.lastVINCharacters,
            customerSearchData.companyName
        ))
    }

    const clearForm = async () => {
        setFormIsChecked(false);
        setErrors([]);
        dispatch(setCustomerSearchData(null))
        dispatch(setCustomerEnteredEmail(''));
        dispatch(setPaging({numberOfPages: 0, numberOfRecords: 0}));
        dispatch(setPageData(defaultPageData))
    }

    const handlePhoneOrEmailChange: React.ChangeEventHandler<HTMLInputElement> = ({target: {value}}) => {
        setFormIsChecked(false);
        setErrors([]);
        dispatch(setCustomerEnteredEmail(value));
    }

    const onTextChange = (name: keyof TCustomerSearchData) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormIsChecked(false);
        setErrors([]);
        dispatch(setCustomerSearchData({[name]: e.target.value}));
    }

    const onSave = (): void => {
        setFormIsChecked(true);
        if (formIsValid) {
            loadData()
        } else {
            showError('Any search field must contain 2 or more characters')
        }
    };

    const handleComplete = async () => {
        dispatch(setUserType(EUserType.Existing));
    }

    const onKeyUp = (e: React.KeyboardEvent) => {
        if (e.keyCode === 13) onSave()
        handleComplete().then()
    }

    const onExpandClick = () => setExpanded(prev => !prev)

    const onSubmit = () => {
        onSave()
        handleComplete().then()
    }

    return <Grid item xs={12} sm={12} md={6} style={{maxWidth: 440, padding: isSm ? '16px 0' : 16}}>
        <div className={classes.existing}>
            <span style={{fontSize: isSm ? 28 : 32}}>{t("Existing Customer")}</span>
            {isSm
                ? null
                : <div className={returningClasses.greyText}>{t("Add Data and hit enter to search", {button: `"${t("Enter")}"`, button1: `"${t("Search")}"`})}</div>}
            <Divider style={{marginBottom: isSm ? 8 : 16, marginTop: 17}}/>
            <InputLabel label={t("Search Customer by Phone or Email")}/>
            <TextField
                onKeyUp={onKeyUp}
                style={{ marginBottom: isSm ? 12 : 28 }}
                error={formIsChecked && (errors.includes("PhoneOrEmail") || !formIsValid)}
                placeholder={t("Enter Phone or Email")}
                InputProps={{disableUnderline: true, endAdornment: isLoading && customerEnteredEmail.length ? <LoadingProcess /> : null }}
                variant="standard"
                name="phoneOrEmail"
                onChange={handlePhoneOrEmailChange}
                value={customerEnteredEmail}
                disabled={isLoading}
                fullWidth/>
            <InputLabel label={t("Search Customer by Name")}/>
            <div className={returningClasses.nameFieldsWrapper}>
                <TextField
                    onKeyUp={onKeyUp}
                    name="firstName"
                    variant="standard"
                    placeholder={t("Enter First Name")}
                    error={formIsChecked && (customerSearchData.firstName.length === 1 || !formIsValid)}
                    onChange={onTextChange('firstName')}
                    InputProps={{disableUnderline: true, endAdornment: isLoading && customerSearchData.firstName.length ?  <LoadingProcess /> : null }}
                    fullWidth
                    disabled={isLoading}
                    value={customerSearchData.firstName}/>
                <TextField
                    onKeyUp={onKeyUp}
                    name="lastName"
                    variant="standard"
                    placeholder={t("Enter Last Name")}
                    error={formIsChecked && (customerSearchData.lastName.length === 1 || !formIsValid)}
                    onChange={onTextChange('lastName')}
                    InputProps={{disableUnderline: true, endAdornment: isLoading && customerSearchData.lastName.length ?  <LoadingProcess /> : null }}
                    fullWidth
                    disabled={isLoading}
                    value={customerSearchData.lastName}/>
            </div>
            <div className={returningClasses.expandBtn} onClick={onExpandClick}>
                {isExpanded ? t("Collapse expanded search criteria") : t("Expand advanced search criteria")}
                {isExpanded ? <KeyboardArrowUp htmlColor="#142EA1"/> : <KeyboardArrowDown htmlColor="#142EA1"/> }
            </div>
            {!isExpanded
                ?  <Button
                    variant="contained"
                    color="primary"
                    disabled={!formIsValid}
                    className={classes.submitButton}
                    onClick={onSubmit}
                >
                    {t("Search")}
                </Button>
            : null }
            {isExpanded
                ? <React.Fragment>
                    <InputLabel label={t("Search by Company Name")}/>
                    <TextField
                        onKeyUp={onKeyUp}
                        placeholder={t("Enter Company Name")}
                        error={formIsChecked && (customerSearchData.companyName.length === 1 || !formIsValid)}
                        onChange={onTextChange('companyName')}
                        InputProps={{disableUnderline: true, endAdornment: isLoading && customerSearchData.address.length ?  <LoadingProcess /> : null }}
                        fullWidth
                        variant="standard"
                        name="companyName"
                        disabled={isLoading}
                        style={{ marginBottom: 16 }}
                        value={customerSearchData.companyName}/>
                    <InputLabel label={t("Search by Address")}/>
                    <TextField
                        onKeyUp={onKeyUp}
                        placeholder={t("Enter Address")}
                        error={formIsChecked && (customerSearchData.address.length === 1 || !formIsValid)}
                        onChange={onTextChange('address')}
                        InputProps={{disableUnderline: true, endAdornment: isLoading && customerSearchData.address.length ?  <LoadingProcess /> : null }}
                        fullWidth
                        variant="standard"
                        name="address"
                        disabled={isLoading}
                        style={{ marginBottom: 16 }}
                        value={customerSearchData.address}/>
                    <InputLabel label={t("Search by VIN (Last 8 digits)")}/>
                    <TextField
                        onKeyUp={onKeyUp}
                        placeholder={t("Enter Last 8 VIN digits")}
                        variant="standard"
                        error={formIsChecked &&
                            ((!!customerSearchData.lastVINCharacters.length && customerSearchData.lastVINCharacters.length < 8)
                                || !formIsValid)}
                        onChange={onTextChange('lastVINCharacters')}
                        InputProps={{disableUnderline: true, endAdornment: isLoading && customerSearchData.lastVINCharacters.length ?  <LoadingProcess /> : null }}
                        name="lastVINCharacters"
                        fullWidth
                        disabled={isLoading}
                        style={{ marginBottom: 16 }}
                        value={customerSearchData.lastVINCharacters}/>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={!formIsValid}
                        className={classes.submitButton}
                        onClick={onSubmit}
                    >
                        {t("Search")}
                    </Button>

            </React.Fragment>
                : null}
            <CustomerSearchResults
                handleNew={handleNew}
                loadData={loadData}
                redirect={redirect}
                onClose={onCloseSearchResults}
                open={isOpenSearchResults}
                onClearSearchForm={clearForm}
            />
            <CustomerNotFoundModal open={isOpenNotFound} onClose={onCloseNotFound} handleNew={handleNew} onTryAnotherName={onCloseNotFound}/>
        </div>
    </Grid>
};

export default ReturningCustomerForAdmin;