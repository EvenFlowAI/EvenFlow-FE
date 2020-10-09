import React from "react";
import {Table} from "../../UI/Table";
import {IconButton} from "@material-ui/core";
import {DeleteForever, Visibility} from "@material-ui/icons";
import {TableRowDataType} from "../../UI/types";
import {IDealershipGroupExtended} from "../../../store/reducers/dealershipGroups/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import * as dealershipActions from "../../../store/reducers/dealershipGroups/actions";
import {changePageData, remove as removeDealership} from "../../../store/reducers/dealershipGroups/actions";
import {useConfirm, useException, useMessage, usePagination} from "../../../utils/hooks";
import {TitleContainer} from "../../Content/TitleContainer/TitleContainer";
import {Titles} from "../../../config/constants";
import {useHistory} from "react-router-dom";
import {Routes} from "../../../config/routes";
import {concatAddress} from "../../../utils/utils";


const rowData: TableRowDataType<IDealershipGroupExtended>[] = [
    {val: el => el.name, header: "Dealership name"},
    {val: el => el.countOfServiceCenters.toString(), header: "Service centers", align: "center"},
    {val: el => el.countOfEmployees.toString(), header: "Employees", align: "center"},
    {val: el => concatAddress(el.address), header: "Address"}
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
    const history = useHistory();

    const handleView = (el: IDealershipGroupExtended) => () => {
        history.push(`${Routes.Admin.DealershipGroups}/${el.id}`);
    };
    const handleRemoveAction = (el: IDealershipGroupExtended) => () => askConfirm({
        title: `Are you sure want to remove dealership group ${el.name}?`,
        isRemove: true,
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
        <IconButton size="small" style={{marginLeft: 8}} onClick={handleRemoveAction(el)}><DeleteForever /></IconButton>
    </>);

    React.useEffect(() => {
        dispatch(dealershipActions.loadAll());
    }, [dispatch]);

    return <>
        <TitleContainer title={Titles.DealershipGroups} actions pad />
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