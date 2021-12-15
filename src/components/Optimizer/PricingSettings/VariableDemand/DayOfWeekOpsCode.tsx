import React, {useCallback, useEffect, useState} from 'react';
import {SquarePaper} from "../../../UI/Paper";
import {PaperTitle} from "../UI";
import {Box, Button, Divider, TableBody, TableCell, TableHead, TableRow, withStyles,} from "@material-ui/core";
import {useConfirm, useModal, useSCs} from "../../../../utils/hooks";
import {ValueSlider} from "../../AppointmentValue/UI";
import {makeStyles} from "@material-ui/core/styles";
import {DenseTable} from "../../AppointmentAllocation/UI";
import {useDispatch, useSelector} from "react-redux";
import {
    addServiceRequestsToPricing,
    deleteSRPricingSettings,
    loadSRPricingSettings,
    updateSRPricingSettings
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
import {TextField} from "../../../UI/TextField";

enum SliderRange {
    Min = -10,
    Max = 10
}

const Slider = withStyles({
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
})(ValueSlider);

type TOpsCode = {
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
    const { srPricingSettings, isLoading } = useSelector((state: RootState) => state.pricingSettings);
    const { assignedList } = useSelector((state: RootState) => state.serviceRequests);
    const [opsCodes, setOpsCodes] = useState<TOpsCode[]>([]);
    const [slidersState, setSlidersState] = useState<SliderObject>({});
    const [selectedCodes, setSelectedCodes] = useState<IAssignedServiceRequest[]>([]);
    const {askConfirm} = useConfirm();
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const classes = useStyles();

    const getData = async (serviceCenterId: number) => {
        await dispatch(setAssignedPageData({ pageSize: 0, pageIndex: 0}));
        await dispatch(loadAssignedServiceRequests(serviceCenterId));
        await dispatch(setAssignedPageData({ pageSize: 10, pageIndex: 0 }))
    }

    const setInitialSliders = (srPricingSettings: IRequestPricingSettings[]) => {
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
    }

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

    const handleAddOpsCode = () => {
        if (selectedSC && selectedCodes.length) {
            const data: TNewRequestsToPricing = {
                serviceCenterId: selectedSC.id,
                serviceRequestIds: selectedCodes
                    .map(item => item.id)
                    .filter(item => !srPricingSettings.find(el => el.serviceRequestId === item)),
            }
            dispatch(addServiceRequestsToPricing(data))
        }
    }

    const handleSaveChanges = (item: TOpsCode) => {
        if (selectedSC) {
            const data: Partial<IRequestPricingSettings> = {
                serviceCenterId: selectedSC.id,
                values: [
                    {
                        demandCategory: EDemandCategory.Low,
                        value: slidersState[item.id].low,
                    },
                    {
                        demandCategory: EDemandCategory.High,
                        value: slidersState[item.id].high,
                    }
                ]
            }
            dispatch(updateSRPricingSettings(item.id, data))
        }
    }

    const saveOpsCode = (item: TOpsCode) => {
        askConfirm({
            title: `Are you sure want to change the value?`,
            onConfirm: () => handleSaveChanges(item),
            onCancel: () => setInitialSliders(srPricingSettings),
        });
    }

    const deleteOpsCode = (item: TOpsCode) => {
        if (selectedSC) {
            askConfirm({
                title: `Are you sure want to remove ops code ${item?.opsCode}?`,
                isRemove: true,
                onConfirm: () => {
                    dispatch(deleteSRPricingSettings(item.id, selectedSC.id))
                }
            });
        }
    }

    const onInputChange = (id: number, type: "low" | "high") => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        event.persist();
        setSlidersState(prev => ({...prev, [id]: {...prev[id], [type]: event.target.value}}))
    }

    // const handleChange = useCallback((id: number, type: "low" | "high") => (e: any, val: number | number[]) => {
    //     setSlidersState(prev => ({...prev, [id]: {...prev[id], [type]: val}}))
    // }, [])

    // const handleChangeCommitted = useCallback((id: number, type: "low" | "high") => (e: any, val: number | number[]) => {
    //     askConfirm({
    //         title: `Are you sure want to change the value?`,
    //         onConfirm: () => handleSaveChanges(id, type, val),
    //         onCancel: () => setInitialSliders(srPricingSettings),
    //     });
    // }, [selectedSC, srPricingSettings])

    const handleSelectOpsCode = useCallback((el: IAssignedServiceRequest) => {
        setSelectedCodes(prev => {
            return prev.find(item => item.id === el.id) ? prev.filter(item => item.id !== el.id) : [...prev, el]
        });
    }, [setSelectedCodes])

    return <SquarePaper variant="outlined">
        <Box display="flex" mr={2} alignItems="center">
            <PaperTitle>Day of Week Ops Code</PaperTitle>
            <div className="grow" />
            <Button color="primary" onClick={onOpen} variant="contained">
                Add Ops Code
            </Button>
        </Box>
        <Divider />
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
                                            <TextField type="number"
                                                       fullWidth
                                                        inputProps={{ min: SliderRange.Min, max: SliderRange.Max, step: 0.001}}
                                                        value={slidersState[item.id].low}
                                                        onChange={onInputChange(item.id, "low")}
                                                        />
                                            {/*<Slider*/}
                                            {/*    min={SliderRange.Min}*/}
                                            {/*    max={SliderRange.Max}*/}
                                            {/*    onChangeCommitted={handleChangeCommitted(item.id, "low")}*/}
                                            {/*    onChange={handleChange(item.id, "low")}*/}
                                            {/*    step={0.01}*/}
                                            {/*    marks={[*/}
                                            {/*        {value: SliderRange.Min, label: SliderRange.Min},*/}
                                            {/*        {value: SliderRange.Max, label: SliderRange.Max}*/}
                                            {/*    ]}*/}
                                            {/*    value={slidersState[item.id].low}*/}
                                            {/*    valueLabelDisplay="on"*/}
                                            {/*/>*/}
                                        </TableCell>
                                        <TableCell key="high">
                                            <TextField type="number"
                                                       fullWidth
                                                       inputProps={{ min: SliderRange.Min, max: SliderRange.Max, step: 0.001}}
                                                       value={slidersState[item.id].high}
                                                       onChange={onInputChange(item.id, "high")}
                                            />
                                            {/*<Slider*/}
                                            {/*    min={SliderRange.Min}*/}
                                            {/*    max={SliderRange.Max}*/}
                                            {/*    step={0.01}*/}
                                            {/*    onChangeCommitted={handleChangeCommitted(item.id, "high")}*/}
                                            {/*    onChange={handleChange(item.id, "high")}*/}
                                            {/*    marks={[*/}
                                            {/*        {value: SliderRange.Min, label: SliderRange.Min},*/}
                                            {/*        {value: SliderRange.Max, label: SliderRange.Max}*/}
                                            {/*    ]}*/}
                                            {/*    value={slidersState[item.id].high}*/}
                                            {/*    valueLabelDisplay="on"*/}
                                            {/*/>*/}
                                        </TableCell>
                                        <TableCell key="save" align='center'>
                                            <Button
                                                variant="text"
                                                style={{textTransform: 'none'}}
                                                onClick={() => saveOpsCode(item)}
                                                color="primary">
                                                Save
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
    </SquarePaper>;
};

export default DayOfWeekOpsCode;