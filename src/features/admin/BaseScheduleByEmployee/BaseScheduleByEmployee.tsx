import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Divider,
  Paper,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useSCs } from '../../../hooks/useSCs/useSCs';
import { loadBaseSummaryByEmployee } from '../../../store/reducers/employees/actions';
import { TOrder, TSortColumns } from './types';
import dayjs from 'dayjs';
import { RootState } from '../../../store/rootReducer';
import {
  ScheduleDataCell,
  ScheduleDayNameCell,
  ScheduleEmployeeTitleWrapper,
  ScheduleTableHeaderCell,
  ScheduleTableHeaderRow,
  ScheduleTableTitle,
  Wrapper,
  StyledScheduleCell,
  DisabledDataCell,
} from '../../../components/styled/ScheduleTableElements';
import {
  IEmployeeRoleHours,
  TScheduleByEmployeeRequestData,
} from '../../../store/reducers/employees/types';
import { TRole } from '../../../store/reducers/users/types';
import { loadServiceBookList } from '../../../store/reducers/appointments/actions';
import { TServiceBook } from '../../../store/reducers/appointments/types';
import BaseScheduleFilters from './BaseScheduleFilters/BaseScheduleFilters';
import { NoData } from '../../../components/wrappers/NoData/NoData';
import { Loading } from '../../../components/wrappers/Loading/Loading';
import { useModal } from '../../../hooks/useModal/useModal';
import EmployeeTimeScheduleSetUp from '../EmployeeTimeScheduleSetUp/EmployeeTimeScheduleSetUp';
import { loadHoursOfOperations } from '../../../store/reducers/appointmentFrameReducer/actions';
import { loadWorkingDays } from '../../../store/reducers/serviceCenters/actions';

const daysList = [1, 2, 3, 4, 5, 6, 0];

const BaseScheduleByEmployee = () => {
  const { employeeRoleHours, loading } = useSelector((state: RootState) => state.employees);
  const { employeesLoading } = useSelector((state: RootState) => state.employeesSchedule);
  const { workingDays } = useSelector(({ serviceCenters }: RootState) => serviceCenters);
  const { isLoading: hoursIsLoading } = useSelector((state: RootState) => state.slotScoring);
  const [loader, setLoader] = useState<boolean>(false);
  const [order, setOrder] = useState<TOrder>({ orderBy: 'Name', isAscending: true });
  const [serviceBook, setServiceBook] = useState<TServiceBook | null>(null);
  const [role, setRole] = useState<TRole | null>(null);
  const [name, setName] = useState<string>('');
  const [currentEmployee, setCurrentEmployee] = useState<IEmployeeRoleHours | null>(null);
  const dispatch = useDispatch();
  const { selectedSC } = useSCs();
  const { isOpen, onOpen, onClose } = useModal();

  const saving = useMemo(
    () => loading || employeesLoading || hoursIsLoading || loader,
    [loading, employeesLoading, hoursIsLoading, loader]
  );

  const getData = useCallback(() => {
    if (selectedSC?.id) {
      setLoader(true);
      const data: TScheduleByEmployeeRequestData = {
        serviceCenterId: selectedSC.id,
        orderBy: order.orderBy,
        isAscending: order.isAscending,
        serviceBookId: serviceBook?.id ?? null,
      };
      if (name) data.name = name;
      if (role) data.role = role;
      dispatch(loadBaseSummaryByEmployee(data));
      setLoader(false);
    }
  }, [selectedSC, order, serviceBook, name, role]);

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    setLoader(true);
    if (name) setName('');
    if (role) setRole(null);
    if (serviceBook) setServiceBook(null);
    setLoader(false);
  }, [selectedSC]);

  useEffect(() => {
    if (selectedSC?.id) {
      dispatch(loadServiceBookList(selectedSC.id));
      dispatch(loadHoursOfOperations(selectedSC.id));
      dispatch(loadWorkingDays(selectedSC.id));
    }
  }, [selectedSC]);

  const onSort = (sort: TSortColumns) => {
    setLoader(true);
    setOrder(prev => ({
      orderBy: sort,
      isAscending: prev.orderBy === sort ? !prev.isAscending : true,
    }));
    setLoader(false);
  };

  const onTableClick = (item: IEmployeeRoleHours) => {
    setCurrentEmployee(item);
    onOpen();
  };

  const getDailyHoursFromMonday = (item: IEmployeeRoleHours) => {
    const hours = item.dailyHours.slice(1, item.dailyHours.length);
    return [...hours, item.dailyHours[0]].map(day => {
      if (workingDays.includes(day.day as number)) {
        return (
          <ScheduleDataCell onClick={() => onTableClick(item)} key={day.day}>
            {day.value.toFixed(1)}
          </ScheduleDataCell>
        );
      } else {
        return <DisabledDataCell key={day.day}>{day.value.toFixed(1)}</DisabledDataCell>;
      }
    });
  };

  return (
    <Paper>
      <ScheduleEmployeeTitleWrapper>
        <ScheduleTableTitle>BASE SCHEDULE BY EMPLOYEE</ScheduleTableTitle>
        <BaseScheduleFilters
          isLoading={saving}
          serviceBook={serviceBook}
          role={role}
          setServiceBook={setServiceBook}
          name={name}
          setName={setName}
          setRole={setRole}
        />
      </ScheduleEmployeeTitleWrapper>
      {saving ? (
        <Loading />
      ) : employeeRoleHours.length ? (
        <Table>
          <TableHead>
            <ScheduleTableHeaderRow>
              <ScheduleTableHeaderCell key="name">
                <TableSortLabel
                  direction={order.isAscending ? 'desc' : 'asc'}
                  onClick={() => onSort('Name')}
                  active={order.orderBy === 'Name'}
                >
                  NAME
                </TableSortLabel>
              </ScheduleTableHeaderCell>
              <ScheduleTableHeaderCell key="role" width={110}>
                <TableSortLabel
                  direction={order.isAscending ? 'desc' : 'asc'}
                  onClick={() => onSort('Role')}
                  active={order.orderBy === 'Role'}
                >
                  ROLE
                </TableSortLabel>
              </ScheduleTableHeaderCell>
              <ScheduleTableHeaderCell key="serviceBook" width={270}>
                SERVICE BOOKS
              </ScheduleTableHeaderCell>
              {/*<ScheduleTableHeaderCell key="breakHours" width={75}>*/}
              {/*    BREAK HOURS*/}
              {/*</ScheduleTableHeaderCell>*/}
              {daysList.map(item => (
                <ScheduleDayNameCell key={item}>
                  {dayjs().set('day', item).format('ddd')}
                </ScheduleDayNameCell>
              ))}
            </ScheduleTableHeaderRow>
          </TableHead>
          <TableBody>
            {employeeRoleHours.map((item, index) => {
              return (
                <TableRow key={index}>
                  <StyledScheduleCell key={item.employeeId}>{item.employeeName}</StyledScheduleCell>
                  <StyledScheduleCell key="role">{item.role}</StyledScheduleCell>
                  <StyledScheduleCell key="serviceBook">
                    {item.serviceBooks.join(', ')}
                  </StyledScheduleCell>
                  {/*<ScheduleDataCell key="breakHours">*/}
                  {/*    0.0*/}
                  {/*</ScheduleDataCell>*/}
                  {getDailyHoursFromMonday(item)}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <div>
          <Divider />
          <Wrapper>
            <NoData title="No employees present" />
          </Wrapper>
        </div>
      )}
      <EmployeeTimeScheduleSetUp
        open={isOpen}
        onClose={onClose}
        editingItem={currentEmployee}
        getData={getData}
      />
    </Paper>
  );
};

export default BaseScheduleByEmployee;
