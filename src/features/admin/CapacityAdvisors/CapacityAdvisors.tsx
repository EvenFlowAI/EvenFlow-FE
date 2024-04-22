import React, {useEffect, useState} from 'react';
import {Title} from "./styles";
import {useDispatch, useSelector} from "react-redux";
import {useSCs} from "../../../hooks/useSCs/useSCs";
import {loadServiceBookList} from "../../../store/reducers/appointments/actions";
import {RootState} from "../../../store/rootReducer";
import {TableRowDataType} from "../../../types/types";
import {InputOrValue} from "../../../components/wrappers/TableInput/TableInput";
import {Table} from "../../../components/tables/Table/Table";
import {SaveEditBlock} from "../../../components/buttons/SaveEditBlock/SaveEditBlock";

const CapacityAdvisors = () => {
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

    const ServiceRowsData: TableRowDataType<any>[] = shortPodsList.map(serviceBook => ({
        header: serviceBook.name,
        width: 155,
        val: (el) => <InputOrValue
            value={el}
            name={serviceBook?.id ? `${serviceBook.id}` : "Service Center"}
            onChange={onChange}
            isEdit={isEdit}
            defaultValue={"0"}
            disabled={false}
        />,
    }))

    const RowData:TableRowDataType<any>[] = [
        {
            header: "Name",
            width: 155,
            val: (el) => el.fullName,
        },
        ...ServiceRowsData,
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

export default CapacityAdvisors;