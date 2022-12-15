import React, {useEffect, useState} from "react";
import {MenuItem, styled, Switch, TableBody, TableHead, Menu, IconButton} from "@material-ui/core";
import {DialogProps} from "../../Modals/types";
import {NoItemsLoading} from "../../UI/NoItemsLoading";
import {DemandTable, TableCell, TableRow} from "../../Optimizer/AppointmentAllocation/UI";
import {TableContainer} from "../../Optimizer/PricingSettings/UI";
import {
    ETransportationType,
    ETransportColumn,
    ITransportationOptionFull
} from "../../../store/reducers/transportationNeeds/types";
import {useDispatch, useSelector} from "react-redux";
import {
    loadTransportationOptions,
    updateTransportationOption
} from "../../../store/reducers/transportationNeeds/actions";
import {useException, useModal, useSCs} from "../../../utils/hooks";
import {RootState} from "../../../store/rootReducer";
import EditTransportationOptionDialog from "../../Modals/EditTransportation/EditTransportationOptionDialog";
import {TitleContainer} from "../../Content/TitleContainer/TitleContainer";
import {bookingFlowRoot} from "../../Optimizer/utils";
import {SquarePaper} from "../../UI/Paper";
import {MoreHoriz} from "@material-ui/icons";
import EditTransportationDescription from "../../Modals/EditTransportationDescription/EditTransportationDescription";

const headCellStyles = {
    fontSize: 12,
    lineHeight: "16px",
    color: "#9FA2B4"
}
const leftAlign = {
    textAlign: "left" as const
}

const TableWrapper = styled("div")(({theme}) => ({
    // width: "100%",
    "& .MuiTableCell-root": {
        [theme.breakpoints.down("xs")]: {
            fontSize: "10px !important",
            padding: "6px !important"
        }
    }
}))


const getOptionString = (option: string) => {
    const string = ETransportationType[+option];
    const array = [];
    if (string) {
        for (let i = 0; i < string.length; i++) {
            if (string[i] === string[i].toUpperCase() && i > 0) {
                array.push(' ')
            }
            array.push(string[i])
        }
    }
    return array.join('');
}

export const TransportationOptions: React.FC<DialogProps> = props => {
    const [editingElement, setEditingElement] = useState<ITransportationOptionFull | null>(null);
    const { options, isLoading } = useSelector((state: RootState) => state.transportation);
    const [initialOptions, setInitialOptions] = useState<ITransportationOptionFull[]>([]);
    const [anchorEl, setAnchorEl] = useState<EventTarget&HTMLButtonElement|null>(null);
    const { isOpen, onOpen, onClose } = useModal();
    const { isOpen: isOptionOpen, onOpen: onOptionOpen, onClose: onOptionClose } = useModal();
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();
    const showError = useException();

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

    return <div style={{width: '100%'}}>
        <TitleContainer title="Transportation Options" pad parent={bookingFlowRoot}/>
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
                                    <TableCell key="1" style={leftAlign}>{getOptionString(el.type)}</TableCell>
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
        <EditTransportationOptionDialog open={isOpen} onClose={onClose} editingElement={editingElement}/>
        <EditTransportationDescription open={isOptionOpen} editingElement={editingElement} onClose={onOptionClose}/>
    </div>
}