import React from "react";
import {TimeWindows} from "./TimeWindows";
import {DemandSegments} from "./DemandSegments";



export const ScheduledAppointments = () => {
    return <div>
        <TimeWindows />
        <div style={{padding: 10}} />
        <DemandSegments />
    </div>
}