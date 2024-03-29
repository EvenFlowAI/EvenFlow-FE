import React from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../BaseModal/BaseModal";
import {LoadingButton} from "../../../buttons/LoadingButton/LoadingButton";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {setConsentOpen} from "../../../../store/reducers/modals/actions";
import {useTranslation} from "react-i18next";
import {
    setAcceptedConsentIds,
    setCurrentFrameScreen,
    setWelcomeScreenView
} from "../../../../store/reducers/appointmentFrameReducer/actions";
import {TCallback} from "../../../../types/types";
import Consent from "./Consent/Consent";
import {Routes} from "../../../../routes/constants";
import {useHistory, useParams} from "react-router-dom";

const CustomerConsents: React.FC<{onNext: TCallback, onPrev?: TCallback}> = ({onNext, onPrev}) => {
    const {isConsentOpen} = useSelector((state: RootState) => state.modals);
    const {isConsentsLoading, consents} = useSelector((state: RootState) => state.appointmentFrame);
    const {customerLoadedData} = useSelector((state: RootState) => state.appointment)
    const {firstScreenOptions} = useSelector((state: RootState) => state.serviceTypes)
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const history = useHistory();
    const {id} = useParams<{id: string}>();

    const onClose = () => dispatch(setConsentOpen(false));

    const onAcknowledge = () => {
        dispatch(setAcceptedConsentIds(consents.map(({id}) => id)));
        onNext();
        onClose();
    }

    const onChange = () => {
        onClose()
        if (customerLoadedData?.isUpdating) {
            dispatch(setCurrentFrameScreen('manageAppointment'))
        } else {
            if (firstScreenOptions.length) {
                dispatch(setWelcomeScreenView('serviceSelect'));
                history.push(Routes.EndUser.Welcome + "/" + id + "?frame=1");
            } else {
                dispatch(setCurrentFrameScreen('serviceNeeds'))
                history.push(Routes.EndUser.AppointmentFrame.replace(":id", id));
            }
        }
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
                <LoadingButton
                    loading={isConsentsLoading}
                    fullWidth
                    onClick={onChange}
                    variant="outlined"
                    color="primary">
                    {t("Change selections")}
                </LoadingButton>
                <LoadingButton
                    fullWidth
                    loading={isConsentsLoading}
                    onClick={onAcknowledge}
                    color="primary"
                    variant="contained">
                    {t("I acknowledge")}
                </LoadingButton>
            </DialogActions>
        </BaseModal>
    );
};

export default CustomerConsents;