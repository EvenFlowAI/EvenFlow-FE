import React, {useCallback, useEffect, useState} from 'react';
import {useConfirm, useModal, useSCs} from "../../../../utils/hooks";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {
    EDemandCategory, IPackagePricingSettings,
} from "../../../../store/reducers/pricingSettings/types";
import {loadMPPricingSettings} from "../../../../store/reducers/pricingSettings/actions";
import {Box, Button, Divider, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import {Loading} from "../../../UI/Loading";
import {DenseTable} from "../../AppointmentAllocation/UI";
import {Slider, SliderRange} from "./DayOfWeekOpsCode";
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

type TMPackage = {
    low: number;
    high: number;
    id: number;
    name: string;
}

const DayOfWeekPackage = () => {
    const { mpPricingSettings, isLoading } = useSelector((state: RootState) => state.pricingSettings);
    const [mPackages, setMPackages] = useState<TMPackage[]>([]);
    const [slidersState, setSlidersState] = useState<SliderObject>({});
    const [editingItem, setEditingItem] = useState<TMPackage | null>(null);
    const { onOpen: onEditOpen, onClose: onEditClose, isOpen: isEditOpen } = useModal();
    const { onOpen, onClose, isOpen } = useModal();
    const {askConfirm} = useConfirm();
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const classes = useStyles();

    const setInitialSliders = (mpPricingSettings: IPackagePricingSettings[]) => {
        setSlidersState(() => {
            const data: SliderObject = {}
            mpPricingSettings.map(item => {
                const lowValue = item.values.find(el => el.demandCategory === EDemandCategory.Low);
                const highValue = item.values.find(el => el.demandCategory === EDemandCategory.High);
                data[item.maintenancePackageId] = {
                    low: lowValue ? lowValue.value : 0,
                    high: highValue ? highValue.value : 0,
                }
            })
            return data;
        })
    }

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadMPPricingSettings(selectedSC.id))
        }
    }, [selectedSC])

    useEffect(() => {
        if (mpPricingSettings) {
            setMPackages(() => mpPricingSettings.map(item => {
                    let low = 0;
                    let high = 0;
                    const lowValue = item.values.find(el => el.demandCategory === EDemandCategory.Low);
                    const highValue = item.values.find(el => el.demandCategory === EDemandCategory.High);
                    if (lowValue) low = lowValue.value;
                    if (highValue) high = highValue.value;
                    return  {
                        name: item.maintenancePackageName,
                        id: item.maintenancePackageId,
                        low,
                        high,
                    }
                })
                    .sort((a, b) => a.id - b.id)
            )
            setInitialSliders(mpPricingSettings);
        }
    }, [mpPricingSettings])

    const deleteOpsCode = (item: TMPackage) => {
        if (selectedSC) {
            askConfirm({
                title: `Are you sure you want to remove maintenance package ${item.name} with ID ${item.id}?`,
                isRemove: true,
                onConfirm: () => {
                    // todo request
                    // dispatch(deleteSRPricingSettings(item.id, selectedSC.id))
                }
            });
        }
    }

    const handleChange = useCallback((id: number, type: "low" | "high") => (e: any, val: number | number[]) => {
        setSlidersState(prev => ({...prev, [id]: {...prev[id], [type]: val}}))
    }, [])

    const onEditClick = async (item: TMPackage) => {
        await setEditingItem(item);
        await onEditOpen();
    }

    return <div>
        <Box display="flex" mr={2} alignItems="center">
            <div className="grow" />
            <Button color="primary" onClick={onOpen} variant="contained">
                Add Maintenance Package
            </Button>
        </Box>
        <Divider />
        <Box display="flex" m={2} alignItems="center">
            {isLoading
                ? <Loading/>
                : mpPricingSettings.length
                    ? <DenseTable>
                        <TableHead>
                            <TableRow>
                                <TableCell className={classes.headerCell} width="21%">
                                    Name
                                </TableCell>
                                <TableCell className={classes.headerCell} width="21%">
                                    ID
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
                            {mPackages.map(item => {
                                return <TableRow key={item.id}>
                                    <TableCell key={item.name}>
                                        {item.name}
                                    </TableCell>
                                    <TableCell key={item.id}>
                                        {item.id}
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
        {/*<EditDayOfWeekOpsCode open={isEditOpen} editingItem={editingItem} onClose={onEditClose}/>*/}
    </div>
};

export default DayOfWeekPackage;