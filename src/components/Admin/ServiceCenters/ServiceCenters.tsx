import React from "react";
import {TableRowDataType} from "../../UI/types";
import {IconButton} from "@material-ui/core";
import {Visibility} from "@material-ui/icons";
import {TableAvatar} from "../TableAvatar";
import {Table} from "../../UI/Table";

interface ServiceCenter {
    name: string; dealershipGroup: string; serviceCenterAddress: string; bays: number;
}

const data: ServiceCenter[] = [
    {name: "Honda Downtown", dealershipGroup: "Honda",
        serviceCenterAddress: "3891 Ranchview, Chicago, 60600", bays: 6},
    {name: "Audi Kardan center", dealershipGroup: "Audi",
        serviceCenterAddress: "2715 Ash Dr. San Jose, Chicago, 60601", bays: 5},
    {name: "Shtirlitcz BMW Håus", dealershipGroup: "BMW",
        serviceCenterAddress: "2715 Ash Dr. San Jose, Chicago, 60231", bays: 10},
    {name: "Honda North city", dealershipGroup: "Honda",
        serviceCenterAddress: "3891 Ranchview, Chicago, 60600", bays: 2},
    {name: "Audi car downtown center", dealershipGroup: "Audi",
        serviceCenterAddress: "2715 Ash Dr. San Jose, Chicago, 60601", bays: 11},
    {name: "BMW US Bavaria center", dealershipGroup: "BMW",
        serviceCenterAddress: "2715 Ash Dr. San Jose, Chicago, 60231", bays: 1},
];

const rowData: TableRowDataType<ServiceCenter>[] = [
    {val: (el: ServiceCenter) => el.dealershipGroup, header: "Dealership group"},
    {val: (el: ServiceCenter) => el.name, header: "Service center name"},
    {val: (el: ServiceCenter) => el.serviceCenterAddress, header: "Service center address"},
    {val: (el: ServiceCenter) => el.bays.toString(), header: "Bays", align: "center"},
];

export const ServiceCenters = () => {
    const handleView = (el: ServiceCenter) => () => alert(`View ${el.name}`);
    const viewActions = (el: ServiceCenter) => (
        <IconButton size="small" onClick={handleView(el)}><Visibility /></IconButton>
    );
    const startActions = (el: ServiceCenter) => (
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