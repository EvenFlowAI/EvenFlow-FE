import React from "react";
import {Table} from "../../UI/Table";
import {IconButton} from "@material-ui/core";
import {Edit, Visibility} from "@material-ui/icons";
import {TableRowDataType} from "../../UI/types";

interface IServiceRow {
    name: string;
    locations: number;
    employees: number;
    address: string;
}

const data: IServiceRow[] = [
    {
        name: "Honda East",
        locations: 4,
        employees: 45,
        address: "6391 Elgin St. Celina, Delaware 10299"
    },
    {
        name: "BMW car",
        locations: 3,
        employees: 55,
        address: "2972 Westheimer Rd. Santa Ana, Illinois 85486 "
    },
    {
        name: "Mercedes trust corp.",
        locations: 10,
        employees: 104,
        address: "1901 Thornridge Cir. Shiloh, Hawaii 81063"
    },
];
const rowData: TableRowDataType<IServiceRow>[] = [
    {val: el => el.name, header: "Name"},
    {val: el => el.locations.toString(), header: "Locations", align: "center"},
    {val: el => el.employees.toString(), header: "Employees", align: "center"},
    {val: el => el.address, header: "Address"}
];


export const ServiceCenterProfiles = () => {
    const handleView = (el: IServiceRow) => () => alert(`View ${el.name}`);
    const handleEdit = (el: IServiceRow) => () => alert(`Update ${el.name}`);
    const viewActions = (el: IServiceRow) => (<>
        <IconButton size="small" onClick={handleView(el)}><Visibility /></IconButton>
        <IconButton size="small" onClick={handleEdit(el)}><Edit /></IconButton>
    </>);

    return <Table
        data={data}
        noDataTitle="No service centers present"
        isLoading={false}
        rowData={rowData}
        index="name"
        actions={viewActions}
    />
}