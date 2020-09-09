import React, {useEffect} from "react";
import {Button, Table, TableBody, TableCell, TableHead, TableRow, withStyles} from "@material-ui/core";
import {CustomerLifetimes} from "../../../Modals/CustomerLifetimes/CustomerLifetimes";
import {useModal, useSCs} from "../../../../utils/hooks";
import {useDispatch, useSelector} from "react-redux";
import {loadCustomerLifetimes} from "../../../../store/reducers/valueSettings/actions";
import {RootState} from "../../../../store/rootReducer";

const StyledTable = withStyles(theme => ({
    root: {
        "& .MuiTableCell-head": {
            textTransform: "uppercase",
            padding: 17,
            fontWeight: "bold",
        },
        "& .MuiTableCell-body": {
            padding: "33px 17px",
        },
        "& .MuiTableCell-root": {
            fontSize: 16,
            backgroundColor: "#FFFFFF"
        },
        "& .sum": {
            color: theme.palette.primary.main
        }
    }
}))(Table);

export const CustomerLifetimeRules = () => {
    const {isOpen, onOpen, onClose} = useModal();
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();
    const data = useSelector((state: RootState) => state.valueSettings.customerLifetimes);

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadCustomerLifetimes(selectedSC.id));
        }
    }, [dispatch, selectedSC])

    return <div>
        <StyledTable>
            <TableHead>
                <TableRow>
                    <TableCell>Customer Lifetime Value</TableCell>
                    <TableCell colSpan={3}>Value Definition</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                    <TableCell>Low Value</TableCell>
                    <TableCell>Less than</TableCell>
                    <TableCell colSpan={2} className="sum">{data ? `$${data.from}`: '-'}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Medium Value</TableCell>
                    <TableCell>Medium Value</TableCell>
                    <TableCell className="sum">{data ? `$${data.from} - $${data.to}` : '-'}</TableCell>
                    <TableCell align="right">
                        <Button
                            onClick={onOpen}
                            color="primary"
                        >
                            Edit
                        </Button>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>High Value</TableCell>
                    <TableCell>More than</TableCell>
                    <TableCell colSpan={2} className="sum">{data ? `$${data.to}` : "-"}</TableCell>
                </TableRow>
            </TableBody>
        </StyledTable>
        <CustomerLifetimes payload={data} open={isOpen} onClose={onClose} />
    </div>
}