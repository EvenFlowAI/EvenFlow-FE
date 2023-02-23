import React, {useEffect} from 'react';
import {TableRowDataType} from "../../UI/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import Checkbox from "../../UI/Checkbox";
import {EDaysFromMonday, IZonesRoutingByDay} from "../../../store/reducers/capacityServiceValet/types";
import {Table} from "../../UI/Table";
import {Loading} from "../../UI/Loading";
import {useSCs} from "../../../utils/hooks";
import {loadZonesRouting, updateZonesRouting} from "../../../store/reducers/capacityServiceValet/actions";

const dayNames = Object.keys(EDaysFromMonday).filter(key => Number.isNaN(+key));

const ZoneRouting = () => {
    const {zones, isLoading: isZonesLoading} = useSelector((state: RootState) => state.serviceValet);
    const {zonesRouting, isLoading} = useSelector((state: RootState) => state.capacityServiceValet);
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();

    useEffect(() => {
        if (selectedSC) dispatch(loadZonesRouting(selectedSC.id))
    }, [selectedSC])

    const onCheckboxChange = (zoneId: number, dayOfWeek: EDaysFromMonday) => (e: any, checked: boolean) => {
        const dayOfWeekData = zonesRouting.find(item => item.dayOfWeek === dayOfWeek);
        if (dayOfWeekData && selectedSC) {
            let updatedData: IZonesRoutingByDay = {...dayOfWeekData};
            if (checked) {
                updatedData = {...updatedData, geographicZoneIds: [...updatedData.geographicZoneIds, zoneId]}
            } else {
                updatedData = {...updatedData, geographicZoneIds: updatedData.geographicZoneIds.filter(el => el !== zoneId)}
            }
            dispatch(updateZonesRouting(selectedSC.id, updatedData))
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
                val: el => <Checkbox checked={Boolean(el.geographicZoneIds.find(zoneId => item.id === zoneId))} onChange={onCheckboxChange(item.id, el.dayOfWeek)}/>
            }
        })
        return [...data, ...zonesData];
    }
    
    return isLoading || isZonesLoading
        ? <Loading/>
        : <div style={{width: 'fit-content', overflowX: 'auto'}}>
            <Table<IZonesRoutingByDay>
                data={zonesRouting}
                index={"dayOfWeek"}
                rowData={getRowData()}
                hidePagination
                borderHeader
            />
        </div>
};

export default ZoneRouting;