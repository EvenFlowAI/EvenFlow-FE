import React, {useCallback, Dispatch, SetStateAction} from 'react';
import {Table} from "../../../../../components/tables/Table/Table";
import {IAssignedServiceRequest} from "../../../../../store/reducers/serviceRequests/types";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";
import Checkbox from "../../../../../components/formControls/Checkbox/Checkbox";
import {CheckBoxOutlineBlank, CheckBoxOutlined} from "@mui/icons-material";
import {useStyles} from "./styles";
import {TableRowDataType} from "../../../../../types/types";

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
        header: "LABOR HOURS",
        align: "center",
        val: el => `${el.serviceRequestOverride?.durationInHours?.toFixed(1) ?? el.serviceRequest.durationInHours.toFixed(1)}`
    },
    {
        header: "LABOR AMOUNT",
        align: "center",
        val: el => `${el.serviceRequestOverride?.warrantyInvoiceAmount?.toFixed(2) ?? el.serviceRequest.warrantyInvoiceAmount.toFixed(2)}`
    },
    {
        header: "PARTS AMOUNT",
        align: "center",
        val: el => `$${el.serviceRequestOverride?.partsUnitCost?.toFixed(2) ?? el.serviceRequest?.partsUnitCost?.toFixed(2)}`
    },
    {
        header: "TOTAL AMOUNT",
        align: "center",
        val: el => `$${el.serviceRequestOverride?.invoiceAmount?.toFixed(2) ?? el.serviceRequest.invoiceAmount?.toFixed(2)}`
    },
]

type TOpsCodesTableProps = {
    selectedCodes: IAssignedServiceRequest[];
    setSelectedCodes: Dispatch<SetStateAction<IAssignedServiceRequest[]>>;
    disabled: boolean;
}

export const OpsCodesTable: React.FC<React.PropsWithChildren<React.PropsWithChildren<TOpsCodesTableProps>>> = ({ selectedCodes, setSelectedCodes, disabled }) => {
    const { allAssignedList, assignedLoading } = useSelector((state: RootState) => state.serviceRequests);
    const { classes  } = useStyles()

    const handleSelect = useCallback((el: IAssignedServiceRequest) => {
        if (!disabled) {
            setSelectedCodes(prev => {
                return prev.find(item => item.id === el.id) ? prev.filter(item => item.id !== el.id) : [...prev, el]
            });
        }
    }, [setSelectedCodes, disabled])

    const preActions = useCallback((el: IAssignedServiceRequest) => {
        return <Checkbox
            color="primary"
            disabled={disabled}
            icon={ !!selectedCodes.find(item => item.id === el.id)
                ? <CheckBoxOutlined htmlColor="#3855FE"/>
                : <CheckBoxOutlineBlank htmlColor="#DADADA"/>}
            checked={!!selectedCodes.find(item => item.id === el.id)}
            onChange={() => handleSelect(el)} />
    }, [selectedCodes, handleSelect, disabled])

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