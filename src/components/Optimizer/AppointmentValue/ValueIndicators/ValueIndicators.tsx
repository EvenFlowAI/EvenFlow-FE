import React, {useEffect, useState} from "react";
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
import {useDispatch} from "react-redux";
import {loadValueSettings} from "../../../../store/reducers/valueSettings/actions";
import {useSCs} from "../../../../utils/hooks";
import {Indicators, IValueSettings} from "../../../../store/reducers/valueSettings/types";
import {noop} from "../../../../utils/utils";


enum SliderRange {
    Max= 10, Min= -10
}

type TForm = {
    [K in Indicators]: IValueSettings;
}

type TColumn = {
    label: string;
    id: number;
    width: string;
    cellProps?: TableCellProps;
}

type TRow = {
    id: Indicators;
    title: string;
}

const data: TRow[] = [
    {id: Indicators.NewCustomer, title: "New customer"},
    {id: Indicators.LostCustomer, title: "Lost customer"},
    {id: Indicators.UrgencyFlag, title: "Urgency Flag"},
    {id: Indicators.EndOfWarranty, title: "End of Warranty"},
    {id: Indicators.CustomerLifetimeLow, title: "Customer Lifetime: Low"},
    {id: Indicators.CustomerLifetimeHigh, title: "Customer Lifetime: High"},
];
const blankRow: IValueSettings = {
    point: 0,
    serviceCenterId: 0,
    state: 0,
    type: Indicators.NewCustomer
}
const initialForm: TForm = data.reduce((acc, i) => {
    return {...acc, [i.id]: {...blankRow, type: i.id}};
}, {} as TForm);

const columns: TColumn[] = [
    {label: "Value Lever", id: 0, width: "25%"},
    {label: "Optimization Settings", id: 1, width: "auto"},
    {label: "OFF/ON", id: 2, width: "10%"},
    {label: "", id: 3, width: "20%", cellProps: {align: "right"}}
]
type TRowProps = {
    rowData: TRow;
    value: IValueSettings;
    disabled: boolean;
    onSwitch: (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
    onSlide: (e: React.ChangeEvent<{}>, val: number | number[]) => void;
    onEdit: () => void;
    onCancel: () => void;
    onSave: () => void;
}
const Row: React.FC<TRowProps> = props => {
    return <TableRow>
        <TableCell>{props.rowData.title}</TableCell>
        <TableCell>
            <ValueSlider
                min={SliderRange.Min}
                max={SliderRange.Max}
                onChange={props.onSlide}
                disabled={props.disabled}
                marks={[
                    {value: SliderRange.Min, label: SliderRange.Min},
                    {value: SliderRange.Max, label: SliderRange.Max}
                ]}
                valueLabelDisplay="on"
                value={props.value.point}
            />
        </TableCell>
        <TableCell>
            <Switch
                color="primary"
                onChange={props.onSwitch}
                checked={Boolean(props.value.state)}
            />
        </TableCell>
        <TableCell align="right">
            {props.disabled
                ? <Button
                    color="primary"
                    onClick={props.onEdit}
                >
                    Edit
                </Button>
                : <>
                    <Button
                        onClick={props.onCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        color="primary"
                        onClick={props.onSave}
                    >
                        Save
                    </Button>
                </>
            }
        </TableCell>

    </TableRow>
}

export const ValueIndicators = () => {
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();
    const [form, setForm] = useState<TForm>(initialForm);
    const [editItem, setEditItem] = useState<IValueSettings|null>(null);

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadValueSettings(selectedSC.id));
        }
    }, [selectedSC, dispatch]);

    const handleChange = (_: any, val: number | number[]) => {
        if (editItem) {
            setEditItem({...editItem, point: val as number});
        }
    }
    const handleSwitch = (i: Indicators) => (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setEditItem({...form[i], state: Number(checked)});
    }
    const handleCancel = () => {
        setEditItem(null);
    }
    const handleEdit = (i: Indicators) => () => {
        setEditItem({...form[i]});
    }
    const handleSave = () => {

    }

    return <div>
        <AppointmentTable>
            <TableHead>
                <TableRow>
                    {columns.map(col =>
                        <TableCell style={{width: col.width}} key={col.id}>{col.label}</TableCell>
                    )}
                </TableRow>
            </TableHead>
            <TableBody>
                {data.map((row) => {
                    return <Row
                        value={editItem && editItem.type === row.id ? editItem : form[row.id]}
                        rowData={row}
                        key={row.id}
                        disabled={editItem === null || editItem.type !== row.id}
                        onSwitch={handleSwitch(row.id)}
                        onCancel={handleCancel}
                        onSlide={handleChange}
                        onEdit={handleEdit(row.id)}
                        onSave={handleSave}
                    />
                })}
            </TableBody>
        </AppointmentTable>
    </div>
}