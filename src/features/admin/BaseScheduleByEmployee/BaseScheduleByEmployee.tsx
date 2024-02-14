import React, {useEffect, useState} from 'react';
import {
    Divider,
    Paper,
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableSortLabel
} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {useSCs} from "../../../hooks/useSCs/useSCs";
import {loadBaseSummaryByEmployee} from "../../../store/reducers/employees/actions";
import {TOrder, TSortColumns} from "./types";
import dayjs from "dayjs";
import {RootState} from "../../../store/rootReducer";
import {
    ScheduleDataCell,
    ScheduleDayNameCell,
    ScheduleEmployeeTitleWrapper,
    ScheduleTableHeaderCell,
    ScheduleTableHeaderRow,
    ScheduleTableTitle, Wrapper,
    StyledScheduleCell
} from "../../../components/styled/ScheduleTableElements";
import {IEmployeeRoleHours, TScheduleByEmployeeRequestData} from "../../../store/reducers/employees/types";
import {TRole} from "../../../store/reducers/users/types";
import {loadServiceBookList} from "../../../store/reducers/appointments/actions";
import {TServiceBook} from "../../../store/reducers/appointments/types";
import BaseScheduleFilters from "./BaseScheduleFilters/BaseScheduleFilters";
import {NoData} from "../../../components/wrappers/NoData/NoData";
import {Loading} from "../../../components/wrappers/Loading/Loading";

const daysList = [1, 2, 3, 4, 5, 6, 7]

const BaseScheduleByEmployee = () => {
    const {employeeRoleHours, loading} = useSelector((state: RootState) => state.employees)
    const {isLoading} = useSelector((state: RootState) => state.appointments)
    const [order, setOrder] = useState<TOrder>({orderBy: "Name", isAscending: true})
    const [serviceBook, setServiceBook] = useState<TServiceBook|null>(null);
    const [role, setRole] = useState<TRole|null>(null);
    const [name, setName] = useState<string>('');
    const [currentEmployee, setCurrentEmployee] = useState<IEmployeeRoleHours|null>(null);
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();

    useEffect(() => {
        if (selectedSC?.id) {
            const isServiceBookServiceCenter = Boolean(serviceBook && !serviceBook.id);
            const data: TScheduleByEmployeeRequestData = {
                serviceCenterId: selectedSC.id,
                orderBy: order.orderBy,
                isAscending: order.isAscending,
                serviceBookId: serviceBook?.id ?? null,
                isServiceBookServiceCenter,
            }
            if (name) data.name = name;
            if (role) data.role = role;
            dispatch(loadBaseSummaryByEmployee(data))
        }
    }, [selectedSC, order, serviceBook, name, role])

    useEffect(() => {
        if (selectedSC?.id) {
            dispatch(loadServiceBookList(selectedSC.id))
        }
    }, [selectedSC])

    const onSort = (sort: TSortColumns) => {
        setOrder(prev => ({orderBy: sort, isAscending: prev.orderBy === sort ? !prev.isAscending : true}))
    }

    const onTableClick = (item: IEmployeeRoleHours) => {
        setCurrentEmployee(item)
    }

    return (
        <Paper>
            <ScheduleEmployeeTitleWrapper>
                <ScheduleTableTitle>BASE SCHEDULE BY EMPLOYEE</ScheduleTableTitle>
                <BaseScheduleFilters
                    isLoading={isLoading||loading}
                    serviceBook={serviceBook}
                    role={role}
                    setServiceBook={setServiceBook}
                    name={name}
                    setName={setName}
                    setRole={setRole}/>
            </ScheduleEmployeeTitleWrapper>
            { loading
                ? <Loading/>
                : employeeRoleHours.length
                    ? <Table>
                        <TableHead>
                            <ScheduleTableHeaderRow>
                                <ScheduleTableHeaderCell key="name">
                                    <TableSortLabel
                                        direction={order.isAscending ? "desc" : "asc"}
                                        onClick={() => onSort("Name")}
                                        active={order.orderBy === "Name"}
                                    >
                                        NAME
                                    </TableSortLabel>
                                </ScheduleTableHeaderCell>
                                <ScheduleTableHeaderCell key="role" width={110}>
                                    <TableSortLabel
                                        direction={order.isAscending ? "desc" : "asc"}
                                        onClick={() => onSort("Role")}
                                        active={order.orderBy === "Role"}
                                    >
                                        ROLE
                                    </TableSortLabel>
                                </ScheduleTableHeaderCell>
                                <ScheduleTableHeaderCell key="serviceBook" width={100}>
                                    <TableSortLabel
                                        direction={order.isAscending ? "desc" : "asc"}
                                        onClick={() => onSort("ServiceBook")}
                                        active={order.orderBy === "ServiceBook"}
                                    >
                                        SERVICE BOOK
                                    </TableSortLabel>
                                </ScheduleTableHeaderCell>
                                {/*<ScheduleTableHeaderCell key="breakHours" width={75}>*/}
                                {/*    BREAK HOURS*/}
                                {/*</ScheduleTableHeaderCell>*/}
                                {daysList.map(item => <ScheduleDayNameCell key={item}>
                                    {dayjs().set('day', item).format('ddd')}
                                </ScheduleDayNameCell>)}
                            </ScheduleTableHeaderRow>
                        </TableHead>
                        <TableBody>
                            {employeeRoleHours.map((item, index) => {
                                return <TableRow key={index}>
                                    <StyledScheduleCell key={item.employeeId}>
                                        {item.employeeName}
                                    </StyledScheduleCell>
                                    <StyledScheduleCell key="role">
                                        {item.role}
                                    </StyledScheduleCell>
                                    <StyledScheduleCell key="serviceBook">
                                        {item.serviceBook}
                                    </StyledScheduleCell>
                                    {/*<ScheduleDataCell key="breakHours">*/}
                                    {/*    0.0*/}
                                    {/*</ScheduleDataCell>*/}
                                    {item.dailyHours.map((day) => {
                                        return <ScheduleDataCell onClick={() => onTableClick(item)} key={day.day}>{day.value.toFixed(1)}</ScheduleDataCell>
                                    })}
                                </TableRow>
                            })}
                        </TableBody>
                    </Table>
                    : <div>
                        <Divider/>
                        <Wrapper>
                            <NoData title="No employees present"/>
                        </Wrapper>
                    </div>
            }
        </Paper>
    );
};

export default BaseScheduleByEmployee;