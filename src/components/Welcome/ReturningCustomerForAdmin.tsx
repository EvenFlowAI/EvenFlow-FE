import React, {useMemo, useState} from 'react';
import {TextField} from "../UI/EndUserInputs";
import {Divider, Grid, useMediaQuery, useTheme} from "@material-ui/core";
import {useStyles} from "./CustomerSelect";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/rootReducer";
import {setCustomerEnteredEmail} from "../../store/reducers/appointment/actions";
import {EServiceType, EUserType} from "../../store/reducers/appointmentFrameReducer/types";
import {setUserType} from "../../store/reducers/appointmentFrameReducer/actions";
import {makeStyles} from "@material-ui/core/styles";
import {
    loadCustomersBySearchTerm,
    setCustomerSearchData, setPageData,
    setPaging
} from "../../store/reducers/enhancedCustomerSearch/actions";
import {useException} from "../../utils/hooks";
import CustomerSearchResults from "../Modals/EnhancedCustomerSearch/CustomerSearchResults";
import CustomerNotFound from "../Modals/CustomerNotFound/CustomerNotFound";
import {TCallback} from "../../types/types";
import {defaultPageData} from "../../store/reducers/defaultInitials";
import {TCustomerSearchData} from "../../store/reducers/enhancedCustomerSearch/types";

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
    onComplete: (serviceType: EServiceType, userType?: EUserType) => void;
    loading: boolean;
    handleNew: () => void;
    isOpenSearchResults: boolean;
    onCloseSearchResults: TCallback;
    onOpenSearchResults: TCallback;
    isOpenNotFound: boolean;
    onCloseNotFound: TCallback;
    onOpenNotFound: TCallback;
    redirect: TCallback;
};

const InputLabel: React.FC<{label: string}> = ({label}) => {
    const returningClasses = useReturningAdminStyles();
    return <div className={returningClasses.inputLabel}>{label}</div>
}

const ReturningCustomerForAdmin: React.FC<TProps> = ({
                                                         loading,
                                                         onComplete,
                                                         handleNew,
                                                         isOpenSearchResults,
                                                         onCloseSearchResults,
                                                         onOpenSearchResults,
                                                         isOpenNotFound,
                                                         onCloseNotFound,
                                                         onOpenNotFound,
                                                         redirect
}) => {
    const {customerEnteredEmail, scProfile} = useSelector((state: RootState) => state.appointment);
    const {serviceTypeOption} = useSelector((state: RootState) => state.appointmentFrame);
    const {customerSearchData} = useSelector((state: RootState) => state.customers);
    const [formIsChecked, setFormIsChecked] = useState<boolean>(false);
    const [isExpanded, setExpanded] = useState<boolean>(false);

    const { t } = useTranslation();
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));
    const dispatch = useDispatch();
    const showError = useException();

    const classes = useStyles();
    const returningClasses = useReturningAdminStyles();

    const serviceType = useMemo(() => serviceTypeOption ? serviceTypeOption.type : EServiceType.VisitCenter, [serviceTypeOption]);

    const handleComplete = async () => {
        dispatch(setUserType(EUserType.Existing));
        onComplete(serviceType, EUserType.Existing);
    }

    const onSuccess = (count: number) => {
        count > 0 ? onOpenSearchResults() : onOpenNotFound()
    }

    const loadData = () => {
        scProfile && dispatch(loadCustomersBySearchTerm(
            scProfile.id,
            onSuccess,
            showError,
            customerSearchData.firstName,
            customerSearchData.lastName,
            customerEnteredEmail
        ))
    }

    const clearForm = async () => {
        setFormIsChecked(false);
        dispatch(setCustomerSearchData(null))
        dispatch(setPaging({numberOfPages: 0, numberOfRecords: 0}));
        dispatch(setPageData(defaultPageData))
    }

    const handlePhoneOrEmailChange: React.ChangeEventHandler<HTMLInputElement> = ({target: {value}}) => {
        setFormIsChecked(false);
        dispatch(setCustomerEnteredEmail(value));
    }

    const onTextChange = (name: keyof TCustomerSearchData) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormIsChecked(false);
        dispatch(setCustomerSearchData({[name]: e.target.value}));
    }

    const checkIsValid = () => {
        return Object.values(customerSearchData).find(item => item.length > 1);
    }

    const onSave = (): void => {
        setFormIsChecked(true);
        if (checkIsValid()) {
            loadData()
        } else {
            showError('First Name or Last Name must consist from 2 or more characters')
        }
    };

    const onKeyUp = (e: React.KeyboardEvent) => {
        if (e.keyCode === 13) onSave()
        handleComplete().then()
    }

    const onExpandClick = () => setExpanded(prev => !prev)

    return <Grid item xs={12} sm={12} md={6} style={{maxWidth: 440, padding: isSm ? '16px 0' : 16}}>
        <div className={classes.existing} onKeyUp={onKeyUp}>
            <span style={{fontSize: isSm ? 28 : 32}}>{t("Returning customer")}</span>
            {isSm
                ? null
                : <div className={returningClasses.greyText}>{t("Add Data and hit enter to search", {button: `"${t("Enter")}"`})}</div>}
            <Divider style={{marginBottom: isSm ? 8 : 16, marginTop: 17}}/>
            <InputLabel label={t("Search Customer by Phone or Email")}/>
            <TextField
                style={{ marginBottom: isSm ? 12 : 28 }}
                placeholder={t("Enter Phone or Email")}
                InputProps={{disableUnderline: true}}
                variant="standard"
                onChange={handlePhoneOrEmailChange}
                value={customerEnteredEmail}
                fullWidth/>

            <InputLabel label={t("Search Customer by Name")}/>
            <div className={returningClasses.nameFieldsWrapper}>
                <TextField
                    placeholder={t("Enter First Name")}
                    error={formIsChecked && (customerSearchData.firstName.length < 2 && customerSearchData.lastName.length < 2)}
                    onChange={onTextChange('firstName')}
                    InputProps={{disableUnderline: true}}
                    fullWidth
                    value={customerSearchData.firstName}/>
                <TextField
                    placeholder={t("Enter Last Name")}
                    error={formIsChecked && (customerSearchData.lastName.length < 2 && customerSearchData.firstName.length < 2)}
                    onChange={onTextChange('lastName')}
                    InputProps={{disableUnderline: true}}
                    fullWidth
                    value={customerSearchData.lastName}/>
            </div>
            <div className={returningClasses.expandBtn} onClick={onExpandClick} style={{marginBottom: isExpanded ? 16 : 0}}>
                {isExpanded ? t("Click to collapse expanded search criteria") : t("Click to expand advanced search criteria")}
            </div>
            {isExpanded
                ? <React.Fragment>
                    <InputLabel label={t("Search by Company Name")}/>
                    <TextField
                        placeholder={t("Enter Company Name")}
                        error={formIsChecked && (customerSearchData.companyName.length < 2)}
                        onChange={onTextChange('companyName')}
                        InputProps={{disableUnderline: true}}
                        fullWidth
                        style={{ marginBottom: 16 }}
                        value={customerSearchData.companyName}/>
                    <InputLabel label={t("Search by Address")}/>
                    <TextField
                        placeholder={t("Enter Address")}
                        error={formIsChecked && (customerSearchData.address.length < 2)}
                        onChange={onTextChange('address')}
                        InputProps={{disableUnderline: true}}
                        fullWidth
                        style={{ marginBottom: 16 }}
                        value={customerSearchData.address}/>
                    <InputLabel label={t("Search by VIN (Last 8 digits)")}/>
                    <TextField
                        placeholder={t("Enter Last 8 VIN digits")}
                        error={formIsChecked && (customerSearchData.lastVINDigits.length < 8 || Number.isNaN(+customerSearchData.lastVINDigits))}
                        onChange={onTextChange('lastVINDigits')}
                        InputProps={{disableUnderline: true}}
                        fullWidth
                        style={{ marginBottom: 16 }}
                        value={customerSearchData.lastVINDigits}/>
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
            <CustomerNotFound open={isOpenNotFound} onClose={onCloseNotFound} handleNew={handleNew} onTryAnotherName={onCloseNotFound}/>
        </div>
    </Grid>
};

export default ReturningCustomerForAdmin;