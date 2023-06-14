import React, {Dispatch, SetStateAction, useEffect, useMemo, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Button, Grid, useMediaQuery} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {setUserType, setWelcomeScreenView} from "../../store/reducers/appointmentFrameReducer/actions";
import {LocalTokens, TCallback} from "../../types/types";
import {v4 as uuidv4} from 'uuid';
import {EServiceType, EUserType} from "../../store/reducers/appointmentFrameReducer/types";
import {RootState} from "../../store/rootReducer";
import {setCustomerEnteredEmail} from "../../store/reducers/appointment/actions";
import {TextField} from "../UI/EndUserInputs";
import {LoadingButton} from "../UI/Button";
import {useTranslation} from "react-i18next";
import {useCurrentUser, useException, useModal} from "../../utils/hooks";
import EnhancedCustomerSearch from "../Modals/EnhancedCustomerSearch/EnhancedCustomerSearch";
import CustomerNotFound from "../Modals/CustomerNotFound/CustomerNotFound";
import CustomerSearchResults from "../Modals/EnhancedCustomerSearch/CustomerSearchResults";
import {loadCustomersBySearchTerm} from "../../store/reducers/enhancedCustomerSearch/actions";
import {Actions} from "../AppointmentFlow/AppointmentFrame/Actions";

export const mh400 = "@media (max-height: 400px)";
export const mh600 = "@media (max-height: 600px)";

export const useStyles = makeStyles(theme => ({
    buttonsContainer: {
        marginTop: "5%",
        marginBottom: 20,
        [mh600]: {
            marginTop: "2%"
        },
        [theme.breakpoints.down("sm")]: {
            marginTop: theme.spacing(5)
        }
    },
    existing: {
        position: "relative",
        fontWeight: "bold",
        fontSize: 32,
        padding: "7% 7% 9% 7%",
        height: "100%",
        textAlign: "center",
        border: "1px solid #DADADA",
        background: "#FFFFFF",
        transition: theme.transitions.create(["box-shadow"]),
        "&:hover": {
            boxShadow: "0 2px 8px rgba(0,0,0,.1)"
        },
        [mh600]: {
            fontSize: 22,
            padding: "7%"
        },
        [mh400]: {
            fontSize: 18,
            padding: "2%"
        },
        [theme.breakpoints.down("xs")]: {
            fontSize: 18,
            padding: "5%"
        }
    },
    button: {
        fontWeight: "bold",
        fontSize: 32,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "7% 7% 9% 7%",
        height: "100%",
        textAlign: "center",
        border: "1px solid #DADADA",
        background: "#FFFFFF",
        transition: theme.transitions.create(["box-shadow"]),
        "&:hover": {
            boxShadow: "0 2px 8px rgba(0,0,0,.1)"
        },
        [mh600]: {
            fontSize: 22,
            padding: "7%"
        },
        [mh400]: {
            fontSize: 18,
            padding: "2%"
        },
        [theme.breakpoints.down("xs")]: {
            fontSize: 18,
            padding: "5%"
        }
    },
    loadingButton: {
        minWidth: 144,
        [theme.breakpoints.down("xs")]: {
            width: "100%",
            "&:last-child": {
                order: -1,
                marginBottom: theme.spacing(2)
            }
        }
    },
    submitButton: {
        minWidth: 144,
        [theme.breakpoints.down("xs")]: {
            width: "100%",
            "&:last-child": {
                marginBottom: theme.spacing(2),
                marginTop: theme.spacing(2),
            }
        }
    },
    searchButton: {
        textTransform: 'none',
        textDecoration: 'underline',
        fontSize: 14,
        fontWeight: 600,
        color: "#202021",
        textDecorationColor: "#DADADA",
    },
    searchLinkWrapper: {
        position: "absolute",
        right: '31%',
        bottom: 0,
        [theme.breakpoints.down("xs")]: {
            right: '22%',
        }
    },
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }
}))

const useLoadingStyles = makeStyles(theme => ({
    wrapper: {
        [theme.breakpoints.down("xs")]: {
            width: "100%",
        }
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
    firstName: string;
    lastName: string;
    setFirstName: Dispatch<SetStateAction<string>>;
    setLastName: Dispatch<SetStateAction<string>>;
};

export const CustomerSelect: React.FC<TProps> = ({
                                                     onComplete,
                                                     loading,
                                                     handleNew,
                                                     isOpenSearchResults,
                                                     onCloseSearchResults,
                                                     onOpenSearchResults,
                                                     isOpenNotFound,
                                                     onCloseNotFound,
                                                     onOpenNotFound,
                                                     firstName,
                                                     lastName,
                                                     setFirstName,
                                                     setLastName,
                                                 }) => {
    const {serviceTypeOption} = useSelector((state: RootState) => state.appointmentFrame);
    const {customerEnteredEmail, scProfile} = useSelector((state: RootState) => state.appointment);
    const {onOpen, onClose, isOpen} = useModal();
    const [formIsChecked, setFormIsChecked] = useState<boolean>(false);

    const serviceType = useMemo(() => serviceTypeOption ? serviceTypeOption.type : EServiceType.VisitCenter, [serviceTypeOption]);
    const classes = useStyles();
    const loadingClasses = useLoadingStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const isXs = useMediaQuery("xs");
    const currentUser = useCurrentUser();
    const showError = useException();

    useEffect(() => {
        const uid = uuidv4();
        sessionStorage.setItem(LocalTokens.sessionId, uid);
        window.addEventListener('unload', () => {
            sessionStorage.setItem(LocalTokens.sessionId, '')
        })
    }, [sessionStorage])

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = ({target: {value}}) => {
        dispatch(setCustomerEnteredEmail(value));
    }

    const handleComplete = async () => {
        dispatch(setUserType(EUserType.Existing));
        onComplete(serviceType, EUserType.Existing);
    }

    const onSuccess = (count: number) => {
        count > 0 ? onOpenSearchResults() : onOpenNotFound()
    }

    const onOpenSearch = () => {
        setFirstName('')
        setLastName('')
        onOpen()
    }

    console.log(customerEnteredEmail)

    const loadData = () => {
        scProfile && dispatch(loadCustomersBySearchTerm(scProfile.id, onSuccess, showError, firstName, lastName, customerEnteredEmail))
    }

    const clearForm = () => {
        setFormIsChecked(false);
        setFirstName('');
        setLastName('');
    }

    const handleBack = () => dispatch(setWelcomeScreenView("serviceCenterSelect"))

    return <div className={classes.wrapper}>
        <Grid className={classes.buttonsContainer}
              alignItems="stretch"
              container
              spacing={4}>
            <Grid item xs={12} sm={12} md={6}>
                <div className={classes.existing}>
                    <span>{t("I`m a returning customer")}</span>
                    <TextField
                        style={{ marginTop: 20, marginBottom: 20 }}
                        placeholder={`${t("Enter your")} ${t("Email or ")}${t("Phone")}`}
                        InputProps={{disableUnderline: true}}
                        variant="standard"
                        onChange={handleChange}
                        value={customerEnteredEmail}
                        fullWidth/>
                    <LoadingButton
                        fullWidth={isXs}
                        loading={loading}
                        variant="contained"
                        color="primary"
                        classes={loadingClasses}
                        className={classes.loadingButton}
                        disabled={loading || !customerEnteredEmail}
                        onClick={handleComplete}>
                        {t("Search")}
                    </LoadingButton>
                    {currentUser
                        ? <div className={classes.searchLinkWrapper}>
                            <Button
                                variant="text"
                                onClick={onOpenSearch}
                                disabled={loading}
                                className={classes.searchButton}>
                                {t("Search Customer by Name")}
                            </Button>
                        </div>
                        : null}
                </div>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
                <div className={classes.button}>
                    <span>{t("I`m a new customer")}</span>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.submitButton}
                        onClick={handleNew}
                    >
                        {t("Next")}
                    </Button>
                </div>
            </Grid>
            <EnhancedCustomerSearch
                firstName={firstName}
                lastName={lastName}
                setFirstName={setFirstName}
                setLastName={setLastName}
                open={isOpen}
                onClose={onClose}
                loadData={loadData}
                formIsChecked={formIsChecked}
                setFormIsChecked={setFormIsChecked}
            />
            <CustomerSearchResults
                handleNew={handleNew}
                loadData={loadData}
                onClose={onCloseSearchResults}
                open={isOpenSearchResults}
                onClearSearchForm={clearForm}
            />
            <CustomerNotFound open={isOpenNotFound} onClose={onCloseNotFound} handleNew={handleNew} onTryAnotherName={onOpen}/>
        </Grid>
        {currentUser && <Actions onBack={handleBack} onNext={() => {}} hideNext prevLabel="Change Service"/>}
    </div>
};