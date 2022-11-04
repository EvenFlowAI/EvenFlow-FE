import React, {useEffect, useState} from 'react';
import {Button} from "@material-ui/core";
import EligibleCustomerSegment from "./EligibleCustomerSegment";
import Zones from "./Zones/Zones";
import {useConfirm, useException, useMessage, useModal, useSCs} from "../../../utils/hooks";
import {TZipCode, TZone} from "../../../store/reducers/mobileService/types";
import AddEditGeographicZone from "../../Modals/EditGeographicZone/AddEditGeographicZone";
import RemoveZipCode from "../../Modals/RemoveZipCode/RemoveZipCode";
import {ButtonsWrapper, TabHeaderWrapper, TextButton, Title, ZonesWrapper} from './styledComponents';
import {useDispatch} from "react-redux";
import {loadMobServiceZones, removeMobServiceZone} from "../../../store/reducers/mobileService/actions";
import {setCurrentZone} from "../../../store/reducers/serviceValet/actions";

type TGeographicZonesProps = {
    onAddZoneOpen: () => void;
}

const GeographicZones: React.FC<TGeographicZonesProps> = ({ onAddZoneOpen }) => {
    const [currentZip, setCurrentZip] = useState<TZipCode|null>(null);
    const [selectedZone, setSelectedZone] = useState<TZone|null>(null);
    const {onOpen: onEditZoneOpen, onClose: onEditZoneClose, isOpen: isEditZoneOpen} = useModal();
    const {onOpen: onRemoveZipOpen, onClose: onRemoveZipClose, isOpen: isRemoveZipOpen} = useModal();
    const {selectedSC} = useSCs();
    const {askConfirm} = useConfirm();
    const dispatch = useDispatch();
    const showMessage = useMessage();
    const showError = useException();

    useEffect(() => {
        if (selectedSC) dispatch(loadMobServiceZones(selectedSC.id))
    }, [selectedSC])

    const onError = (err: string) => showError(err)

    const onSuccess = () => showMessage(`Zone removed`)

    const onRemove = () => {
        if (selectedZone?.id && selectedSC) {
            dispatch(setCurrentZone(null));
            dispatch(removeMobServiceZone(selectedZone.id, selectedSC.id, onSuccess, onError));
            setSelectedZone(null);
        }
    }

    const askRemove = () => {
        if (selectedZone) {
            askConfirm({
                onConfirm: onRemove,
                isRemove: true,
                title: `Please confirm you want to remove Zone ${selectedZone.name}`,
            });
        }
    }

    return (
        <div>
            <TabHeaderWrapper>
                <ButtonsWrapper>
                    <TextButton variant="text" onClick={onEditZoneOpen} disabled={!selectedZone}>Edit</TextButton>
                    <TextButton variant="text" onClick={askRemove} disabled={!selectedZone}>Remove</TextButton>
                    <Button onClick={onAddZoneOpen} variant="contained" color="primary" style={{width: 160}}>Add Zone</Button>
                </ButtonsWrapper>
            </TabHeaderWrapper>
            <Title>Eligible Customer Type</Title>
            <ZonesWrapper>
                <div style={{width: '30%'}}>
                    <EligibleCustomerSegment/>
                </div>
                <Zones
                    selectedZone={selectedZone}
                    setSelectedZone={setSelectedZone}
                    onRemoveZip={onRemoveZipOpen}
                    setCurrentZip={setCurrentZip}
                />
            </ZonesWrapper>
            <AddEditGeographicZone
                serviceType="mobileService"
                open={isEditZoneOpen}
                onClose={onEditZoneClose}
                isEdit
                zone={selectedZone}
                onRemoveZipOpen={onRemoveZipOpen}
                setCurrentZip={setCurrentZip}
                currentZip={currentZip}
            />
            <RemoveZipCode open={isRemoveZipOpen} zone={selectedZone} onClose={onRemoveZipClose} zip={currentZip} serviceType="mobileService"/>
        </div>
    );
};

export default GeographicZones;