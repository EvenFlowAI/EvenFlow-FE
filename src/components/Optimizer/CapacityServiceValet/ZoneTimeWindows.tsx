import React, {useEffect, useState} from 'react';
import {
    ETimeWindows,
    EZoneTimeGap,
    IZonesRoutingByDay,
    IZoneTimeWindow
} from "../../../store/reducers/capacityServiceValet/types";
import moment from "moment";
import {generateZoneSlots} from "./utils";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {TableRowDataType} from "../../UI/types";
import Checkbox from "../../UI/Checkbox";
import {MenuItem, Select} from "@material-ui/core";
import {TextField} from "../../UI/TextField";
import {getOptions} from "../../../utils/utils";
import {EServiceType} from "../../../store/reducers/appointmentFrameReducer/types";

const timeWindowOptions = getOptions(Object.keys(ETimeWindows).filter(key => Number.isNaN(+key)))

const ZoneTimeWindows = () => {
    const {zones, isLoading: isZonesLoading} = useSelector((state: RootState) => state.serviceValet);
    const [gap, setGap] = useState<EZoneTimeGap>(EZoneTimeGap.Medium);
    const [timeSlots, setTimeSlots] = useState<moment.Moment[]>([])
    const [data, setData] = useState<TableRowDataType<IZoneTimeWindow>[]>([]);

    useEffect(() => {
        getRowData()
    }, [timeSlots, zones])

    const handleSelect = (zoneId: number, slotId: number) => (e: React.ChangeEvent<{value: unknown}>) => {

    }

    useEffect(() => {
        setTimeSlots(generateZoneSlots(gap));
    }, [gap])


    const getRowData = (): TableRowDataType<IZoneTimeWindow>[] => {
        const data: TableRowDataType<IZoneTimeWindow>[] = [
            {
                header: "TIME OF DAY",
                width: 200,
                val: (el, index) => moment(el.start).format('HH:MM ')
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
                    onChange={handleSelect(el.zoneId, el.id)}
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
        <div>
            Zone Time Windows
        </div>
    );
};

export default ZoneTimeWindows;