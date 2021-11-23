import React, {useCallback, useEffect, useState} from 'react';
import {SquarePaper} from "../../../UI/Paper";
import {PaperTitle} from "../UI";
import {Box, Button, Divider, TableBody, TableCell, TableHead, TableRow, withStyles,} from "@material-ui/core";
import {useConfirm, useModal, useSCs} from "../../../../utils/hooks";
import {ValueSlider} from "../../AppointmentValue/UI";
import {makeStyles} from "@material-ui/core/styles";
import {DenseTable} from "../../AppointmentAllocation/UI";
import {useDispatch, useSelector} from "react-redux";
import {loadSRPricingSettings, updateSRPricingSettings} from "../../../../store/reducers/pricingSettings/actions";
import {RootState} from "../../../../store/rootReducer";
import {EDemandCategory, IRequestPricingLevel} from "../../../../store/reducers/pricingSettings/types";

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

const DayOfWeekOpsCode = () => {
    const { onOpen, onClose, isOpen } = useModal();
    const { srPricingSettings } = useSelector((state: RootState) => state.pricingSettings);
    const [opsCodes, setOpsCodes] = useState<TOpsCode[]>([]);
    const [selectedCodes, setSelectedCodes] = useState<number[]>([]);
    const [deletingItem, setDeletingItem] = useState<TOpsCode | null>(null);
    const {askConfirm} = useConfirm();
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const classes = useStyles();

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadSRPricingSettings(selectedSC.id))
        }
    }, [selectedSC])

    useEffect(() => {
        if (srPricingSettings) {
            // TODO change to ops code description or name
            setOpsCodes(() => srPricingSettings.map(item => {
                    let low = 0;
                    let high = 0;
                    const lowValue = item.values.find(el => el.demandCategory === EDemandCategory.Low);
                    const highValue = item.values.find(el => el.demandCategory === EDemandCategory.High);
                    if (lowValue) low = lowValue.value;
                    if (highValue) high = highValue.value;
                    return  {
                        opsCode: item.serviceRequestId.toString(),
                        id: item.serviceRequestId,
                        low,
                        high,
                    }
                })
            )
        }
    }, [srPricingSettings])

    const handleRemove = useCallback(() => {
        // ToDo request
    }, [])

    const deleteOpsCode =  useCallback((item: TOpsCode) => {
        setDeletingItem(item);
        askConfirm({
            title: `Are you sure want to remove ops code ${item?.opsCode}?`,
            isRemove: true,
            onConfirm: async () => {
                await handleRemove();
            }
        });
    }, [])

    const onOpsCodeSave = useCallback((selectedCodes: number[], serviceCenterId: number) => {
        // ToDo request
    }, [])

    const handleChange = useCallback((id: number, type: "low" | "high") => (e: any, val: number | number[]) => {
        if (selectedSC && !Array.isArray(val)) {
            const data: Partial<IRequestPricingLevel> = {
                serviceCenterId: selectedSC.id,
                values: [
                    {
                        demandCategory: type === "low" ? EDemandCategory.Low : EDemandCategory.High,
                        value: val,
                    }
                ]
            }
            dispatch(updateSRPricingSettings(id, data))
        }
    }, [])

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
            {srPricingSettings.length ? <DenseTable>
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.headerCell} width="22%">
                            Ops Code
                        </TableCell>
                        <TableCell className={classes.headerCell} width="30%">
                            Low
                        </TableCell>
                        <TableCell className={classes.headerCell} width="30%">
                            High
                        </TableCell>
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
                                    marks={[
                                        {value: SliderRange.Min, label: SliderRange.Min},
                                        {value: SliderRange.Max, label: SliderRange.Max}
                                    ]}
                                    value={item.low}
                                    valueLabelDisplay="on"
                                />
                            </TableCell>
                            <TableCell key="high">
                                <Slider
                                    min={SliderRange.Min}
                                    max={SliderRange.Max}
                                    onChange={handleChange(item.id, "high")}
                                    marks={[
                                        {value: SliderRange.Min, label: SliderRange.Min},
                                        {value: SliderRange.Max, label: SliderRange.Max}
                                    ]}
                                    value={item.high}
                                    valueLabelDisplay="on"
                                />
                            </TableCell>
                            <TableCell key="remove" align='center'>
                                <Button
                                    variant="text"
                                    style={{ textTransform: 'none'}}
                                    onClick={() => deleteOpsCode(item)}
                                    color="primary">
                                    Remove
                                </Button>
                            </TableCell>
                        </TableRow>
                    })}
                </TableBody>
            </DenseTable>
            : <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>No data</div>}
        </Box>
    </SquarePaper>;
};

export default DayOfWeekOpsCode;