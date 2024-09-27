import React, {Dispatch, SetStateAction} from 'react';
import {IOrder, TableRowDataType} from "../../../../types/types";
import {IRecall} from "../../../../store/reducers/recall/types";
import {EditableTableCell} from "../../CapacityAdvisors/EditableTableCell";
import {Table} from "../../../../components/tables/Table/Table";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {setRecallOrder, setRecallPageData} from "../../../../store/reducers/recall/actions";
import {usePagination} from "../../../../hooks/usePaginations/usePaginations";
import {Box, Button} from "@mui/material";
import {StyledSwitch, SwitcherLabel} from "../styles";
import {useModal} from "../../../../hooks/useModal/useModal";

type TProps = {
    isEdit: boolean;
    data: IRecall[];
    setData: Dispatch<SetStateAction<IRecall[]>>;
}

const PartsAvailabilityTable: React.FC<TProps> = ({isEdit, data, setData }) => {
    const {recallsCount, order, isLoading} = useSelector((state: RootState) => state.recalls);
    const {onOpen, onClose, isOpen} = useModal();
    const {changeRowsPerPage,changePage,pageIndex,pageSize} = usePagination(
        (s: RootState) => s.recalls.recallPageData,
        setRecallPageData
    );
    const dispatch = useDispatch()

    const onChange = ({target: {name, value}}: React.ChangeEvent<HTMLInputElement>) => {
        const [field, id] = name.split('-');
        setData(prev => {
            const item = prev.find(el => el.id === +id)
            if (item) {
                const filtered = prev.filter(el => el.id !== +id);
                const updated = {...item, [field]: value};
                return [...filtered, updated].sort((a, b) => a.localIndex - b.localIndex)
            }
            return prev;
        })
    }

    const onCheck = (id: number) => (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setData(prev => {
            const item = prev.find(el => el.id === id)
            if (item) {
                const filtered = prev.filter(el => el.id !== +id);
                const updated = {...item, isRemedyAvailable: checked};
                return [...filtered, updated].sort((a, b) => a.localIndex - b.localIndex)
            }
            return prev;
        })
    }

    const rowData: TableRowDataType<IRecall>[] = [
        {
            header: "Op Code",
            width: 120,
            val: el => el.serviceRequest?.name ?? '',
            orderId: "OpCode"
        },
        {
            header: "NHTSA Campaign",
            val: el => el.recallCampaignNumber,
            orderId: "CampaignNumber"
        },
        {
            header: "OEM Program",
            val: el => el.oemProgram,
            orderId: "OemProgram"
        },
        {
            header: "Recall Component",
            val: el => el.recallComponent,
            orderId: "RecallComponent"
        },
        {
            header: "Part Lead Time (Days)",
            width: 145,
            val: el => <EditableTableCell
                value={el.partLeadDaysCount?.toString() ?? '0'}
                name={`partLeadDaysCount-${el.id}`}
                onChange={onChange}
                isEdit={isEdit}
                keepDefaultStyling
                defaultValue={"0"}
                disabled={isLoading}
                width={80}
            />,
            orderId: "PartLeadDays"
        },
        {
            header: "Daily Parts",
            val: el => <EditableTableCell
                value={el.dailyPartsCount?.toString() ?? '0'}
                name={`dailyPartsCount-${el.id}`}
                onChange={onChange}
                isEdit={isEdit}
                defaultValue={"0"}
                type="number"
                keepDefaultStyling
                disabled={isLoading}
                width={80}
            />,
            orderId: "DailyParts"
        },
        {
            header: "Remedy Available",
            width: 127,
            val: el => !isEdit
                ? el.isRemedyAvailable ? <SwitcherLabel>YES</SwitcherLabel> : <SwitcherLabel>NO</SwitcherLabel>
                : <Box p={0} alignItems="center" display="flex">
                    <SwitcherLabel>NO</SwitcherLabel>
                    <StyledSwitch
                    onChange={onCheck(el.id)}
                    checked={el.isRemedyAvailable}
                    color="primary"/>
                    <SwitcherLabel>YES</SwitcherLabel>
                    </Box>,
            orderId: "RemedyAvailable"
        },
        {
            header: "Rollover Icon",
            width: 114,
            val: el => isEdit
                ? <Button variant="text" color="primary" onClick={onOpen} style={{marginLeft:-16}}>{el.rolloverMessage?.length ? 'Update': 'Add'}</Button>
                : el.rolloverMessage?.length
                    ? <SwitcherLabel>YES</SwitcherLabel>
                    : <SwitcherLabel>NO</SwitcherLabel>,
        },
    ]

    const onSort = (o: IOrder<IRecall>) => () => {
        dispatch(setRecallOrder(o))
    }

    return (
        <div>
            <Table<IRecall>
                data={data}
                index={"id"}
                verticalPadding={isEdit ? 22 : 32}
                isAscending={order.isAscending}
                order={order?.orderBy}
                onSort={onSort}
                rowData={rowData}
                rowsPerPage={pageSize}
                page={pageIndex}
                onChangePage={changePage}
                onChangeRowsPerPage={changeRowsPerPage}
                count={recallsCount}
                hidePagination={recallsCount < 11}
            />
        </div>
    );
};

export default PartsAvailabilityTable;