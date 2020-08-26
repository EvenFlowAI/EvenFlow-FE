import React from "react";
import {Table} from "../../UI/Table";
import {Box, IconButton} from "@material-ui/core";
import {Edit, DeleteForever, Visibility} from "@material-ui/icons";
import {TableRowDataType} from "../../UI/types";
import {IDealershipGroupExtended} from "../../../store/reducers/dealershipGroups/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import * as dealershipActions from "../../../store/reducers/dealershipGroups/actions";
import {changePageData, remove as removeDealership} from "../../../store/reducers/dealershipGroups/actions";
import {useConfirm, useException, useMessage, usePagination} from "../../../utils/hooks";


const rowData: TableRowDataType<IDealershipGroupExtended>[] = [
    {val: el => el.name, header: "Dealership name"},
    {val: el => el.countOfServiceCenters.toString(), header: "Service centers", align: "center"},
    {val: el => el.countOfEmployees.toString(), header: "Employees", align: "center"},
    {val: el => el.mainAddress, header: "Main Address"}
];


export const DealershipGroups = () => {
    const {count, data, isLoading} = useSelector((state: RootState) => ({
        count: state.dealershipGroups.paging.numberOfRecords,
        data: state.dealershipGroups.dealershipList,
        isLoading: state.dealershipGroups.loading
    }));

    const {changeRowsPerPage,changePage,pageIndex,pageSize} = usePagination(
        (s: RootState) => s.dealershipGroups.pageData,
        changePageData
    );

    const {askConfirm} = useConfirm();
    const dispatch = useDispatch();
    const showError = useException();
    const showMessage = useMessage();

    const handleView = (el: IDealershipGroupExtended) => () => alert(`View ${el.name}`);
    const handleEdit = (el: IDealershipGroupExtended) => () => alert(`Edit ${el.name}`);
    const handleRemoveAction = (el: IDealershipGroupExtended) => () => askConfirm({
        content: `Are you sure want to remove dealership group ${el.name}?`,
        title: "Remove Dealership",
        onConfirm: async () => {
            await handleRemove(el);
        }
    });
    const handleRemove = async (d: IDealershipGroupExtended) => {
        try {
            await dispatch(removeDealership(d.id));
            showMessage(`Successfully removed ${d.name}`);
        } catch (e) {
            showError(e);
        }

    }
    const viewActions = (el: IDealershipGroupExtended) => (<>
        <IconButton size="small" onClick={handleView(el)}><Visibility /></IconButton>
        <IconButton size="small" style={{marginLeft: 8}} onClick={handleEdit(el)}><Edit /></IconButton>
        <IconButton size="small" style={{marginLeft: 8}} onClick={handleRemoveAction(el)}><DeleteForever /></IconButton>
    </>);

    React.useEffect(() => {
        dispatch(dealershipActions.loadAll());
    }, [dispatch]);

    return <>
        <Box padding={1} />
        <Table<IDealershipGroupExtended>
            data={data}
            noDataTitle="No Dealership Groups are present"
            isLoading={isLoading}
            rowData={rowData}
            onChangePage={changePage}
            onChangeRowsPerPage={changeRowsPerPage}
            count={count}
            page={pageIndex}
            rowsPerPage={pageSize}
            index="id"
            actions={viewActions}
        />
    </>
}