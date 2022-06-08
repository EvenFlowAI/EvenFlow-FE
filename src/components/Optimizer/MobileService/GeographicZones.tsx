import React, {useState} from 'react';
import {Button, styled} from "@material-ui/core";
import EligibleCustomerSegment from "./EligibleCustomerSegment";
import Zones from "./Zones/Zones";
import {useModal} from "../../../utils/hooks";
import RemoveGeographicZone from "../../Modals/RemoveGeographicZone/RemoveGeographicZone";
import {TZone} from "../../../store/reducers/mobileService/types";
import AddEditGeographicZone from "../../Modals/EditGeographicZone/AddEditGeographicZone";

const TabHeaderWrapper = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 32px',
})

const ButtonsWrapper = styled('div')({
    display: 'flex',
    alignItems: 'center',
})

const Title = styled('div')({
    fontSize: 24,
    fontWeight: "bold",
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
    const {onOpen: onRemoveOpen, onClose: onRemoveClose, isOpen: isRemoveOpen} = useModal();
    const {onOpen: onAddZoneOpen, onClose: onAddZoneClose, isOpen: isAddZoneOpen} = useModal();
    const {onOpen: onEditZoneOpen, onClose: onEditZoneClose, isOpen: isEditZoneOpen} = useModal();

    return (
        <div>
            <TabHeaderWrapper>
                <Title>Eligible Customer Type</Title>
                <ButtonsWrapper>
                    <TextButton variant="text" onClick={onEditZoneOpen} disabled={!currentZone}>Edit</TextButton>
                    <TextButton variant="text" onClick={onRemoveOpen} disabled={!currentZone}>Remove</TextButton>
                    <Button onClick={onAddZoneOpen} variant="contained" color="primary" style={{width: 160}}>Add Zone</Button>
                </ButtonsWrapper>
            </TabHeaderWrapper>
            <ZonesWrapper>
                <div style={{width: '30%'}}>
                    <EligibleCustomerSegment/>
                </div>
                <Zones currentZone={currentZone} setCurrentZone={setCurrentZone}/>
            </ZonesWrapper>
            <RemoveGeographicZone open={isRemoveOpen} zone={currentZone} onClose={onRemoveClose}/>
            <AddEditGeographicZone open={isEditZoneOpen} onClose={onEditZoneClose} isEdit zone={currentZone}/>
            <AddEditGeographicZone open={isAddZoneOpen} onClose={onAddZoneClose} isEdit={false}/>
        </div>
    );
};

export default GeographicZones;