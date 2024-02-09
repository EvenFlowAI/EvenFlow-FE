import React, {useEffect, useState} from 'react';
import {Paper, Table, TableBody, TableHead, TableRow, TableSortLabel} from "@mui/material";
import {
    DayNameCell, StyledCell,
    TableFooterRow,
    TableHeaderCell,
    TableHeaderRow,
    TableTitle,
    TableTitleWrapper,
    TableTotalCell
} from "./styles";
import {useDispatch, useSelector} from "react-redux";
import {useSCs} from "../../../hooks/useSCs/useSCs";
import {loadBaseSummary} from "../../../store/reducers/employees/actions";
import {TOrder, TSortColumns} from "./types";
import dayjs from "dayjs";
import {RootState} from "../../../store/rootReducer";

const daysList = [1, 2, 3, 4, 5, 6, 7]

const BaseScheduleSummary = () => {
    const {baseSummary} = useSelector((state: RootState) => state.employees)
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
            </TableTitleWrapper>
                <Table>
                    <TableHead>
                        <TableHeaderRow>
                        <TableHeaderCell key="role" width={300}>
                            <TableSortLabel
                                direction={order.isAscending ? "desc" : "asc"}
                                onClick={() => onSort("Role")}
                                active={order.orderBy === "Role"}
                            >
                                ROLE
                            </TableSortLabel>
                        </TableHeaderCell>
                            <TableHeaderCell key="serviceBook" width={180}>
                                <TableSortLabel
                                    direction={order.isAscending ? "desc" : "asc"}
                                    onClick={() => onSort("ServiceBook")}
                                    active={order.orderBy === "ServiceBook"}
                                >
                                    SERVICE BOOK
                                </TableSortLabel>
                            </TableHeaderCell>
                            {daysList.map(item => <DayNameCell key={item}>
                                {dayjs().set('day', item).format('ddd')}
                            </DayNameCell>)}
                        </TableHeaderRow>
                    </TableHead>
                    {baseSummary ? <TableBody>
                        {baseSummary.roleHours.map((item, index) => {
                            return <TableRow key={index}>
                                <StyledCell key="role">
                                    {item.role}
                                </StyledCell>
                                <StyledCell key="serviceBook">
                                    {item.serviceBook}
                                </StyledCell>
                                {item.dailyHours.map((day) => {
                                    return <StyledCell key={day.day}>{day.value.toFixed(1)}</StyledCell>
                                })}
                            </TableRow>
                        })}
                        <TableFooterRow key="total">
                            <StyledCell/>
                            <TableTotalCell key="totalCell">Total</TableTotalCell>
                            {baseSummary.totalHours.map((item) => {
                                return <StyledCell key={item.day}>{item.value.toFixed(1)}</StyledCell>
                            })}
                        </TableFooterRow>
                    </TableBody>
                        : null}
                </Table>
        </Paper>
    );
};

export default BaseScheduleSummary;