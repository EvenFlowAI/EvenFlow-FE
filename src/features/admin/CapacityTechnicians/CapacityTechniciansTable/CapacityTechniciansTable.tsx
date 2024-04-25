import React, {useEffect, useState} from 'react';
import {InputWrapper, PickerWrapper} from "./styles";
import {useDispatch, useSelector} from "react-redux";
import {useSCs} from "../../../../hooks/useSCs/useSCs";
import {loadServiceBookList} from "../../../../store/reducers/appointments/actions";
import {RootState} from "../../../../store/rootReducer";
import {TableRowDataType, TParsableDate} from "../../../../types/types";
import {InputOrValue} from "../../../../components/wrappers/TableInput/TableInput";
import {Table} from "../../../../components/tables/Table/Table";
import {SaveEditBlock} from "../../../../components/buttons/SaveEditBlock/SaveEditBlock";
import dayjs from "dayjs";
import {
    ECapacityType,
    ITechnicianCapacity,
    ITechniciansPayload
} from "../../../../store/reducers/employeeCapacity/types";
import {
    loadTechniciansCapacity,
    setDateRange,
    updateTechniciansCapacity
} from "../../../../store/reducers/employeeCapacity/actions";
import {CALENDAR_FORMAT} from "../../../../utils/constants";
import {useException} from "../../../../hooks/useException/useException";
import {useMessage} from "../../../../hooks/useMessage/useMessage";
import {CustomWeekPicker} from "../../../../components/pickers/CustomWeekPicker/CustomWeekPicker";
import {Loading} from "../../../../components/wrappers/Loading/Loading";
import {sortEmployees} from "../../../../utils/utils";

const daysOfWeek = [1, 2, 3, 4, 5, 6, 7, 0]

const CapacityTechniciansTable: React.FC<{selectedTab: string}> = ({selectedTab}) => {
    const {technicians, isLoading, dateRange} = useSelector((state: RootState) => state.employeesCapacity);
    const [isEdit, setEdit] = useState<boolean>(false);
    const [data, setData] = useState<ITechnicianCapacity[]>([]);
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const showError = useException();
    const showMessage = useMessage();

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadServiceBookList(selectedSC.id))
            setEdit(false)
        }
    }, [selectedSC])

    useEffect(() => {
        if (selectedSC && dateRange.from && dateRange.to) {
            dispatch(loadTechniciansCapacity(
                selectedSC.id,
                selectedTab === "0" ? ECapacityType.DailyVehicles : ECapacityType.AvailableBillHours,
            ))
        }
    }, [selectedSC, dateRange, selectedTab])

    useEffect(() => {
        const dateFrom = dayjs().set('day', 1).format(CALENDAR_FORMAT)
        dispatch(setDateRange({
            from: dateFrom,
            to: dayjs(dateFrom, CALENDAR_FORMAT).add(1, 'week').subtract(1, 'day').format(CALENDAR_FORMAT)
        }))
    }, [])

    useEffect(() => {
        setData([...technicians].sort(sortEmployees))
    }, [technicians])

    const onChange = ({target: {name, value}}: React.ChangeEvent<HTMLInputElement>) => {
        const [employeeId, serviceBookId] = name.split('/');
        setData(prev => {
            let employee = prev.find(el => el.employeeId === employeeId)
            if (serviceBookId) {
                employee = prev.find(el => el.employeeId === employeeId && +serviceBookId === el.serviceBookId)
            }
            if (employee) {
                const updated = {...employee, efficiency: +value}
                return prev
                    .filter(item => serviceBookId
                        ? item.serviceBookId !== +serviceBookId && item.employeeId !== employeeId
                        : item.employeeId !== employeeId)
                    .concat(updated)
                    .sort(sortEmployees)
            }
            return prev;
        })
    }

    const onCancel = () => {
        setData([...technicians].sort(sortEmployees))
        setEdit(false);
    }

    const onSuccess = () => {
        setEdit(false);
        showMessage("Technicians Capacity updated")
    }

    const onSave = () => {
        if (data.find(el => el.efficiency < 0)) {
            showError("Efficiency must not be less than 0")
        } else {
            if (selectedSC) {
                const payload: ITechniciansPayload = {
                    serviceCenterId: selectedSC.id,
                    techniciansEfficiency: data.map(el => ({
                        employeeId: el.employeeId,
                        serviceBookId: el.serviceBookId,
                        efficiency: el.efficiency})),
                }
                dispatch(updateTechniciansCapacity(
                    payload,
                    selectedTab === "0" ? ECapacityType.DailyVehicles : ECapacityType.AvailableBillHours,
                    showError,
                    onSuccess
                    ))
            }
        }
    }

    const DaysData: TableRowDataType<ITechnicianCapacity>[] = daysOfWeek.map(day => ({
        header: dayjs().set('day', day).format("ddd"),
        val: (el) => selectedTab === '0'
            ? `${el.dailyCapacity[dayjs(day).format("dddd")].toFixed(0)}`
            : `${el.dailyCapacity[dayjs(day).format("dddd")].toFixed(1)}`
    }))

    const RowData:TableRowDataType<ITechnicianCapacity>[] = [
        {
            header: "Name",
            val: (el) => el.employeeName,
            width: 148,
        },
        {
            header: "Service Book",
            val: (el) => el.serviceBookName,
            width: 100,
        },
        {
            header: "Average Bill Hours per RO",
            val: (el) => el.avarageBillHoursPerRO ? el.avarageBillHoursPerRO.toString() : '',
        },
        {
            header: "Efficiency",
            width: 135,
            val: (el) => <InputWrapper>
                <InputOrValue
                    value={`${el.efficiency}`}
                    isEdit={isEdit}
                    defaultValue={"0%"}
                    disabled={false}
                    name={el.serviceBookId ? `${el.employeeId}/${el.serviceBookId}` : `${el.employeeId}`}
                    onChange={onChange}/>
                <div style={{marginLeft: 4, padding: 0}}>%</div>
            </InputWrapper>,
        },
        ...DaysData,
        {
            header: <div style={{margin: '0 -16px'}}>
                <SaveEditBlock
                    onCancel={onCancel}
                    onSave={onSave}
                    isEdit={isEdit}
                    isSaving={isLoading}
                    withoutPadding
                    onEdit={() => setEdit(true)}/>
            </div>,
            align: 'right',
            width: 130,
            val: () => ' ',
        }
    ]

    const onDateChange = (date: TParsableDate) => {
        dispatch(setDateRange({
            from: dayjs(date).format(CALENDAR_FORMAT),
            to: dayjs(date).add(6, 'days').format(CALENDAR_FORMAT)
        }))
    }

    return (
        <div>
            <PickerWrapper>
                <CustomWeekPicker date={dateRange.from} onChange={onDateChange}/>
            </PickerWrapper>
            {isLoading
                ? <Loading/>
                : <Table data={data} index="employeeId" rowData={RowData} hidePagination withoutOverflow/>}
        </div>
    );
};

export default CapacityTechniciansTable;