import React, {useCallback, useEffect, useState} from 'react';
import {useConfirm, useModal, useSCs} from "../../../../utils/hooks";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {
    EDemandCategory,
    IRequestPricingSettings,
} from "../../../../store/reducers/pricingSettings/types";
import {
    deleteSRPricingSettings,
    loadSRPricingSettings
} from "../../../../store/reducers/pricingSettings/actions";
import {Box, Button, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import {Loading} from "../../../UI/Loading";
import {DenseTable} from "../../AppointmentAllocation/UI";
import EditDayOfWeekOpsCode from "../../../Modals/EditDayOFWeekOpsCode/EditDayOFWeekOpsCode";
import {Slider, SliderRange, TOpsCode} from "./DayOfWeekOpsCode";
import {makeStyles} from "@material-ui/core/styles";

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

const DayOfWeekPackage = () => {
    const { srPricingSettings, isLoading } = useSelector((state: RootState) => state.pricingSettings);
    const [opsCodes, setOpsCodes] = useState<TOpsCode[]>([]);
    const [slidersState, setSlidersState] = useState<SliderObject>({});
    const [editingItem, setEditingItem] = useState<TOpsCode | null>(null);
    const { onOpen: onEditOpen, onClose: onEditClose, isOpen: isEditOpen } = useModal();
    const {askConfirm} = useConfirm();
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const classes = useStyles();

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
        }
    }, [selectedSC])

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

    const deleteOpsCode = (item: TOpsCode) => {
        if (selectedSC) {
            askConfirm({
                title: `Are you sure you want to remove maintenance package ${item?.opsCode}?`,
                isRemove: true,
                onConfirm: () => {
                    dispatch(deleteSRPricingSettings(item.id, selectedSC.id))
                }
            });
        }
    }

    const handleChange = useCallback((id: number, type: "low" | "high") => (e: any, val: number | number[]) => {
        setSlidersState(prev => ({...prev, [id]: {...prev[id], [type]: val}}))
    }, [])

    const onEditClick = async (item: TOpsCode) => {
        await setEditingItem(item);
        await onEditOpen();
    }

    return <div>
        {/*<Box display="flex" mr={2} alignItems="center">*/}
        {/*    <div className="grow" />*/}
        {/*    <Button color="primary" onClick={onOpen} variant="contained">*/}
        {/*        Add Ops Code*/}
        {/*    </Button>*/}
        {/*</Box>*/}
        {/*<Divider />*/}
        <Box display="flex" m={2} alignItems="center">
            {isLoading
                ? <Loading/>
                : srPricingSettings.length
                    ? <DenseTable>
                        <TableHead>
                            <TableRow>
                                <TableCell className={classes.headerCell} width="21%">
                                    Maintenance Package Name
                                </TableCell>
                                <TableCell className={classes.headerCell} width="21%">
                                    Maintenance Package ID
                                </TableCell>
                                <TableCell className={classes.headerCell} width="21%">
                                    Low
                                </TableCell>
                                <TableCell className={classes.headerCell} width="21%">
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
    </div>
};

export default DayOfWeekPackage;