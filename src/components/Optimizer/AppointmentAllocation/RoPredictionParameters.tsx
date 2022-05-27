import React, {useState} from 'react';
import {DemandTable, SaveEditBlock, TableCell, TableRow} from "./UI";
import {TableBody, TableHead} from "@material-ui/core";
import {TextField} from "../../UI/TextField";
import {makeStyles} from "@material-ui/core/styles";
import {InfoOutlined} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {useException} from "../../../utils/hooks";
import LaborRate from "../MaintenancePackages/LaborRate/LaborRate";
import {RootState} from "../../../store/rootReducer";
import {setServiceRequestsPageActiveTab} from "../../../store/reducers/serviceRequests/actions";
import {useHistory} from "react-router-dom";
import {Routes} from "../../../config/routes";

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
    const {selectedSC} = useSelector((state: RootState) => state.serviceCenters);

    const [isEdit, setEdit] = useState<boolean>(false);
    const [isSaving, setSaving] = useState<boolean>(false);
    const [heavyRepairLaborHour, setHeavyRepairLaborHour] = useState<number>(0);
    const [otherRepairLaborHour, setOtherRepairLaborHour] = useState<number>(0);
    const [defaultRepairLaborHour, setDefaultRepairLaborHour] = useState<number>(0);
    const history = useHistory();

    const classes = useStyles();
    const dispatch = useDispatch();
    const showError = useException();

    const handleChangeHeavy = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHeavyRepairLaborHour(Number(e.target.value))
    }

    const handleChangeOther = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOtherRepairLaborHour(Number(e.target.value))
    }

    const handleChangeDefault = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDefaultRepairLaborHour(Number(e.target.value))
    }

    const onSuccess = () => {
      setEdit(false);
    }

    const onError = (err: string) => {
        showError(err);
    }

    const handleCancel = () => {
        setEdit(false);
    }

    const handleSave = () => {}

    const onMaintenancePackageClick = async () => {
        await dispatch(setServiceRequestsPageActiveTab("1"));
        await history.push(Routes.Optimizer.ServiceRequests);
    }

    return (
        <div>
            <div className={classes.laborPerHour}>
                Labor Rate Per Hour: ${selectedSC?.laborRatePerHour}
            </div>
            {/*<div className={classes.note}>*/}
            {/*    <InfoOutlined/>*/}
            {/*    <span className={classes.text}>*/}
            {/*        Note: To adjust the Labor Rate value, see*/}
            {/*        <span role="presentation" onClick={onMaintenancePackageClick} className={classes.link}>Maintenance Package Page</span>*/}
            {/*    </span>*/}
            {/*</div>*/}
            <DemandTable>
                <TableHead>
                    <TableRow>
                        <TableCell width='40%'>Model Parameter</TableCell>
                        <TableCell width='40%'>Value</TableCell>
                        <TableCell width='20%' style={{textAlign: "right"}}>
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
                        <TableCell>
                            DefaultLaborHours
                        </TableCell>
                        <TableCell>
                            {!isEdit
                                ? defaultRepairLaborHour
                                : <TextField
                                    type="number"
                                    inputProps={{
                                        min: 0,
                                        step: 1,
                                    }}
                                    value={defaultRepairLaborHour}
                                    onChange={handleChangeDefault}
                                />
                            }
                        </TableCell>
                        <TableCell/>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            HeavyRepairLaborHour
                        </TableCell>
                        <TableCell>
                            {!isEdit
                                ? heavyRepairLaborHour
                                : <TextField
                                    type="number"
                                    inputProps={{
                                        min: 0,
                                    }}
                                    value={heavyRepairLaborHour}
                                    onChange={handleChangeHeavy}
                                />
                            }
                        </TableCell>
                        <TableCell/>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            OtherRepairLaborHour
                        </TableCell>
                        <TableCell>
                            {!isEdit
                                ? otherRepairLaborHour
                                : <TextField
                                    type="number"
                                    inputProps={{
                                        min: 0,
                                        step: 1,
                                    }}
                                    value={otherRepairLaborHour}
                                    onChange={handleChangeOther}
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