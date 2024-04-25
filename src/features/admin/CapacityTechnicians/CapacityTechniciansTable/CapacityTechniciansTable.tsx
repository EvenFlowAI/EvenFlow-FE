import React, {useEffect, useState} from 'react';
import {InputWrapper} from "./styles";
import {useDispatch, useSelector} from "react-redux";
import {useSCs} from "../../../../hooks/useSCs/useSCs";
import {loadServiceBookList} from "../../../../store/reducers/appointments/actions";
import {RootState} from "../../../../store/rootReducer";
import {TableRowDataType} from "../../../../types/types";
import {InputOrValue} from "../../../../components/wrappers/TableInput/TableInput";
import {Table} from "../../../../components/tables/Table/Table";
import {SaveEditBlock} from "../../../../components/buttons/SaveEditBlock/SaveEditBlock";
import dayjs from "dayjs";
import {ECapacityType, ITechnicianCapacity} from "../../../../store/reducers/employeeCapacity/types";
import {loadTechniciansCapacity, setDateRange} from "../../../../store/reducers/employeeCapacity/actions";
import {CALENDAR_FORMAT} from "../../../../utils/constants";

const daysOfWeek = [1, 2, 3, 4, 5, 6, 7, 0]

const sortAdvisors = (a: ITechnicianCapacity, b: ITechnicianCapacity): number => a.employeeName
    ? a.employeeName.localeCompare(b.employeeName)
    : a.employeeId.localeCompare(b.employeeId)

const CapacityTechniciansTable: React.FC<{selectedTab: string}> = ({selectedTab}) => {
    const {technicians, isLoading, dateRange} = useSelector((state: RootState) => state.employeesCapacity);
    const [isEdit, setEdit] = useState<boolean>(false);
    const [data, setData] = useState<ITechnicianCapacity[]>([]);
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();

    useEffect(() => {
        if (selectedSC) dispatch(loadServiceBookList(selectedSC.id))
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
        setData([...technicians].sort(sortAdvisors))
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
                    .sort(sortAdvisors)
            }
            return prev;
        })
    }

    const onCancel = () => {
        setData([...technicians].sort(sortAdvisors))
        setEdit(false);
    }

    const onSave = () => {}

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

    return (
        <div>
            <Table data={data} index="employeeId" rowData={RowData} hidePagination withoutOverflow/>
        </div>
    );
};

export default CapacityTechniciansTable;