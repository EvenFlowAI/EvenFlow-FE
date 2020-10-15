import React from "react";
import {TimeWindows} from "./TimeWindows";
import {DemandSegments} from "./DemandSegments";
import {Caption} from "../../UI/Caption";
import {Link} from "react-router-dom";
import {Routes} from "../../../config/routes";



export const ScheduledAppointments = () => {
    return <div>
        <TimeWindows />
        <div style={{padding: 10}} />
        <DemandSegments />
        <div style={{padding: 10}} />
        <Caption title={<>
            <span>You can change the number of demand segments on </span>
            <Link
                style={{fontWeight: "bold", color: "inherit"}}
                to={Routes.Optimizer.OptimizationWindows}>
                Optimization Windows
            </Link>
            <span> page</span>
        </>} />
    </div>
}