import React, {useEffect, useState} from 'react';
import {SquarePaper} from "../../components/UI/Paper";
import {TableContainer} from "../../components/Optimizer/PricingSettings/UI";
import {NoItemsLoading} from "../../components/UI/NoItemsLoading";
import {DemandTable, TableCell, TableRow} from "../../components/Optimizer/AppointmentAllocation/UI";
import {IconButton, Menu, MenuItem, Switch, TableBody, TableHead} from "@material-ui/core";
import {getTransportationOptionString} from "../../utils/utils";
import {ETransportColumn, ITransportationOptionFull} from "../../store/reducers/transportationNeeds/types";
import {MoreHoriz} from "@material-ui/icons";
import {
    loadTransportationOptions,
    updateTransportationOption
} from "../../store/reducers/transportationNeeds/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/rootReducer";
import {useException, useModal, useSCs} from "../../utils/hooks";
import {headCellStyles, TableWrapper} from "./styles";
import {EditTransportationModal} from "./EditTransportationModal/EditTransportationModal";
import {EditTransportationDescriptionModal} from "./EditTransportationDescriptionModal/EditTransportationDescriptionModal";

const leftAlign = {
    textAlign: "left" as const
}

export const Transportations = () => {
    const { options, isLoading } = useSelector((state: RootState) => state.transportation);
    const [initialOptions, setInitialOptions] = useState<ITransportationOptionFull[]>([]);
    const [editingElement, setEditingElement] = useState<ITransportationOptionFull | null>(null);
    const [anchorEl, setAnchorEl] = useState<EventTarget&HTMLButtonElement|null>(null);
    const {selectedSC} = useSCs();
    const showError = useException();
    const dispatch = useDispatch();
    const { isOpen, onOpen, onClose } = useModal();
    const { isOpen: isOptionOpen, onOpen: onOptionOpen, onClose: onOptionClose } = useModal();

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadTransportationOptions(selectedSC.id))
        }
    }, [selectedSC])

    useEffect(() => {
        setInitialOptions(options)
    }, [options])

    const closeMenu = () => {
        setEditingElement(null);
        setAnchorEl(null);
    }

    const handleSwitch = (id: number) => async (e: any, value: boolean) => {
        const option = options.find(item => item.id === id)
        if (selectedSC && option) {
            try {
                dispatch(updateTransportationOption({
                    ...option,
                    state: value ? 1 : 0,
                    serviceCenterId: selectedSC.id
                }))
            } catch (e) {
                showError(e);
            }
        }
    }

    const openMenu = (el: ITransportationOptionFull) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setEditingElement(el);
        setAnchorEl(e.currentTarget);
    }

    const onManageRules = () => {
        setAnchorEl(null);
        onOpen();
    }

    const onManageOption = () => {
        setAnchorEl(null);
        onOptionOpen();
    }

    return (
        <>
            <SquarePaper variant="outlined">
                <TableContainer>
                    <NoItemsLoading items={options} loading={isLoading} />
                    {initialOptions.length ? <TableWrapper>
                        <DemandTable>
                            <TableHead>
                                <TableRow>
                                    <TableCell
                                        // width={360}
                                        key="1"
                                        style={{...headCellStyles, ...leftAlign}}>
                                        Service needs
                                    </TableCell>
                                    <TableCell key="3" style={headCellStyles}>Description</TableCell>
                                    <TableCell key="2" style={headCellStyles}>Mapping to Booking Flow</TableCell>
                                    <TableCell key="4" style={headCellStyles}>Manage</TableCell>
                                    <TableCell key="5" style={headCellStyles}>Status (Off/ON)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {initialOptions.map(el => {
                                    return <TableRow key={el.type}>
                                        <TableCell key="1" style={leftAlign}>{getTransportationOptionString(el.type)}</TableCell>
                                        <TableCell key="3">
                                            {el.description}
                                        </TableCell>
                                        <TableCell key="2">
                                            {el.column === ETransportColumn.Yes ? "Yes" : "No"}
                                        </TableCell>
                                        <TableCell key="4">
                                            <IconButton size="small" onClick={openMenu(el)}>
                                                <MoreHoriz />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell key="5">
                                            <Switch
                                                disabled={isLoading}
                                                onChange={handleSwitch(el.id)}
                                                checked={Boolean(el.state)}
                                                color="primary"
                                            />
                                        </TableCell>
                                    </TableRow>
                                })}
                            </TableBody>
                        </DemandTable>
                    </TableWrapper> : null}
                </TableContainer>
            </SquarePaper>
            <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={closeMenu}>
                <MenuItem onClick={() => onManageRules()}>Manage Rules</MenuItem>
                <MenuItem onClick={() => onManageOption()}>Manage Option</MenuItem>
            </Menu>
            <EditTransportationModal open={isOpen} onClose={onClose} editingElement={editingElement}/>
            <EditTransportationDescriptionModal open={isOptionOpen} editingElement={editingElement} onClose={onOptionClose}/>
        </>
    );
};