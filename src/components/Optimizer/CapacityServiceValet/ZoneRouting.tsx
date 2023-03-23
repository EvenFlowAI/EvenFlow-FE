import React, {useEffect, useState} from 'react';
import {TableRowDataType} from "../../UI/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import Checkbox from "../../UI/Checkbox";
import {EDaysFromMonday, IZonesRoutingByDay} from "../../../store/reducers/capacityServiceValet/types";
import {Table} from "../../UI/Table";
import {Loading} from "../../UI/Loading";
import {useSCs} from "../../../utils/hooks";
import {loadZonesRouting, updateZonesRouting} from "../../../store/reducers/capacityServiceValet/actions";
import {EDay} from "../../../store/reducers/demandSegments/types";

const dayNames = Object.keys(EDay).filter(key => Number.isNaN(+key));

const ZoneRouting = () => {
    const {zones, isLoading: isZonesLoading} = useSelector((state: RootState) => state.serviceValet);
    const {zonesRouting, isLoading} = useSelector((state: RootState) => state.capacityServiceValet);
    const [initialZones, setInitialZones] = useState<IZonesRoutingByDay[]>([]);
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();

    useEffect(() => {
        if (selectedSC) dispatch(loadZonesRouting(selectedSC.id))
    }, [selectedSC])

    useEffect(() => {
        setInitialZones([1, 2, 3, 4, 5, 6, 0].map(item => {
            const existingDay = zonesRouting.find(el => el.dayOfWeek.toString() === item.toString())
            return existingDay ?? {dayOfWeek: item, geographicZoneIds: []}
        }))
    }, [zonesRouting])

    const onCheckboxChange = (zoneId: number, dayOfWeek: EDaysFromMonday) => (e: any, checked: boolean) => {
        const dayOfWeekData = initialZones.find(item => item.dayOfWeek === dayOfWeek);
        if (dayOfWeekData && selectedSC) {
            let updatedData: IZonesRoutingByDay = {...dayOfWeekData};
            if (checked) {
                updatedData = {...updatedData, geographicZoneIds: [...updatedData.geographicZoneIds, zoneId]}
            } else {
                updatedData = {...updatedData, geographicZoneIds: updatedData.geographicZoneIds.filter(el => el !== zoneId)}
            }
            const data = zonesRouting.filter(item => item.dayOfWeek !== dayOfWeek).concat(updatedData)
            dispatch(updateZonesRouting(selectedSC.id, data))
        }
    }

    const getRowData = (): TableRowDataType<IZonesRoutingByDay>[] => {
        const data: TableRowDataType<IZonesRoutingByDay>[] = [
            {
                header: "DAY OF WEEK",
                width: 200,
                val: el => dayNames[el.dayOfWeek].toString()
            }
        ]
        const zonesData: TableRowDataType<IZonesRoutingByDay>[] = zones.map(item => {
            return {
                header: item.name.toUpperCase(),
                width: 100,
                val: el => <Checkbox
                    color="primary"
                    checked={Boolean(el.geographicZoneIds.find(zoneId => item.id === zoneId))}
                    onChange={onCheckboxChange(item.id, el.dayOfWeek)}
                />
            }
        })
        return [...data, ...zonesData];
    }
    
    return isLoading || isZonesLoading
        ? <Loading/>
        : <div style={{width: 'fit-content', overflowX: 'auto'}}>
            <Table<IZonesRoutingByDay>
                data={initialZones}
                index={"dayOfWeek"}
                rowData={getRowData()}
                hidePagination
                borderHeader
            />
        </div>
};

export default ZoneRouting;