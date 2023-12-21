import React, {useState} from "react";
import {IServiceCenterForm} from "../../../store/reducers/serviceCenters/types";
import {CreateServiceCenterModal} from "../../../features/admin/ServiceCenters";
import {TitleContainer} from "../../../components/TitleContainer/TitleContainer";
import {Titles} from "../../../config/constants";
import ServiceCentersTable from "../../../features/admin/ServiceCenters/ServiceCentersTable/ServiceCentersTable";
import {ServiceCenterActions} from "../../../features/admin/ServiceCenters";
import {useModal} from "../../../hooks/useModal/useModal";
import {useCurrentUser} from "../../../hooks/useCurrentUser/useCurrentUser";

export const ServiceCenters = () => {
    const [editedItem, setEditedItem] = useState<IServiceCenterForm|undefined>();
    const currentUser = useCurrentUser();
    const {onOpen, onClose, isOpen} = useModal();

    return <>
        <TitleContainer title={Titles.ServiceCenters} actions={<ServiceCenterActions/>} pad />
        <ServiceCentersTable editedItem={editedItem} setEditedItem={setEditedItem} onOpen={onOpen}/>
        <CreateServiceCenterModal
            readOnly={currentUser?.isSuperUser}
            open={isOpen}
            onClose={onClose}
            payload={editedItem} />
    </>
}