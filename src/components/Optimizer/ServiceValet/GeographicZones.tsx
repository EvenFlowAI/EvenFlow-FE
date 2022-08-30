import React, {useEffect, useState} from 'react';
import {Button} from "@material-ui/core";
import EligibleCustomerSegment from "./EligibleCustomerSegment";
import Zones from "./Zones/Zones";
import {useModal, useSCs} from "../../../utils/hooks";
import RemoveGeographicZone from "../../Modals/RemoveGeographicZone/RemoveGeographicZone";
import {TZipCode, TZone} from "../../../store/reducers/mobileService/types";
import AddEditGeographicZone from "../../Modals/EditGeographicZone/AddEditGeographicZone";
import RemoveZipCode from "../../Modals/RemoveZipCode/RemoveZipCode";
import {TabHeaderWrapper, ButtonsWrapper, TextButton, Title, ZonesWrapper} from './styledComponents';
import {useDispatch, useSelector} from "react-redux";
import {loadServiceValetZones} from "../../../store/reducers/serviceValet/actions";
import {RootState} from "../../../store/rootReducer";

type TGeographicZonesProps = {
    onAddZoneOpen: () => void;
}

const GeographicZones: React.FC<TGeographicZonesProps> = ({ onAddZoneOpen }) => {
    const {currentZone} = useSelector((state: RootState) => state.serviceValet);
    const [selectedZone, setSelectedZone] = useState<TZone|null>(null);
    const [currentZip, setCurrentZip] = useState<TZipCode|null>(null);
    const {onOpen: onRemoveZoneOpen, onClose: onRemoveZoneClose, isOpen: isRemoveZoneOpen} = useModal();
    const {onOpen: onEditZoneOpen, onClose: onEditZoneClose, isOpen: isEditZoneOpen} = useModal();
    const {onOpen: onRemoveZipOpen, onClose: onRemoveZipClose, isOpen: isRemoveZipOpen} = useModal();

    const dispatch = useDispatch();
    const {selectedSC} = useSCs();

    useEffect(() => {
        if (selectedSC) dispatch(loadServiceValetZones(selectedSC.id))
    }, [selectedSC])

    return (
        <div>
            <TabHeaderWrapper>
                <ButtonsWrapper>
                    <TextButton variant="text" onClick={onEditZoneOpen} disabled={!selectedZone}>Edit</TextButton>
                    <TextButton variant="text" onClick={onRemoveZoneOpen} disabled={!selectedZone}>Remove</TextButton>
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
            <RemoveGeographicZone
                setZone={setSelectedZone}
                zone={selectedZone}
                open={isRemoveZoneOpen}
                onClose={onRemoveZoneClose}
                serviceType="serviceValet"
            />
            <AddEditGeographicZone
                serviceType="serviceValet"
                open={isEditZoneOpen}
                onClose={onEditZoneClose}
                isEdit
                zone={selectedZone}
                onRemoveZipOpen={onRemoveZipOpen}
                setCurrentZip={setCurrentZip}
                currentZip={currentZip}
            />
            <RemoveZipCode open={isRemoveZipOpen} onClose={onRemoveZipClose} zone={currentZone} zip={currentZip} serviceType="serviceValet"/>
        </div>
    );
};

export default GeographicZones;