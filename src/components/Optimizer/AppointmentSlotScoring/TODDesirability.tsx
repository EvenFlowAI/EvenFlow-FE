import React from "react";
import {DemandSegmentsDesirability} from "./DemandSegmentsDesirability";
import {AppointmentSlotsDesirability} from "./AppointmentSlotsDesirability";

export const TODDesirability = () => {
    return <div>
        <AppointmentSlotsDesirability />
        <DemandSegmentsDesirability />
    </div>
}