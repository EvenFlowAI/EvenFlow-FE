import React from 'react';
import {DenseTableWithPadding} from "../../../components/styled/DemandTable";
import {Radio, Switch, TableBody, TableHead, TableRow} from "@mui/material";
import {
    StyledTableCell,
    RadioGroupStyled,
    RadioBtn,
    SubCellWhite,
    SubCellGrey,
    SwitchWrapperWhite,
    SwitchWrapperGrey
} from "./styles";

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

const mockData: IDemandPrediction[] = [
    {
        serviceBookName: 'Service Book Name',
        requestDemandMethod: ERequestDemandMethod.AppointmentSlots,
        predictedDemandMethod:  {
            type: EPredictedDemandMethod.Predicted,
            configured: true,
        },
        demandActivity: [
            {
                type: EDemandPredictionType.EvenFlowAppointments,
                isRequestOn: true,
                isPredictionOn: false,
            }, {
                type: EDemandPredictionType.ExEvenFlowAppointments,
                isRequestOn: false,
                isPredictionOn: true,
            }, {
                type: EDemandPredictionType.OpenROs,
                isRequestOn: false,
                isPredictionOn: true,
            },
        ]
    },
    // {
    //     serviceBookName: 'Express',
    //     requestDemandMethod: ERequestDemandMethod.ScheduledHours,
    //     predictedDemandMethod:  {
    //         type: EPredictedDemandMethod.Probability,
    //         configured: false,
    //     },
    //     demandActivity: [
    //         {
    //             type: EDemandPredictionType.EvenFlowAppointments,
    //             isRequestOn: false,
    //             isPredictionOn: true,
    //         }, {
    //             type: EDemandPredictionType.ExEvenFlowAppointments,
    //             isRequestOn: true,
    //             isPredictionOn: false,
    //         }, {
    //             type: EDemandPredictionType.OpenROs,
    //             isRequestOn: true,
    //             isPredictionOn: false,
    //         },
    //     ]
    // }
]

const DemandPredictionTable = () => {

    const handleChangeRequestDemandMethod = (idOrName: number|string) =>  (e: React.ChangeEvent<HTMLInputElement>) => {
        // todo logic
    }

    const handleChangePredictedDemandMethod = (idOrName: number|string) =>  (e: React.ChangeEvent<HTMLInputElement>) => {
        // todo logic
    }

    const handleSwitch = (idOrName: number|string, type: EDemandPredictionType, requestType: "request"|"prediction") => async (e: any, value: boolean) => {
       // todo logic
    }


    return (
        <DenseTableWithPadding>
            <TableHead>
                <TableRow>
                    <StyledTableCell key="serviceBook" style={{textTransform: 'capitalize'}}>
                        Service Book
                    </StyledTableCell>
                    <StyledTableCell key="Request" style={{textTransform: 'capitalize'}}>
                        Request Demand Method
                    </StyledTableCell>
                    <StyledTableCell key="Predicted" style={{textTransform: 'capitalize'}}>
                        Predicted Demand Method
                    </StyledTableCell>
                    <StyledTableCell key="type" style={{textTransform: 'capitalize'}}>
                       Demand Type
                    </StyledTableCell>
                    <StyledTableCell key="RequestStatus" style={{textTransform: 'capitalize'}}>
                        Request Demand Status
                    </StyledTableCell>
                    <StyledTableCell key="PredictedStatus" style={{textTransform: 'capitalize'}}>
                        Predicted Demand Status
                    </StyledTableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {mockData.map(item => {
                    return  <TableRow key={item.serviceBookId ?? item.serviceBookName}>
                        <StyledTableCell
                            key={item.serviceBookId ?? item.serviceBookName}
                            rowSpan={3}>
                            {item.serviceBookName}
                        </StyledTableCell>
                        <StyledTableCell
                            key="requestDemandMethod"
                            rowSpan={3}>
                                <RadioGroupStyled
                                    value={item.requestDemandMethod}
                                    onChange={handleChangeRequestDemandMethod(item.serviceBookId ?? item.serviceBookName)}
                                    aria-labelledby="demo-controlled-radio-buttons-group"
                                    name="controlled-radio-buttons-group">
                                    <RadioBtn
                                        value={ERequestDemandMethod.AppointmentSlots}
                                        control={<Radio color="primary" size="small"/>}
                                        label="Appointment Slots" />
                                    <RadioBtn
                                        value={ERequestDemandMethod.ScheduledHours}
                                        control={<Radio color="primary" size="small"/>}
                                        label="Scheduled Hours" />
                                </RadioGroupStyled>
                        </StyledTableCell>
                        <StyledTableCell key="predictedDemandMethod" rowSpan={3}>
                            <RadioGroupStyled
                                value={item.predictedDemandMethod.type}
                                onChange={handleChangePredictedDemandMethod(item.serviceBookId ?? item.serviceBookName)}
                                aria-labelledby="demo-controlled-radio-buttons-group"
                                name="controlled-radio-buttons-group">
                                <RadioBtn
                                    value={EPredictedDemandMethod.Predicted}
                                    control={<Radio color="primary" size="small"/>}
                                    label="Predicted" />
                                <RadioBtn
                                    value={EPredictedDemandMethod.Probability}
                                    control={<Radio color="primary" size="small"/>}
                                    label="Probability" />
                            </RadioGroupStyled>
                        </StyledTableCell>
                        <StyledTableCell key="evenflowAppontments" style={{padding: 0}} width={230}>
                            <SubCellWhite key="evenflowAppontments" style={{borderBottom: '1px solid #DADADA'}}>
                                EvenFlow Appointments
                            </SubCellWhite>
                            <SubCellGrey key="ExEvenflowAppontments" style={{borderBottom: '1px solid #DADADA'}}>
                                Ex EvenFlow Appointments
                            </SubCellGrey>
                            <SubCellWhite key="ROs">Open ROs</SubCellWhite>
                        </StyledTableCell>
                        <StyledTableCell key="requestDemandStatus" style={{padding: 0}} width={146}>
                            <SwitchWrapperWhite key="evenflowAppontments" style={{borderBottom: '1px solid #DADADA'}}>
                                <Switch
                                    onChange={handleSwitch(item.serviceBookId ?? item.serviceBookName, EDemandPredictionType.EvenFlowAppointments, "request")}
                                    checked={Boolean(item.demandActivity.find(el => el.type === EDemandPredictionType.EvenFlowAppointments)?.isRequestOn)}
                                    color="primary"
                                />
                            </SwitchWrapperWhite>
                            <SwitchWrapperGrey key="ExEvenflowAppontments" style={{borderBottom: '1px solid #DADADA'}}>
                                <Switch
                                    onChange={handleSwitch(item.serviceBookId ?? item.serviceBookName, EDemandPredictionType.ExEvenFlowAppointments, "request")}
                                    checked={Boolean(item.demandActivity.find(el => el.type === EDemandPredictionType.ExEvenFlowAppointments)?.isRequestOn)}
                                    color="primary"
                                />
                            </SwitchWrapperGrey>
                            <SwitchWrapperWhite key="ROs">
                                <Switch
                                    onChange={handleSwitch(item.serviceBookId ?? item.serviceBookName, EDemandPredictionType.OpenROs, "request")}
                                    checked={Boolean(item.demandActivity.find(el => el.type === EDemandPredictionType.OpenROs)?.isRequestOn)}
                                    color="primary"
                                />
                            </SwitchWrapperWhite>
                        </StyledTableCell>
                        <StyledTableCell key="predictionDemandStatus" style={{padding: 0}} width={146}>
                            <SwitchWrapperWhite key="evenflowAppontments" style={{borderBottom: '1px solid #DADADA'}}>
                                <Switch
                                    onChange={handleSwitch(item.serviceBookId ?? item.serviceBookName, EDemandPredictionType.EvenFlowAppointments, "prediction")}
                                    checked={Boolean(item.demandActivity.find(el => el.type === EDemandPredictionType.EvenFlowAppointments)?.isPredictionOn)}
                                    color="primary"
                                />
                            </SwitchWrapperWhite>
                            <SwitchWrapperGrey key="ExEvenflowAppontments" style={{borderBottom: '1px solid #DADADA'}}>
                                <Switch
                                    onChange={handleSwitch(item.serviceBookId ?? item.serviceBookName, EDemandPredictionType.ExEvenFlowAppointments, "prediction")}
                                    checked={Boolean(item.demandActivity.find(el => el.type === EDemandPredictionType.ExEvenFlowAppointments)?.isPredictionOn)}
                                    color="primary"
                                />
                            </SwitchWrapperGrey>
                            <SwitchWrapperWhite key="ROs">
                                <Switch
                                    onChange={handleSwitch(item.serviceBookId ?? item.serviceBookName, EDemandPredictionType.OpenROs, "prediction")}
                                    checked={Boolean(item.demandActivity.find(el => el.type === EDemandPredictionType.OpenROs)?.isPredictionOn)}
                                    color="primary"
                                />
                            </SwitchWrapperWhite>
                        </StyledTableCell>
                    </TableRow>
                })}
            </TableBody>
        </DenseTableWithPadding>
    );
};

export default DemandPredictionTable;