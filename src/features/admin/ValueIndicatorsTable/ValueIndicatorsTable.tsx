import React, {useCallback, useEffect, useMemo, useState} from "react";
import {
    TableBody,
    TableCell,
    TableHead,
    TableRow, useMediaQuery, useTheme
} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {loadValueSettings, setValueSettings} from "../../../store/reducers/valueSettings/actions";
import {Indicators, IValueSettings} from "../../../store/reducers/valueSettings/types";
import {SC_UNDEFINED} from "../../../utils/constants";
import {RootState} from "../../../store/rootReducer";
import {StyledTable} from "../../../components/styled/StyledTable";
import {ValueIndicatorsRow} from "./ValueIndicatorsRow/ValueIndicatorsRow";
import {TData} from "./types";
import {blankRow, columns, initialData, rows} from "./constants";

import {useMessage} from "../../../hooks/useMessage/useMessage";
import {useException} from "../../../hooks/useException/useException";
import {useSCs} from "../../../hooks/useSCs/useSCs";
import {useSelectedPod} from "../../../hooks/useSelectedPod/useSelectedPod";

type TProps = {onTabChange?: (e: any, idx: string) => void}

export const ValueIndicatorsTable = ({onTabChange}: TProps) => {
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();
    const {selectedPod} = useSelectedPod();
    const {valueSettings: valuesData, configuredValues} = useSelector((state: RootState) => state.valueSettings);

    const showError = useException();
    const showMessage = useMessage();
    const [loading, setLoading] = useState<boolean>(false);
    const [editItem, setEditItem] = useState<IValueSettings|null>(null);
    const theme = useTheme();
    const isXS = useMediaQuery(theme.breakpoints.down('sm'));

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
            dispatch(loadValueSettings(selectedSC.id, selectedPod?.id));
        }
    }, [selectedSC, selectedPod, dispatch]);

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
                ...editItem, serviceCenterId: selectedSC.id, podId: selectedPod?.id
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
        <StyledTable>
            <TableHead>
                <TableRow>
                    {columns.map(col => {
                        if (isXS && !col.id) {
                            return null;
                        }
                        return <TableCell style={{width: col.width}} key={col.id}>{col.label}</TableCell>;
                    })}
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map((row) => {
                    return <ValueIndicatorsRow
                        value={editItem && editItem.type === row.id ? editItem : data[row.id]}
                        rowData={row}
                        loading={loading}
                        isXS={isXS}
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
        </StyledTable>
    </div>
}