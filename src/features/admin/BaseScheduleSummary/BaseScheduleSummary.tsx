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
import {Loading} from "../../../components/wrappers/Loading/Loading";
import {IRoleHours} from "../../../store/reducers/employees/types";

const daysList = [1, 2, 3, 4, 5, 6, 0]

const BaseScheduleByEmployee = () => {
    const {baseSummary, loading} = useSelector((state: RootState) => state.employees)
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

    const getDailyHoursFromMonday = (item: IRoleHours) => {
        const hours = item.dailyHours.slice(1, item.dailyHours.length);
        return [...hours, item.dailyHours[0]].map((day) => {
            return <StyledScheduleCell key={day.day}>{day.value.toFixed(1)}</StyledScheduleCell>
        })
    }

    const getTotalHoursFromMonday = () => {
        if (baseSummary) {
            const hours = baseSummary.totalHours.slice(1, baseSummary.totalHours.length);
            return [...hours, baseSummary.totalHours[0]].map((item) => {
                return <StyledScheduleCell key={item.day}>{item.value.toFixed(1)}</StyledScheduleCell>
            })
        }
    }

    return (
        <Paper>
            <Wrapper>
                <ScheduleTableTitle>BASE SCHEDULE SUMMARY</ScheduleTableTitle>
            </Wrapper>
            {
                loading ? <Loading/>
                    : <Table>
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
                                        {getDailyHoursFromMonday(item)}
                                    </TableRow>
                                })}
                                <ScheduleTableFooterRow key="total">
                                    <StyledScheduleCell/>
                                    <ScheduleTableTotalCell key="totalCell">Total</ScheduleTableTotalCell>
                                    {getTotalHoursFromMonday()}
                                </ScheduleTableFooterRow>
                            </TableBody>
                            : null}
                    </Table>
            }

        </Paper>
    );
};

export default BaseScheduleByEmployee;