import React, {Dispatch, SetStateAction, useCallback} from 'react';
import {TableRowDataType} from "../../UI/types";
import {IAssignedServiceRequest, TOPsCodeWithIndex} from "../../../store/reducers/serviceRequests/types";
import {TextField} from "../../UI/TextField";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import Checkbox from "../../UI/Checkbox";
import {CheckBoxOutlineBlank, CheckBoxOutlined} from "@material-ui/icons";
import {Table} from "../../UI/Table";
import {makeStyles} from "@material-ui/core/styles";

type TOpsCodesTableProps = {
    selectedCodes: TOPsCodeWithIndex[];
    setSelectedCodes: Dispatch<SetStateAction<TOPsCodeWithIndex[]>>;
    disabled: boolean;
    wrongOrderIndexes: number[];
    setWrongOrderIndexes: Dispatch<SetStateAction<number[]>>;
}

const useStyles = makeStyles(() => ({
    scrollableTable: {
        maxHeight: 300,
        overflowY: 'auto',
        marginBottom: 20,
    }
}))

const OpsCodesWithOrder:React.FC<TOpsCodesTableProps> = ({
                                                             selectedCodes,
                                                             setSelectedCodes,
                                                             disabled,
                                                             wrongOrderIndexes,
                                                             setWrongOrderIndexes
}) => {
    const { allAssignedList, assignedLoading } = useSelector((state: RootState) => state.serviceRequests);
    const classes = useStyles()

    const onSROrderChange = (id: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        e.persist()
        if (e?.target?.value.match(/^\d+$/)) {
            const elementToChange = selectedCodes.find(item => item.id === id)
            if (elementToChange) {
                const updated = {...elementToChange, orderIndex: e.target?.value ?? ''}
                setSelectedCodes(prev => {
                    const filtered = prev.filter(item => item.id !== id);
                    return [...filtered, updated]
                })
                if (e.target?.value) setWrongOrderIndexes(prev => prev.filter(el => el !== +e.target?.value))
            }
        }
    }

    const checkError = (el: IAssignedServiceRequest): boolean => {
        const codes = selectedCodes.filter(item => wrongOrderIndexes.includes(+item.orderIndex))
        return !!codes.find(code => code.id === el.id)
    }

    const RowData: TableRowDataType<IAssignedServiceRequest>[] = [
        {
            header: "Booking Flow Order",
            val: (el) => <TextField
                fullWidth
                error={checkError(el)}
                disabled={!selectedCodes.find(item => item.id === el.id)}
                inputProps={{min: 1, step: 1, max: allAssignedList.length + 1}}
                value={selectedCodes.find(item => item.id === el.id)?.orderIndex ?? 0}
                onChange={onSROrderChange(el.id)}
            />
        },
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

    const handleSelect = useCallback((el: IAssignedServiceRequest) => {
        if (!disabled) {
            setSelectedCodes(prev => {
                const codeToChange = prev.find(item => item.id === el.id);
                if (codeToChange) {
                    const data = prev.map(code => ({
                        ...code,
                        orderIndex: +code.orderIndex > +codeToChange.orderIndex ? `${+code.orderIndex - 1}` : code.orderIndex
                    }))
                    return data.filter(item => item.id !== el.id)
                } else {
                    return [...prev, {id: el.id, orderIndex: '0'}]
                }
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

export default OpsCodesWithOrder;