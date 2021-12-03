import React, {useCallback, Dispatch, SetStateAction} from 'react';
import {Table} from "../../UI/Table";
import {IAssignedServiceRequest} from "../../../store/reducers/serviceRequests/types";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {TableRowDataType} from "../../UI/types";
import Checkbox from "../../UI/Checkbox";
import {CheckBoxOutlineBlank, CheckBoxOutlined} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";

const RowData: TableRowDataType<IAssignedServiceRequest>[] = [
    {
        header: "OPS CODE",
        val: el => el.serviceRequest.code
    },
    {
        header: "DESCRIPTION",
        val: el => el.serviceRequestOverride?.description?.length ?  el.serviceRequestOverride.description : el.serviceRequest.description
    },
    {
        header: "PARTS UNIT COST",
        align: "center",
        val: el => `$${el.serviceRequestOverride?.partsUnitCost ?? el.serviceRequest.partsUnitCost}`
    },
    {
        header: "# Of PARTS",
        align: "center",
        val: el => `${el.serviceRequestOverride?.numberOfParts ?? el.serviceRequest.numberOfParts}`
    },
    {
        header: "PARTS AMOUNT",
        align: "center",
        val: el => `$${el.serviceRequestOverride?.partsAmount ?? 0}`
    },
    {
        header: "INVOICE AMOUNT",
        align: "center",
        val: el => `$${el.serviceRequestOverride?.invoiceAmount ?? el.serviceRequest.invoiceAmount}`
    },
]

const useStyles = makeStyles(() => ({
    scrollableTable: {
        maxHeight: 300,
        overflowY: 'auto',
        marginBottom: 20,
    }
}))

type TOpsCodesTableProps = {
    selectedCodes: IAssignedServiceRequest[];
    setSelectedCodes: Dispatch<SetStateAction<IAssignedServiceRequest[]>>;
}

const OpsCodesTable: React.FC<TOpsCodesTableProps> = ({ selectedCodes, setSelectedCodes }) => {
    const { allAssignedList, assignedLoading } = useSelector((state: RootState) => state.serviceRequests);
    const classes = useStyles()

    const handleSelect = useCallback((el: IAssignedServiceRequest) => {
        setSelectedCodes(prev => {
            return prev.find(item => item.id === el.id) ? prev.filter(item => item.id !== el.id) : [...prev, el]
        });
    }, [setSelectedCodes])

    const preActions = useCallback((el: IAssignedServiceRequest) => {
        return <Checkbox
            color="primary"
            icon={ !!selectedCodes.find(item => item.id === el.id)
                ? <CheckBoxOutlined htmlColor="#3855FE"/>
                : <CheckBoxOutlineBlank htmlColor="#DADADA"/>}
            checked={!!selectedCodes.find(item => item.id === el.id)}
            onChange={() => handleSelect(el)} />
    }, [selectedCodes, handleSelect])

    return (
        <div className={classes.scrollableTable}>
            <Table<IAssignedServiceRequest>
                data={allAssignedList}
                index="id"
                smallHeaderFont
                startActions={preActions}
                hidePagination
                compact
                rowData={RowData}
                isLoading={assignedLoading}
                count={allAssignedList.length}
            />
        </div>
    );
};

export default OpsCodesTable;