import React, {useCallback, useEffect, SetStateAction, Dispatch} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Button} from "@material-ui/core";
import {DialogProps} from "../../../types";
import {TableRowDataType} from "../../../../UI/types";
import {RootState} from "../../../../../store/rootReducer";
import {Table} from "../../../../UI/Table";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../BaseModal";
import {usePagination, useSCs} from "../../../../../utils/hooks";
import Checkbox from "../../../../UI/Checkbox";
import {
    changeComplimentaryPageData,
    loadComplimentary,
} from "../../../../../store/reducers/packages/actions";
import {IComplimentaryServiceByQuery} from "../../../../../store/reducers/packages/types";

type TAssignOpsCodeModalProps = DialogProps & {
    selectedCodes: number[];
    setSelectedCodes: Dispatch<SetStateAction<number[]>>;
    isComplimentary?: boolean;
    title: string;
}

const tableData: TableRowDataType<IComplimentaryServiceByQuery>[] = [
    {header: "OPS CODE", val: el => el.code},
    {header: "DESCRIPTION", val: el => el.name, width: '80%'},
]

const AssignOpsCodeModal: React.FC<TAssignOpsCodeModalProps> =
    ({selectedCodes, setSelectedCodes, isComplimentary, title, ...props}) => {
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const [
        complimentary,
        isLoading,
        servicesCount,
    ] = useSelector((state: RootState) => [
        state.packages.complimentary,
        state.packages.isComplimentaryLoading,
        state.packages.complimentaryPaging.numberOfRecords,
    ]);
    const {changeRowsPerPage, changePage, pageIndex, pageSize} = usePagination(
        (s: RootState) => s.packages.complimentaryPageData,
        changeComplimentaryPageData
    );

    useEffect(() => {
        if (props.open && selectedSC) {
            dispatch(loadComplimentary(selectedSC.id))
        }
    }, [props.open, dispatch, selectedSC]);

    const handleClose = useCallback((): void => {
        props.onClose();
    }, [props.onClose])

    const handleSelect = useCallback((el: IComplimentaryServiceByQuery) => {
        setSelectedCodes(prev => {
            return  prev.includes(+el.id) ? prev.filter(item => item !== el.id) : [...prev, el.id]
        });
    }, [setSelectedCodes])

    const preActions = useCallback((el: IComplimentaryServiceByQuery) => {
        return <Checkbox color="primary" checked={selectedCodes.includes(+el.id)} onChange={() => handleSelect(el)} />
    }, [selectedCodes, handleSelect])

    return (
        <BaseModal {...props}>
            <DialogTitle onClose={handleClose}>{title}</DialogTitle>
            <DialogContent>
                <Table<IComplimentaryServiceByQuery>
                    data={complimentary}
                    index="id"
                    startActions={preActions}
                    compact
                    hidePagination={servicesCount < 11}
                    rowData={tableData}
                    isLoading={isLoading}
                    page={pageIndex}
                    rowsPerPage={pageSize}
                    onChangePage={changePage}
                    onChangeRowsPerPage={changeRowsPerPage}
                    count={servicesCount}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>
                    Close
                </Button>
            </DialogActions>
        </BaseModal>
    );
};

export default AssignOpsCodeModal;