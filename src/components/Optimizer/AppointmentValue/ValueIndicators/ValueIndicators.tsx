import React from "react";
import {AppointmentTable, ValueSlider} from "../UI";
import {
    Button,
    Switch,
    TableBody,
    TableCell,
    TableCellProps,
    TableHead,
    TableRow
} from "@material-ui/core";

enum Indicators {
    NewCustomer,
    LostCustomer,
    UrgencyFlag,
    EndOfWarranty,
    CustomerLifetimeValue
}

type TData = {
    id: Indicators;
    name: string;
    val: number;
    checked: boolean;
}

const data: TData[] = [
    {name: "New customer", id: Indicators.NewCustomer, val: 5, checked: false},
    {name: "Lost customer", id: Indicators.LostCustomer, val: 2, checked: false},
    {name: "Urgency Flag", id: Indicators.UrgencyFlag, val: 1, checked: true},
    {name: "End of Warranty", id: Indicators.EndOfWarranty, val: 2, checked: false},
    {name: "Customer Lifetime Value", id: Indicators.CustomerLifetimeValue, val: 10, checked: true},
];

type TRow<Item> = {
    label: string;
    id: number;
    val: (el: Item) => JSX.Element | string;
    classes?: string;
    cellProps?: TableCellProps
}
const columns: TRow<TData>[] = [
    {label: "Value Lever", id: 0, val: el => el.name},
    {
        label: "Optimization Settings", id: 1,
        val: el => <ValueSlider
            min={-10}
            max={10}
            valueLabelDisplay="on"
            defaultValue={el.val}
        />
    },
    {
        label: "OFF/ON", id: 2,
        val: el => <Switch
            color="primary"
            defaultChecked={el.checked}
        />
    },
    {label: "", id: 3, val: el => <Button color="primary">Edit</Button>, cellProps: {align: "right"}}
]

export const ValueIndicators = () => {
    return <div>
        <AppointmentTable>
            <TableHead>
                <TableRow>
                    {columns.map(col =>
                        <TableCell key={col.id}>{col.label}</TableCell>
                    )}
                </TableRow>
            </TableHead>
            <TableBody>
                {data.map(el => {
                    return <TableRow key={el.id}>
                        {columns.map(cell => {
                            return <TableCell key={cell.id} {...cell.cellProps}>{cell.val(el)}</TableCell>;
                        })}
                    </TableRow>
                })}
            </TableBody>
        </AppointmentTable>
    </div>
}