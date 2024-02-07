import React, {useEffect, useState} from 'react';
import {Paper, Table, TableCell, TableHead, TableRow, TableSortLabel} from "@mui/material";
import {TableTitle, TableTitleWrapper} from "./styles";
import {useDispatch} from "react-redux";
import {useSCs} from "../../../hooks/useSCs/useSCs";
import {loadBaseSummary} from "../../../store/reducers/employees/actions";
import {TOrder, TSortColumns} from "./types";
import dayjs from "dayjs";

const BaseScheduleSummary = () => {
    const [order, setOrder] = useState<TOrder>({orderBy: "Role", isAscending: true})
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();

    useEffect(() => {
        if (selectedSC?.id) {
            dispatch(loadBaseSummary(selectedSC?.id, order.orderBy, order.isAscending))
        }
    }, [selectedSC, order])

    const onSort = (sort: TSortColumns) => {
        setOrder(prev => ({orderBy: sort, isAscending: prev.orderBy === sort ? !prev.isAscending : true}))
    }

    return (
        <Paper>
            <TableTitleWrapper>
                <TableTitle>BASE SCHEDULE SUMMARY</TableTitle>
                <Table>
                    <TableHead>
                        <TableRow>
                        <TableCell>
                            <TableSortLabel
                                direction={order.isAscending ? "desc" : "asc"}
                                onClick={() => onSort("Role")}
                                active={order.orderBy === "Role"}
                            >
                                ROLE
                            </TableSortLabel>
                        </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    direction={order.isAscending ? "desc" : "asc"}
                                    onClick={() => onSort("ServiceBook")}
                                    active={order.orderBy === "ServiceBook"}
                                >
                                    SERVICE BOOK
                                </TableSortLabel>
                            </TableCell>

                        </TableRow>
                    </TableHead>
                </Table>
            </TableTitleWrapper>

        </Paper>
    );
};

export default BaseScheduleSummary;