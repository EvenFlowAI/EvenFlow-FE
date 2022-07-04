import React, {useEffect, useState} from 'react';
import {
    styled,
    TableCell as TC,
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

export const TablesWrapper = styled('div')({
    padding: 24,
    border: '1px solid #DADADA',
    backgroundColor: "#FFFFFF",
})

const STextField = styled(TextField)({
    maxWidth: 100
});

export const TableCell = withStyles({
    root: {
        border: "none !important",
        padding: "12px 16px !important",
        // textAlign: "left",
    }
})(TC);

export const HeaderTableCell = withStyles({
    root: {
        color: '#9FA2B4',
        '& .distanceCell': {
            display: 'flex',
            flexDirection: 'column',
            fontSize: 12,
            lineHeight: '15px',
            '& > span': {
                fontWeight: 400
            }
        }
    }
})(TableCell)

export const FirstCell = withStyles(({
    root: {
        color: '#9FA2B4',
    }
}))(TableCell)

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

interface TDistancePriceSettings {
    id: number;
    rangeMin: number;
    rangeMax: number;
    costPerMile: number;
    serviceMultiplier: number;
}

const data: TDistancePriceSettings[] = [
    {
        id: 1,
        rangeMin: 1.88,
        rangeMax: 12,
        costPerMile: 16,
        serviceMultiplier: 0.2,
    },
    {
        id: 2,
        rangeMin: 2.88,
        rangeMax: 22,
        costPerMile: 26,
        serviceMultiplier: 0.5,
    },
    {
        id: 3,
        rangeMin: 3.88,
        rangeMax: 32,
        costPerMile: 36,
        serviceMultiplier: 0.8,
    },
]

const ByDistance = () => {
    const [distanceData, setDistanceData] = useState<TDistancePriceSettings[]>([]);
    const [anchorEl, setAnchorEl] = useState<EventTarget&HTMLButtonElement|null>(null);
    const [editedItem, setEditedItem] = useState<TDistancePriceSettings|null>(null);
    const [isEdit, setIsEdit] = useState<boolean>(false);

    useEffect(() => {
        setDistanceData(data.sort((a, b) => a.id - b.id));
    }, [data]);

    const handleMenuOpen = (item: TDistancePriceSettings) => (e: React.MouseEvent<HTMLButtonElement>) => {
        setIsEdit(false);
        setEditedItem(item);
        setAnchorEl(e.currentTarget);
    }
    const editZone = () => {
        setIsEdit(true);
        setAnchorEl(null);
    }

    const deleteSettings = () => {
        //todo delete
    }

    const handleSlide = (t: number) => (e: any, value: number|number[]) => {
        if (typeof value === 'number') {
            const item = distanceData.find(item => item.id === t);
            if (item) {
                const updated = {...item, serviceMultiplier: value};
                setDistanceData(prev => {
                    const filtered = prev.filter(el =>  el.id !== t);
                    return [...filtered, updated].sort((a, b) => a.id - b.id);
                })
            }
        }
    }

    const handleChangeField = (fieldName: string) => ({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
        if (Number(value) >= 0) {
            setDistanceData(prev => {
                const itemToUpdate = prev.find(el => el.id === editedItem?.id);
                if (itemToUpdate) {
                    const updated = {...itemToUpdate, [fieldName]: Number(value)};
                    const filtered = prev.filter(el => el.id !== editedItem?.id);
                    return [...filtered, updated].sort((a, b) => a.id - b.id);
                }
                return prev;
            })
        }
    }

    const onCancel = () => {
        setDistanceData(data)
        setIsEdit(false)
    }

    const onSave = () => {
        setIsEdit(false)
    }

    return (
        <TablesWrapper>
            <DemandTable>
                <TableHead>
                    <TableRow>
                        <HeaderTableCell align="left" size="small">
                            <div className="distanceCell">№ </div>
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
                              Cost Per Mile, $
                            </div>
                        </HeaderTableCell>
                        <HeaderTableCell align="left" size="small">
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
                                        value={+item?.rangeMin?.toFixed(2)}
                                        onChange={handleChangeField('rangeMin')}
                                    />
                                    : item.rangeMin.toFixed(2)}
                            </TableCell>
                            <TableCell size="small">
                                {isEdit && (editedItem?.id === item.id)
                                    ? <STextField
                                        type="number"
                                        inputProps={{
                                            min: 0,
                                            step: 0.01,
                                        }}
                                        value={+item?.rangeMax?.toFixed(2)}
                                        onChange={handleChangeField('rangeMax')}
                                    />
                                    : item.rangeMax.toFixed(2)}
                            </TableCell>
                            <TableCell size="small">
                                {isEdit && (editedItem?.id === item.id)
                                    ? <STextField
                                        type="number"
                                        inputProps={{
                                            min: 0,
                                            step: 0.01,
                                        }}
                                        value={+item?.costPerMile?.toFixed(2)}
                                        onChange={handleChangeField('costPerMile')}
                                    />
                                    : item.costPerMile.toFixed(2)}
                            </TableCell>
                            <TableCell size="small">
                                <Slider
                                    min={0}
                                    max={1}
                                    valueLabelDisplay="on"
                                    step={0.01}
                                    disabled={!isEdit || editedItem?.id !== item.id}
                                    valueLabelFormat={value => value.toFixed(2)}
                                    value={item.serviceMultiplier}
                                    marks={[{label: '0.00', value: 0}, {label: '0.20', value: 0.2}, {label: '0.40', value: 0.4}, {label: '0.60', value: 0.6}, {label: '0.80', value: 0.8}, {label: '1.00', value: 1}]}
                                    onChange={handleSlide(item.id)}
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
        </TablesWrapper>
    );
};

export default ByDistance;