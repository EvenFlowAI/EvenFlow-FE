import React from 'react';
import {useDialogStyles} from "../DetailedFees/DetailedFees";
import {DialogContent, DialogTitle} from "../BaseModal";
import {DialogProps} from "../types";
import {Dialog} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import {Actions} from "../../AppointmentFlow/AppointmentFrame/Actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {EServiceType} from "../../../store/reducers/appointmentFrameReducer/types";
import {makeStyles} from "@material-ui/core/styles";
import {setCurrentFrameScreen, setServiceType} from "../../../store/reducers/appointmentFrameReducer/actions";

type TDisplayAncillaryPriceProps = DialogProps & {
    onNext: () => void;
}

const useStyles = makeStyles(() => ({
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
    }
}))

const DisplayAncillaryPrice: React.FC<TDisplayAncillaryPriceProps> = ({open, onClose, onNext}) => {
    const {serviceType} = useSelector((state: RootState) => state.appointmentFrame);
    const dialogClasses = useDialogStyles();
    const classes = useStyles();
    const {t} = useTranslation();
    const dispatch = useDispatch();

    const serviceString = serviceType === EServiceType.MobileService
        ? t("Mobile Service")
        : t("Pick Up / Drop Off Service");
    // todo price display
    const price = 18;

    const onBack = () => {
        dispatch(setServiceType(EServiceType.VisitCenter));
        dispatch(setCurrentFrameScreen("serviceNeeds"));
        onClose()
    }

    const onSubmit = () => {
        onNext()
        onClose()
    }

    return (
        <Dialog open={open} fullWidth onClose={onClose} classes={{root: dialogClasses.root, paper: dialogClasses.dialogPaper}}>
            <DialogTitle onClose={onClose}/>
            <DialogContent>
                <div className={classes.info}>
                    {t("For the location you entered, a convenience fee of")} ${price.toFixed(2)} {t("will be added to your service bill for the")} {" "}
                    {serviceString}.
                    <span className={classes.question}>
                        {t("Do you wish to proceed with the")} {serviceString}?
                    </span>
                </div>
            </DialogContent>
            <Actions
                onBack={onBack}
                onNext={onSubmit}
                nextLabel={`${t("Continue with")} ${serviceString}`}
                prevLabel={t("Visit Center instead")}
            />
        </Dialog>
    );
};

export default DisplayAncillaryPrice;
