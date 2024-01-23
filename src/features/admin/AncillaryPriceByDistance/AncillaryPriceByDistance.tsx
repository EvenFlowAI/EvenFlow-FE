import React, {useEffect, useState} from 'react';
import {
    TableHead,
    TableBody,
    Menu,
    MenuItem,
    IconButton,
    Button
} from "@mui/material";
import {MoreHoriz} from "@mui/icons-material";
import AddDistanceRangeModal from "./AddDistanceRangeModal/AddDistanceRangeModal";
import {IDistancePriceSettings, TDistanceRange} from "../../../store/reducers/serviceValet/types";
import {Loading} from "../../../components/wrappers/Loading/Loading";
import {NoData} from "../../../components/wrappers/NoData/NoData";
import {AncillaryPriceSlider} from "../../../components/styled/AncillaryPriceSlider";
import {FirstCell, HeaderTableCell, TableCell} from "../../../components/styled/AncillaryPriceComponents";
import {ButtonWrapper, STextField, WideButton} from "./styles";
import {DemandTable} from "../../../components/styled/DemandTable";
import {TableRow} from "../../../components/styled/TableRow";
import {useModal} from "../../../hooks/useModal/useModal";
import {useException} from "../../../hooks/useException/useException";

type TByDistanceProps = {
    data: IDistancePriceSettings[];
    onItemSave: (item: IDistancePriceSettings) => void;
    onItemDelete: (id: number) => void;
    onAddRange: (data: TDistanceRange) => void;
    isLoading: boolean;
}

const AncillaryPriceByDistance: React.FC<React.PropsWithChildren<React.PropsWithChildren<TByDistanceProps>>> = ({ data, onItemDelete, onItemSave, onAddRange, isLoading }) => {
    const [distanceData, setDistanceData] = useState<IDistancePriceSettings[]>([]);
    const [anchorEl, setAnchorEl] = useState<EventTarget&HTMLButtonElement|null>(null);
    const [editedItem, setEditedItem] = useState<IDistancePriceSettings|null>(null);
    const [nextEditedItem, setNextEditedItem] = useState<IDistancePriceSettings|null>(null);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const {onOpen, isOpen, onClose} = useModal();
    const showError = useException();

    useEffect(() => {
        setDistanceData(data.slice().sort((a, b) => a.orderIndex - b.orderIndex));
    }, [data]);

    const checkIsValid = () => {
        if (editedItem) {
            const updated = distanceData.find(el => el.id === editedItem.id);
            if (updated && (updated.minValue > updated.maxValue)) {
                showError('"Min Value" must to be less than or equal to "Max Value"');
                return false;
            }
            if (updated && updated.costPerMile === 0 && updated.serviceMultiplier === 0) {
                showError( "Service Multiplier' or 'Cost Per Mile' must be greater than 0")
                return false;
            }
            if (updated && updated.costPerMile > 0 && updated.serviceMultiplier > 0) {
                showError("Only one value can be greater than 0: 'Service Multiplier' or 'Cost Per Mile'");
                return false;
            }
        }
        return true;
    }

    const handleMenuOpen = (item: IDistancePriceSettings) => (e: React.MouseEvent<HTMLButtonElement>) => {
        if (checkIsValid()) {
            setIsEdit(false);
            setEditedItem(item);
            setAnchorEl(e.currentTarget);
        }
    }
    const editZone = () => {
        setIsEdit(true);
        setAnchorEl(null);
    }

    const deleteSettings = () => {
        if (editedItem) onItemDelete(editedItem.id)
    }

    const handleSlide = (t: number) => (e: any, value: number|number[]) => {
        const item = distanceData.find(item => item.id === t);
        if (typeof value === 'number' && item) {
                const updated = {...item, serviceMultiplier: value};
                setEditedItem(updated);
                setDistanceData(prev => {
                    const filtered = prev.filter(el =>  el.id !== t);
                    return [...filtered, updated]
                        .sort((a, b) => a.orderIndex - b.orderIndex);
                })
        }
    }

    const handleChangeField = (fieldName: string) => ({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
        if (editedItem && Number(value) >= 0) {
            setDistanceData(prev => {
                const itemToUpdate = prev.find(el => el.id === editedItem.id);
                const nextItem = prev.find(el => el.orderIndex === editedItem.orderIndex + 1);
                let nextUpdated: IDistancePriceSettings|null = null;
                if (itemToUpdate) {
                    let newValue = Number(value);
                    if (nextItem && fieldName === 'maxValue') {
                        if (newValue > nextItem.maxValue) {
                            showError('"Max Value" of the Distance Range must be less than or equal to "Max Value" of the next Distance Range');
                            return prev;
                        }
                        nextUpdated = {...nextItem};
                        nextUpdated.minValue = newValue;
                        setNextEditedItem(nextUpdated);
                    }
                    const updated = {...itemToUpdate, [fieldName]: newValue};
                    setEditedItem(updated);
                    const filtered = nextUpdated
                        ? prev.filter(el => el.id !== editedItem?.id && el.id !== nextUpdated?.id)
                        : prev.filter(el => el.id !== editedItem?.id);
                    const data = nextUpdated ? [...filtered, updated, nextUpdated] : [...filtered, updated];
                    return data.sort((a, b) => a.orderIndex - b.orderIndex);
                }
                return prev;
            })
        }
    }

    const onCancel = () => {
        setDistanceData(data.slice().sort((a, b) => a.orderIndex - b.orderIndex))
        setIsEdit(false)
    }

    const onSave = () => {
        if (checkIsValid()) {
            setIsEdit(false)
            if (editedItem) onItemSave(editedItem);
            if (nextEditedItem) onItemSave(nextEditedItem);
        }
    }

    return (
        <div>
            <ButtonWrapper>
                <WideButton color="primary" onClick={onOpen} variant="contained">Add Range</WideButton>
            </ButtonWrapper>
            {isLoading
                ? <Loading/>
                : !data.length
                    ? <NoData/>
                    : <DemandTable>
                        <TableHead>
                            <TableRow>
                                <HeaderTableCell align="left" size="small">
                                    <div className="distanceCell">№</div>
                                </HeaderTableCell>
                                <HeaderTableCell align="left" size="small">
                                    <div className="distanceCell">
                                        Distance
                                        <span>(Range min)</span>
                                    </div>
                                </HeaderTableCell>
                                <HeaderTableCell align="left" size="small">
                                    <div className="distanceCell">
                                        Distance
                                        <span>(Range max)</span>
                                    </div>
                                </HeaderTableCell>
                                <HeaderTableCell align="left" size="small">
                                    <div className="distanceCell">
                                        Cost Per Mile ($)
                                    </div>
                                </HeaderTableCell>
                                <HeaderTableCell align="left" size="small" width={450}>
                                    <div className="distanceCell">
                                        Service Multiplier
                                    </div>
                                </HeaderTableCell>
                                <HeaderTableCell align="left" size="small" width={170}>
                                    {isEdit
                                        ? <>
                                            <Button
                                                onClick={onCancel}
                                                color="secondary"
                                                size="small"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                onClick={onSave}
                                                color="primary"
                                                size="small"
                                            >
                                                Save
                                            </Button>
                                        </>
                                        : null}
                                </HeaderTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {distanceData.map((item, index) => (
                                <TableRow key={item.id}>
                                    <FirstCell size="small">{index + 1}.</FirstCell>
                                    <TableCell size="small">
                                        {isEdit && (editedItem?.id === item.id)
                                            ? <STextField
                                                type="number"
                                                inputProps={{
                                                    min: 0,
                                                    step: 0.01,
                                                }}
                                                value={item?.minValue}
                                                disabled
                                                onChange={handleChangeField('minValue')}
                                            />
                                            : item.minValue.toFixed(2)}
                                    </TableCell>
                                    <TableCell size="small">
                                        {isEdit && (editedItem?.id === item.id)
                                            ? <STextField
                                                type="number"
                                                inputProps={{
                                                    min: 0,
                                                    step: 0.01,
                                                }}
                                                value={item?.maxValue}
                                                onChange={handleChangeField('maxValue')}
                                            />
                                            : item.maxValue.toFixed(2)}
                                    </TableCell>
                                    <TableCell size="small">
                                        {isEdit && (editedItem?.id === item.id)
                                            ? <STextField
                                                type="number"
                                                inputProps={{
                                                    min: 0,
                                                    step: 0.01,
                                                }}
                                                value={item?.costPerMile}
                                                onChange={handleChangeField('costPerMile')}
                                            />
                                            : item.costPerMile.toFixed(2)}
                                    </TableCell>
                                    <TableCell size="small">
                                        <AncillaryPriceSlider
                                            min={0}
                                            max={1}
                                            valueLabelDisplay="on"
                                            step={0.01}
                                            disabled={!isEdit || editedItem?.id !== item.id}
                                            valueLabelFormat={value => value.toFixed(2)}
                                            value={item.serviceMultiplier}
                                            marks={[{label: '0.00', value: 0}, {
                                                label: '0.20',
                                                value: 0.2
                                            }, {label: '0.40', value: 0.4}, {label: '0.60', value: 0.6}, {
                                                label: '0.80',
                                                value: 0.8
                                            }, {label: '1.00', value: 1}]}
                                            onChange={handleSlide(item.id)}
                                        />
                                    </TableCell>
                                    <TableCell size="small" align="right">
                                        <IconButton
                                            size="small"
                                            onClick={handleMenuOpen(item)}>
                                            <MoreHoriz/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                            }
                        </TableBody>
                        <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={() => setAnchorEl(null)}>
                            <MenuItem onClick={editZone}>Edit</MenuItem>
                            <MenuItem onClick={deleteSettings}>Delete</MenuItem>
                        </Menu>
                    </DemandTable>
            }
            <AddDistanceRangeModal open={isOpen} onClose={onClose} onAddRange={onAddRange}/>
        </div>
    );
};

export default AncillaryPriceByDistance;