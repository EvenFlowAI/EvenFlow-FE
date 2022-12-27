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
import {MenuItem, Select, withStyles} from "@material-ui/core";
import {TextField} from "../../UI/TextField";
import {getOptions} from "../../../utils/utils";
import {Table} from "../../UI/Table";
import {KeyboardArrowDown} from "@material-ui/icons";

const timeWindowOptions = getOptions(Object.keys(ETimeWindows).filter(key => Number.isNaN(+key)))

const CustomSelect = withStyles(() => ({
    root: {
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        background: 'transparent'
    }
}))(Select);

const CustomInput = withStyles(() => ({
    root: {
        border: 'none',
        background: 'transparent'
    }
}))(TextField);

const ZoneTimeWindows = () => {
    const {zones, isLoading: isZonesLoading} = useSelector((state: RootState) => state.serviceValet);
    const {zoneTimeWindows, isLoading} = useSelector((state: RootState) => state.capacityServiceValet);
    const {slotRange} = useSelector((state: RootState) => state.slotScoring);
    const [gap, setGap] = useState<EZoneTimeGap>(EZoneTimeGap.Medium);
    const [data, setData] = useState<IZoneTimeSlot[]>([]);
    const [localZoneWindows, setLocalZoneWindows] = useState<IZoneTimeSlot[]>([])

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
                val: (el, index) => <span style={{fontWeight: 'bold'}}>{moment(el.start).format('HH:mm a')}</span>
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

    return (
        <div style={{width: 'fit-content', overflowX: 'auto'}}>
            <Table data={data} index="start" rowData={getRowData()} hidePagination isLoading={isLoading || isZonesLoading}/>
        </div>
    );
};

export default ZoneTimeWindows;