import React from "react";
import {Table} from "../../UI/Table";
import {IconButton} from "@material-ui/core";
import {Visibility} from "@material-ui/icons";


interface IServiceRow {
    technicianName: string; serviceName: string; serviceLocation: string; serviceLevel: number;
}

const data: IServiceRow[] = [
    {technicianName: "Devon Lane", serviceName: "Honda Service",
        serviceLocation: "1901 Thornridge Cir. Shiloh, Chicago 39495", serviceLevel: 1},
    {technicianName: "Wade Warren", serviceName: "Honda Service",
        serviceLocation: "2118 Thornridge Cir. Syracuse, Chicago 39495", serviceLevel: 1},
    {technicianName: "Dianne Russell", serviceName: "Audi service",
        serviceLocation: "2715 Ash Dr. San Jose, Chicago 39495", serviceLevel: 2},
];

const rowData = [
    {val: (el: IServiceRow) => el.technicianName, header: "Technician Name"},
    {val: (el: IServiceRow) => el.serviceName, header: "Service Name"},
    {val: (el: IServiceRow) => el.serviceLocation, header: "Service Location"},
    {val: (el: IServiceRow) => el.serviceLevel.toString(), header: "Level"},
];


export const ServiceCenterProfiles = () => {
    const handleView = (el: IServiceRow) => () => alert(`View ${el.technicianName}`);
    const viewActions = (el: IServiceRow) => (
        <IconButton size="small" onClick={handleView(el)}><Visibility /></IconButton>
    );
    return <Table
        data={data}
        rowData={rowData}
        index="technicianName"
        actions={viewActions}
    />
}