import React, {Dispatch, SetStateAction, useMemo} from 'react';
import {DialogContent, DialogTitle} from "../BaseModal";
import {Button, Dialog} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {useDialogStyles} from "../DetailedFees/DetailedFees";
import {useTranslation} from "react-i18next";
import {EServiceType} from "../../../store/reducers/appointmentFrameReducer/types";
import {makeStyles} from "@material-ui/core/styles";
import {DialogProps} from "../types";
import {setAddress, setZipCode} from "../../../store/reducers/appointmentFrameReducer/actions";
import {TCallback} from "../../../types/types";

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
    buttonWrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '20px 0',
        [`${theme.breakpoints.down("sm")} and (orientation: landscape)`]: {
            margin: 0,
        }
    },
    linkButton: {
        textTransform: 'none',
        fontSize: 18,
        textDecoration: 'underline',
    }
}))

type TUnavailableServiceProps = DialogProps & {
    setFormChecked: Dispatch<SetStateAction<boolean>>;
    onBackToServiceOption: TCallback;
    onVisitCenter: TCallback;
}

const UnavailableService: React.FC<TUnavailableServiceProps> = ({onClose, open, setFormChecked, onBackToServiceOption, onVisitCenter}) => {
    const {serviceTypeOption, appointmentByKey} = useSelector((state: RootState) => state.appointmentFrame);
    const {customerLoadedData} = useSelector((state: RootState) => state.appointment);
    const dialogClasses = useDialogStyles();
    const classes = useStyles();
    const {t} = useTranslation();
    const dispatch = useDispatch();

    const serviceType = useMemo(() => serviceTypeOption ? serviceTypeOption.type : EServiceType.VisitCenter, [serviceTypeOption]);
    const isSameServiceTypeOption = useMemo(() => {
        return appointmentByKey?.serviceTypeOption?.id === serviceTypeOption?.id
    }, [appointmentByKey, serviceTypeOption])
    const serviceString = serviceType === EServiceType.MobileService
        ? t("Mobile Service")
        : t("Pick Up / Drop Off Service");

    const backLabel = customerLoadedData?.isUpdating
        ? isSameServiceTypeOption
            ? t("Keep Original Location")
            : t("Back") : t("Visit Center")

    const clearLocation = () => {
        setFormChecked(false);
        dispatch(setAddress(null));
        dispatch(setZipCode(""));
        onClose()
    }

    const keepOriginalLocation = () => {
        dispatch(setAddress(appointmentByKey?.address ?? null))
        dispatch(setZipCode(appointmentByKey?.zipCode ?? ''))
        onClose()
    }

    const onVisitCenterClick = () => {
        if (customerLoadedData?.isUpdating) {
            if (isSameServiceTypeOption) {
                keepOriginalLocation()
            } else {
                onBackToServiceOption()
                clearLocation();
            }
        } else {
            onVisitCenter()
            clearLocation();
        }
    }

    return (
        <Dialog open={open} fullWidth onClose={onClose} classes={{root: dialogClasses.root, paper: dialogClasses.dialogPaper}}>
            <DialogTitle onClose={onClose}/>
            <DialogContent>
                <div className={classes.info}>
                    {t("We are sorry but we do not offer")} {serviceString} {t("to your area")}. {t("Would you like to book an appointment to visit our service center?")}
                </div>
            </DialogContent>
            <div className={classes.buttonWrapper}>
                <Button
                    onClick={onVisitCenterClick}
                    color={'primary'}
                    variant='contained'>
                    {backLabel}
                </Button>
            </div>
            <div className={classes.buttonWrapper}>
                <Button
                    className={classes.linkButton}
                    onClick={clearLocation}
                    variant="text">
                    {t("Try another location")}
                </Button>
            </div>
        </Dialog>
    );
};

export default UnavailableService;