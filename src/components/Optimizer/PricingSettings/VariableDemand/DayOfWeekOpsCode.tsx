import React, {useCallback, useEffect, useState} from 'react';
import {Box, Button, TableBody, TableCell, TableHead, TableRow, withStyles,} from "@material-ui/core";
import {useConfirm, useException, useModal, useSCs} from "../../../../utils/hooks";
import {ValueSlider} from "../../AppointmentValue/UI";
import {makeStyles} from "@material-ui/core/styles";
import {DenseTable} from "../../AppointmentAllocation/UI";
import {useDispatch, useSelector} from "react-redux";
import {
    addServiceRequestsToPricing,
    deleteSRPricingSettings,
    loadSRPricingSettings,
} from "../../../../store/reducers/pricingSettings/actions";
import {RootState} from "../../../../store/rootReducer";
import {
    EDemandCategory,
    IRequestPricingSettings,
    TNewRequestsToPricing
} from "../../../../store/reducers/pricingSettings/types";
import AddOpsCodeModal from "../../../Modals/AddPackage/parts/AddOpsCode/AddOpsCode";
import {IAssignedServiceRequest} from "../../../../store/reducers/serviceRequests/types";
import {Loading} from "../../../UI/Loading";
import {loadAssignedServiceRequests, setAssignedPageData} from "../../../../store/reducers/serviceRequests/actions";
import EditDayOfWeekOpsCode from "../../../Modals/EditDayOFWeekOpsCode/EditDayOFWeekOpsCode";

export enum SliderRange {
    Min = -10,
    Max = 10
}

export const Slider = withStyles({
    root: {
        margin: "0 25px",
        width: "calc(100% - 50px)"
    },
    markLabel: {
        top: 5,
        left: "-12px !important",
        "& ~ .MuiSlider-mark ~ .MuiSlider-markLabel": {
            left: "unset !important",
            right: -25
        }
    },
    valueLabel: {
        '& > span': {
            width: 57
        }
    }
})(ValueSlider);

export type TOpsCode = {
    opsCode: string;
    low: number;
    high: number;
    id: number;
}

const useStyles = makeStyles(() => ({
    headerCell: {
        fontWeight: 'bold',
        fontSize: 15,
        textTransform: 'uppercase',
    }
}));
type SliderValues = {
    [key: string]: number,
}
type SliderObject = {
    [key: string]: SliderValues
}

const DayOfWeekOpsCode = () => {
    const { onOpen, onClose, isOpen } = useModal();
    const { onOpen: onEditOpen, onClose: onEditClose, isOpen: isEditOpen } = useModal();
    const { srPricingSettings, isLoading } = useSelector((state: RootState) => state.pricingSettings);
    const { assignedList } = useSelector((state: RootState) => state.serviceRequests);
    const [opsCodes, setOpsCodes] = useState<TOpsCode[]>([]);
    const [slidersState, setSlidersState] = useState<SliderObject>({});
    const [selectedCodes, setSelectedCodes] = useState<IAssignedServiceRequest[]>([]);
    const [editingItem, setEditingItem] = useState<TOpsCode | null>(null);
    const {askConfirm} = useConfirm();
    const showError = useException();
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const classes = useStyles();

    const getData = async (serviceCenterId: number) => {
        await dispatch(setAssignedPageData({ pageSize: 0, pageIndex: 0}));
        await dispatch(loadAssignedServiceRequests(serviceCenterId));
        await dispatch(setAssignedPageData({ pageSize: 10, pageIndex: 0 }))
    }

    const setInitialSliders = useCallback((srPricingSettings: IRequestPricingSettings[]) => {
        setSlidersState(() => {
            const data: SliderObject = {}
            srPricingSettings.map(item => {
                const lowValue = item.values.find(el => el.demandCategory === EDemandCategory.Low);
                const highValue = item.values.find(el => el.demandCategory === EDemandCategory.High);
                data[item.serviceRequestId] = {
                    low: lowValue ? lowValue.value : 0,
                    high: highValue ? highValue.value : 0,
                }
            })
            return data;
        })
    }, [])

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadSRPricingSettings(selectedSC.id))
            getData(selectedSC.id).then();
        }
    }, [selectedSC])

    useEffect(() => {
        if (assignedList.length && srPricingSettings) {
            setSelectedCodes(() => {
                return assignedList.filter(item => srPricingSettings.find(el => el.serviceRequestId === item.id));
            })
        }
    }, [assignedList, srPricingSettings])

    useEffect(() => {
        if (srPricingSettings) {
            setOpsCodes(() => srPricingSettings.map(item => {
                    let low = 0;
                    let high = 0;
                    const lowValue = item.values.find(el => el.demandCategory === EDemandCategory.Low);
                    const highValue = item.values.find(el => el.demandCategory === EDemandCategory.High);
                    if (lowValue) low = lowValue.value;
                    if (highValue) high = highValue.value;
                    return  {
                        opsCode: item.serviceRequestCode,
                        id: item.serviceRequestId,
                        low,
                        high,
                    }
                })
                .sort((a, b) => a.id - b.id)
            )
            setInitialSliders(srPricingSettings);
        }
    }, [srPricingSettings])

    const handleAddOpsCode = useCallback(() => {
        if (selectedSC && selectedCodes.length) {
            const data: TNewRequestsToPricing = {
                serviceCenterId: selectedSC.id,
                serviceRequestIds: selectedCodes
                    .map(item => item.id)
                    .filter(item => !srPricingSettings.find(el => el.serviceRequestId === item)),
            }
            try {
                dispatch(addServiceRequestsToPricing(data))
            } catch (e) {
                showError(e)
            }
        }
    }, [selectedSC, selectedCodes, srPricingSettings, showError, dispatch])

    const deleteOpsCode = useCallback((item: TOpsCode) => {
        if (selectedSC) {
            askConfirm({
                title: `Please confirm you want to remove ops code ${item?.opsCode}?`,
                isRemove: true,
                onConfirm: () => {
                    try {
                        dispatch(deleteSRPricingSettings(item.id, selectedSC.id))
                    } catch (e) {
                        showError(e)
                    }
                }
            });
        }
    }, [selectedSC, askConfirm, dispatch, showError])

    const handleChange = useCallback((id: number, type: "low" | "high") => (e: any, val: number | number[]) => {
        setSlidersState(prev => ({...prev, [id]: {...prev[id], [type]: val}}))
    }, [])

    const handleSelectOpsCode = useCallback((el: IAssignedServiceRequest) => {
        setSelectedCodes(prev => {
            return prev.find(item => item.id === el.id) ? prev.filter(item => item.id !== el.id) : [...prev, el]
        });
    }, [setSelectedCodes])

    const onEditClick = async (item: TOpsCode) => {
        await setEditingItem(item);
        await onEditOpen();
    }

    return <div>
        <Box display="flex" mr={2}  mb={2} alignItems="center">
            <div className="grow" />
            <Button color="primary" onClick={onOpen} variant="contained">
                Add Ops Code
            </Button>
        </Box>
        <Box display="flex" m={2} alignItems="center">
            {isLoading
                ? <Loading/>
                : srPricingSettings.length
                    ? <DenseTable>
                            <TableHead>
                                <TableRow>
                                    <TableCell className={classes.headerCell} width="22%">
                                        Ops Code
                                    </TableCell>
                                    <TableCell className={classes.headerCell} width="26%">
                                        Low
                                    </TableCell>
                                    <TableCell className={classes.headerCell} width="26%">
                                        High
                                    </TableCell>
                                    <TableCell width="8%"/>
                                    <TableCell width="8%"/>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {opsCodes.map(item => {
                                    return <TableRow key={item.opsCode}>
                                        <TableCell key={item.opsCode}>
                                            {item.opsCode}
                                        </TableCell>
                                        <TableCell key="low">
                                            <Slider
                                                min={SliderRange.Min}
                                                max={SliderRange.Max}
                                                onChange={handleChange(item.id, "low")}
                                                disabled
                                                step={0.01}
                                                marks={[
                                                    {value: SliderRange.Min, label: SliderRange.Min},
                                                    {value: SliderRange.Max, label: SliderRange.Max}
                                                ]}
                                                value={slidersState[item.id].low}
                                                valueLabelDisplay="on"
                                            />
                                        </TableCell>
                                        <TableCell key="high">
                                            <Slider
                                                min={SliderRange.Min}
                                                max={SliderRange.Max}
                                                step={0.01}
                                                disabled
                                                onChange={handleChange(item.id, "high")}
                                                marks={[
                                                    {value: SliderRange.Min, label: SliderRange.Min},
                                                    {value: SliderRange.Max, label: SliderRange.Max}
                                                ]}
                                                value={slidersState[item.id].high}
                                                valueLabelDisplay="on"
                                            />
                                        </TableCell>
                                        <TableCell key="save" align='center'>
                                            <Button
                                                variant="text"
                                                style={{textTransform: 'none'}}
                                                onClick={() => onEditClick(item)}
                                                color="primary">
                                                Edit
                                            </Button>
                                        </TableCell>
                                        <TableCell key="remove" align='center'>
                                            <Button
                                                variant="text"
                                                style={{textTransform: 'none'}}
                                                onClick={() => deleteOpsCode(item)}
                                                color="primary">
                                                Remove
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                })}
                            </TableBody>
                        </DenseTable>
                        : <div style={{ display: 'flex', width: '100%', justifyContent: 'center'}}>No data</div>
            }
        </Box>
        <EditDayOfWeekOpsCode open={isEditOpen} editingItem={editingItem} onClose={onEditClose}/>
        <AddOpsCodeModal
            setSelectedCodes={setSelectedCodes}
            selectedCodes={selectedCodes}
            handleSelect={handleSelectOpsCode}
            disabledIds={srPricingSettings.map(item => item.serviceRequestId)}
            open={isOpen}
            onClose={onClose}
            isEligible={true}
            handleSave={handleAddOpsCode}
        />
    </div>;
};

export default DayOfWeekOpsCode;