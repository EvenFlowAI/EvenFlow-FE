import React from "react";
import {DemandSegmentsDesirability} from "./DemandSegmentsDesirability/DemandSegmentsDesirability";
import {AppointmentSlotsDesirability} from "./AppointmentSlotsDesirability/AppointmentSlotsDesirability";

export const TimeOfDayDesirability = () => {
    return <div>
        <AppointmentSlotsDesirability />
        <DemandSegmentsDesirability />
    </div>
}