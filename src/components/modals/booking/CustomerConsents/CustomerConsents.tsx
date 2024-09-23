import React from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../BaseModal/BaseModal";
import {LoadingButton} from "../../../buttons/LoadingButton/LoadingButton";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {setConsentOpen} from "../../../../store/reducers/modals/actions";
import {useTranslation} from "react-i18next";
import {
    setAcceptedConsentIds,
} from "../../../../store/reducers/appointmentFrameReducer/actions";
import {TCallback} from "../../../../types/types";
import Consent from "./Consent/Consent";
import {useMediaQuery, useTheme} from "@mui/material";

const CustomerConsents: React.FC<{onNext: TCallback, onPrev?: TCallback}> = ({onNext, onPrev}) => {
    const {isConsentOpen} = useSelector((state: RootState) => state.modals);
    const {isConsentsLoading, consents, isAppointmentSaving} = useSelector((state: RootState) => state.appointmentFrame);
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("mdl"));

    const onClose = () => dispatch(setConsentOpen(false));

    const onAcknowledge = () => {
        dispatch(setAcceptedConsentIds(consents.map(({id}) => id)));
        onNext();
        onClose();
    }

    const onChange = () => {
        onClose()
        onPrev && onPrev()
    }

    return (
        <BaseModal
            width={600}
            open={isConsentOpen}
            onClose={onClose}
        >
            <DialogTitle onClose={onClose}></DialogTitle>
            <DialogContent>
                {consents.map(consent => <Consent consent={consent} key={consent.id}/>)}
            </DialogContent>
            <DialogActions style={{paddingLeft: 72, paddingRight: 72}}>
                {isSm ? <React.Fragment>
                        <LoadingButton
                            fullWidth
                            loading={isAppointmentSaving || isConsentsLoading}
                            onClick={onAcknowledge}
                            color="primary"
                            variant="contained">
                            {t("I acknowledge")}
                        </LoadingButton>
                        <LoadingButton
                            loading={isAppointmentSaving || isConsentsLoading}
                            fullWidth
                            onClick={onChange}
                            variant="outlined"
                            color="primary">
                            {t("Change selections")}
                        </LoadingButton>
                    </React.Fragment>
                    : <React.Fragment>
                        <LoadingButton
                            loading={isAppointmentSaving || isConsentsLoading}
                            fullWidth
                            onClick={onChange}
                            variant="outlined"
                            color="primary">
                            {t("Change selections")}
                        </LoadingButton>
                        <LoadingButton
                            fullWidth
                            loading={isAppointmentSaving || isConsentsLoading}
                            onClick={onAcknowledge}
                            color="primary"
                            variant="contained">
                            {t("I acknowledge")}
                        </LoadingButton>
                    </React.Fragment>}

            </DialogActions>
        </BaseModal>
    );
};

export default CustomerConsents;