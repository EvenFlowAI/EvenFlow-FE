import React from 'react';
import {DenseTableWithPadding} from "../../../components/styled/DemandTable";
import {Radio, TableBody, TableHead, TableRow} from "@mui/material";
import {StyledTableCell} from "./styles";

export enum ERequestDemandMethod {
    AppointmentSlots, ScheduledHours
}

export enum EPredictedDemandMethod {
    Predicted, Probability
}

export type TPredictedDemandMethod = {
    type: EPredictedDemandMethod;
    configured: boolean;
}

export enum EDemandPredictionType {
    EvenFlowAppointments, ExEvenFlowAppointments, OpenROs
}

export type TDemandActivity = {
    type: EDemandPredictionType;
    isRequestOn: boolean;
    isPredictionOn: boolean;
}

export interface IDemandPrediction {
    serviceBookName: string;
    serviceBookId?: number;
    requestDemandMethod: ERequestDemandMethod;
    predictedDemandMethod: TPredictedDemandMethod;
    demandActivity: TDemandActivity[];
}

const mockData: IDemandPrediction[] = []

const DemandPredictionTable = () => {
    return (
        <DenseTableWithPadding>
            <TableHead>
                <TableRow>
                    <StyledTableCell key="serviceBook">
                        Service Book
                    </StyledTableCell>
                    <StyledTableCell key="Request">
                        Request Demand Method
                    </StyledTableCell>
                    <StyledTableCell key="Predicted">
                        Predicted Demand Method
                    </StyledTableCell>
                    <StyledTableCell key="type">
                       Demand Type
                    </StyledTableCell>
                    <StyledTableCell key="RequestStatus">
                        Request Demand Status
                    </StyledTableCell>
                    <StyledTableCell key="PredictedStatus">
                        Predicted Demand Status
                    </StyledTableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                    <StyledTableCell key="serviceBook"></StyledTableCell>
                </TableRow>
            </TableBody>
        </DenseTableWithPadding>
    );
};

export default DemandPredictionTable;