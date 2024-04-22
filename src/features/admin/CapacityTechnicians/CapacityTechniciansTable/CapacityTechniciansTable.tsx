import React, {useEffect, useState} from 'react';
import {InputWrapper, Title} from "./styles";
import {useDispatch, useSelector} from "react-redux";
import {useSCs} from "../../../../hooks/useSCs/useSCs";
import {loadServiceBookList} from "../../../../store/reducers/appointments/actions";
import {RootState} from "../../../../store/rootReducer";
import {TableRowDataType} from "../../../../types/types";
import {InputOrValue} from "../../../../components/wrappers/TableInput/TableInput";
import {Table} from "../../../../components/tables/Table/Table";
import {SaveEditBlock} from "../../../../components/buttons/SaveEditBlock/SaveEditBlock";
import dayjs from "dayjs";

const daysOfWeek = [1, 2, 3, 4, 5, 6, 7, 0]

const CapacityTechniciansTable = () => {
    const {shortPodsList} = useSelector((state: RootState) => state.pods);
    const [isEdit, setEdit] = useState<boolean>(false);
    const [data, setData] = useState([]);
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();

    useEffect(() => {
        if (selectedSC) dispatch(loadServiceBookList(selectedSC.id))
    }, [selectedSC])

    const onChange = ({target: {name, value}}: React.ChangeEvent<HTMLInputElement>) => {

    }

    const onCancel = () => {}

    const onSave = () => {}

    const DaysData: TableRowDataType<any>[] = daysOfWeek.map(day => ({
        header: dayjs().set('day', day).format("ddd"),
        width: 64,
        val: (el) => '',
    }))

    const RowData:TableRowDataType<any>[] = [
        {
            header: "Name",
            val: (el) => el.fullName,
        },
        {
            header: "Service Book",
            val: (el) => el.serviceBook,
        },
        {
            header: "Average Bill Hours per RO",
            val: (el) => el.averageBillHoursPerRO,
        },
        {
            header: "Efficiency",
            val: (el) => <InputWrapper>
                <InputOrValue
                value={`${el.efficiency}%`}
                isEdit={isEdit}
                defaultValue={"0%"}
                disabled={false}
                name={el.id}
                onChange={onChange}/>
                {isEdit ? null : <span>%</span>}
            </InputWrapper>,
        },
        ...DaysData,
        {
            header: <SaveEditBlock
                onCancel={onCancel}
                onSave={onSave}
                isEdit={isEdit}
                isSaving={false}
                onEdit={() => setEdit(true)}/>,
            width: 142,
            val: () => '',
        }
    ]

    return (
        <div>
            <Title>Service Advisor Daily Capacity</Title>
            <Table data={data} index="id" rowData={RowData}/>
        </div>
    );
};

export default CapacityTechniciansTable;