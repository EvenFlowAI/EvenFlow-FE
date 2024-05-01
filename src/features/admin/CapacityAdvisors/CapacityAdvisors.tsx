import React, {useEffect, useState} from 'react';
import {Title} from "./styles";
import {useDispatch, useSelector} from "react-redux";
import {useSCs} from "../../../hooks/useSCs/useSCs";
import {loadServiceBookList} from "../../../store/reducers/appointments/actions";
import {RootState} from "../../../store/rootReducer";
import {TableRowDataType} from "../../../types/types";
import {Table} from "../../../components/tables/Table/Table";
import {SaveEditBlock} from "../../../components/buttons/SaveEditBlock/SaveEditBlock";
import {loadAdvisorsCapacity, updateAdvisorsCapacity} from "../../../store/reducers/employeeCapacity/actions";
import {
    IAdvisorCapacity,
    TAdvisorCapacityPayload, TAdvisorPerPodBase
} from "../../../store/reducers/employeeCapacity/types";
import {useException} from "../../../hooks/useException/useException";
import {useMessage} from "../../../hooks/useMessage/useMessage";
import {sortEmployees} from "../../../utils/utils";
import {EditableTableCell} from "./EditableTableCell";

const CapacityAdvisors = () => {
    const {shortPodsList} = useSelector((state: RootState) => state.pods);
    const {advisors, isLoading} = useSelector((state: RootState) => state.employeesCapacity);
    const [isEdit, setEdit] = useState<boolean>(false);
    const [data, setData] = useState<IAdvisorCapacity[]>([]);
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const showError = useException();
    const showMessage = useMessage();

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadServiceBookList(selectedSC.id))
            dispatch(loadAdvisorsCapacity(selectedSC.id))
            setEdit(false);
        }
    }, [selectedSC])

    useEffect(() => {
        setData([...advisors].sort(sortEmployees))
    }, [advisors])

    const onChange = ({target: {name, value}}: React.ChangeEvent<HTMLInputElement>) => {
        const [employeeId, serviceBookId] = name.split('/');
        setData(prev => {
            let itemToChange = prev.find(el => el.employeeId === employeeId);
            if (itemToChange) {
                const serviceBook = itemToChange.capacityPerServiceBook
                    .find(el => el.id === +serviceBookId)
                const serviceCenter = itemToChange.capacityPerServiceBook
                    .find(el => !el.id)
                if (serviceBook) {
                    itemToChange = {
                        ...itemToChange,
                        capacityPerServiceBook: itemToChange.capacityPerServiceBook
                            .filter(el => el.id !== +serviceBookId)
                            .concat({...serviceBook, value: +value})}
                } else if (serviceCenter) {
                    itemToChange = {
                        ...itemToChange,
                        capacityPerServiceBook: itemToChange.capacityPerServiceBook
                            .filter(el => el.id)
                            .concat({...serviceCenter, value: +value})}
                }
                return prev
                    .filter(el => el.employeeId !== itemToChange?.employeeId)
                    .concat(itemToChange)
                    .sort(sortEmployees)
            }
            return prev
        })
    }

    const onCancel = () => {
        setData([...advisors].sort(sortEmployees))
        setEdit(false)
    }

    const onSuccess = () => {
        setEdit(false)
        showMessage("Advisors Capacity updated")
    }

    const checkIsValid = (): boolean => {
        return !data.find(el => el.capacityPerServiceBook.find(item => item.value < 0))
    }

    const onSave = () => {
        if (checkIsValid()) {
            if (selectedSC) {
                const capacitySettings = data.map(el => {
                    return {
                        employeeId: el.employeeId,
                        capacityPerServiceBook: el.capacityPerServiceBook
                            .filter(item => item.isEditable)
                            .map(item => {
                            let setting: TAdvisorPerPodBase = {value: item.value}
                            if (item.id) setting = {...setting, id: item.id};
                            return setting;
                        })
                    }
                })
                const payload: TAdvisorCapacityPayload = {
                    serviceCenterId: selectedSC.id,
                    capacitySettings,
                }
                dispatch(updateAdvisorsCapacity(payload, showError, onSuccess))
            }
        } else {
            showError("Employee Capacity must not be less than 0")
        }
    }

    const ServiceRowsData: TableRowDataType<IAdvisorCapacity>[] = shortPodsList.map(serviceBook => ({
        header: serviceBook.name,
        width: 120,
        val: (el) => <EditableTableCell
            value={el.capacityPerServiceBook.find(item => item.id && item.id === serviceBook.id)?.value ?? '0'}
            name={serviceBook?.id ? `${el.employeeId}/${serviceBook.id}` : `${el.employeeId}`}
            onChange={onChange}
            isEdit={isEdit}
            defaultValue={"0"}
            disabled={isLoading
                || (Boolean(serviceBook.id)
                    && !el.capacityPerServiceBook
                        .find(item => item.id && item.id === serviceBook.id)?.isEditable)}
        />,
    }))

    const RowData:TableRowDataType<IAdvisorCapacity>[] = [
        {
            header: "Name",
            width: 170,
            val: (el) => el.employeeName ?? "",
        },
        {
            header: "Service Center",
            width: 120,
            val: (el) => <EditableTableCell
                value={el.capacityPerServiceBook.find(item => !item.id)?.value ?? '0'}
                name={`${el.employeeId}`}
                onChange={onChange}
                isEdit={isEdit}
                defaultValue={"0"}
                disabled={isLoading}
            />,
        },
        ...ServiceRowsData,
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
            width: 130,
            align: 'right',
            val: () => ' ',
        }
    ]

    return (
        <div>
            <Title>Service Advisor Daily Capacity</Title>
            <Table<IAdvisorCapacity>
                data={data}
                isLoading={isLoading}
                index="employeeId"
                rowData={RowData}
                hidePagination
                withoutOverflow
                compactBodyPadding={isEdit}
            />
        </div>
    );
};

export default CapacityAdvisors;