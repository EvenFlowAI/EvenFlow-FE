import React from "react";
import {TimeWindows} from "./TimeWindows";
import {DemandSegments} from "./DemandSegments";
import {Caption} from "../../UI/Caption";
import {Routes} from "../../../config/routes";
import {TextLink} from "../../UI/TextLink";
import {styled} from "@material-ui/core";


const TableContainer = styled("div")({
    overflowX: "auto"
});


export const ScheduledAppointments = () => {
    return <div>
        <TableContainer><TimeWindows/></TableContainer>
        <div style={{padding: 10}} />
        <TableContainer><DemandSegments/></TableContainer>
        <div style={{padding: 10}} />
        <Caption title={<>
            <span>You can change the number of demand segments on </span>
            <TextLink
                to={Routes.Optimizer.OptimizationWindows}>
                Optimization Windows
            </TextLink>
            <span> page</span>
        </>} />
    </div>
}