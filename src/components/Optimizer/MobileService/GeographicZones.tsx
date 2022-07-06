import React, {useState} from 'react';
import {Button} from "@material-ui/core";
import EligibleCustomerSegment from "./EligibleCustomerSegment";
import Zones from "./Zones/Zones";
import {useModal} from "../../../utils/hooks";
import RemoveGeographicZone from "../../Modals/RemoveGeographicZone/RemoveGeographicZone";
import {TZone} from "../../../store/reducers/mobileService/types";
import AddEditGeographicZone from "../../Modals/EditGeographicZone/AddEditGeographicZone";
import RemoveZipCode from "../../Modals/RemoveZipCode/RemoveZipCode";
import {TabHeaderWrapper, ButtonsWrapper, TextButton, Title, ZonesWrapper} from './styledComponents';

type TGeographicZonesProps = {
    onAddZoneOpen: () => void;
}

const GeographicZones: React.FC<TGeographicZonesProps> = ({ onAddZoneOpen }) => {
    const [currentZone, setCurrentZone] = useState<TZone|null>(null);
    const [currentZip, setCurrentZip] = useState<string>('');
    const {onOpen: onRemoveZoneOpen, onClose: onRemoveZoneClose, isOpen: isRemoveZoneOpen} = useModal();
    const {onOpen: onEditZoneOpen, onClose: onEditZoneClose, isOpen: isEditZoneOpen} = useModal();
    const {onOpen: onRemoveZipOpen, onClose: onRemoveZipClose, isOpen: isRemoveZipOpen} = useModal();

    return (
        <div>
            <TabHeaderWrapper>
                <ButtonsWrapper>
                    <TextButton variant="text" onClick={onEditZoneOpen} disabled={!currentZone}>Edit</TextButton>
                    <TextButton variant="text" onClick={onRemoveZoneOpen} disabled={!currentZone}>Remove</TextButton>
                    <Button onClick={onAddZoneOpen} variant="contained" color="primary" style={{width: 160}}>Add Zone</Button>
                </ButtonsWrapper>
            </TabHeaderWrapper>
            <Title>Eligible Customer Type</Title>
            <ZonesWrapper>
                <div style={{width: '30%'}}>
                    <EligibleCustomerSegment/>
                </div>
                <Zones
                    currentZone={currentZone}
                    setCurrentZone={setCurrentZone}
                    onRemoveZip={onRemoveZipOpen}
                    setCurrentZip={setCurrentZip}
                />
            </ZonesWrapper>
            <RemoveGeographicZone open={isRemoveZoneOpen} zone={currentZone} onClose={onRemoveZoneClose} serviceType="mobileService"/>
            <AddEditGeographicZone
                serviceType="mobileService"
                open={isEditZoneOpen}
                onClose={onEditZoneClose}
                isEdit
                zone={currentZone}
                onRemoveZipOpen={onRemoveZipOpen}
                setCurrentZip={setCurrentZip}
                currentZip={currentZip}
            />
            <RemoveZipCode open={isRemoveZipOpen} onClose={onRemoveZipClose} zone={currentZone} zip={currentZip} serviceType="mobileService"/>
        </div>
    );
};

export default GeographicZones;