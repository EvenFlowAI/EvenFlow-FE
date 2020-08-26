import React from "react";
import {DialogProps} from "../types";
import {BaseModal, DialogActions, DialogTitle} from "../BaseModal";
import {Button} from "@material-ui/core";
import {TableRowDataType} from "../../UI/types";
import {Table} from "../../UI/Table";
import {CheckCircle} from "@material-ui/icons";


type TBay = {
    title: string;
    alignmentEquipment: boolean;
    carryingCapacity: boolean;
    onlyQuickService: boolean;
}
const rowData: TableRowDataType<TBay>[] = [
    {header: "Bay", val: v => v.title},
    {header: "Alignment Equipment", align: "center", val: v => v.alignmentEquipment ? <CheckCircle color="primary" /> : ""},
    {header: "Carrying Capacity", align: "center", val: v => v.carryingCapacity ? <CheckCircle color="primary" /> : ""},
    {header: "Only Quick Service", align: "center", val: v => v.onlyQuickService ? <CheckCircle color="primary" /> : ""},
];
const items: TBay[] = [
    {title: "Bay 1", alignmentEquipment: false, carryingCapacity: false, onlyQuickService: true},
    {title: "Bay 2", alignmentEquipment: false, carryingCapacity: true, onlyQuickService: true},
    {title: "Bay 3", alignmentEquipment: false, carryingCapacity: false, onlyQuickService: true},
    {title: "Bay 4", alignmentEquipment: false, carryingCapacity: false, onlyQuickService: true},
    {title: "Bay 5", alignmentEquipment: true, carryingCapacity: false, onlyQuickService: false},
    {title: "Bay 6", alignmentEquipment: true, carryingCapacity: false, onlyQuickService: false},
    {title: "Bay 7", alignmentEquipment: true, carryingCapacity: true, onlyQuickService: false},
    {title: "Bay 8", alignmentEquipment: true, carryingCapacity: false, onlyQuickService: false},
    {title: "Bay 9", alignmentEquipment: false, carryingCapacity: true, onlyQuickService: false},
    {title: "Bay 10", alignmentEquipment: false, carryingCapacity: true, onlyQuickService: false},
];

export const Bays: React.FC<DialogProps> = props => {
    return <BaseModal {...props} width={700}>
        <DialogTitle onClose={props.onClose}>Bays</DialogTitle>
        <Table<TBay> rowData={rowData} data={items} index={"title"} compact hidePagination />
        <DialogActions>
            <Button variant="contained" color="primary" onClick={props.onClose}>Close</Button>
        </DialogActions>
    </BaseModal>
}