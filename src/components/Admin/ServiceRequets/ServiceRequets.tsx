import React, {useEffect} from "react";
import {TitleContainer} from "../../Content/TitleContainer/TitleContainer";
import {Button, IconButton} from "@material-ui/core";
import {SearchInput} from "../../UI/SearchInput";
import {useDispatch, useSelector} from "react-redux";
import {loadAdminServiceRequests, setAdminPageData} from "../../../store/reducers/serviceRequests/actions";
import {usePagination} from "../../../utils/hooks";
import {TableRowDataType} from "../../UI/types";
import {EServiceStatus, ISRAdmin} from "../../../store/reducers/serviceRequests/types";
import {Table} from "../../UI/Table";
import {RootState} from "../../../store/rootReducer";
import {CheckCircle, MoreHoriz} from "@material-ui/icons";

const rowData: TableRowDataType<ISRAdmin>[] = [
    {header: "OPs Code", val: el => el.code},

    {
        header: "Status",
        align: "center",
        val: el => el.status === EServiceStatus.Archived
            ? <CheckCircle fontSize="small" color="primary" />
            : ""
    }
];

export const ServiceRequests = () => {
    const dispatch = useDispatch();
    const {pageIndex, pageSize, changePage, changeRowsPerPage} = usePagination(
        state => state.serviceRequests.adminPageData, setAdminPageData
    );
    const [
        serviceRequests,
        loading,
        count
    ] = useSelector((state: RootState) => [
        state.serviceRequests.adminList,
        state.serviceRequests.adminLoading,
        state.serviceRequests.adminPaging.numberOfRecords
    ]);

    useEffect(() => {
        dispatch(loadAdminServiceRequests());
    }, [dispatch, pageIndex, pageSize]);

    const titleActions = <div style={{display: "flex", alignItems: "center"}}>
        <SearchInput onSearch={() => {}} />
        <Button
            style={{marginLeft: 16}}
            color="primary"
            variant="contained">
            Add OPs Code
        </Button>
    </div>;

    const tableActions = (el: ISRAdmin) => {
        return <IconButton>
            <MoreHoriz />
        </IconButton>;
    }

    return <>
        <TitleContainer title="Service Requests" pad actions={titleActions} />
        <Table<ISRAdmin>
            data={serviceRequests}
            index="id"
            rowData={rowData}
            count={count}
            page={pageIndex}
            rowsPerPage={pageSize}
            compact
            actions={tableActions}
            onChangePage={changePage}
            isLoading={loading}
            onChangeRowsPerPage={changeRowsPerPage}
        />
    </>
}