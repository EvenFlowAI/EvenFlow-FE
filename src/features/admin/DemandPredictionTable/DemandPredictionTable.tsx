import React, {useEffect} from 'react';
import {DenseTableWithPadding} from "../../../components/styled/DemandTable";
import {Radio, Switch, TableBody, TableHead, TableRow} from "@mui/material";
import {
    RadioBtn,
    RadioGroupStyled,
    StyledTableCell,
    SubCellGrey,
    SubCellWhite,
    SwitchWrapperGrey,
    SwitchWrapperWhite
} from "./styles";
import {EDemandPredictionType, ERequestDemandMethod} from "../../../store/reducers/demandManagement/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {useSCs} from "../../../hooks/useSCs/useSCs";
import {loadDemandManagementSettings} from "../../../store/reducers/demandManagement/actions";
import {DemandPredictedCell} from "./DemandPredictedCell/DemandPredictedCell";


const DemandPredictionTable = () => {
    const {isLoading, settings} = useSelector((state: RootState) => state.demandManagement);
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();

    useEffect(() => {
       selectedSC && dispatch(loadDemandManagementSettings(selectedSC.id))
    }, [selectedSC])


    const handleSwitch = (idOrName: number|string, type: EDemandPredictionType, requestType: "request"|"prediction") => async (e: any, value: boolean) => {
        // todo request
    }

    const handleChangeRequestDemandMethod = (idOrName: number|string) =>  (e: React.ChangeEvent<HTMLInputElement>) => {
        // todo request

    }
    return (
        <DenseTableWithPadding>
            <TableHead>
                <TableRow>
                    <StyledTableCell key="serviceBook" style={{textTransform: 'capitalize'}} width={145}>
                        Service Book
                    </StyledTableCell>
                    <StyledTableCell key="Request" style={{textTransform: 'capitalize'}}>
                        Request<br/>Demand Method
                    </StyledTableCell>
                    <StyledTableCell key="Predicted" style={{textTransform: 'capitalize'}}>
                        Predicted<br/>Demand Method
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
                {settings.map(item => {
                    return  <TableRow key={item.podId ?? item.serviceBookName}>
                        <StyledTableCell
                            key={item.podId ?? item.serviceBookName}>
                            {item.serviceBookName}
                        </StyledTableCell>
                        <StyledTableCell
                            key="requestDemandMethod" align="left">
                                <RadioGroupStyled
                                    value={item.requestDemandMethod}
                                    onChange={handleChangeRequestDemandMethod(item.podId ?? item.serviceBookName)}
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
                        <DemandPredictedCell item={item}/>
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
                                    onChange={handleSwitch(item.podId ?? item.serviceBookName, EDemandPredictionType.EvenFlowAppointments, "request")}
                                    checked={Boolean(item.demandTypeSettings.find(el => el.type === EDemandPredictionType.EvenFlowAppointments)?.isRequestStatusOn)}
                                    color="primary"
                                />
                            </SwitchWrapperWhite>
                            <SwitchWrapperGrey key="ExEvenflowAppontments" style={{borderBottom: '1px solid #DADADA'}}>
                                <Switch
                                    onChange={handleSwitch(item.podId ?? item.serviceBookName, EDemandPredictionType.ExEvenFlowAppointments, "request")}
                                    checked={Boolean(item.demandTypeSettings.find(el => el.type === EDemandPredictionType.ExEvenFlowAppointments)?.isRequestStatusOn)}
                                    color="primary"
                                />
                            </SwitchWrapperGrey>
                            <SwitchWrapperWhite key="ROs">
                                <Switch
                                    onChange={handleSwitch(item.podId ?? item.serviceBookName, EDemandPredictionType.OpenROs, "request")}
                                    checked={Boolean(item.demandTypeSettings.find(el => el.type === EDemandPredictionType.OpenROs)?.isRequestStatusOn)}
                                    color="primary"
                                />
                            </SwitchWrapperWhite>
                        </StyledTableCell>
                        <StyledTableCell key="predictionDemandStatus" style={{padding: 0}} width={146}>
                            <SwitchWrapperWhite key="evenflowAppontments" style={{borderBottom: '1px solid #DADADA'}}>
                                <Switch
                                    onChange={handleSwitch(item.podId ?? item.serviceBookName, EDemandPredictionType.EvenFlowAppointments, "prediction")}
                                    checked={Boolean(item.demandTypeSettings.find(el => el.type === EDemandPredictionType.EvenFlowAppointments)?.isPredictedStatusOn)}
                                    color="primary"
                                />
                            </SwitchWrapperWhite>
                            <SwitchWrapperGrey key="ExEvenflowAppontments" style={{borderBottom: '1px solid #DADADA'}}>
                                <Switch
                                    onChange={handleSwitch(item.podId ?? item.serviceBookName, EDemandPredictionType.ExEvenFlowAppointments, "prediction")}
                                    checked={Boolean(item.demandTypeSettings.find(el => el.type === EDemandPredictionType.ExEvenFlowAppointments)?.isPredictedStatusOn)}
                                    color="primary"
                                />
                            </SwitchWrapperGrey>
                            <SwitchWrapperWhite key="ROs">
                                <Switch
                                    onChange={handleSwitch(item.podId ?? item.serviceBookName, EDemandPredictionType.OpenROs, "prediction")}
                                    checked={Boolean(item.demandTypeSettings.find(el => el.type === EDemandPredictionType.OpenROs)?.isPredictedStatusOn)}
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