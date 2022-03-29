import React, {useEffect, useState} from "react";
import {Button, styled, Switch, TableBody, TableHead} from "@material-ui/core";
import {DialogProps} from "../types";
import {BaseModal, DialogContent, DialogTitle} from "../BaseModal";
import {NoItemsLoading} from "../../UI/NoItemsLoading";
import {DemandTable, TableCell, TableRow} from "../../Optimizer/AppointmentAllocation/UI";
import {TableContainer} from "../../Optimizer/PricingSettings/UI";
import {
    ETransportationType,
    INewTransportationOption,
    ITransportationOptionFull
} from "../../../store/reducers/transportationNeeds/types";
import {useDispatch, useSelector} from "react-redux";
import {
    loadTransportationOptions,
    updateTransportationOption
} from "../../../store/reducers/transportationNeeds/actions";
import {useException, useModal, useSCs} from "../../../utils/hooks";
import {RootState} from "../../../store/rootReducer";
import EditTransportationOptionDialog from "./EditTransportationOptionDialog";

const headCellStyles = {
    fontSize: 12,
    lineHeight: "16px",
    color: "#9FA2B4"
}
const leftAlign = {
    textAlign: "left" as const
}

const TableWrapper = styled("div")(({theme}) => ({
    width: "100%",
    overflowX: "auto",
    overflowY: "auto",
    maxHeight: "40vh",
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
    for (let i = 0; i < string.length; i++) {
        if (string[i] === string[i].toUpperCase() && i > 0) {
            array.push(' ')
        }
        array.push(string[i])
    }
    return array.join('');
}

export const TransportationOptions: React.FC<DialogProps> = props => {
    const [editingElement, setEditingElement] = useState<ITransportationOptionFull | null>(null);
    const { options, isLoading } = useSelector((state: RootState) => state.transportation);
    const [initialOptions, setInitialOptions] = useState<ITransportationOptionFull[]>([]);
    const { isOpen, onOpen, onClose } = useModal();
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();
    const showError = useException();

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadTransportationOptions(selectedSC.id))
        }
    }, [selectedSC])

    useEffect(() => {
        if (selectedSC) {
            setInitialOptions(() => {
                return Object.keys(ETransportationType).filter(item => Number.isNaN(+item)).map(key => {
                    // @ts-ignore
                    const type = ETransportationType[key];
                    const option = options.find(item => item.type === type);
                    return option || {
                        type,
                        state: 0,
                        serviceCenterId: selectedSC.id,
                    } as INewTransportationOption
                })
            })
        }
    }, [selectedSC, options])

    const handleSwitch = (type: number) => async (e: any, value: boolean) => {
        if (selectedSC) {
            try {
                dispatch(updateTransportationOption({
                    type,
                    state: value ? 1 : 0,
                    serviceCenterId: selectedSC.id
                }))
            } catch (e) {
                showError(e);
            }
        }
    }

    const onEditClick = async (el: ITransportationOptionFull) => {
        await setEditingElement(el);
        await onOpen();
    }

    return <BaseModal {...props} width={700}>
        <DialogTitle onClose={props.onClose}>Transportation Needs Configuration</DialogTitle>
        <DialogContent>
            <TableContainer>
                <NoItemsLoading items={options} loading={isLoading} />
                {initialOptions.length ? <TableWrapper>
                    <DemandTable>
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    width={360}
                                    style={{...headCellStyles, ...leftAlign}}>
                                    Service needs
                                </TableCell>
                                <TableCell style={headCellStyles}>Manage rules</TableCell>
                                <TableCell style={headCellStyles}>Status (Off/ON)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {initialOptions.map(el => {
                                return <TableRow key={el.type}>
                                    <TableCell style={leftAlign}>{getOptionString(el.type)}</TableCell>
                                    <TableCell>
                                        <Button
                                            style={{ textTransform: 'none' }}
                                            variant="text"
                                            disabled={!Boolean(el.state)}
                                            color="primary"
                                            onClick={() => onEditClick(el)}>
                                            Edit
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Switch
                                            disabled={isLoading}
                                            onChange={handleSwitch(+el.type)}
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
        </DialogContent>
        <EditTransportationOptionDialog open={isOpen} onClose={onClose} editingElement={editingElement}/>
    </BaseModal>
}