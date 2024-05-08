import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";
import {EDemandCategory, IPackagePricingSettings} from "../../../../../store/reducers/pricingSettings/types";
import {
    deletePackagePricingSettings,
    loadMPPricingSettings, loadPackageOptionsList
} from "../../../../../store/reducers/pricingSettings/actions";
import {Box, Button, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import {Loading} from "../../../../../components/wrappers/Loading/Loading";
import EditDayOFWeekPackage from "../../EditDayOFWeekPackageModal/EditDayOFWeekPackageModal";
import {TMPackage, SliderObject, SliderRange} from "../../types";
import {useStyles} from "../styles";
import {Slider} from "../../../../../components/styled/Slider";
import AddPackageToPricingModal from "../../AddPackageToPricingModal/AddPackageToPricingModal";
import {DenseTable} from "../../../../../components/styled/DemandTable";
import {useModal} from "../../../../../hooks/useModal/useModal";
import {useConfirm} from "../../../../../hooks/useConfirm/useConfirm";
import {useException} from "../../../../../hooks/useException/useException";
import {useSCs} from "../../../../../hooks/useSCs/useSCs";

const DayOfWeekPackage = () => {
    const { mpPricingSettings, isLoading } = useSelector((state: RootState) => state.pricingSettings);
    const [mPackages, setMPackages] = useState<TMPackage[]>([]);
    const [slidersState, setSlidersState] = useState<SliderObject>({});
    const [editingItem, setEditingItem] = useState<TMPackage | null>(null);
    const { onOpen: onEditOpen, onClose: onEditClose, isOpen: isEditOpen } = useModal();
    const { onOpen, onClose, isOpen } = useModal();
    const {askConfirm} = useConfirm();
    const showError = useException();
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const { classes  } = useStyles();

    const setInitialSliders = useCallback((mpPricingSettings: IPackagePricingSettings[]) => {
        setSlidersState(() => {
            const data: SliderObject = {}
            mpPricingSettings.map(item => {
                const lowValue = item.values.find(el => el.demandCategory === EDemandCategory.Low);
                const highValue = item.values.find(el => el.demandCategory === EDemandCategory.High);
                data[item.maintenancePackageOptionId] = {
                    low: lowValue ? lowValue.value : 0,
                    high: highValue ? highValue.value : 0,
                }
            })
            return data;
        })
    }, [])

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadMPPricingSettings(selectedSC.id))
            dispatch(loadPackageOptionsList(selectedSC.id))
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
                        optionName: item.maintenancePackageOptionName,
                        optionId: item.maintenancePackageOptionId,
                        low,
                        high,
                    }
                })
                    .sort((a, b) => a.id - b.id)
            )
            setInitialSliders(mpPricingSettings);
        }
    }, [mpPricingSettings])

    const deletePackageOption = useCallback((item: TMPackage) => {
        if (selectedSC) {
            askConfirm({
                title: `Please confirm you want to remove Maintenance Package Level ${item.optionName} with Package ID ${item.id}?`,
                isRemove: true,
                onConfirm: () => {
                    try {
                        dispatch(deletePackagePricingSettings(item.optionId, selectedSC.id))
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

    const onEditClick = async (item: TMPackage) => {
        await setEditingItem(item);
        await onEditOpen();
    }

    return <div>
        <Box display="flex" mr={2} mb={2} alignItems="center">
            <div className="grow" />
            <Button color="primary" onClick={onOpen} variant="contained">
                Add Maintenance Package
            </Button>
        </Box>
        <Box display="flex" m={2} alignItems="center">
            {isLoading
                ? <Loading/>
                : mpPricingSettings.length
                    ? <DenseTable>
                        <TableHead>
                            <TableRow>
                                <TableCell className={classes.headerCell} width="152" style={{textTransform: "capitalize"}}>
                                   Package Name
                                </TableCell>
                                <TableCell className={classes.headerCell} width="120" style={{textTransform: "capitalize"}}>
                                    Package ID
                                </TableCell>
                                <TableCell className={classes.headerCell} width="19%" style={{textTransform: "capitalize"}}>
                                    Package Option Name
                                </TableCell>
                                <TableCell className={classes.headerCell} width="19%" style={{textTransform: "capitalize"}}>
                                    Low
                                </TableCell>
                                <TableCell className={classes.headerCell} width="19%" style={{textTransform: "capitalize"}}>
                                    High
                                </TableCell>
                                <TableCell width="8%"/>
                                <TableCell width="8%"/>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {mPackages.map(item => {
                                return <TableRow key={item.optionId}>
                                    <TableCell key={item.name}>
                                        {item.name}
                                    </TableCell>
                                    <TableCell key={item.optionId}>
                                        {item.id}
                                    </TableCell>
                                    <TableCell key={item.optionName}>
                                        {item.optionName}
                                    </TableCell>
                                    <TableCell key="low">
                                        <Slider
                                            min={SliderRange.Min}
                                            max={SliderRange.Max}
                                            onChange={handleChange(item.optionId, "low")}
                                            disabled
                                            step={0.01}
                                            marks={[
                                                {value: SliderRange.Min, label: SliderRange.Min},
                                                {value: SliderRange.Max, label: SliderRange.Max}
                                            ]}
                                            value={slidersState[item.optionId].low}
                                            valueLabelDisplay="on"
                                        />
                                    </TableCell>
                                    <TableCell key="high">
                                        <Slider
                                            min={SliderRange.Min}
                                            max={SliderRange.Max}
                                            step={0.01}
                                            disabled
                                            onChange={handleChange(item.optionId, "high")}
                                            marks={[
                                                {value: SliderRange.Min, label: SliderRange.Min},
                                                {value: SliderRange.Max, label: SliderRange.Max}
                                            ]}
                                            value={slidersState[item.optionId].high}
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
                                            onClick={() => deletePackageOption(item)}
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
        <EditDayOFWeekPackage open={isEditOpen} editingItem={editingItem} onClose={onEditClose}/>
        <AddPackageToPricingModal open={isOpen} onClose={onClose}/>
    </div>
};

export default DayOfWeekPackage;