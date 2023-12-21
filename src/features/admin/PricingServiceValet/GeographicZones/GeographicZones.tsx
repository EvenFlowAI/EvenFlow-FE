import React, {useEffect, useState} from 'react';
import EligibleCustomerSegment from "../EligibleCustomerSegment/EligibleCustomerSegment";
import Zones from "../Zones/Zones";
import {useConfirm, useException, useMessage, useModal, useSCs} from "../../../../utils/hooks";
import {TZipCode, TZone} from "../../../../store/reducers/mobileService/types";
import AddEditGeographicZone from "../../../../components/modals/admin/EditGeographicZone/AddEditGeographicZone";
import RemoveZipCode from "../../../../components/modals/admin/RemoveZipCode/RemoveZipCode";
import {useDispatch} from "react-redux";
import {
    loadServiceValetZones,
    removeServiceValetZone,
    setCurrentZone
} from "../../../../store/reducers/serviceValet/actions";
import GeographicZonesButtons from "../../../../components/GeographicZonesButtons/GeographicZonesButtons";
import {EligibleTitle} from "../../../../components/styled/EligibleTitle";
import {GeographicZonesWrapper, TabHeaderWrapper} from "../../../../components/styled/GeographicZonesWrappers";

type TGeographicZonesProps = {
    onAddZoneOpen: () => void;
}

const GeographicZones: React.FC<TGeographicZonesProps> = ({ onAddZoneOpen }) => {
    const [selectedZone, setSelectedZone] = useState<TZone|null>(null);
    const [currentZip, setCurrentZip] = useState<TZipCode|null>(null);
    const {onOpen: onEditZoneOpen, onClose: onEditZoneClose, isOpen: isEditZoneOpen} = useModal();
    const {onOpen: onRemoveZipOpen, onClose: onRemoveZipClose, isOpen: isRemoveZipOpen} = useModal();

    const {selectedSC} = useSCs();
    const {askConfirm} = useConfirm();
    const dispatch = useDispatch();
    const showMessage = useMessage();
    const showError = useException();

    useEffect(() => {
        if (selectedSC) dispatch(loadServiceValetZones(selectedSC.id))
    }, [selectedSC])

    const onError = (err: string) => showError(err)

    const onSuccess = () => showMessage(`Zone removed`)

    const onRemove = () => {
        if (selectedZone?.id && selectedSC) {
            dispatch(setCurrentZone(null));
            dispatch(removeServiceValetZone(selectedZone.id, selectedSC.id, onSuccess, onError));
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
                <GeographicZonesButtons
                    selectedZone={selectedZone}
                    onAddZoneOpen={onAddZoneOpen}
                    onEditZoneOpen={onEditZoneOpen}
                    askRemove={askRemove}
                />
            </TabHeaderWrapper>
            <EligibleTitle>Eligible Customer Type</EligibleTitle>
            <GeographicZonesWrapper>
                <div style={{width: '30%'}}>
                    <EligibleCustomerSegment/>
                </div>
                <Zones
                    selectedZone={selectedZone}
                    setSelectedZone={setSelectedZone}
                    onRemoveZip={onRemoveZipOpen}
                    setCurrentZip={setCurrentZip}
                />
            </GeographicZonesWrapper>
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
            <RemoveZipCode open={isRemoveZipOpen} onClose={onRemoveZipClose} zone={selectedZone} zip={currentZip} serviceType="serviceValet"/>
        </div>
    );
};

export default GeographicZones;