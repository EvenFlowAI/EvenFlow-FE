import React, {useEffect} from "react";
import {TableRowDataType} from "../../UI/types";
import {IconButton} from "@material-ui/core";
import {Visibility} from "@material-ui/icons";
import {TableAvatar} from "../TableAvatar";
import {Table} from "../../UI/Table";
import {IServiceCenterExtended} from "../../../store/reducers/serviceCenters/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {loadAll} from "../../../store/reducers/serviceCenters/actions";
import {usePagination} from "../../../utils/hooks";
import {changePageData} from "../../../store/reducers/dealershipGroups/actions";


const rowData: TableRowDataType<IServiceCenterExtended>[] = [
    {val: (el: IServiceCenterExtended) => el.dealership.name, header: "Dealership group"},
    {val: (el: IServiceCenterExtended) => el.name, header: "Service center name"},
    {val: (el: IServiceCenterExtended) => el.mainAddress, header: "Service center address"},
    {val: (el: IServiceCenterExtended) => el.countOfBays.toString(), header: "Bays", align: "center"},
];

export const ServiceCenters = () => {
    const {data, loading, count} = useSelector((state: RootState) => ({
        data: state.serviceCenters.serviceCenters,
        loading: state.serviceCenters.loading,
        count: state.serviceCenters.paging.numberOfRecords
    }));
    const dispatch = useDispatch();
    const {changeRowsPerPage,changePage,pageIndex,pageSize} = usePagination(
        (s: RootState) => s.dealershipGroups.pageData,
        changePageData
    );

    useEffect(() => {
        dispatch(loadAll())
    }, [dispatch])

    const handleView = (el: IServiceCenterExtended) => () => alert(`View ${el.name}`);
    const viewActions = (el: IServiceCenterExtended) => (
        <IconButton size="small" onClick={handleView(el)}><Visibility /></IconButton>
    );
    const startActions = (el: IServiceCenterExtended) => (
        <TableAvatar name={el.name} />
    )

    return <Table<IServiceCenterExtended>
        data={data}
        noDataTitle="No Service Centers present"
        isLoading={loading}
        rowData={rowData}
        onChangePage={changePage}
        onChangeRowsPerPage={changeRowsPerPage}
        count={count}
        page={pageIndex}
        rowsPerPage={pageSize}
        startActions={startActions}
        index="id"
        actions={viewActions}
    />
}