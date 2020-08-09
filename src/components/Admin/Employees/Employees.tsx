import React from "react";
import {Table} from "../../UI/Table";
import {IconButton} from "@material-ui/core";
import {Visibility} from "@material-ui/icons";
import {TableRowDataType} from "../../UI/types";
import {TableAvatar} from "../TableAvatar";


interface EmployeeRow {
    name: string; dealershipGroup: string; serviceCenterAddress: string; role: string;
}

const data: EmployeeRow[] = [
    {name: "Devon Lane", dealershipGroup: "Honda Service",
        serviceCenterAddress: "1901 Thornridge Cir. Shiloh, Chicago 39495", role: "Owner"},
    {name: "Wade Warren", dealershipGroup: "Honda Service",
        serviceCenterAddress: "2118 Thornridge Cir. Syracuse, Chicago 39495", role: "Technician (1)"},
    {name: "Dianne Russell", dealershipGroup: "Audi service",
        serviceCenterAddress: "2715 Ash Dr. San Jose, Chicago 39495", role: "Advisor"},
];

const rowData: TableRowDataType<EmployeeRow>[] = [
    {val: (el: EmployeeRow) => el.name, header: "Name"},
    {val: (el: EmployeeRow) => el.dealershipGroup, header: "Dealership group"},
    {val: (el: EmployeeRow) => el.serviceCenterAddress, header: "Service center address"},
    {val: (el: EmployeeRow) => el.role, header: "Role"},
];


export const Employees = () => {
    const handleView = (el: EmployeeRow) => () => alert(`View ${el.name}`);
    const viewActions = (el: EmployeeRow) => (
        <IconButton size="small" onClick={handleView(el)}><Visibility /></IconButton>
    );
    const startActions = (el: EmployeeRow) => (
        <TableAvatar name={el.name} />
    )

    return <Table
        data={data}
        noDataTitle="No employees present"
        isLoading={false}
        rowData={rowData}
        startActions={startActions}
        index="name"
        actions={viewActions}
    />
}