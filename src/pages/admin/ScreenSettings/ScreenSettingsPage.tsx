import React from 'react';
import {TitleContainer} from "../../../components/TitleContainer/TitleContainer";
import {bookingFlowRoot} from "../../../config/constants";
import {EditEmailRequirementModal} from "../../../features/admin/ScreenSettings/EditEmailRequirementModal/EditEmailRequirementModal";
import {useModal} from "../../../utils/hooks";
import {ScreenSettings} from "../../../features/admin/ScreenSettings/ScreenSettings";

const ScreenSettingsPage = () => {
    const {onOpen: onEmailEditOpen, isOpen: isEmailEditOpen, onClose: onEmailEditClose} = useModal();

    return (
        <>
            <TitleContainer title="Screen Settings" pad parent={bookingFlowRoot} />
            <ScreenSettings onEmailEditOpen={onEmailEditOpen}/>
            <EditEmailRequirementModal open={isEmailEditOpen} onClose={onEmailEditClose}/>
        </>
    );
};

export default ScreenSettingsPage;