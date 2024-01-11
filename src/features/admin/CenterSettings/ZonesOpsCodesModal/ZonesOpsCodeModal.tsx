import React, {useEffect, useState} from 'react';
import {DialogTitle, BaseModal, DialogContent} from "../../../../components/modals/BaseModal/BaseModal";
import {Button} from "@mui/material";
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
    const [formChecked, setFormChecked] = useState<boolean>(false);
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
        setFormChecked(false)
        setZonesOpsCodes(centerSettings?.zoneServiceRequests ?? [])
        onClose();
    }

    const onSave = () => {
        setFormChecked(true)
        if (selectedSC) {
            if (zonesOpsCodes.length) {
                const data: TZonesOpsCodesRequest[] = zonesOpsCodes
                    .map(el => ({zoneId: el.zone.id, serviceRequestId: el.serviceRequest.id}))
                dispatch(updateServiceValetZonesOpsCodes(selectedSC.id, data, onCancel, showError))
            } else {
                showError("All Service Valet Zones should have assigned Ops Code")
            }
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
                            formChecked={formChecked}
                            setFormChecked={setFormChecked}
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