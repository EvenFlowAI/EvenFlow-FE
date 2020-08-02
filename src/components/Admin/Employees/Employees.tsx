import React from "react";
import {Table} from "../../UI/Table";
import {IconButton} from "@material-ui/core";
import {Visibility} from "@material-ui/icons";
import {TableRowDataType} from "../../UI/types";


interface EmployeeRow {
    technicianName: string; serviceName: string; serviceLocation: string; serviceLevel: number;
}

const data: EmployeeRow[] = [
    {technicianName: "Devon Lane", serviceName: "Honda Service",
        serviceLocation: "1901 Thornridge Cir. Shiloh, Chicago 39495", serviceLevel: 1},
    {technicianName: "Wade Warren", serviceName: "Honda Service",
        serviceLocation: "2118 Thornridge Cir. Syracuse, Chicago 39495", serviceLevel: 1},
    {technicianName: "Dianne Russell", serviceName: "Audi service",
        serviceLocation: "2715 Ash Dr. San Jose, Chicago 39495", serviceLevel: 2},
];

const rowData: TableRowDataType<EmployeeRow>[] = [
    {val: (el: EmployeeRow) => el.technicianName, header: "Technician Name"},
    {val: (el: EmployeeRow) => el.serviceName, header: "Service Name"},
    {val: (el: EmployeeRow) => el.serviceLocation, header: "Service Location"},
    {val: (el: EmployeeRow) => el.serviceLevel.toString(), header: "Level", align: "center"},
];


export const Employees = () => {
    const handleView = (el: EmployeeRow) => () => alert(`View ${el.technicianName}`);
    const viewActions = (el: EmployeeRow) => (
        <IconButton size="small" onClick={handleView(el)}><Visibility /></IconButton>
    );

    return <Table
        data={data}
        noDataTitle="No employees present"
        isLoading={false}
        rowData={rowData}
        index="technicianName"
        actions={viewActions}
    />
}