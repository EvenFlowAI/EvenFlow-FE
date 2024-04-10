import React from 'react';
import {ProximityTable} from "../ProximityTable/ProximityTable";
import {TimeWindowsTable} from "./TimeWindowsTable/TimeWindowsTable";

const TimeWindows = () => {
    return (
        <div>
            <ProximityTable/>
            <TimeWindowsTable/>
        </div>
    );
};

export default TimeWindows;