import React from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../../components/modals/BaseModal/BaseModal";
import {DialogProps} from "../../../../components/modals/BaseModal/types";
import {useSCs} from "../../../../hooks/useSCs/useSCs";
import {useDispatch, useSelector} from "react-redux";
import {useException} from "../../../../hooks/useException/useException";
import {useMessage} from "../../../../hooks/useMessage/useMessage";
import {RootState} from "../../../../store/rootReducer";
import {useSelectedPod} from "../../../../hooks/useSelectedPod/useSelectedPod";

const EditCustomerConsentModal: React.FC<DialogProps & { id: number }> = ({open, onClose, id}) => {
    const {advisorsList} = useSelector(({scEmployees}: RootState) => scEmployees);
    const {scRequestsShort: serviceRequests} = useSelector(({serviceRequests}: RootState) => serviceRequests);
    const {makesModels} = useSelector(({vehicleDetails}: RootState) => vehicleDetails);
    const {mobileZonesShort} = useSelector(({mobileService}: RootState) => mobileService);
    const {svZonesShort} = useSelector(({serviceValet}: RootState) => serviceValet);
    const {optionsShort} = useSelector(({transportation}: RootState) => transportation);
    const {selectedSC} = useSCs();
    const {selectedPod} = useSelectedPod();
    const dispatch = useDispatch();
    const showError = useException();
    const showMessage = useMessage();

    const onCancel = () => {
        onClose()
    }

    return (
        <BaseModal open={open} width={940} onClose={onCancel}>
            <DialogTitle onClose={onCancel}>
                {id ? "Edit" : "Add"} Customer Consent
            </DialogTitle>
            <DialogContent></DialogContent>
            <DialogActions></DialogActions>
        </BaseModal>
    );
};

export default EditCustomerConsentModal;