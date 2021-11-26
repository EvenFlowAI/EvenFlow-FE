import React, {useEffect, useState} from "react";
import {Button, styled, Switch, TableBody, TableHead} from "@material-ui/core";
import {DialogProps, TViewMode} from "../types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {NoItemsLoading} from "../../UI/NoItemsLoading";
import {DemandTable, TableCell, TableRow} from "../../Optimizer/AppointmentAllocation/UI";
import {TableContainer} from "../../Optimizer/PricingSettings/UI";
import {ITransportationOptionFull} from "../../../store/reducers/transportationNeeds/types";
import {useDispatch, useSelector} from "react-redux";
import {
    loadTransportationOptions,
    updateTransportationOption
} from "../../../store/reducers/transportationNeeds/actions";
import {useSCs} from "../../../utils/hooks";
import {RootState} from "../../../store/rootReducer";

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

export const TransportationOptions: React.FC<DialogProps&TViewMode> = props => {
    const [editingElement, setEditingElement] = useState<ITransportationOptionFull | null>(null);
    const { options, isLoading } = useSelector((state: RootState) => state.transportation);
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadTransportationOptions(selectedSC.id))
        }
    }, [selectedSC])

    const handleSwitch = (type: number) => async (e: any, value: boolean) => {
        if (selectedSC) {
            dispatch(updateTransportationOption({
                type,
                state: value ? 1 : 0,
                serviceCenterId: selectedSC.id
            }))
        }
    }

    const onEditClick = (el: ITransportationOptionFull) => {
        setEditingElement(el);
    }

    return <BaseModal {...props} width={700}>
        <DialogTitle onClose={props.onClose}>Transportation Needs Configuration</DialogTitle>
        <DialogContent>
            <TableContainer>
                <NoItemsLoading items={options} loading={isLoading} />
                {options.length ? <TableWrapper>
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
                            {options.map(el => {
                                return <TableRow key={el.id}>
                                    <TableCell style={leftAlign}>{el.type}</TableCell>
                                    <TableCell>
                                        <Button
                                            style={{ textTransform: 'none' }}
                                            variant="text"
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
        <DialogActions>
            <Button color="primary" onClick={props.onClose}>Close</Button>
        </DialogActions>
    </BaseModal>
}