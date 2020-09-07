import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Button} from "@material-ui/core";
import {useModal, usePagination} from "../../../utils/hooks";
import {Table} from "../../UI/Table";
import {TableRowDataType} from "../../UI/types";
import {IBay} from "../../../store/reducers/bays/types";
import {CheckCircle} from "@material-ui/icons";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {setPageData} from "../../../store/reducers/bays/actions";
import {CreateBay} from "../../Modals/Bays/CreateBay";

const useStyles = makeStyles({
    wrapper: {

    },
    actionRow: {
        textAlign: "right"
    }
});

const rowData: TableRowDataType<IBay>[] = [
    {header: "", val: v => v.name},
    {header: "Alignment Equipment", val: v => v.alignmentEquipment ? <CheckCircle color="primary" /> : "-"},
    {header: "Carrying Capacity", val: v => v.carryingCapacity ? <CheckCircle color="primary" /> : "-"},
    {header: "Only Quick Service", val: v => v.onlyQuickService ? <CheckCircle color="primary" /> : "-"},
];

export const RequiredEquipment = () => {
    const {onOpen, onClose, isOpen} = useModal();
    const [
        loading,
        bays,
        size
    ] = useSelector((state: RootState) => [
        state.bays.loading,
        state.bays.bays,
        state.bays.paging.numberOfRecords
    ]);

    const {pageIndex, pageSize, changeRowsPerPage, changePage} = usePagination(state => state.bays.pageData, setPageData);

    const classes = useStyles();
    return <div className={classes.wrapper}>
        <div className={classes.actionRow}>
            <Button
                color="primary"
                variant="contained"
                onClick={onOpen}
            >
                Add Bay
            </Button>
        </div>
        <Table<IBay>
            data={bays}
            isLoading={loading}
            index="id"
            onChangePage={changePage}
            onChangeRowsPerPage={changeRowsPerPage}
            rowsPerPage={pageSize}
            page={pageIndex}
            count={size}
            rowData={rowData}
        />
        <CreateBay open={isOpen} onClose={onClose} />
    </div>
}