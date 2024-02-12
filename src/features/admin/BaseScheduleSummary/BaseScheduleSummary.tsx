import React, {useEffect, useState} from 'react';
import {Paper, Table, TableBody, TableHead, TableRow, TableSortLabel} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {useSCs} from "../../../hooks/useSCs/useSCs";
import {loadBaseSummary} from "../../../store/reducers/employees/actions";
import {TOrder, TSortColumns} from "./types";
import dayjs from "dayjs";
import {RootState} from "../../../store/rootReducer";
import {
    ScheduleDayNameCell, ScheduleTableFooterRow,
    ScheduleTableHeaderCell, ScheduleTableHeaderRow, ScheduleTableTitle, Wrapper,
    ScheduleTableTotalCell, StyledScheduleCell
} from "../../../components/styled/ScheduleTableElements";

const daysList = [1, 2, 3, 4, 5, 6, 7]

const BaseScheduleByEmployee = () => {
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
            <Wrapper>
                <ScheduleTableTitle>BASE SCHEDULE SUMMARY</ScheduleTableTitle>
            </Wrapper>
            <Table>
                <TableHead>
                    <ScheduleTableHeaderRow>
                        <ScheduleTableHeaderCell key="role" width={300}>
                            <TableSortLabel
                                direction={order.isAscending ? "desc" : "asc"}
                                onClick={() => onSort("Role")}
                                active={order.orderBy === "Role"}
                            >
                                ROLE
                            </TableSortLabel>
                        </ScheduleTableHeaderCell>
                        <ScheduleTableHeaderCell key="serviceBook" width={180}>
                            <TableSortLabel
                                direction={order.isAscending ? "desc" : "asc"}
                                onClick={() => onSort("ServiceBook")}
                                active={order.orderBy === "ServiceBook"}
                            >
                                SERVICE BOOK
                            </TableSortLabel>
                        </ScheduleTableHeaderCell>
                        {daysList.map(item => <ScheduleDayNameCell key={item}>
                            {dayjs().set('day', item).format('ddd')}
                        </ScheduleDayNameCell>)}
                    </ScheduleTableHeaderRow>
                </TableHead>
                {baseSummary ? <TableBody>
                        {baseSummary.roleHours.map((item, index) => {
                            return <TableRow key={index}>
                                <StyledScheduleCell key="role">
                                    {item.role}
                                </StyledScheduleCell>
                                <StyledScheduleCell key="serviceBook">
                                    {item.serviceBook}
                                </StyledScheduleCell>
                                {item.dailyHours.map((day) => {
                                    return <StyledScheduleCell key={day.day}>{day.value.toFixed(1)}</StyledScheduleCell>
                                })}
                            </TableRow>
                        })}
                        <ScheduleTableFooterRow key="total">
                            <StyledScheduleCell/>
                            <ScheduleTableTotalCell key="totalCell">Total</ScheduleTableTotalCell>
                            {baseSummary.totalHours.map((item) => {
                                return <StyledScheduleCell key={item.day}>{item.value.toFixed(1)}</StyledScheduleCell>
                            })}
                        </ScheduleTableFooterRow>
                    </TableBody>
                    : null}
            </Table>
        </Paper>
    );
};

export default BaseScheduleByEmployee;