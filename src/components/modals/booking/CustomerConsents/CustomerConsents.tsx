import React from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../BaseModal/BaseModal";
import {LoadingButton} from "../../../buttons/LoadingButton/LoadingButton";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {setConsentOpen} from "../../../../store/reducers/modals/actions";
import {useTranslation} from "react-i18next";
import {setAcceptedConsentIds} from "../../../../store/reducers/appointmentFrameReducer/actions";
import {TCallback} from "../../../../types/types";

const CustomerConsents: React.FC<{onNext: TCallback, onPrev?: TCallback}> = ({onNext, onPrev}) => {
    const {isConsentOpen} = useSelector((state: RootState) => state.modals);
    const {isAppointmentSaving, consents} = useSelector((state: RootState) => state.appointmentFrame);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onClose = () => dispatch(setConsentOpen(false));

    const onAccept = () => {
        dispatch(setAcceptedConsentIds(consents.map(({id}) => id)));
        onNext()
    }

    const onDecline = () => {
        // todo logic, modal title and content
        onClose()
        onPrev && onPrev()
    }

    return (
        <BaseModal
            width={600}
            open={isConsentOpen}
            onClose={onDecline}
        >
            <DialogTitle onClose={onDecline}>
                {t("Do you accept?")}
            </DialogTitle>
            <DialogContent>

            </DialogContent>
            <DialogActions>
                <LoadingButton
                    loading={isAppointmentSaving}
                    fullWidth
                    onClick={onDecline}
                    variant="outlined"
                    color="primary">
                    {t("Decline")}
                </LoadingButton>
                <LoadingButton
                    fullWidth
                    loading={isAppointmentSaving}
                    onClick={onAccept}
                    color="primary"
                    variant="contained">
                    {t("Accept")}
                </LoadingButton>
            </DialogActions>
        </BaseModal>
    );
};

export default CustomerConsents;