import React, {useCallback, useEffect, useState} from 'react';
import {DemandTable, SaveEditBlock, TableCell, TableRow} from "./UI";
import {TableBody, TableHead} from "@material-ui/core";
import {TextField} from "../../UI/TextField";
import {makeStyles} from "@material-ui/core/styles";
import {useDispatch, useSelector} from "react-redux";
import {useException, useMessage} from "../../../utils/hooks";
import {RootState} from "../../../store/rootReducer";
import {loadPredictionParams, updatePredictionParams} from "../../../store/reducers/serviceCenters/actions";
import {IPredictionParams} from "../../../store/reducers/serviceCenters/types";
import {Loading} from "../../UI/Loading";

const useStyles = makeStyles(() => ({
    laborPerHour: {
        width: 'fit-content',
        fontSize: 18,
        fontWeight: "bold",
        background: "#FFFFFF",
        borderRadius: 3,
        padding: 16,
        marginBottom: 30,
    },
    note: {
        display: "flex",
        alignItems: 'center',
        marginBottom: 30,
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 16,
    },
    link: {
        color: "blue",
        textDecoration: "underline",
        marginLeft: 10,
        cursor: "pointer",
    }
}))

const fixedToTwo = /(^-?\d*\.?\d{1,2}?)$/;

const RoPredictionParameters = () => {
    const {selectedSC, predictionParams, predictionParamsLoading} = useSelector((state: RootState) => state.serviceCenters);
    const {selectedPod} = useSelector((state: RootState) => state.pods);

    const [isEdit, setEdit] = useState<boolean>(false);
    const [heavyRepairLaborHours, setHeavyRepairLaborHours] = useState<string>('0');
    const [otherRepairLaborHours, setOtherRepairLaborHours] = useState<string>('0');
    const [defaultLaborHours, setDefaultLaborHours] = useState<string>('0');

    const classes = useStyles();
    const dispatch = useDispatch();
    const showError = useException();
    const showMessage = useMessage();

    const setInitialData = useCallback(() => {
        setHeavyRepairLaborHours(predictionParams.heavyRepairLaborHours.toString());
        setOtherRepairLaborHours(predictionParams.otherRepairLaborHours.toString());
        setDefaultLaborHours(predictionParams.defaultLaborHours.toString());
    }, [predictionParams])

    useEffect(() => {
        setInitialData()
    }, [predictionParams])

    useEffect(() => {
        if (selectedSC) {
            selectedPod
                ? dispatch(loadPredictionParams(selectedSC.id, selectedPod.id))
                : dispatch(loadPredictionParams(selectedSC.id))
        }
    }, [selectedSC, selectedPod])

    const handleChangeHeavy = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (Number(e.target.value) >= 0) setHeavyRepairLaborHours(e.target.value)
    }

    const handleChangeOther = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (Number(e.target.value) >= 0) setOtherRepairLaborHours(e.target.value)
    }

    const handleChangeDefault = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (Number(e.target.value) >= 0) setDefaultLaborHours(e.target.value)
    }

    const onSuccess = () => {
        setEdit(false);
        showMessage('RO Prediction Params Updated Successfully')
    }

    const onError = (err: string) => {
        showError(err);
    }

    const handleCancel = useCallback(() => {
        setEdit(false);
        setInitialData();
    }, [setInitialData])

    const handleSave = () => {
        if (heavyRepairLaborHours.match(fixedToTwo)
            && otherRepairLaborHours.match(fixedToTwo)
            && defaultLaborHours.match(fixedToTwo)) {
            const data: IPredictionParams = {
                heavyRepairLaborHours: Number(heavyRepairLaborHours),
                otherRepairLaborHours: Number(otherRepairLaborHours),
                defaultLaborHours: Number(defaultLaborHours),
            }
            if (selectedPod) data.podId = selectedPod.id;
            if (selectedSC) dispatch(updatePredictionParams(selectedSC.id, data, onError, onSuccess));
        } else {
            showError('Each value can contain only two digits after coma');
        }
    }

    return (
        <div>
            <div className={classes.laborPerHour}>
                Labor Rate Per Hour: ${selectedSC?.laborRatePerHour}
            </div>
            {predictionParamsLoading
                ? <Loading/>
                :<DemandTable>
                    <TableHead>
                        <TableRow>
                            <TableCell width='20%' align="left">Model Parameter</TableCell>
                            <TableCell width='45%' align="left">Description</TableCell>
                            <TableCell width='20%'>Value</TableCell>
                            <TableCell width='15%' style={{textAlign: "right"}}>
                                <SaveEditBlock
                                    onSave={handleSave}
                                    onEdit={() => setEdit(true)}
                                    onCancel={handleCancel}
                                    isEdit={isEdit}
                                    isSaving={predictionParamsLoading}
                                />
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell align="left">
                                HeavyRepairLaborHour
                            </TableCell>
                            <TableCell align="left">
                                The number of incremental hours added to the appointment if the appointment is predicted a Heavy Repair
                            </TableCell>
                            <TableCell>
                                {!isEdit
                                    ? heavyRepairLaborHours
                                    : <TextField
                                        type="number"
                                        error={!heavyRepairLaborHours.match(fixedToTwo)}
                                        inputProps={{
                                            min: 0,
                                        }}
                                        value={heavyRepairLaborHours}
                                        onChange={handleChangeHeavy}
                                    />
                                }
                            </TableCell>
                            <TableCell/>
                        </TableRow>
                        <TableRow>
                            <TableCell align="left">
                                OtherRepairLaborHour
                            </TableCell>
                            <TableCell align="left">
                                The number of incremental hours added to the appointment if the appointment is <span style={{textDecoration: 'underline'}}>not</span> predicted a Heavy Repair
                            </TableCell>
                            <TableCell>
                                {!isEdit
                                    ? otherRepairLaborHours
                                    : <TextField
                                        type="number"
                                        error={!otherRepairLaborHours.match(fixedToTwo)}
                                        inputProps={{
                                            min: 0,
                                            step: 1,
                                        }}
                                        value={otherRepairLaborHours}
                                        onChange={handleChangeOther}
                                    />
                                }
                            </TableCell>
                            <TableCell/>
                        </TableRow>
                        <TableRow>
                            <TableCell align="left">
                                DefaultLaborHours
                            </TableCell>
                            <TableCell align="left">
                                When an Open RO or an appointment booked outside of EvenFlow app uses ops codes that are not
                                in the Service Requests Page and the Labor Hour value can not be found in the DMS
                            </TableCell>
                            <TableCell>
                                {!isEdit
                                    ? defaultLaborHours
                                    : <TextField
                                        error={!defaultLaborHours.match(fixedToTwo)}
                                        type="number"
                                        inputProps={{
                                            min: 0,
                                            step: 1,
                                        }}
                                        value={defaultLaborHours}
                                        onChange={handleChangeDefault}
                                    />
                                }
                            </TableCell>
                            <TableCell/>
                        </TableRow>
                    </TableBody>
                </DemandTable>
            }
                </div>
                );
            };

            export default RoPredictionParameters;