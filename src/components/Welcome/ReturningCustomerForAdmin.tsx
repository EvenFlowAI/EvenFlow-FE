import React, {useMemo, useState} from 'react';
import {TextField} from "../UI/EndUserInputs";
import {Divider, Grid, useMediaQuery, useTheme} from "@material-ui/core";
import {useStyles} from "./CustomerSelect";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/rootReducer";
import {setCustomerEnteredEmail} from "../../store/reducers/appointment/actions";
import {EUserType} from "../../store/reducers/appointmentFrameReducer/types";
import {setUserType} from "../../store/reducers/appointmentFrameReducer/actions";
import {makeStyles} from "@material-ui/core/styles";
import {
    loadCustomersBySearchTerm,
    setCustomerSearchData, setPageData,
    setPaging
} from "../../store/reducers/enhancedCustomerSearch/actions";
import {useException, useModal} from "../../utils/hooks";
import CustomerSearchResults from "../Modals/EnhancedCustomerSearch/CustomerSearchResults";
import CustomerNotFound from "../Modals/CustomerNotFound/CustomerNotFound";
import {TCallback} from "../../types/types";
import {defaultPageData} from "../../store/reducers/defaultInitials";
import {TCustomerSearchData} from "../../store/reducers/enhancedCustomerSearch/types";
import {Loading} from "../UI/Loading";
import {KeyboardArrowDown, KeyboardArrowUp} from "@material-ui/icons";

export const useReturningAdminStyles = makeStyles((theme) => ({
    greyText: {
        display: 'flex',
        justifyContent: "center",
        fontSize: 16,
        fontWeight: 600,
        color: "#828282",
        marginTop: 10
    },
    inputLabel: {
        display: 'flex',
        justifyContent: "flex-start",
        fontWeight: 700,
        fontSize: 20,
        color: "#202021",
        textAlign: "left",
        [theme.breakpoints.down("sm")]: {
            fontSize: 18,
        },
    },
    nameFieldsWrapper: {
        display: 'flex',
        justifyContent: "space-between",
        alignItems: "center",
        [theme.breakpoints.down("sm")]: {
            flexDirection: 'column',
        },
        "& > div": {
            marginBottom: 28,
            [theme.breakpoints.down("sm")]: {
                marginBottom: 16,
            }
        },
        '& > div:first-child': {
            marginRight: 12,
            [theme.breakpoints.down("sm")]: {
                marginRight: 0,
                marginBottom: 8,
            },
        }
    },
    expandBtn: {
        display: 'flex',
        justifyContent: 'flex-start',
        color: "#142EA1",
        fontSize: 16,
        fontWeight: 600,
        cursor: "pointer"
    }
}))

type TProps = {
    handleNew: () => void;
    redirect: TCallback;
};

type TError = {
    field: string;
    message: string;
}

const InputLabel: React.FC<{label: string}> = ({label}) => {
    const returningClasses = useReturningAdminStyles();
    return <div className={returningClasses.inputLabel}>{label}</div>
}

const ReturningCustomerForAdmin: React.FC<TProps> = ({
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
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));
    const dispatch = useDispatch();
    const showError = useException();

    const classes = useStyles();
    const returningClasses = useReturningAdminStyles();
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
            customerSearchData.lastVINCharacters
        ))
    }

    const clearForm = async () => {
        setFormIsChecked(false);
        setErrors([]);
        dispatch(setCustomerSearchData(null))
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

    // const checkPhoneOrEmailValid = () => {
    //     if (customerEnteredEmail.length) {
    //         return Number.isNaN(+customerEnteredEmail)
    //             ? checkEmail(customerEnteredEmail)
    //             : customerEnteredEmail.length >= 11
    //     }
    //     return true
    // }

    return <Grid item xs={12} sm={12} md={6} style={{maxWidth: 440, padding: isSm ? '16px 0' : 16}}>
        <div className={classes.existing} onKeyUp={onKeyUp}>
            <span style={{fontSize: isSm ? 28 : 32}}>{t("Search Customer")}</span>
            {isSm
                ? null
                : <div className={returningClasses.greyText}>{t("Add Data and hit enter to search", {button: `"${t("Enter")}"`})}</div>}
            <Divider style={{marginBottom: isSm ? 8 : 16, marginTop: 17}}/>
            <InputLabel label={t("Search Customer by Phone or Email")}/>
            <TextField
                style={{ marginBottom: isSm ? 12 : 28 }}
                error={formIsChecked && (errors.includes("PhoneOrEmail") || !formIsValid)}
                placeholder={t("Enter Phone or Email")}
                InputProps={{disableUnderline: true, endAdornment: isLoading && customerEnteredEmail.length ? <Loading size="1rem" /> : null }}
                variant="standard"
                name="phoneOrEmail"
                onChange={handlePhoneOrEmailChange}
                value={customerEnteredEmail}
                disabled={isLoading}
                fullWidth/>

            <InputLabel label={t("Search Customer by Name")}/>
            <div className={returningClasses.nameFieldsWrapper}>
                <TextField
                    name="firstName"
                    placeholder={t("Enter First Name")}
                    error={formIsChecked && (customerSearchData.firstName.length === 1 || !formIsValid)}
                    onChange={onTextChange('firstName')}
                    InputProps={{disableUnderline: true, endAdornment: isLoading && customerSearchData.firstName.length ? <Loading size="1rem" /> : null }}
                    fullWidth
                    disabled={isLoading}
                    value={customerSearchData.firstName}/>
                <TextField
                    name="lastName"
                    placeholder={t("Enter Last Name")}
                    error={formIsChecked && (customerSearchData.lastName.length === 1 || !formIsValid)}
                    onChange={onTextChange('lastName')}
                    InputProps={{disableUnderline: true, endAdornment: isLoading && customerSearchData.lastName.length ? <Loading size="1rem" /> : null }}
                    fullWidth
                    disabled={isLoading}
                    value={customerSearchData.lastName}/>
            </div>
            <div className={returningClasses.expandBtn} onClick={onExpandClick} style={{marginBottom: isExpanded ? 16 : 0}}>
                {isExpanded ? t("Collapse expanded search criteria") : t("Expand advanced search criteria")}
                {isExpanded ? <KeyboardArrowUp htmlColor="#142EA1"/> : <KeyboardArrowDown htmlColor="#142EA1"/> }
            </div>
            {isExpanded
                ? <React.Fragment>
                    {/*<InputLabel label={t("Search by Company Name")}/>*/}
                    {/*<TextField*/}
                    {/*    placeholder={t("Enter Company Name")}*/}
                    {/*    error={formIsChecked && (customerSearchData.companyName.length === 1 || !formIsValid)}*/}
                    {/*    onChange={onTextChange('companyName')}*/}
                    {/*    InputProps={{disableUnderline: true}}*/}
                    {/*    fullWidth*/}
                    {/*    style={{ marginBottom: 16 }}*/}
                    {/*    value={customerSearchData.companyName}/>*/}
                    <InputLabel label={t("Search by Address")}/>
                    <TextField
                        placeholder={t("Enter Address")}
                        error={formIsChecked && (customerSearchData.address.length === 1 || !formIsValid)}
                        onChange={onTextChange('address')}
                        InputProps={{disableUnderline: true, endAdornment: isLoading && customerSearchData.address.length ? <Loading size="1rem" /> : null }}
                        fullWidth
                        name="address"
                        disabled={isLoading}
                        style={{ marginBottom: 16 }}
                        value={customerSearchData.address}/>
                    <InputLabel label={t("Search by VIN (Last 8 digits)")}/>
                    <TextField
                        placeholder={t("Enter Last 8 VIN digits")}
                        error={formIsChecked &&
                            ((!!customerSearchData.lastVINCharacters.length && customerSearchData.lastVINCharacters.length < 8)
                                || !formIsValid)}
                        onChange={onTextChange('lastVINCharacters')}
                        InputProps={{disableUnderline: true, endAdornment: isLoading && customerSearchData.lastVINCharacters.length ? <Loading size="1rem" /> : null }}
                        name="lastVINCharacters"
                        fullWidth
                        disabled={isLoading}
                        style={{ marginBottom: 16 }}
                        value={customerSearchData.lastVINCharacters}/>
            </React.Fragment>
                : null}
            {/*<LoadingButton*/}
            {/*    fullWidth={isSm}*/}
            {/*    loading={isLoading}*/}
            {/*    variant="contained"*/}
            {/*    color="primary"*/}
            {/*    classes={loadingClasses}*/}
            {/*    className={classes.loadingButton}*/}
            {/*    disabled={isLoading || !formIsValid}*/}
            {/*    onClick={handleComplete}>*/}
            {/*    {t("Search")}*/}
            {/*</LoadingButton>*/}
            <CustomerSearchResults
                handleNew={handleNew}
                loadData={loadData}
                redirect={redirect}
                onClose={onCloseSearchResults}
                open={isOpenSearchResults}
                onClearSearchForm={clearForm}
            />
            <CustomerNotFound open={isOpenNotFound} onClose={onCloseNotFound} handleNew={handleNew} onTryAnotherName={onCloseNotFound}/>
        </div>
    </Grid>
};

export default ReturningCustomerForAdmin;