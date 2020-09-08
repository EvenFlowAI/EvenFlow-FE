import React from "react";
import {Button, Table, TableBody, TableCell, TableHead, TableRow, withStyles} from "@material-ui/core";

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
                    <TableCell colSpan={2} className="sum">$12312</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Medium Value</TableCell>
                    <TableCell>Medium Value</TableCell>
                    <TableCell className="sum">$12312 - $400000</TableCell>
                    <TableCell align="right">
                        <Button
                            color="primary"
                        >
                            Edit
                        </Button>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>High Value</TableCell>
                    <TableCell>More than</TableCell>
                    <TableCell colSpan={2} className="sum">$400000</TableCell>
                </TableRow>
            </TableBody>
        </StyledTable>
    </div>
}