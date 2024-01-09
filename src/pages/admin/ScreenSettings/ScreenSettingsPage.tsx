import React from 'react';
import {TitleContainer} from "../../../components/wrappers/TitleContainer/TitleContainer";
import {bookingFlowRoot} from "../../../utils/constants";
import {EditEmailRequirementModal} from "../../../features/admin/ScreenSettings/EditEmailRequirementModal/EditEmailRequirementModal";
import {ScreenSettings} from "../../../features/admin/ScreenSettings/ScreenSettings";
import {useModal} from "../../../hooks/useModal/useModal";

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