import React, {useEffect, useState} from 'react';
import {NoItemsLoading} from "../../../components/wrappers/NoItemsLoading/NoItemsLoading";
import {IconButton, Menu, MenuItem, Switch, TableBody, TableHead, TableCell} from "@mui/material";
import {getTransportationOptionString} from "../../../utils/utils";
import {ITransportationOptionFull} from "../../../store/reducers/transportationNeeds/types";
import {MoreHoriz} from "@mui/icons-material";
import {
    loadTransportationOptions,
    updateTransportationOption
} from "../../../store/reducers/transportationNeeds/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {HeaderCell, TableWrapper} from "./styles";
import {EditTransportationModal} from "./EditTransportationModal/EditTransportationModal";
import {EditTransportationDescriptionModal} from "./EditTransportationDescriptionModal/EditTransportationDescriptionModal";
import {DemandTable} from "../../../components/styled/DemandTable";
import {TableRow} from "../../../components/styled/TableRow";
import {useModal} from "../../../hooks/useModal/useModal";
import {useException} from "../../../hooks/useException/useException";
import {useSCs} from "../../../hooks/useSCs/useSCs";
import {servicesRoot} from "../../../utils/constants";
import {TitleContainer} from "../../../components/wrappers/TitleContainer/TitleContainer";

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
            <TitleContainer title="Other Transportation" pad parent={servicesRoot}/>
                <div style={{padding: 16, width: "100%"}}>
                    <NoItemsLoading items={options} loading={isLoading} />
                    {initialOptions.length ? <TableWrapper>
                        <DemandTable>
                            <TableHead>
                                <TableRow>
                                    <HeaderCell
                                        key="1"
                                        style={{textTransform: 'capitalize'}}
                                        align="left">
                                        Service Needs
                                    </HeaderCell>
                                    <HeaderCell key="3" align="left" style={{textTransform: 'capitalize'}}>
                                        Description
                                    </HeaderCell>
                                    <HeaderCell key="2" align="left" style={{textTransform: 'capitalize'}}>
                                        Order Index
                                    </HeaderCell>
                                    <HeaderCell key="4" align="left" style={{textTransform: 'capitalize'}}>
                                        Manage
                                    </HeaderCell>
                                    <HeaderCell key="5" align="left" width={150} style={{textTransform: 'capitalize'}}>
                                        Status (Off/ON)
                                    </HeaderCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {initialOptions.map(el => {
                                    return <TableRow key={el.type}>
                                        <TableCell key="1" align="left">{getTransportationOptionString(el.type)}</TableCell>
                                        <TableCell key="3" align="left">
                                            {el.description}
                                        </TableCell>
                                        <TableCell key="2" align="left">
                                            {el.orderIndex}
                                        </TableCell>
                                        <TableCell key="4" align="left">
                                            <IconButton size="small" onClick={openMenu(el)} >
                                                <MoreHoriz />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell key="5" align="left">
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
                </div>
            <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={closeMenu}>
                <MenuItem onClick={() => onManageRules()}>Manage Rules</MenuItem>
                <MenuItem onClick={() => onManageOption()}>Manage Option</MenuItem>
            </Menu>
            <EditTransportationModal open={isOpen} onClose={onClose} editingElement={editingElement}/>
            <EditTransportationDescriptionModal open={isOptionOpen} editingElement={editingElement} onClose={onOptionClose}/>
        </>
    );
};