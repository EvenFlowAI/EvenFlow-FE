import React from "react";
import {TitleContainer} from "../../../components/wrappers/TitleContainer/TitleContainer";
import {capacityManagementRoot} from "../../../utils/constants";
import {ButtonContainer} from "./styles";
import CapacitySettingsTable from "../../../features/admin/CapacitySettingsTable/CapacitySettingsTable";
import RecalculateCapacity from "../../../components/buttons/RecalculateCapacity/RecalculateCapacity";

export const CapacitySettings = () => {
    return <div>
        <TitleContainer title="Capacity Settings" pad parent={capacityManagementRoot} />
        <ButtonContainer>
            <RecalculateCapacity/>
        </ButtonContainer>
        <CapacitySettingsTable/>
    </div>
}