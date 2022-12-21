import React, {useEffect, useState} from 'react';
import {
    ETimeWindows,
    EZoneTimeGap,
    IZoneTimeWindow
} from "../../../store/reducers/capacityServiceValet/types";
import moment from "moment";
import {generateZoneSlots} from "./utils";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {TableRowDataType} from "../../UI/types";
import {MenuItem, Select} from "@material-ui/core";
import {TextField} from "../../UI/TextField";
import {getOptions} from "../../../utils/utils";
import {Table} from "../../UI/Table";

const timeWindowOptions = getOptions(Object.keys(ETimeWindows).filter(key => Number.isNaN(+key)))

const ZoneTimeWindows = () => {
    const {zones, isLoading: isZonesLoading} = useSelector((state: RootState) => state.serviceValet);
    const {zoneTimeWindows, isLoading} = useSelector((state: RootState) => state.capacityServiceValet);
    const {slotRange} = useSelector((state: RootState) => state.slotScoring);
    const [gap, setGap] = useState<EZoneTimeGap>(EZoneTimeGap.Medium);
    const [data, setData] = useState<IZoneTimeWindow[]>([]);

    const handleSelect = (zoneId: number, start: string) => (e: React.ChangeEvent<{value: unknown}>) => {
        console.log(zoneId, start, e.target.value)
    }

    useEffect(() => {
        setData(generateZoneSlots(gap, zoneTimeWindows, slotRange?.start, slotRange?.end));
    }, [gap, zoneTimeWindows, slotRange])

    const getRowData = (): TableRowDataType<IZoneTimeWindow>[] => {
        const data: TableRowDataType<IZoneTimeWindow>[] = [
            {
                header: "TIME OF DAY",
                width: 200,
                val: (el, index) => moment(el.start).format('HH:mm A')
            }
        ]
        const zonesData: TableRowDataType<IZoneTimeWindow>[] = zones.map(item => {
            return {
                header: item.name.toUpperCase(),
                width: 150,
                val: el => <Select
                    fullWidth
                    style={{ marginRight: 20}}
                    placeholder='Role'
                    onChange={handleSelect(item.id, el.start)}
                    value={el.timeWindow}
                    input={
                        <TextField />
                    }
                >
                    {timeWindowOptions.map(op => {
                        return <MenuItem key={op.name} value={op.value}>{op.name}</MenuItem>
                    })}
                </Select>
            }
        })
        return [...data, ...zonesData];
    }

    return (
            <Table data={data} index="start" rowData={getRowData()} hidePagination isLoading={isLoading || isZonesLoading}/>
    );
};

export default ZoneTimeWindows;