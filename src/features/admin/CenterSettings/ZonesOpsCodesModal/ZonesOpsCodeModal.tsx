import React, {useEffect, useState} from 'react';
import {DialogTitle, BaseModal, DialogContent} from "../../../../components/modals/BaseModal/BaseModal";
import {Button} from "@material-ui/core";
import {ButtonsWrapper, TopWrapper} from "../styles";
import {DialogProps} from "../../../../components/modals/BaseModal/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {ISVZoneDefaultOpsCode, TZonesOpsCodesRequest} from "../../../../store/reducers/capacityServiceValet/types";
import {loadAllAssignedServiceRequests} from "../../../../store/reducers/serviceRequests/actions";
import {ZonesWrapper} from "./styles";
import {useException} from "../../../../hooks/useException/useException";
import {useSCs} from "../../../../hooks/useSCs/useSCs";
import {loadServiceValetZones} from "../../../../store/reducers/serviceValet/actions";
import {Loading} from "../../../../components/wrappers/Loading/Loading";
import OpsCodeInput from "./OpsCodeInput/OpsCodeInput";
import {updateServiceValetZonesOpsCodes} from "../../../../store/reducers/capacityServiceValet/actions";

const ZonesOpsCodeModal: React.FC<DialogProps> = ({onClose, open}) => {
    const {centerSettings} = useSelector((state: RootState) => state.capacityServiceValet);
    const {zones, isLoading} = useSelector((state: RootState) => state.serviceValet);
    const [zonesOpsCodes, setZonesOpsCodes] = useState<ISVZoneDefaultOpsCode[]>([])
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const showError = useException();

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadAllAssignedServiceRequests(selectedSC.id))
            dispatch(loadServiceValetZones(selectedSC.id))
        }
    }, [selectedSC])

    useEffect(() => {
        if (centerSettings?.zoneServiceRequests && open) {
            setZonesOpsCodes(centerSettings.zoneServiceRequests)
        }
    }, [centerSettings, open])


    const onCancel = () => {
        setZonesOpsCodes(centerSettings?.zoneServiceRequests ?? [])
        onClose();
    }

    const onSave = () => {
        if (selectedSC && zonesOpsCodes.length) {
            const data: TZonesOpsCodesRequest[] = zonesOpsCodes
                .map(el => ({zoneId: el.zone.id, serviceRequestId: el.serviceRequest.id}))
            dispatch(updateServiceValetZonesOpsCodes(selectedSC.id, data, onCancel, showError))
        }
    }

    return <BaseModal onClose={onCancel} open={open} width={425}>
        <DialogTitle>
            <TopWrapper>
                Service Valet Ops Code
                <ButtonsWrapper>
                    <Button variant="text" onClick={onCancel} color="secondary" style={{textTransform: 'none'}}>Cancel</Button>
                    <Button variant="text" onClick={onSave} color="primary" style={{textTransform: 'none'}}>Save</Button>
                </ButtonsWrapper>
            </TopWrapper>
        </DialogTitle>
        <DialogContent>
            <ZonesWrapper>
            {isLoading
                ? <Loading/>
            : [...zones]
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map(zone => (
                        <OpsCodeInput
                            key={zone.id}
                            zone={zone}
                            zonesOpsCodes={zonesOpsCodes}
                            setZonesOpsCodes={setZonesOpsCodes}/>
                    ))}
            </ZonesWrapper>
        </DialogContent>
    </BaseModal>
};

export default ZonesOpsCodeModal;