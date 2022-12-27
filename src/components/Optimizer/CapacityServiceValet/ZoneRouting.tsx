import React from 'react';
import {TableRowDataType} from "../../UI/types";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import Checkbox from "../../UI/Checkbox";
import {EDaysFromMonday, IZonesRoutingByDay} from "../../../store/reducers/capacityServiceValet/types";
import {Table} from "../../UI/Table";
import {Loading} from "../../UI/Loading";

const dayNames = Object.keys(EDaysFromMonday).filter(key => Number.isNaN(+key));

const ZoneRouting = () => {
    const {zones, isLoading: isZonesLoading} = useSelector((state: RootState) => state.serviceValet);
    const {zonesRouting, isLoading} = useSelector((state: RootState) => state.capacityServiceValet);

    const onCheckboxChange = (zoneId: number, routingId: number) => (e: any, checked:boolean) => {

    }

    const getRowData = (): TableRowDataType<IZonesRoutingByDay>[] => {
        const data: TableRowDataType<IZonesRoutingByDay>[] = [
            {
                header: "DAY OF WEEK",
                width: 200,
                val: el => dayNames[el.day].toString()
            }
        ]
        const zonesData: TableRowDataType<IZonesRoutingByDay>[] = zones.map(item => {
            return {
                header: item.name.toUpperCase(),
                width: 100,
                val: el => <Checkbox checked={Boolean(el.zones.find(zone => item.id === zone.id))} onChange={onCheckboxChange(item.id, el.id)}/>
            }
        })
        return [...data, ...zonesData];
    }
    
    return isLoading || isZonesLoading
        ? <Loading/>
        : <div style={{width: 'fit-content', overflowX: 'auto'}}>
            <Table<IZonesRoutingByDay>
                data={zonesRouting}
                index={"id"}
                rowData={getRowData()}
                hidePagination
                borderHeader
            />
        </div>
};

export default ZoneRouting;