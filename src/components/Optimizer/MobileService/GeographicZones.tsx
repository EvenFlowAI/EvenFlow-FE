import React, {useState} from 'react';
import {Button, styled} from "@material-ui/core";
import EligibleCustomerSegment from "./EligibleCustomerSegment";
import Zones from "./Zones/Zones";
import {useModal} from "../../../utils/hooks";
import RemoveGeographicZone from "../../Modals/RemoveGeographicZone/RemoveGeographicZone";
import {TZone} from "../../../store/reducers/mobileService/types";
import AddEditGeographicZone from "../../Modals/EditGeographicZone/AddEditGeographicZone";
import RemoveZipCode from "../../Modals/RemoveZipCode/RemoveZipCode";

const TabHeaderWrapper = styled('div')({
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: '24px 32px',
})

const ButtonsWrapper = styled('div')({
    display: 'flex',
    alignItems: 'center',
})

const Title = styled('div')({
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 8,
})

const TextButton = styled(Button)({
    textTransform: 'none',
    fontSize: 18,
    fontWeight: 'normal',
    color: '#252733',
    marginRight: 20,
})

const ZonesWrapper = styled('div')({
    display: 'flex',
    alignItems: 'flex-start',
    '& > div': {
        marginRight: 24,
    }
})

const GeographicZones = () => {
    const [currentZone, setCurrentZone] = useState<TZone|null>(null);
    const [currentZip, setCurrentZip] = useState<string>('');
    const {onOpen: onRemoveZoneOpen, onClose: onRemoveZoneClose, isOpen: isRemoveZoneOpen} = useModal();
    const {onOpen: onAddZoneOpen, onClose: onAddZoneClose, isOpen: isAddZoneOpen} = useModal();
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
            <RemoveGeographicZone open={isRemoveZoneOpen} zone={currentZone} onClose={onRemoveZoneClose}/>
            <AddEditGeographicZone
                open={isEditZoneOpen}
                onClose={onEditZoneClose}
                isEdit
                zone={currentZone}
                onRemoveZipOpen={onRemoveZipOpen}
                setCurrentZip={setCurrentZip}
                currentZip={currentZip}
            />
            <AddEditGeographicZone open={isAddZoneOpen} onClose={onAddZoneClose} isEdit={false}/>
            <RemoveZipCode open={isRemoveZipOpen} onClose={onRemoveZipClose} zone={currentZone} zip={currentZip}/>
        </div>
    );
};

export default GeographicZones;