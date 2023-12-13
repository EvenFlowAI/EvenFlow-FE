import React, {useState} from "react";
import {IServiceCenterForm} from "../../store/reducers/serviceCenters/types";
import {useCurrentUser, useModal} from "../../utils/hooks";
import {CreateServiceCenterModal} from "./CreateServiceCenterModal/CreateServiceCenterModal";
import {TitleContainer} from "../../components/Content/TitleContainer/TitleContainer";
import {Titles} from "../../config/constants";
import ServiceCentersTable from "./ServiceCentersTable/ServiceCentersTable";

export const ServiceCenters = () => {
    const [editedItem, setEditedItem] = useState<IServiceCenterForm|undefined>();
    const currentUser = useCurrentUser();
    const {onOpen, onClose, isOpen} = useModal();

    return <>
        <TitleContainer title={Titles.ServiceCenters} actions pad />
        <ServiceCentersTable editedItem={editedItem} setEditedItem={setEditedItem} onOpen={onOpen}/>
        <CreateServiceCenterModal
            readOnly={currentUser?.isSuperUser}
            open={isOpen}
            onClose={onClose}
            payload={editedItem} />
    </>
}