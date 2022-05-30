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

const useStyles = makeStyles(() => ({
    laborPerHour: {
        width: 300,
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

const RoPredictionParameters = () => {
    const {selectedSC, predictionParams} = useSelector((state: RootState) => state.serviceCenters);

    const [isEdit, setEdit] = useState<boolean>(false);
    const [isSaving, setSaving] = useState<boolean>(false);
    const [heavyRepairLaborHours, setHeavyRepairLaborHours] = useState<number>(0);
    const [otherRepairLaborHours, setOtherRepairLaborHours] = useState<number>(0);
    const [defaultLaborHours, setDefaultLaborHours] = useState<number>(0);

    const classes = useStyles();
    const dispatch = useDispatch();
    const showError = useException();
    const showMessage = useMessage();

    const setInitialData = useCallback(() => {
        setHeavyRepairLaborHours(predictionParams.heavyRepairLaborHours);
        setOtherRepairLaborHours(predictionParams.otherRepairLaborHours);
        setDefaultLaborHours(predictionParams.defaultLaborHours);
    }, [predictionParams])

    useEffect(() => {
        setInitialData()
    }, [predictionParams])

    useEffect(() => {
        if (selectedSC) dispatch(loadPredictionParams(selectedSC.id))
    }, [selectedSC])

    const handleChangeHeavy = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHeavyRepairLaborHours(Number(e.target.value))
    }

    const handleChangeOther = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOtherRepairLaborHours(Number(e.target.value))
    }

    const handleChangeDefault = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDefaultLaborHours(Number(e.target.value))
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
    }, [])

    const handleSave = () => {
        const data: IPredictionParams = {
            heavyRepairLaborHours,
            otherRepairLaborHours,
            defaultLaborHours,
        }
        if (selectedSC) dispatch(updatePredictionParams(selectedSC.id, data, onError, onSuccess))
    }

    return (
        <div>
            <div className={classes.laborPerHour}>
                Labor Rate Per Hour: ${selectedSC?.laborRatePerHour}
            </div>
            <DemandTable>
                <TableHead>
                    <TableRow>
                        <TableCell width='20%' align="left">Model Parameter</TableCell>
                        <TableCell width='45%' align="left">Desciption</TableCell>
                        <TableCell width='20%'>Value</TableCell>
                        <TableCell width='15%' style={{textAlign: "right"}}>
                            <SaveEditBlock
                                onSave={handleSave}
                                onEdit={() => setEdit(true)}
                                onCancel={handleCancel}
                                isEdit={isEdit}
                                isSaving={isSaving}
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
                            The number of incremental hours added to the appointment if the appointment predicted as Heavy Repair
                        </TableCell>
                        <TableCell>
                            {!isEdit
                                ? heavyRepairLaborHours
                                : <TextField
                                    type="number"
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
                            The number of incremental hours added to the appointment if the appointment is <span style={{textDecoration: 'underline'}}>not</span> predicted as Heavy Repair
                        </TableCell>
                        <TableCell>
                            {!isEdit
                                ? otherRepairLaborHours
                                : <TextField
                                    type="number"
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
                            in the Service Request Page and the Labor Hour value can not be found in the DMS
                        </TableCell>
                        <TableCell>
                            {!isEdit
                                ? defaultLaborHours
                                : <TextField
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
        </div>
    );
};

export default RoPredictionParameters;