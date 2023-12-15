import React from 'react';
import {TitleContainer} from "../../../components/Content/TitleContainer/TitleContainer";
import {bookingFlowRoot} from "../../../components/Optimizer/utils";
import {EditEmailRequirementModal} from "../../../features/ScreenSettings/EditEmailRequirementModal/EditEmailRequirementModal";
import {useModal} from "../../../utils/hooks";
import {ScreenSettings} from "../../../features/ScreenSettings/ScreenSettings";

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