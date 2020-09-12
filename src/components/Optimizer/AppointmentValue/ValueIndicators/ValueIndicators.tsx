import React, {useCallback, useEffect, useMemo, useState} from "react";
import {AppointmentTable, ValueSlider} from "../UI";
import {
    Button as DefaultButton, CircularProgress,
    Switch,
    TableBody,
    TableCell,
    TableCellProps,
    TableHead,
    TableRow, withStyles
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {loadValueSettings, setValueSettings} from "../../../../store/reducers/valueSettings/actions";
import {useException, useMessage, useSCs} from "../../../../utils/hooks";
import {Indicators, IValueSettings} from "../../../../store/reducers/valueSettings/types";
import {SC_UNDEFINED} from "../../../../config/constants";
import {RootState} from "../../../../store/rootReducer";

const Button = withStyles({
    root: {
        fontSize: 14,
        textTransform: "none",
        minWidth: 0,
        padding: "4px 2px",
        marginLeft: 8
    }
})(DefaultButton);


enum SliderRange {
    Max= 10, Min= -10
}

type TData = {
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
    tab: string;
}

const rows: TRow[] = [
    {id: Indicators.NewCustomer, title: "New customer", tab: "3"},
    {id: Indicators.LostCustomer, title: "Lost customer", tab: "3"},
    {id: Indicators.UrgencyFlag, title: "Urgency Flag", tab: "2"},
    {id: Indicators.EndOfWarranty, title: "End of Warranty", tab: "4"},
    {id: Indicators.CustomerLifetimeLow, title: "Customer Lifetime: Low", tab: "1"},
    {id: Indicators.CustomerLifetimeHigh, title: "Customer Lifetime: High", tab: "1"},
];
const blankRow: IValueSettings = {
    point: 0,
    serviceCenterId: 0,
    state: 0,
    type: Indicators.NewCustomer
}
const initialData: TData = rows.reduce((acc, i) => {
    return {...acc, [i.id]: {...blankRow, type: i.id}};
}, {} as TData);

const columns: TColumn[] = [
    {label: "Value Lever", id: 0, width: "25%"},
    {label: "Optimization Settings", id: 1, width: "auto"},
    {label: "OFF/ON", id: 2, width: "10%"},
    {label: "", id: 3, width: "15%", cellProps: {align: "right"}}
]
type TRowProps = {
    rowData: TRow;
    value: IValueSettings;
    loading: boolean;
    isNotSet: boolean;
    disabled: boolean;
    editing: boolean;
    onSwitch: (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
    onSlide: (e: React.ChangeEvent<{}>, val: number | number[]) => void;
    onEdit: () => void;
    onTabChange: () => void
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
                disabled={props.isNotSet}
                onChange={props.onSwitch}
                checked={Boolean(props.value.state)}
            />
        </TableCell>
        <TableCell align="right">
            {props.isNotSet
                ? <Button color="primary" onClick={props.onTabChange}>
                    Adjust the value
                </Button>
                : !props.editing
                ? <Button
                    color="primary"
                    onClick={props.onEdit}
                >
                    Edit
                </Button>
                : props.loading ? <CircularProgress /> : <>
                    <Button
                        color="secondary"
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
type TProps = {onTabChange?: (e: any, idx: string) => void}
export const ValueIndicators = ({onTabChange}: TProps) => {
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();
    const [valuesData, configuredValues] = useSelector((state: RootState) => [
        state.valueSettings.valueSettings,
        state.valueSettings.configuredValues
    ]);

    const showError = useException();
    const showMessage = useMessage();
    const [loading, setLoading] = useState<boolean>(false);
    const [editItem, setEditItem] = useState<IValueSettings|null>(null);

    const data: TData = useMemo(() => {
        if (!valuesData.length) {
            return initialData;
        } else {
            return rows.reduce((acc, row) => {
                acc[row.id] = valuesData.find(el => el.type === row.id)
                    || {...blankRow, type: row.id};
                return acc;
            }, {} as TData);
        }
    }, [valuesData]);

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadValueSettings(selectedSC.id));
        }
    }, [selectedSC, dispatch]);

    const handleTabChange = useCallback((idx: string) => (): void => {
        if (onTabChange) {
            onTabChange(null, idx);
        }
    }, [onTabChange])

    const handleChange = (_: any, val: number | number[]) => {
        if (editItem) {
            setEditItem({...editItem, point: val as number});
        }
    }
    const handleSwitch = (i: Indicators) => (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setEditItem({...data[i], state: Number(checked)});
    }
    const handleCancel = () => {
        setEditItem(null);
    }
    const handleEdit = (i: Indicators) => () => {
        setEditItem({...data[i]});
    }
    const handleSave = async () => {
        if (!selectedSC) {
            showError(SC_UNDEFINED);
        } else if (!editItem) {
            showError("No changes found");
        } else {
            const data: IValueSettings = {
                ...editItem, serviceCenterId: selectedSC.id
            }
            try {
                setLoading(true);
                await dispatch(setValueSettings(data));
                setLoading(false);
                showMessage("Saved");
                setEditItem(null);
            } catch (e) {
                setLoading(false);
                showError(e);
            }
        }
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
                {rows.map((row) => {
                    return <Row
                        value={editItem && editItem.type === row.id ? editItem : data[row.id]}
                        rowData={row}
                        loading={loading}
                        isNotSet={!configuredValues.includes(Number(row.id))}
                        onTabChange={handleTabChange(row.tab)}
                        key={row.id}
                        editing={Boolean(editItem && editItem.type === row.id)}
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