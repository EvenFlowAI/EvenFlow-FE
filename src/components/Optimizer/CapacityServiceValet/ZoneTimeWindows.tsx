import React, {useEffect, useState} from 'react';
import {
    ETimeWindows,
    EZoneTimeGap, IZoneTimeSlot,
} from "../../../store/reducers/capacityServiceValet/types";
import moment from "moment";
import {generateZoneSlots} from "./utils";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {TableRowDataType} from "../../UI/types";
import {
    Button,
    CircularProgress,
    FormControlLabel, InputBase,
    MenuItem,
    Paper,
    Radio,
    RadioGroup,
    Select,
    styled,
    withStyles
} from "@material-ui/core";
import {getOptions} from "../../../utils/utils";
import {Table} from "../../UI/Table";
import {KeyboardArrowDown} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";

const timeWindowOptions = getOptions(Object.keys(ETimeWindows).filter(key => Number.isNaN(+key)))

const CustomSelect = withStyles(() => ({
    root: {
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        background: 'transparent'
    },
}))(Select);

const CustomInput = withStyles(() => ({
    root: {
        border: 'none',
        background: 'transparent',
        '&$disabled': {
            background: 'transparent'
        },
    },
    disabled: {}
}))(InputBase);

const CustomRadioGroup = withStyles(() => ({
    root: {
        flexDirection: 'row'
    }
}))(RadioGroup)

const CustomPaper = withStyles(() => ({
    root: {
        marginBottom: 20,
        borderRadius: 0,
        padding: 16,
    }
}))(Paper)

const ControlsWrapper = styled('div')(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
}));

const RadioLabel = styled('span')(() => ({
    fontSize: 14,
    textTransform: 'uppercase',
    fontWeight: "bold",
    marginRight: 26,
}))

const RadioWrapper = styled('div')(() => ({
    display: 'flex',
    alignItems: 'center'
}))

const useStyles = makeStyles(() => ({
    progress: {
        padding: 10,
    },
    editButton: {
        textTransform: "none",
        fontSize: 14
    },
    editSaveButtons: {
        display: 'flex',
        alignItems: 'center',
        '& > button:first-child': {
            marginRight: 20
        }
    },
    tableWrapper: {
        width: 'fit-content',
        overflowX: 'auto',
        border: '1px solid #DADADA'
    }
}))

const ZoneTimeWindows = () => {
    const {zones, isLoading: isZonesLoading} = useSelector((state: RootState) => state.serviceValet);
    const {zoneTimeWindows, isLoading} = useSelector((state: RootState) => state.capacityServiceValet);
    const {slotRange} = useSelector((state: RootState) => state.slotScoring);
    const [gap, setGap] = useState<EZoneTimeGap>(EZoneTimeGap.Medium);
    const [data, setData] = useState<IZoneTimeSlot[]>([]);
    const [localZoneWindows, setLocalZoneWindows] = useState<IZoneTimeSlot[]>([])
    const [isEdit, setEdit] = useState<boolean>(false);
    const classes = useStyles();

    useEffect(() => setLocalZoneWindows(zoneTimeWindows), [zoneTimeWindows])

    useEffect(() => {
        setData(generateZoneSlots(gap, localZoneWindows, zones, slotRange?.start, slotRange?.end));
    }, [gap, localZoneWindows, slotRange, zones])


    const handleSelect = (zoneId: number, start: string) => (e: React.ChangeEvent<{value: unknown}>) => {
        if (e.target.value && typeof e.target.value === 'number') {
            setLocalZoneWindows(prev => {
                let itemToUpdate = prev.find(el => el.start === start);
                const currentZone = zones.find(el => el.id === zoneId);
                if (itemToUpdate) {
                    const zoneToUpdate = itemToUpdate.zones.find(zone => zone.zoneId === zoneId)
                    if (zoneToUpdate) {
                        const updated = {...zoneToUpdate, timeWindow: e.target.value as ETimeWindows};
                        const zones = itemToUpdate.zones.filter(el => el.zoneId !== zoneToUpdate.zoneId).concat(updated)
                        itemToUpdate = {...itemToUpdate, zones};
                        return prev.filter(item => item.id !== itemToUpdate?.id).concat(itemToUpdate)
                    } else {
                        itemToUpdate = {...itemToUpdate, zones:
                                [...itemToUpdate.zones, {
                                    zoneId,
                                    timeWindow: e.target.value as ETimeWindows,
                                    timeSlotType: gap,
                                    zoneName: currentZone?.name ?? ''
                                }]
                        };
                        return prev.filter(item => item.id !== itemToUpdate?.id).concat(itemToUpdate)
                    }
                } else {
                    const zone = zones.find(el => el.id === zoneId)
                    if (zone) {
                        const mappedZones = zones.filter(el => el.id !== zone.id).map(item => ({
                            zoneId: item.id,
                            timeWindow: ETimeWindows.NotAvailable,
                            timeSlotType: gap,
                            zoneName: item.name
                        }))
                        return [...prev, {
                            start,
                            id: 0,
                            zones: [...mappedZones, {
                                zoneId,
                                timeWindow: e.target.value as ETimeWindows,
                                timeSlotType: gap,
                                zoneName: zone.name
                            }]}]
                    } else return prev
                }
            })
        }
    }

    const getRowData = (): TableRowDataType<IZoneTimeSlot>[] => {
        const data: TableRowDataType<IZoneTimeSlot>[] = [
            {
                header: "TIME OF DAY",
                width: 136,
                val: (el) => <span style={{fontWeight: 'bold'}}>{moment(el.start).format('HH:mm a')}</span>
            }
        ]
        const zonesData: TableRowDataType<IZoneTimeSlot>[] = zones.map(item => {
            return {
                header: item.name.toUpperCase(),
                width: 170,
                val: el =>
                    <CustomSelect
                        fullWidth
                        IconComponent={KeyboardArrowDown}
                        disabled={!isEdit || isZonesLoading || isLoading}
                        placeholder='Select Time Window'
                        onChange={handleSelect(item.id, el.start)}
                        value={el.zones.find(zone => zone.zoneId === item.id)?.timeWindow}
                        input={
                            <CustomInput />
                        }
                    >
                        {timeWindowOptions.map(op => {
                            return <MenuItem key={op.name} value={op.value}>
                                {op.name}</MenuItem>
                        })}
                    </CustomSelect>
            }
        })
        return [...data, ...zonesData];
    }

    const handleGapChange = (e: React.ChangeEvent<HTMLInputElement>, value: string) => {
        setEdit && setGap(Number(value) as EZoneTimeGap)
    }

    const handleEditCancel = () => {
        setEdit(false)
    }

    const handleSave = () => {
        setEdit(false)
    }

    return (
        <CustomPaper variant="outlined">
            <ControlsWrapper>
                <RadioWrapper>
                    <RadioLabel>Gap Slots:</RadioLabel>
                    <CustomRadioGroup
                        value={gap}
                        onChange={handleGapChange}
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group">
                        <FormControlLabel
                            value={EZoneTimeGap.Small}
                            disabled={isLoading || isZonesLoading}
                            control={<Radio color="primary" size="small"/>}
                            label="15 min" />
                        <FormControlLabel
                            value={EZoneTimeGap.Medium}
                            disabled={isLoading || isZonesLoading}
                            control={<Radio color="primary" size="small"/>}
                            label="30 min" />
                        <FormControlLabel
                            value={EZoneTimeGap.Large}
                            disabled={isLoading || isZonesLoading}
                            control={<Radio color="primary" size="small"/>}
                            label="60 min" />
                    </CustomRadioGroup>
                </RadioWrapper>
                {isEdit
                    ? isLoading ? <CircularProgress color="primary" className={classes.progress} />
                        : <div className={classes.editSaveButtons}>
                            <Button
                                className={classes.editButton}
                                color="secondary"
                                onClick={handleEditCancel}>
                                Cancel
                            </Button>
                            <Button
                                className={classes.editButton}
                                color="primary"
                                onClick={handleSave}>
                                Save
                            </Button>
                        </div>
                    : <Button
                        color="primary"
                        className={classes.editButton}
                        onClick={() => setEdit(true)}>
                        Edit
                    </Button>
                }
            </ControlsWrapper>
            <div className={classes.tableWrapper}>
                <Table
                    data={data}
                    index="start"
                    rowData={getRowData()}
                    hidePagination
                    isLoading={isLoading || isZonesLoading}
                    borderHeader
                />
            </div>
        </CustomPaper>
    );
};

export default ZoneTimeWindows;