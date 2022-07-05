import React, {useEffect, useState} from 'react';
import {
    styled,
    TableHead,
    withStyles,
    TableBody,
    Menu,
    MenuItem,
    IconButton,
    Button
} from "@material-ui/core";
import {DemandTable, TableRow} from "../../AppointmentAllocation/UI";
import {ValueSlider} from "../../AppointmentValue/UI";
import {MoreHoriz} from "@material-ui/icons";
import {TextField} from "../../../UI/TextField";
import {HeaderTableCell, FirstCell, TableCell} from "./ByDistance";
import {IZonePriceSettings} from "../../../../store/reducers/serviceValet/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {useSCs} from "../../../../utils/hooks";
import {
    deleteServiceValetPrisingByZones,
    updateServiceValetPrisingByZones
} from "../../../../store/reducers/serviceValet/actions";

export const TablesWrapper = styled('div')({
    padding: 24,
    border: '1px solid #DADADA',
    backgroundColor: "#FFFFFF",
})

const STextField = styled(TextField)({
    maxWidth: 100
});

const Slider = withStyles((theme) => ({
    rail: {
        background: "#3261FB",
        opacity: 1
    },
    track: {
        background: "transparent",
    },
    mark: {
        height: 4,
        width: 1,
    },
    markLabel: {
        top: 25,
        color: "#9FA2B4",
        fontWeight: 'bold',
        fontSize: 12,
    },
    thumb: {
        width: 18,
        height: 18,
        background: "#3261FB",
        border: '2px solid #FFFFFF',
        marginTop: -7,
    },
    valueLabel: {
        top: -20,
        left: -8,
        transition: theme.transitions.create(["box-shadow"]),
        '&:focus, &:hover, &:active': {
            boxShadow: '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.2),0 0 0 1px rgba(0,0,0,0.02)',
            '@media (hover: none)': {
                boxShadow: '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)',
            },
        },
        "&>span": {
            boxShadow: "1px 4px 10px rgba(0, 44, 131, 0.3)",
            width: 'fit-content',
            height: 22,
            transform: "none",
            padding: 6,
            "&>span": {
                transform: "none",
                color: theme.palette.text.primary,
            },
        }
    }
}))(ValueSlider);

const data: IZonePriceSettings[] = [
    {
        zoneName: 'Zone 1',
        zoneId: 1,
        flatFee: 11,
        serviceMultiplier: 0.2,
    },
    {
        zoneName: 'Zone 2',
        zoneId: 2,
        flatFee: 12,
        serviceMultiplier: 0.3,
    },
    {
        zoneName: 'Zone 3',
        zoneId: 3,
        flatFee: 13,
        serviceMultiplier: 0.1,
    }
]

const ByZone = () => {
    const {pricingByZones} = useSelector((state: RootState) => state.serviceValet)
    const [zonesData, setZonesData] = useState<IZonePriceSettings[]>([]);
    const [anchorEl, setAnchorEl] = useState<EventTarget&HTMLButtonElement|null>(null);
    const [editedItem, setEditedItem] = useState<IZonePriceSettings|null>(null);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();

    useEffect(() => {
        setZonesData(data.sort((a, b) => a.zoneId - b.zoneId));
    }, [data]);

    const handleMenuOpen = (item: IZonePriceSettings) => (e: React.MouseEvent<HTMLButtonElement>) => {
        setIsEdit(false);
        setEditedItem(item);
        setAnchorEl(e.currentTarget);
    }
    const editZone = () => {
        setIsEdit(true);
        setAnchorEl(null);
    }

    const deleteSettings = () => {
        if (selectedSC && editedItem) {
            dispatch(deleteServiceValetPrisingByZones(selectedSC.id, editedItem.id))
        }
    }

    const handleSlide = (t: number) => (e: any, value: number|number[]) => {
        if (typeof value === 'number') {
            const item = zonesData.find(item => item.zoneId === t);
            if (item) {
                const updated = {...item, serviceMultiplier: value};
                setZonesData(prev => {
                    const filtered = prev.filter(el =>  el.zoneId !== t);
                    return [...filtered, updated].sort((a, b) => a.zoneId - b.zoneId);
                })
            }
        }
    }

    const handleChangeFee = ({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
        if (Number(value) >= 0) {
            setZonesData(prev => {
                const itemToUpdate = prev.find(el => el.zoneId === editedItem?.zoneId);
                if (itemToUpdate) {
                    const updated = {...itemToUpdate, flatFee: Number(value)};
                    const filtered = prev.filter(el => el.zoneId !== editedItem?.zoneId);
                    return [...filtered, updated].sort((a, b) => a.zoneId - b.zoneId);
                }
                return prev;
            })
        }
    }

    const onCancel = () => {
        setZonesData(data)
        setIsEdit(false)
    }

    const onSave = () => {
        setIsEdit(false)
        if (selectedSC && editedItem) {
            // todo data
            dispatch(updateServiceValetPrisingByZones(selectedSC.id))
        }
    }

    return (
            <DemandTable>
                <TableHead>
                    <TableRow>
                        <HeaderTableCell align="left" size="small">
                            <div className="distanceCell">№</div>
                        </HeaderTableCell>
                        <HeaderTableCell align="left" size="small">
                            <div className="distanceCell">Zone</div>
                        </HeaderTableCell>
                        <HeaderTableCell align="left" size="small">
                            <div className="distanceCell">Flat Fee, $</div>
                        </HeaderTableCell>
                        <HeaderTableCell align="left" size="small">
                            <div className="distanceCell">Service Multiplier</div>
                        </HeaderTableCell>
                        <HeaderTableCell align="left" size="small" width={170}>
                            {isEdit
                                ? <>
                                    <Button
                                        onClick={onCancel}
                                        color="secondary"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={onSave}
                                        color="primary"
                                    >
                                        Save
                                    </Button>
                                </>
                                : null }
                        </HeaderTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {zonesData.map((item, index) => (
                        <TableRow key={item.zoneId}>
                            <FirstCell size="small">{index + 1}.</FirstCell>
                            <TableCell size="small"> {item.zoneName}</TableCell>
                            <TableCell size="small">
                                {isEdit && (editedItem?.zoneId === item.zoneId)
                                    ? <STextField
                                        type="number"
                                        inputProps={{
                                            min: 0,
                                            step: 0.01,
                                        }}
                                        value={+item?.flatFee?.toFixed(2)}
                                        onChange={handleChangeFee}
                                    />
                                    : item.flatFee.toFixed(2)}
                            </TableCell>
                            <TableCell size="small">
                                <Slider
                                    min={0}
                                    max={1}
                                    valueLabelDisplay="on"
                                    step={0.01}
                                    disabled={!isEdit || editedItem?.zoneId !== item.zoneId}
                                    valueLabelFormat={value => value.toFixed(2)}
                                    value={item.serviceMultiplier}
                                    marks={[{label: '0.00', value: 0}, {label: '0.20', value: 0.2}, {label: '0.40', value: 0.4}, {label: '0.60', value: 0.6}, {label: '0.80', value: 0.8}, {label: '1.00', value: 1}]}
                                    onChange={handleSlide(item.zoneId)}
                                />
                            </TableCell>
                            <TableCell size="small" align="center">
                                <IconButton
                                    size="small"
                                    onClick={handleMenuOpen(item)}>
                                    <MoreHoriz />
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
    );
};

export default ByZone;